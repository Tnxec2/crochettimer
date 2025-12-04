import { FC } from "react";
import { CrochetPart } from "../../service/db";


type Props = {
    part: CrochetPart,
    handleUpdate: (part: CrochetPart, e: React.FormEvent<HTMLFormElement>) => Promise<void>
    onDeletePart: (part: CrochetPart) => void
}

export const EditPartDialog: FC<Props> = ({ part, handleUpdate, onDeletePart }) => {

    return (
        <form onSubmit={(e) => { handleUpdate(part, e) }}>
            <input type="text" className="form-control mb-3" name="name" placeholder="Name" defaultValue={part.name} autoFocus autoComplete="off" />
            <button type="submit" className="btn btn-success me-3">Save Part</button>
            <button type="button" className="btn btn-danger" onClick={() => {
                if (window.confirm(`Would you delete this part "${part.name}"?`)) onDeletePart(part)
            }}>Delete Part</button>
        </form>
    )
}