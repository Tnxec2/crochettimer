import { FC, ReactNode, useState } from "react";
import { CrochetPart, CrochetProject } from "../../service/db";
import { Counter } from "../ui/counter";
import { PartCard } from "./part.card";
import Modal from "../modal/modal";
import { InputDialog } from "../ui/inputNameDialog";
import { millisecondsToHuman } from "../../service/time";



type Props = {
    project: CrochetProject,
    timer: ReactNode,
    onAddPart: (name: string) => void,
    onUpdatePart: (part: CrochetPart) => void,
    onDeletePart: (part: CrochetPart) => void,
    onUpdate: (project: CrochetProject) => void,
    stopTimer: () => void,
}

export const ProjectDetails : FC<Props> = ({project, timer, onAddPart, onUpdatePart, onDeletePart, onUpdate, stopTimer}) => {
    const [openNewPartNameDialog, setOpenNewPartNameDialog] = useState(false)

    return (<div className="">
        
        { project.hasMultipleParts ? 
        <>
            {project.hasTimer && <div className="counter-title">Total: {millisecondsToHuman(project.time)}</div> }
            {project.parts?.map((part) => 
                <PartCard 
                    key={part.id}
                    project={project}
                    part={part}  
                    onUpdatePart={onUpdatePart} 
                    timer={project.hasTimer && timer}
                    stopTimer={stopTimer}
                    onDeletePart={onDeletePart}
                    />
            )
            }
            <div className="button" onClick={() => setOpenNewPartNameDialog(true)}>Add part</div>
        </> 
        : 
        <>
            <div className="">
            {project.hasTimer && timer}
            <Counter counter={project.counter} 
            updateCounter={(c) => {onUpdate({...project, counter: c})}} 
            isSecond={false}
             />
             { project.hasSecondCounter && 
             <Counter counter={project.secondCounter} 
            updateCounter={(c) => {onUpdate({...project, secondCounter: c})}} 
            isSecond={true}
             /> }
    </div>
        </>}


        <Modal
          open={openNewPartNameDialog}
          modalLabel="New part"
          onClose={() => {
            setOpenNewPartNameDialog(false);
          }}
        >
            <InputDialog 
                defaultValue=''
                placeholder="name"
                save={(v) => {
                    onAddPart(v);
                    setOpenNewPartNameDialog(false);
                }}
            />
        </Modal>
    </div>)
}