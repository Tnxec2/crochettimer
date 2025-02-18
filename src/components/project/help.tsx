import { FC, useCallback, useState } from "react";
import Modal from "../modal/modal";
import { BackupDialog } from "./backup.dialog";
import { RestoreDialog } from "./restore.dialog";
import { ThemeToggle } from "../ui/theme.toggle";
import { ArrowBackOutline } from "../icons/back";
import { CrochetProject, getStoreData, Stores } from "../../service/db";
import { useNavigate } from "react-router-dom";

type Props = {
};



export const HelpPage: FC<Props> = ({}) => {
  const navigate = useNavigate();
  const [backup, setBackup] = useState<boolean>(false);
  const [restore, setRestore] = useState<boolean>(false);

  const save = useCallback(async () => {
    function saveTextToFile(projects: CrochetProject[]) {
        const blob = new Blob([JSON.stringify(projects, null, 2)], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `crochettimer_backup_${new Date().toISOString()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } 

        const data = await getStoreData<CrochetProject>(Stores.Projects);
        saveTextToFile(data);
  }, [])

  const handleImport = async (

  ) => {

  };


  return (
    <>
      <nav>
        <ThemeToggle />
        <div className="app-title">
          <h1>Help</h1>
        </div>
        <div
          className="button"
          onClick={() => {
            navigate('/')
          }}
        >
          <ArrowBackOutline />
        </div>
      </nav>

      <div className="" style={{ textAlign: 'left', padding: '1em' }}>
        <p>
          With this app you can count rows or stiches in your crochet / knitting projects. You can track multiple parts on one project, or you can work your project as single part project.
        </p>
        <p>
          You have two counters for every part:
        </p>
        <ol>
          <li>main counter, for count rows</li>
          <li>secondary counter, for count stitches</li>
          <li>Also you can also track total time for whole project.</li>
        </ol>
        <p>Your data are saved localy on your deivce in the web browser storage.</p>
      </div>
      <h2>Helpers</h2>
      <p>You can backup your data to json file, and restore saved data from json.</p>
      <div className="card-list button" onClick={() => {save()}}>
        Backup projects
      </div>
      <div className="card-list button"  onClick={() => {setRestore(true)}}>
        Restore backup
      </div>



      <Modal
        open={restore}
        modalLabel="Restore backup"
        onClose={() => {
          setRestore(false);
        }}
      >
        <RestoreDialog reload={() => {navigate('/')}} />
      </Modal>
    </>
  );
};
