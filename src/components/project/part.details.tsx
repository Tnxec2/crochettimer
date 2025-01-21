import { FC, ReactNode } from "react";
import { CrochetPart } from "../../service/db";
import { Counter } from "./counter";


type Props = {
    part: CrochetPart,
    onUpdate: (part: CrochetPart) => void,
    hasSecondCounter: boolean
    timer?: ReactNode
}

export const PartDetails : FC<Props> = ({part, onUpdate, hasSecondCounter, timer}) => {

    return (<div className="">
            {timer}
            <Counter counter={part.counter} 
            updateCounter={(c) => {onUpdate({...part, counter: c})}} 
            isSecond={false}
             />
             { hasSecondCounter && 
             <Counter counter={part.secondCounter} 
            updateCounter={(c) => {onUpdate({...part, secondCounter: c})}} 
            isSecond={true}
             /> }
    </div>)
}