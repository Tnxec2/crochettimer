import { FC, useCallback, useEffect, useState } from "react";
import { CrochetProject, Stores, getStoreData } from "../../service/db";
import { HeavyPlusSign } from "../icons/plus";
import { ProjectCard } from "./project.card";
import { Archive } from "../icons/archive";
import { Help } from "../icons/help";
import { useNavigate } from "react-router-dom";
import { ArrowBackOutline } from "../icons/back";
import { Navigation } from "./navbar";

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

  const [filteredProjects, setFilteredProjects] = useState<CrochetProject[]>([]);

  const handleGetProjects = useCallback( async () => {
    console.log('handleGetProjects');
    
    getStoreData<CrochetProject>(Stores.Projects)
      .then((data) => {
        setFilteredProjects(data.filter((p) => showArchived === p.archived ))
  }) }, [showArchived]) 

  useEffect(() => {
    handleGetProjects()
  }, [handleGetProjects, showArchived])

  return (
    <>
    <Navigation 
      title={ showArchived ? 'Archived Projects' : 'Projects' }
      actionsLeft={
        <div
          className="btn btn-outline-secondary ms-2"
          onClick={() => {
            navigate(`/help`)
          }}
        >
          <Help />
        </div>
      }
      actionsRight={
        <>{ !showArchived && <>
              <div
                className="btn btn-outline-secondary"
                onClick={() => {
                  navigate(`/project/new`);
                }}
              >
                <HeavyPlusSign />
              </div></> }
              <div
                className="btn btn-outline-secondary ms-2"
                onClick={() => {
                  toggleArchived();
                }}
              >
              { !showArchived ? <Archive /> : <ArrowBackOutline />  }
            </div>
        </>
      }    
    />
    <div className="card-body">
      <ul className="list-group">
        
        {filteredProjects.length > 0 ? filteredProjects.map((p) => (
          <ProjectCard
            key={p.id}
            item={p}
            onEdit={() => {
              navigate(`/project/${p.id}/edit`)
            }}
            onOpen={() => {
              navigate(`/project/${p.id}`)
            }}
          />
        )) : <li className="list-group-item">
          No { showArchived ? 'archived' : '' } projects found. { !showArchived && 'Click the + button to add a new project.' }</li> }
      </ul>
      </div>
    </>
  );
};
