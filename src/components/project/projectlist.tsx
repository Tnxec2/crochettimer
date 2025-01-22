import { FC, useState } from "react";
import { CrochetProject, Stores, addData, deleteData } from "../../service/db";
import { HeavyPlusSign } from "../icons/plus";
import { ProjectCard } from "./project.card";
import Modal from "../modal/modal";
import { AddProjectDialog } from "./addProjectDialog";
import { EditProjectDialog } from "./editProjectDialog";



type Props = {
    projects: CrochetProject[]
    onOpenProject: (p: CrochetProject | null) => void
    onUpdateProject: (p: CrochetProject) => void
    setError: (e: string) => void
    reload: () => void
}

export const ProjectList : FC<Props> = ({projects, onOpenProject, onUpdateProject, reload, setError}) => {
    const [openAddProject, setOpenAddProject] = useState<boolean>(false);
    const [editProject, setEditProject] = useState<CrochetProject | null>(null);

    const handleAddProject = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        const target = e.target as typeof e.target & {
          name: { value: string };
          hasMultipleParts: { checked: boolean };
          hasTimer: { checked: boolean };
          hasSecondCounter: { checked: boolean };
        };
    
        const name = target.name.value;
    
        if (name.trim() === "") {
          alert("Please enter a valid name");
          return;
        }
    
        setOpenAddProject(false);
    
        const newProject: CrochetProject = {
          id: Date.now().toString(),
          name: name,
          hasMultipleParts: target.hasMultipleParts.checked,
          hasTimer: target.hasTimer.checked,
          hasSecondCounter: target.hasSecondCounter.checked,
          counter: 1,
          secondCounter: 1,
          time: 0,
          timerOn: false,
        };
    
        try {
          const res = await addData(Stores.Projects, newProject);
          // refetch data after creating data
          reload();
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Something went wrong");
          }
        }
      };

    const handleUpdateProject = async (
        project: CrochetProject,
        e: React.FormEvent<HTMLFormElement>
      ) => {
        e.preventDefault();
    
        const target = e.target as typeof e.target & {
          name: { value: string };
          hasMultipleParts: { checked: boolean };
          hasTimer: { checked: boolean };
          hasSecondCounter: { checked: boolean };
        };
    
        setEditProject(null);
    
        const newProject = {
          ...project,
          name: target.name.value,
          hasMultipleParts: target.hasMultipleParts.checked,
          hasTimer: target.hasTimer.checked,
          hasSecondCounter: target.hasSecondCounter.checked,
        };
    
        console.log(target, newProject);
    
        onUpdateProject(newProject);
      };

    const handleRemoveProject = async (id: string) => {
        try {
          await deleteData(Stores.Projects, id);
          // refetch data after deleting data
          reload();
          setEditProject(null);
          onOpenProject(null);
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
          <nav>
            <div className="app-title">
              <h1>Projects</h1>
            </div>
            <div
              className="button"
              onClick={() => {
                setOpenAddProject(true);
              }}
            >
              <HeavyPlusSign />
            </div>
          </nav>

          <div className="card-list">
            {projects.map((p) => (
              <ProjectCard
                key={p.id}
                item={p}
                onEdit={() => {
                  setEditProject(p);
                }}
                onOpen={() => {
                  onOpenProject(p) //setOpenProject(p);
                }}
              />
            ))}
          </div>

          <Modal
            open={openAddProject}
            modalLabel="Add new Project"
            onClose={() => {
              setOpenAddProject(false);
            }}
          >
            <AddProjectDialog handleAddProject={handleAddProject} />
          </Modal>

          {editProject && (
            <Modal
              open={editProject !== null}
              modalLabel="Edit Project"
              onClose={() => {
                setEditProject(null);
              }}
            >
              <EditProjectDialog
                project={editProject}
                handleUpdate={handleUpdateProject}
                onDeleteProject={() => {
                  handleRemoveProject(editProject.id);
                }}
              />
            </Modal>
          )}
        </>

    )
}