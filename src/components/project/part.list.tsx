import { FC, ReactNode, useState } from "react";
import { CrochetPart, CrochetProject } from "../../service/db";
import { PartCard } from "./part.card";
import { millisecondsToHuman } from "../../service/time";
import { InputDialog } from "../ui/inputNameDialog";
import Modal from "../modal/modal";
import { useNavigate } from "react-router-dom";

type Props = {
  project: CrochetProject,
  timer: ReactNode;
  onAddPart: (name: string) => void;
  onUpdatePart: (part: CrochetPart) => void;
  onDeletePart: (part: CrochetPart) => void;
  stopTimer: () => void;
};

export const PartList: FC<Props> = ({
  project,
  timer,
  onAddPart,
  onUpdatePart,
  onDeletePart,
  stopTimer,
}) => {
  const [openNewPartNameDialog, setOpenNewPartNameDialog] = useState(false);


  const navigate = useNavigate();
  

  return (
    <div className="">
      {project.hasTimer && (
        <div className="alert alert-light d-flex justify-content-between align-items-center">
          Total: {millisecondsToHuman(project.time)}
        </div>
      )}

      { project.parts?.length && <div className="list-group mb-3"> {project.parts?.map((part) => (
        <PartCard
          key={part.id}
          project={project}
          part={part}
          onUpdatePart={onUpdatePart}
          timer={project.hasTimer && timer}
          stopTimer={stopTimer}
          onDeletePart={onDeletePart}
          openPart={(p) => navigate(`/project/${project.id}/part/${p.id}`)}
        />
      ))} </div>}
      <button type="button" className="btn btn-outline-success w-100" onClick={() => setOpenNewPartNameDialog(true)}>
        Add part
      </button>

      <Modal
        open={openNewPartNameDialog}
        modalLabel="New part"
        onClose={() => {
          setOpenNewPartNameDialog(false);
        }}
      >
        <InputDialog
          defaultValue=""
          placeholder="name"
          save={(v) => {
            onAddPart(v);
            setOpenNewPartNameDialog(false);
          }}
        />
      </Modal>
    </div>
  );
};
