
import { ChangeEvent, FC, useCallback,  } from 'react'


interface PROPS {
    onClose: () => void
    onLoad: (file: File | undefined) => void
}

export const FileLoaderComponent: FC<PROPS> = ({ onLoad, onClose }) => {


    const loadFileInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let file = e.target.files?.item(0)
        if (file) {
            onLoad(file)
        }
    }, [])

    return (
        <>
            <p>Select json file.</p>
            <input
                type="file"
                className='form-control'
                accept="application/json"
                onChange={loadFileInput}
                onAbort={onClose}
            />
        </>
)
}
