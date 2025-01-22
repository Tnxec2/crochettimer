import { FC, useEffect, useRef } from "react";
import { CrochetPart, CrochetProject } from "../../service/db";
import { ArrowBackOutline } from "../icons/back";
import { ProjectDetails } from "./project.details";
import { Timer } from "./timer";



type Props = {
    project: CrochetProject
    onOpenProject: (p: CrochetProject | null) => void
    onUpdateProject: (project: CrochetProject) => Promise<void>

}

export const ProjectDetailsContainer : FC<Props> = ({project, onOpenProject, onUpdateProject}) => {
  const timerRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    if (project) {
      const startTime = Date.now() - project.time;
      const timer = setInterval(async () => {
        if (project?.timerOn) {
          const newProject = {
            ...project,
            time: Math.round((Date.now() - startTime) / 1000) * 1000,
          };

          onUpdateProject(newProject);
        }
      }, 1000);

      timerRef.current = timer;

      return () => clearInterval(timer);
    }
  }, [project?.timerOn, project?.time, project, onUpdateProject]);

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

    onUpdateProject(newProject);
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

    onUpdateProject(newProject);
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

    onUpdateProject(newProject);
  };

  const onResetTimer = async (project: CrochetProject) => {
    if (timerRef.current) clearInterval(timerRef.current);

    const newProject: CrochetProject = {
      ...project,
      timerOn: false,
      time: 0,
    };

    onUpdateProject(newProject);
  };

  const onStartTimer = async (project: CrochetProject) => {
    const newProject: CrochetProject = {
      ...project,
      timerOn: true,
    };
    onUpdateProject(newProject);
  };

  const onStopTimer = async (project: CrochetProject) => {
    if (timerRef.current) clearInterval(timerRef.current);

    const newProject: CrochetProject = {
      ...project,
      timerOn: false,
    };

    onUpdateProject(newProject);
  };

    return (

<>
<nav>
  <div className="app-title">
    <h1>{project.name}</h1>
  </div>
  <div
    className="button"
    onClick={() => {
      onOpenProject(null);
    }}
  >
    <ArrowBackOutline />
  </div>
</nav>
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
    onUpdateProject(p);
  }}
  timer={
    <Timer
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
    />
  }
  stopTimer={() => {
    onStopTimer(project);
  }}
/>
</>
)
}