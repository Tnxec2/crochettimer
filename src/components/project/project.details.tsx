import { FC, ReactNode } from "react";
import { CrochetPart, CrochetProject } from "../../service/db";
import { Counter } from "../ui/counter";

import { PartList } from "./part.list";

type Props = {
  project: CrochetProject;
  timer: ReactNode;
  onAddPart: (name: string) => void;
  onUpdatePart: (part: CrochetPart) => void;
  onDeletePart: (part: CrochetPart) => void;
  onUpdate: (project: CrochetProject) => void;
  stopTimer: () => void;
};

export const ProjectDetails: FC<Props> = ({
  project,
  timer,
  onAddPart,
  onUpdatePart,
  onDeletePart,
  onUpdate,
  stopTimer,
}) => {
  return (
    <div className="">
      { project.note.length > 0 && <div className="notes">Notes: {project.note.split('\n').map((l) => <>{l}<br /></>)}</div> }
      {project.hasMultipleParts ? (
        <PartList
          project={project}
          timer={project.hasTimer ? timer : null}
          onAddPart={onAddPart}
          onUpdatePart={onUpdatePart}
          onDeletePart={onDeletePart}
          stopTimer={stopTimer}
        />
      ) : (
        <>
          <div className="">
            {project.hasTimer && timer}
            <Counter
              counter={project.counter}
              updateCounter={(c) => {
                onUpdate({ ...project, counter: c });
              }}
              isSecond={false}
            />
            {project.hasSecondCounter && (
              <Counter
                counter={project.secondCounter}
                updateCounter={(c) => {
                  onUpdate({ ...project, secondCounter: c });
                }}
                isSecond={true}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};
