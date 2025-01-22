import { useState, useEffect, useCallback } from "react";

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

  const [isDBReady, setIsDBReady] = useState<boolean>(false);
  const [error, setError] = useState<string | null>();

  const [openProject, setOpenProject] = useState<CrochetProject | null>(null);

  const [projects, setProjects] = useState<CrochetProject[] | []>([]);

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
        <ProjectList 
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
          onUpdateProject={updateProject}
         />
      )}
    </div>
  );
}

export default App;
