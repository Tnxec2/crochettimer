import { FC, ReactNode, useState } from "react";
import { CrochetPart } from "../../service/db";
import Modal from "../modal/modal";
import { EditPartDialog } from "./editPartDialog";
import { PartDetails } from "./part.details";



type Props = {
    part: CrochetPart,
    onUpdatePart: (part: CrochetPart) => void,
    hasSecondCounter: boolean,
    timer?: ReactNode
    isTimerOn: boolean
    stopTimer: () => void
}

export const PartCard : FC<Props> = ({part, onUpdatePart, hasSecondCounter, timer, isTimerOn, stopTimer}) => {
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
          />
        </Modal>
      )}

      {openPart && (
        <Modal
          open={openPart !== null}
          modalLabel={openPart.name}
          onClose={() => {
            
            if (isTimerOn && window.confirm('stop timer?')) stopTimer();
            setOpenPart(null);
          }}
        >
          <PartDetails
            part={openPart}
            onUpdate={(p) => {
                onUpdatePart(p);
                setOpenPart(p);
            }}
            hasSecondCounter={hasSecondCounter}
            timer={timer}
          />
        </Modal>
      )}
    </>
}