import React, { useState, useEffect, useRef, useCallback } from "react";

import "./App.css";
import {
  CrochetPart,
  CrochetProject,
  Stores,
  addData,
  deleteData,
  getStoreData,
  initDB,
  updateData,
} from "./service/db";
import { ProjectCard } from "./components/project/project.card";
import { AddProjectDialog } from "./components/project/addProjectDialog";
import Modal from "./components/modal/modal";
import { ErrorMessage } from "./components/project/error";
import { EditProjectDialog } from "./components/project/editProjectDialog";
import { ProjectDetails } from "./components/project/project.details";
import { Timer } from "./components/project/timer";
import { ArrowBackOutline } from "./components/icons/back";
import { HeavyPlusSign } from "./components/icons/plus";

function App() {
  const [isDBReady, setIsDBReady] = useState<boolean>(false);
  const [error, setError] = useState<string | null>();

  const [openAddProject, setOpenAddProject] = useState<boolean>(false);
  const [editProject, setEditProject] = useState<CrochetProject | null>(null);
  const [openProject, setOpenProject] = useState<CrochetProject | null>(null);

  const [projects, setProjects] = useState<CrochetProject[] | []>([]);

  const timerRef = useRef<NodeJS.Timeout>(null);

  // declare this async method
  const handleGetProjects = async () => {
    const data = await getStoreData<CrochetProject>(Stores.Projects);
    setProjects(data);
  };

  useEffect(() => {
    const handleInitDB = async () => {
      const status = await initDB();
      setIsDBReady(status);
      handleGetProjects();
    };
    if (!isDBReady) handleInitDB();
  }, [isDBReady]);

  const updateProject = useCallback(async (project: CrochetProject) => {
    try {
      const res = await updateData(Stores.Projects, project.id, project);
      // refetch data after update data
      handleGetProjects();
      setOpenProject(project);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    }
  }, []);

  useEffect(() => {
    if (openProject) {
      const startTime = Date.now() - openProject.time;
      const timer = setInterval(async () => {
        if (openProject?.timerOn) {
          const newProject = {
            ...openProject,
            time: Math.round((Date.now() - startTime) / 1000) * 1000,
          };

          updateProject(newProject);
        }
      }, 1000);

      timerRef.current = timer;

      return () => clearInterval(timer);
    }
  }, [openProject?.timerOn, openProject?.time, openProject, updateProject]);

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

    updateProject(newProject);
  };

  const handleAddPart = async (project: CrochetProject, partName: string) => {
    const newPart: CrochetPart = {
      id: Date.now().toString(),
      name: partName,
      counter: 1,
      secondCounter: 1,
    };
    const newProject: CrochetProject = {
      ...project,
      parts: project.parts ? [...project.parts, newPart] : [newPart],
    };

    updateProject(newProject);
  };

  const handleUpdatePart = async (
    project: CrochetProject,
    part: CrochetPart
  ) => {
    const newProject: CrochetProject = {
      ...project,
      parts:
        project.parts?.map((p) => (p.id === part.id ? part : p)) || undefined,
    };

    updateProject(newProject);
  };

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
      handleGetProjects();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    }
  };

  const handleRemoveProject = async (id: string) => {
    try {
      await deleteData(Stores.Projects, id);
      // refetch data after deleting data
      handleGetProjects();
      setEditProject(null);
      setOpenProject(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong deleting the data");
      }
    }
  };

  const onResetTimer = async (project: CrochetProject) => {
    if (timerRef.current) clearInterval(timerRef.current);

    const newProject: CrochetProject = {
      ...project,
      timerOn: false,
      time: 0,
    };

    updateProject(newProject);
  };

  const onStartTimer = async (project: CrochetProject) => {
    const newProject: CrochetProject = {
      ...project,
      timerOn: true,
    };
    updateProject(newProject);
  };

  const onStopTimer = async (project: CrochetProject) => {
    if (timerRef.current) clearInterval(timerRef.current);

    const newProject: CrochetProject = {
      ...project,
      timerOn: false,
    };

    updateProject(newProject);
  };

  return (
    <div className="App">
      {!isDBReady && <div>DB is not ready</div>}
      {error && (
        <ErrorMessage
          onClose={() => {
            setError(null);
          }}
          error={error}
        />
      )}
      {!openProject ? (
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
                  setOpenProject(p);
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
      ) : (
        <>
          <nav>
            <div className="app-title">
              <h1>{openProject.name}</h1>
            </div>
            <div
              className="button"
              onClick={() => {
                setOpenProject(null);
              }}
            >
              <ArrowBackOutline />
            </div>
          </nav>
          <ProjectDetails
            project={openProject}
            onAddPart={(name) => {
              handleAddPart(openProject, name);
            }}
            onUpdatePart={(p) => {
              handleUpdatePart(openProject, p);
            }}
            onUpdate={async (project) => {
              updateProject(project);
            }}
            timer={
              <Timer
                isRunning={openProject.timerOn}
                timer={openProject.time}
                reset={() => {
                  onResetTimer(openProject);
                }}
                start={() => {
                  onStartTimer(openProject);
                }}
                stop={() => {
                  onStopTimer(openProject);
                }}
              />
            }
            stopTimer={() => {
              onStopTimer(openProject);
            }}
          />
        </>
      )}
    </div>
  );
}

export default App;
