import { FC } from "react";
import { CrochetProject } from "../../service/db";
import { Checkbox } from "../ui/checkbox";



type Props = {
    project: CrochetProject,
    handleUpdate: (project: CrochetProject, e: React.FormEvent<HTMLFormElement>) => Promise<void>,
    onDeleteProject: () => void
}

export const EditProjectDialog : FC<Props> = ({project, handleUpdate, onDeleteProject}) => {

    return (<>
        <form onSubmit={(e) => {handleUpdate(project, e)}}>
        <input type="hidden" className="hidden" name="id"  disabled value={project.id} />
        <input type="text" name="name" placeholder="Name" defaultValue={project.name}/>
        <Checkbox name="hasMultipleParts" title="has multiple parts" defaultChecked={project.hasMultipleParts}/>
        <Checkbox name="hasTimer" title="has timer" defaultChecked={project.hasTimer}/>
        <Checkbox name="hasSecondCounter" title="has second counter" defaultChecked={project.hasSecondCounter} />
        <button type="submit" className="button">Save Project</button>
        <button type="button" className="button button-danger" onClick={() => {
            if (window.confirm('Would you delete project?')) onDeleteProject()
            }}>Delete Project</button>
      </form>
    </>)
}