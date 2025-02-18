import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CrochetPart, CrochetProject, getById, Stores, updateData } from "../../service/db";
import { ArrowBackOutline } from "../icons/back";
import { ProjectDetails } from "./project.details";
import { Timer } from "../ui/timer";
import { ThemeToggle } from "../ui/theme.toggle";
import { useNavigate, useParams } from "react-router-dom";
import { PartDetails } from "./part.details";
import { Archive } from "../icons/archive";


export const ProjectDetailsContainer : FC = () => {
  const {id, partid} = useParams();

  const navigate = useNavigate();

  const timerRef = useRef<NodeJS.Timeout>(null);

  const [project, setProject] = useState<CrochetProject|null>()

  useEffect(() => {
    const handleGetProject = (id: string) => {
      console.log('handleGetProject');
      
      getById<CrochetProject>(Stores.Projects, id)
        .then((data) => setProject(data))
    };
    if (id) handleGetProject(id)
  }, [id])

  const updateProject = useCallback(async (project: CrochetProject) => {
    updateData(Stores.Projects, project.id, project)
    .then((data) => setProject(data)) 
  }, []);

  useEffect(() => {
    if (project) {
      const startTime = Date.now() - project.time;
      const timer = setInterval(async () => {
        if (project?.timerOn) {
          const newProject = {
            ...project,
            time: Math.round((Date.now() - startTime) / 1000) * 1000,
          };

          updateProject(newProject);
        }
      }, 1000);

      timerRef.current = timer;

      return () => clearInterval(timer);
    }
  }, [project?.timerOn, project?.time, project, updateProject]);

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

  const handleDeletePart = async (
    project: CrochetProject,
    part: CrochetPart
  ) => {
    const newProject: CrochetProject = {
      ...project,
      parts:
        project.parts?.filter((p) => p.id !== part.id) || undefined,
    };

    updateProject(newProject);
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

  const timer = useMemo(() => project && project.hasTimer ? <Timer
  isRunning={project.timerOn}
  timer={project.time}
  reset={() => {
    onResetTimer(project);
  }}
  start={() => {
    onStartTimer(project);
  }}
  stop={() => {
    onStopTimer(project);
  }}
/> : '', [project])

    return (

<>
<nav>
  <ThemeToggle />
  <div className="app-title">
    <h1>{project?.archived && <Archive />} {project?.name}</h1>
  </div>
  <div
    className="button"
    onClick={() => {
      if (project && partid) navigate(`/${project.id}`)
      else navigate('/')
    }}
  >
    <ArrowBackOutline />
  </div>
</nav>
{ project && !partid &&
<ProjectDetails
  project={project}
  onAddPart={(name) => {
    handleAddPart(project, name);
  }}
  onUpdatePart={(p) => {
    handleUpdatePart(project, p);
  }}
  onDeletePart={(p) => {
    handleDeletePart(project, p);
  }}
  onUpdate={async (p) => {
    updateProject(p);
  }}
  timer={timer}
  stopTimer={() => {
    onStopTimer(project);
  }}
/>
}
{ project?.parts && partid && 
  <PartDetails
      part={project.parts?.find((part) => part.id === partid)}
      onUpdate={(p) => {
        navigate(`/${project.id}/${p.id}}`);
      }}
      hasSecondCounter={project.hasSecondCounter}
      timer={timer}
    />
}
</>
)
}