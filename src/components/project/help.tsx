import { FC, useCallback, useState } from "react";
import Modal from "../modal/modal";
import { RestoreDialog } from "./restore.dialog";
import { ThemeToggle } from "../ui/theme.toggle";
import { ArrowBackOutline } from "../icons/back";
import { CrochetProject, getStoreData, Stores } from "../../service/db";
import { useNavigate } from "react-router-dom";
import { Help } from "../icons/help";
import { Navigation } from "./navbar";


export const HelpPage: FC = () => {
  const navigate = useNavigate();
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

  return (
    <>
      <Navigation
        title={'Help'}
        actionsRight={
          <div className="btn btn-outline-secondary" onClick={() => { navigate(`/`) }}>
            <ArrowBackOutline />
          </div>
        } />
      <div className="card-body" >
        <p>
          With this app you can count rows or stiches in your crochet / knitting projects. You can track multiple parts on one project, or you can work your project as single part project.
        </p>
        <p>
          You have two counters for every part:
        </p>
        <ul>
          <li>main counter, for count rows</li>
          <li>secondary counter, for count stitches</li>
          <li>Also you can also track total time for whole project.</li>
        </ul>
        <p>Your data are saved localy on your deivce in the web browser storage.</p>
      </div>
      <div className="card-footer">
        <h2>Helpers</h2>
        <p>You can backup your data to json file, and restore saved data from json.</p>
        <div className="btn-group mb-3" role="group" aria-label="backup restore group">
          <div className="btn btn-primary" onClick={() => { save() }}>
            Backup projects
          </div>
          <div className="btn btn-warning" onClick={() => { setRestore(true) }}>
            Restore backup
          </div>
        </div>
      </div>
      <Modal
        open={restore}
        modalLabel="Backup restore"
        onClose={() => {
          setRestore(false);
        }}
      >
        <RestoreDialog reload={() => { navigate(`/`) }} />
      </Modal>
    </>
  );
};
