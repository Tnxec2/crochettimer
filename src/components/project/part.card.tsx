import { FC, ReactNode, useState } from "react";
import { CrochetPart, CrochetProject } from "../../service/db";
import Modal from "../modal/modal";
import { EditPartDialog } from "./editPartDialog";
import { More } from "../icons/morevert";



type Props = {
  project: CrochetProject,
  part: CrochetPart,
  onUpdatePart: (part: CrochetPart) => void,
  onDeletePart: (part: CrochetPart) => void,
  timer?: ReactNode
  stopTimer: () => void
  openPart: (p: CrochetPart) => void
}

export const PartCard: FC<Props> = ({ project, part, onUpdatePart, onDeletePart, timer, stopTimer, openPart }) => {
  const [editPart, setEditPart] = useState<CrochetPart | null>(null);


  const handleUpdatePart = async (
    part: CrochetPart,
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const target = e.target as typeof e.target & {
      name: { value: string };
    };

    setEditPart(null);
    onUpdatePart({ ...part, name: target.name.value })
  }

  return <><div className="list-group-item d-flex align-items-center" onClick={() => { openPart(part) }} >
    <div className="card-title">{part.name}</div>
    <div className="ms-auto">
      <div className="badge text-bg-secondary" title="main counter">{part.counter}</div>
      {project.hasSecondCounter && part.secondCounter &&
        <div className="badge text-bg-secondary ms-1" title="secondary counter">{part.secondCounter}</div>
      }
      <div className="btn btn-outline-secondary ms-3" onClick={(e) => {
        e.stopPropagation();
        setEditPart(part)
      }}><More /></div>
    </div>
  </div>
    {editPart && (
      <Modal
        open={editPart !== null}
        modalLabel="Edit part"
        onClose={() => {
          setEditPart(null);
        }}
      >
        <EditPartDialog
          part={editPart}
          handleUpdate={handleUpdatePart}
          onDeletePart={onDeletePart}
        />
      </Modal>
    )}
  </>
}