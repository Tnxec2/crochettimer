import { useState, useEffect, useCallback, useRef } from "react";

import "./App.css";
import {
  CrochetProject,
  Stores,
  getStoreData,
  initDB,
  updateData,
} from "./service/db";
import { ErrorMessage } from "./components/ui/error";
import { ProjectList } from "./components/project/projectlist";
import { ProjectDetailsContainer } from "./components/project/project.details.container";
import { keepTheme } from "./service/theme";

function App() {
  useEffect(() => {
    keepTheme();
  })

  const firstEffectRan = useRef(false)

  const [isDBReady, setIsDBReady] = useState<boolean>(false);

  const [error, setError] = useState<string | null>();

  const [showArchived, setShowArchived] = useState<boolean>(false);

  const [openProject, setOpenProject] = useState<CrochetProject | null>(null);

  const [projects, setProjects] = useState<CrochetProject[] | []>([]);

  // declare this async method
  const handleGetProjects = async () => {
    const data = await getStoreData<CrochetProject>(Stores.Projects);
    setProjects(data);
  };

  useEffect(() => {
    const handleInitDB = async () => {
      initDB().then((status) => {
        setIsDBReady(status)
        if (status) handleGetProjects();
      })
    };

    if (firstEffectRan.current) {
      if (!isDBReady) handleInitDB();
    }
    return () => {
      firstEffectRan.current = true
    }
  }, [isDBReady]);

  const updateProject = useCallback(async (project: CrochetProject, reopen: boolean) => {
    try {
      const res = await updateData(Stores.Projects, project.id, project);
      // refetch data after update data
      handleGetProjects();
      if (reopen) setOpenProject(project); // only if a project is open
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    }
  }, []);
  
  return (
    <div className="App lato-regular">
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
        <ProjectList 
          showArchived={showArchived}
          toggleArchived={() => {setShowArchived(!showArchived)}}
          projects={projects}
          onOpenProject={setOpenProject}
          onUpdateProject={updateProject}
          reload={handleGetProjects}
          setError={setError}
        />
      ) : (
        <ProjectDetailsContainer
          project={openProject}
          onOpenProject={setOpenProject}
          onUpdateProject={(p) => updateProject(p, true)}
         />
      )}
    </div>
  );
}

export default App;
