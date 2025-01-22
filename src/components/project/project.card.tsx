import { FC } from "react";
import { CrochetProject } from "../../service/db";
import { More } from "../icons/morevert";



type Props = {
    item: CrochetProject,
    onEdit: () => void,
    onOpen: () => void,
}

export const ProjectCard : FC<Props> = ({item, onEdit, onOpen}) => {

    return <div className="list-item" >
        <div className="card-title" onClick={onOpen}>{item.name}</div>
        { item.hasMultipleParts && item.parts && <div className="p3">{item.parts?.length}</div> }
        <div className="button" onClick={onEdit}><More /></div>
    </div>
}