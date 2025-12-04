import { FC } from "react";
import { CrochetProject } from "../../service/db";
import { More } from "../icons/morevert";



type Props = {
    item: CrochetProject,
    onEdit: () => void,
    onOpen: () => void,
}

export const ProjectCard : FC<Props> = ({item, onEdit, onOpen}) => {

    return <div className="list-group-item list-group-item-action d-flex align-items-center"  onClick={onOpen}
        title={item.note ? `${item.name}\n\n${item.note}` : item.name}
    >
        <div className="" >
                {item.name}
        </div>

        <div className="ms-auto">
            { item.hasMultipleParts && item.parts && <div className="ms-auto badge text-bg-secondary" title="parts">
                {item.parts?.length}
            </div> }
            <button className="btn btn-outline-secondary ms-3"  onClick={(e) => {
                e.stopPropagation();
                onEdit();
            }}>
                <More />
            </button>
        </div>
    </div>
}