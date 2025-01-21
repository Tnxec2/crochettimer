import { FC } from "react";
import { CrochetPart } from "../../service/db";


type Props = {
    part: CrochetPart,
    handleUpdate: (part: CrochetPart, e: React.FormEvent<HTMLFormElement>) => Promise<void>
}

export const EditPartDialog : FC<Props> = ({part, handleUpdate}) => {

    return (<>
        <form onSubmit={(e) => {handleUpdate(part, e)}}>
        <input type="text" name="name" placeholder="Name" defaultValue={part.name} autoFocus/>
        <button type="submit" className="button">Save Part</button>
      </form>
    </>)
}