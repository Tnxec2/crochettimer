import { FC } from "react";



type Props = {
    onClose: () => void,
    error?: string
}

export const ErrorMessage : FC<Props> = ({onClose, error}) => {

    return ( <>
    { error && 
        <div className="error" >
            <span className="error-title">{error}</span>
            <button className="button" onClick={() => {onClose()}}>x</button>
        </div>}
    </>)
}