import { FC } from "react";


type Props = {
    defaultValue: string,
    placeholder: string,
    save: (value: string) => void
}

export const InputDialog : FC<Props> = ({defaultValue, placeholder, save}) => {

    const handleAddProject = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const target = e.target as typeof e.target & {
          text: { value: string };
        };
    
        save(target.text.value);
    }

    return (<>
        <form onSubmit={(handleAddProject)}>
        <input type="text" name="text" placeholder={placeholder} defaultValue={defaultValue} autoFocus/>
        <button type="submit" className="button">Save</button>
      </form>
    </>)
}