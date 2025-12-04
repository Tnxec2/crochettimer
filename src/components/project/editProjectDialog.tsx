import { FC, useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { CrochetProject, deleteData, getById, Stores, updateData } from "../../service/db";
import { Checkbox } from "../ui/checkbox";
import { Navigation } from "./navbar";
import { ArrowBackOutline } from "../icons/back";

type Props = {
    setError: (e: string) => void;
}

export const EditProjectDialog: FC<Props> = ({ setError }) => {

    const { id } = useParams();
    
    const [project, setProject] = useState<CrochetProject | null>();

    useEffect(() => {
        if (id) {
            getById<CrochetProject>(Stores.Projects, id)
                .then((data) => {
                    setProject(data)
                })
                .catch((err) => {
                    if (err instanceof Error) {
                        setError(err.message);
                    } else {
                        setError("Something went wrong fetching the data");
                    }
                })
        }
    }, [id]);

    const handleUpdateProject = async (
        project: CrochetProject,
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        e.stopPropagation();

        const target = e.target as typeof e.target & {
            name: { value: string };
            note: { value: string };
            hasMultipleParts: { checked: boolean };
            hasTimer: { checked: boolean };
            hasSecondCounter: { checked: boolean };
            archived: { checked: boolean };
        };


        const newProject = {
            ...project,
            name: target.name.value,
            note: target.note.value,
            hasMultipleParts: target.hasMultipleParts.checked,
            hasTimer: target.hasTimer.checked,
            hasSecondCounter: target.hasSecondCounter.checked,
            archived: target.archived.checked,
        };

        updateData(Stores.Projects, project.id, newProject)
            .then((data) => { window.history.back() })
            .catch((err) => {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Something went wrong deleting the data");
                }
            })
    };


    const handleRemoveProject = async (id: string) => {
        try {
            await deleteData(Stores.Projects, id);
            // refetch data after deleting data
            window.history.back();
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Something went wrong deleting the data");
            }
        }
    };

    return (
        <>
            <Navigation
                title={ <>Edit Project: <strong>{project?.name || ''}</strong>  </>}
                actionsRight={
                    <div className="btn btn-outline-secondary" onClick={() => { window.history.back() }}>
                        <ArrowBackOutline />
                    </div>
                }
            />
            <div className="card-body">
                {project &&
                    <form onSubmit={(e) => { handleUpdateProject(project, e) }}>
                        <input type="hidden" className="hidden" name="id" disabled value={project.id} />
                        <input type="text" className="form-control mb-3" name="name" placeholder="Name" defaultValue={project.name} autoComplete="off" required />
                        <Checkbox name="hasMultipleParts" title="has multiple parts" defaultChecked={project.hasMultipleParts} />
                        <Checkbox name="hasTimer" title="has timer" defaultChecked={project.hasTimer} />
                        <Checkbox name="hasSecondCounter" title="has second counter" defaultChecked={project.hasSecondCounter} />
                        <textarea name="note" className="form-control mt-3 mb-3" rows={5} title="notes" placeholder="notes" defaultValue={project.note}></textarea>

                        <Checkbox name="archived" title="project archived" defaultChecked={project.archived === true} />
                        <div className="mt-3 d-flex">
                        <button type="submit" className="btn btn-success">Save Project</button>
                        <button type="button" className="btn btn-danger ms-auto" onClick={() => {
                            if (window.confirm('Would you delete project?')) handleRemoveProject(project.id);
                        }}>Delete Project</button>
                        </div>
                    </form>
                }
            </div>
        </>)
}
