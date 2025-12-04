import { FC, useState } from "react";
import { toggleTheme } from "../../service/theme";
import { Night } from "../icons/night";
import { Day } from "../icons/day";



type Props = {
    
}

export const ThemeToggle : FC<Props> = ({}) => {
    const [theme, setTheme] = useState(localStorage.getItem('theme'))

    return (<>
    <button type="button" className="btn btn-outline-secondary"  onClick={() => {
        console.log('toggle');
        setTheme(toggleTheme());
    }} >{theme === 'theme-dark' ? <Night /> : <Day />}</button>
    </>)
}