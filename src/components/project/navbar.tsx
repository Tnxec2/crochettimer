
import { FC } from "react";

import { Checkbox } from "../ui/checkbox";
import { ThemeToggle } from "../ui/theme.toggle";
import { useNavigate } from "react-router-dom";
import { Help } from "../icons/help";



type Props = {
    actionsLeft?: React.ReactNode,
    title?: React.ReactNode,
    actionsRight?: React.ReactNode,
}

export const Navigation : FC<Props> = ({title, actionsLeft, actionsRight}) => {

    const navigate = useNavigate();
    
    return (<>
    <div className="card-header">
      <nav className="navbar bg-body-tertiary">
        <div className="container-fluid">
          <div>
            <ThemeToggle />
            { actionsLeft }
          </div>
          <a className="navbar-brand ms-2" href="#">
            { title }
          </a>
          <div>
            { actionsRight }
          </div>
        </div>
      </nav>
      </div>
      </>)
}