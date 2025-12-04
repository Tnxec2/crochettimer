import { FC } from "react";
import { FileLoaderComponent } from "./fileloader";



type Props = {

}

export const BackupDialog : FC<Props> = ({}) => {

    return (<>
        <FileLoaderComponent 
            onClose={() => {}}
            onLoad={(f) => {}}
        />
    </>)
}