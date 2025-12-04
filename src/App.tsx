import { useState, useEffect } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";

import "./App.css";
import {
  initDB,
} from "./service/db";
import { ErrorMessage } from "./components/ui/error";
import { ProjectList } from "./components/project/projectlist";
import { ProjectDetailsContainer } from "./components/project/project.details.container";
import { keepTheme } from "./service/theme";
import { HelpPage } from "./components/project/help";
import { AddProject } from "./components/project/addProject";
import { EditProjectDialog } from "./components/project/editProjectDialog";


function App() {
  useEffect(() => {
    keepTheme();
  })

  const [isDBReady, setIsDBReady] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);

  const [showArchived, setShowArchived] = useState<boolean>(false);

  useEffect(() => {
    const handleInitDB = async () => {
      initDB().then((status) => {
        setIsDBReady(status)
      })
    };

    if (!isDBReady) handleInitDB();
  }, [isDBReady]);

  return (
    <HashRouter>
      <div className="vh-100">
          <div className="container py-5 h-100">
            <div className="row d-flex justify-content-center align-items-top h-100">
              <div className="col col-lg-9 col-xl-7">
                  {!isDBReady && <div className="alert alert-danger" role="alert">DB is not ready</div>}
                  {error && (
                    <ErrorMessage
                      onClose={() => {
                        setError(null);
                      }}
                      error={error}
                    />
                  )}
                <div className="card rounded-3">
                
                  {isDBReady &&
                    <Routes>
                      <Route path={`/projects`} element={
                        <ProjectList
                          showArchived={showArchived}
                          toggleArchived={() => { setShowArchived(!showArchived) }}
                          setError={setError}
                        />
                      } />
                      <Route path={`/project/new`} element={
                        <AddProject setError={setError} />
                      } />
                      <Route path={`/help`} element={
                        <HelpPage />
                      } />
                      <Route path={`/project/:id`} element={
                        <ProjectDetailsContainer setError={setError} />
                      } />
                      <Route path={`/project/:id/edit`} element={
                        <EditProjectDialog setError={setError} />
                      } />
                      <Route path={`/project/:id/part/:partid`} element={
                        <ProjectDetailsContainer setError={setError}/>
                      } />
                      <Route
                        path={`/`}
                        element={<Navigate to={`/projects`} replace />}
                    />
                    </Routes>}
                </div>
              </div>
          </div>
        </div>
      </div>
    </HashRouter>);
}

export default App;