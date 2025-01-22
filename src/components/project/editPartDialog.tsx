import { FC } from "react";
import { CrochetPart } from "../../service/db";


type Props = {
    part: CrochetPart,
    handleUpdate: (part: CrochetPart, e: React.FormEvent<HTMLFormElement>) => Promise<void>
    onDeletePart: (part: CrochetPart) => void
}

export const EditPartDialog : FC<Props> = ({part, handleUpdate, onDeletePart}) => {

    return (<>
        <form onSubmit={(e) => {handleUpdate(part, e)}}>
        <input type="text" name="name" placeholder="Name" defaultValue={part.name} autoFocus/>
        <button type="submit" className="button">Save Part</button>
        <button type="button" className="button button-danger" onClick={() => {
            if (window.confirm(`Would you delete this part "${part.name}"?`)) onDeletePart(part)
            }}>Delete Project</button>
      </form>
    </>)
}