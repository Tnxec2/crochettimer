import { FC, useCallback, useEffect, useState } from "react";
import { CrochetProject, Stores, addData, deleteData, getStoreData } from "../../service/db";
import { HeavyPlusSign } from "../icons/plus";
import { ProjectCard } from "./project.card";
import Modal from "../modal/modal";
import { AddProjectDialog } from "./addProjectDialog";
import { EditProjectDialog } from "./editProjectDialog";
import { ThemeToggle } from "../ui/theme.toggle";
import { Archive } from "../icons/archive";
import { Help } from "../icons/help";
import { useNavigate } from "react-router-dom";

type Props = {
  showArchived: boolean,
  toggleArchived: () => void,
  setError: (e: string) => void;
};

export const ProjectList: FC<Props> = ({
  showArchived,
  toggleArchived,
  setError
}) => {

  const navigate = useNavigate();


  const [projects, setProjects] = useState<CrochetProject[] | []>([]);
  const [filteredProjects, setFilteredProjects] = useState<CrochetProject[] | []>([]);

  const handleGetProjects = useCallback( async () => {
    console.log('handleGetProjects');
    
    getStoreData<CrochetProject>(Stores.Projects)
      .then((data) => {
        setProjects(data)
        setFilteredProjects(data.filter((p) => showArchived === p.archived ))
  }) }, [showArchived]) 

  useEffect(() => {
    handleGetProjects()
  }, [handleGetProjects, showArchived])


  const [openAddProject, setOpenAddProject] = useState<boolean>(false);

  const [editProject, setEditProject] = useState<CrochetProject | null>(null);

  const handleAddProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const target = e.target as typeof e.target & {
      name: { value: string };
      note: { value: string };
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
      note: target.note.value,
      archived: false,
    };

    try {
      const res = await addData(Stores.Projects, newProject);
      // refetch data after creating data
      handleGetProjects();
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
    reopen: boolean,
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

    setEditProject(null);

    const newProject = {
      ...project,
      name: target.name.value,
      note: target.note.value,
      hasMultipleParts: target.hasMultipleParts.checked,
      hasTimer: target.hasTimer.checked,
      hasSecondCounter: target.hasSecondCounter.checked,
      archived: target.archived.checked,
    };

    console.log(target, newProject);

    //onUpdateProject(newProject, reopen);
  };

  const handleRemoveProject = async (id: string) => {
    try {
      await deleteData(Stores.Projects, id);
      // refetch data after deleting data
      handleGetProjects();
      setEditProject(null);
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
        <ThemeToggle />
        <div
          className="button"
          onClick={() => {
            navigate('/help')
          }}
        >
          <Help />
        </div>
        <div className="app-title">
          <h1>{showArchived ? 'Archived Projects' : 'Projects'}</h1>
        </div>
        { !showArchived && <>

        <div
          className="button"
          onClick={() => {
            setOpenAddProject(true);
          }}
        >
          <HeavyPlusSign />
        </div></> }
        <div
          className="button"
          onClick={() => {
            toggleArchived();
          }}
        >
          <Archive />
        </div>

      </nav>

      <div className="card-list">
        {filteredProjects.map((p) => (
          <ProjectCard
            key={p.id}
            item={p}
            onEdit={() => {
              setEditProject(p);
            }}
            onOpen={() => {
              navigate(`/${p.id}`)
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
  );
};
