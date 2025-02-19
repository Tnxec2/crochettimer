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


function App() {
  useEffect(() => {
    keepTheme();
  })

  const [isDBReady, setIsDBReady] = useState<boolean>(false);

  const [error, setError] = useState<string | null>();

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
        {isDBReady &&
          <Routes>
            <Route path={`/projects`} element={
              <ProjectList
                showArchived={showArchived}
                toggleArchived={() => { setShowArchived(!showArchived) }}
                setError={setError}
              />
            } />
            <Route path={`/help`} element={
              <HelpPage />
            } />
            <Route path={`/project/:id`} element={
              <ProjectDetailsContainer />
            } />
            <Route path={`/project/:id/part/:partid`} element={
              <ProjectDetailsContainer />
            } />
            <Route
              path={`/`}
              element={<Navigate to={`/projects`} replace />}
          />
          </Routes>}
      </div>
    </HashRouter>);
}

export default App;