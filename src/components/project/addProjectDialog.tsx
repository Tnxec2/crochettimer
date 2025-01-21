import { FC } from "react";

import { Checkbox } from "../ui/checkbox";



type Props = {
    handleAddProject: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
}

export const AddProjectDialog : FC<Props> = ({handleAddProject}) => {

    return (<>
        <form onSubmit={handleAddProject}>
        <input type="text" name="name" placeholder="Name" autoFocus />
        <Checkbox name="hasMultipleParts" title="has multiple parts" />
        <Checkbox name="hasTimer" title="has timer" />
        <Checkbox name="hasSecondCounter" title="has second counter" />
        <button type="submit" className="button">Add Project</button>
      </form>
    </>)
}