import { FC } from "react";



type Props = {
    onClose: () => void,
    error?: string
}

export const ErrorMessage : FC<Props> = ({onClose, error}) => {

    return ( <>
    { error && 
        <div className="alert alert-danger alert-dismissible fade show" role="alert" >
            <strong>Error</strong> <br/>{error}
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => onClose()}></button>
        </div>}
    </>)
}