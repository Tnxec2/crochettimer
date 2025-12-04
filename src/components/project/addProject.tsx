import { FC } from "react";

import { Checkbox } from "../ui/checkbox";
import { Navigation } from "./navbar";
import { CrochetProject, addData, Stores } from "../../service/db";
import { ArrowBackOutline } from "../icons/back";



type Props = {
    setError: (e: string) => void;
}

export const AddProject: FC<Props> = ({ setError }) => {
    

      const handleAddProject = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        const target = e.target as typeof e.target & {
          name: { value: string };
          note: { value: string };
          hasMultipleParts: { checked: boolean };
          hasTimer: { checked: boolean };
          hasSecondCounter: { checked: boolean };
        };
    
        const name = target.name.value;
    
        if (name.trim() === "") {
          alert("Please enter a valid name");
          return;
        }
    
    
        const newProject: CrochetProject = {
          id: Date.now().toString(),
          name: name,
          hasMultipleParts: target.hasMultipleParts.checked,
          hasTimer: target.hasTimer.checked,
          hasSecondCounter: target.hasSecondCounter.checked,
          counter: 1,
          secondCounter: 1,
          time: 0,
          timerOn: false,
          note: target.note.value,
          archived: false,
        };
    
          addData(Stores.Projects, newProject)
          .then((data) => {window.history.back()})
          .catch ((err: unknown) => {
            if (err instanceof Error) {
              setError(err.message);
            } else {
              setError("Something went wrong");
            }
          })
      };

    return (
        <>
            <Navigation
                title={'Add new project'}
                actionsRight={
                    <div className="btn btn-outline-secondary" onClick={() => { window.history.back() }}>
                        <ArrowBackOutline />
                    </div>
                }
            />
            <div className="card-body">
                <form className="" onSubmit={handleAddProject}>
                    <input type="text" className="form-control mb-3" name="name" placeholder="Name" autoFocus autoComplete="off" required />
                    <Checkbox name="hasMultipleParts" title="has multiple parts" />
                    <Checkbox name="hasTimer" title="has timer" />
                    <Checkbox name="hasSecondCounter" title="has second counter" />
                    <textarea name="note" className="form-control mt-3 mb-3" rows={5} title="notes" placeholder="notes"></textarea>
                    <button type="submit" className="btn btn-primary">Add Project</button>
                </form>
            </div>
        </>)
}