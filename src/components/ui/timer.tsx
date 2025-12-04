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

    return (<div className="alert alert-light d-flex align-items-center justify-content-between prevent-select">
                <button type="button" className="btn btn-outline-secondary" onClick={(e) => {
                    e.preventDefault();
                    if (window.confirm('Would you reset timer')) reset()
                }}>
            <TimerReset />
        </button>

        <div className="timer-title">{prettyTime}</div>
        { isRunning ?
        <button type="button" className="btn btn-outline-danger prevent-select" onClick={(e) => {e.preventDefault(); stop() }}>
            <StopFill />
        </button> :
        <button type="button" className="btn btn-outline-success prevent-select" onClick={(e) => {e.preventDefault(); start()}}>
            <Play />
        </button>
        }
    </div>)
}