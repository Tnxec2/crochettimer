import { ChangeEvent, FC } from "react";
import { addMultipleData, CrochetProject } from "../../service/db";



type Props = {
    reload: () => void
}

export const RestoreDialog: FC<Props> = ({ reload }) => {

    async function onLoadJson(e: ProgressEvent<FileReader>) {

        if (e.target) {
            let json = e.target.result;
            if (json) {
                let j: CrochetProject[] = JSON.parse(json.toString());


                await addMultipleData(j)
                reload();
            }
        }
    }

    function uploadJsonFile(e: ChangeEvent<HTMLInputElement>) {
        let file = e.target?.files?.item(0);
        if (file) {
            let fr = new FileReader();
            fr.onload = onLoadJson;
            fr.readAsText(file);
        }
    }

    return (<>
        <p>Select JSON backup file to restore</p>
        <div className="d-flex">
        <input
            type="file"
            className="form-control"
            accept="application/json"
            id="jsonLoad"
            onChange={uploadJsonFile}
            title="Select JSON backup file to restore"
        />
        </div>
    </>)
}