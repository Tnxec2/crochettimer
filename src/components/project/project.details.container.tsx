import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CrochetPart, CrochetProject, getById, Stores, updateData } from "../../service/db";
import { ArrowBackOutline } from "../icons/back";
import { ProjectDetails } from "./project.details";
import { Timer } from "../ui/timer";
import { ThemeToggle } from "../ui/theme.toggle";
import { useNavigate, useParams } from "react-router-dom";
import { PartDetails } from "./part.details";
import { Archive } from "../icons/archive";
import { Navigation } from "./navbar";

type Props = {
  setError: (e: string) => void;
}

export const ProjectDetailsContainer: FC<Props> = ({ setError }) => {

  const { id, partid } = useParams();

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

  const navigate = useNavigate();

  const timerRef = useRef<NodeJS.Timeout>(null);

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
      <Navigation
        title={<> Project: {project?.name} { project?.archived && <Archive />} </>}
        actionsRight={
          <div className="btn btn-outline-secondary" onClick={() => {
            if (project && partid) navigate(`/project/${project.id}`)
            else navigate(`/`)
          }}>
            <ArrowBackOutline />
          </div>
        }
      />
      <div className="card-body">
        {project && !partid &&
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
        {project?.parts && partid &&
          <PartDetails
            part={project.parts?.find((part) => part.id === partid)}
            onUpdate={(p) => {
              handleUpdatePart(project, p)
            }}
            hasSecondCounter={project.hasSecondCounter}
            timer={timer}
          />
        }
      </div>
    </>
  )
}