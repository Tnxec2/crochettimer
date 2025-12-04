

import { FC, useRef } from "react";



type Props = {
    name?: string,
    title?: string,
    defaultChecked?: boolean,
    onClick?: () => void,
    
}

export const Checkbox : FC<Props> = ({name, title, defaultChecked}) => {
    const ref = useRef<HTMLInputElement | null>(null)

    return (
    <div className="form-check">
        <input type="checkbox" className="form-check-input" title={title} name={name} defaultChecked={defaultChecked} ref={ref} />
        <label className="form-check-label" onClick={() => {ref?.current?.click()}}>{title}</label>
    </div>
    )
}