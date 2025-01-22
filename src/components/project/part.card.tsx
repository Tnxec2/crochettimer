import { FC, ReactNode, useState } from "react";
import { CrochetPart, CrochetProject } from "../../service/db";
import Modal from "../modal/modal";
import { EditPartDialog } from "./editPartDialog";
import { PartDetails } from "./part.details";



type Props = {
    project: CrochetProject,
    part: CrochetPart,
    onUpdatePart: (part: CrochetPart) => void,
    onDeletePart: (part: CrochetPart) => void,
    timer?: ReactNode
    stopTimer: () => void
}

export const PartCard : FC<Props> = ({project, part, onUpdatePart, onDeletePart, timer, stopTimer}) => {
    const [editPart, setEditPart] = useState<CrochetPart | null>(null);
    const [openPart, setOpenPart] = useState<CrochetPart | null>(null);

    const handleUpdatePart = async (
        part: CrochetPart,
        e: React.FormEvent<HTMLFormElement>
      ) => {
        e.preventDefault();
    
        const target = e.target as typeof e.target & {
          name: { value: string };
        };
    
        setEditPart(null);
        onUpdatePart({...part, name: target.name.value})
    }

    return <><div className="list-item" >
        <div className="card-title" onClick={() => {setOpenPart(part)}}>{part.name}</div>

        <div className="button" onClick={() => {setEditPart(part)}}>Edit</div>
    </div>
    {editPart && (
        <Modal
          open={editPart !== null}
          modalLabel="Edit Part"
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

      {openPart && (
        <Modal
          open={openPart !== null}
          modalLabel={project.name}
          onClose={() => {
            
            if (project.timerOn && window.confirm('stop timer?')) stopTimer();
            setOpenPart(null);
          }}
        >
          <PartDetails
            part={openPart}
            onUpdate={(p) => {
                onUpdatePart(p);
                setOpenPart(p);
            }}
            hasSecondCounter={project.hasSecondCounter}
            timer={timer}
          />
        </Modal>
      )}
    </>
}