import { FC } from "react";


import { TimerReset } from "../icons/timer-reset";
import { StopFill } from "../icons/stop";
import { Play } from "../icons/play";
import { millisecondsToHuman } from "../../service/time";


type Props = {
    timer: number,
    isRunning: boolean,
    stop: () => void,
    start: () => void,
    reset: () => void,
}



export const Timer : FC<Props> = ({timer, isRunning, stop, start, reset}) => {
    const prettyTime = millisecondsToHuman(timer)

    return (<div className="timer prevent-select">
                <div className="button" onClick={(e) => {
                    e.preventDefault();
                    if (window.confirm('Would you reset timer')) reset()
                }}>
            <TimerReset />
        </div>

        <div className="timer-title">{prettyTime}</div>
        { isRunning ?
        <div className="button prevent-select stop" onClick={(e) => {e.preventDefault(); stop() }}>
            <StopFill />
        </div> :
        <div className="button prevent-select start" onClick={(e) => {e.preventDefault(); start()}}>
            <Play />
        </div>
        }

    </div>)
}