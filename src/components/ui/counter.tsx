import { FC } from "react";
import { Minus } from "../icons/minus";
import { HeavyPlusSign } from "../icons/plus";
import { TimerReset } from "../icons/timer-reset";

export type TCounter = {
  count: number;
};

type Props = {
  counter: number;
  updateCounter: (counter: number) => void;
  isSecond?: boolean;
};

export const Counter: FC<Props> = ({ counter, updateCounter, isSecond }) => {
  return (
    <div className={`counter prevent-select ${isSecond ? "second" : "main"}`}>
      <div
        className="button"
        onClick={(e) => {
          e.preventDefault();
          if (window.confirm("Would you reset this counter")) updateCounter(1);
        }}
      >
        <TimerReset />
      </div>
      <div
        className="button prevent-select"
        onClick={(e) => {
          e.preventDefault();
          if (counter > 1) updateCounter(counter - 1);
        }}
      >
        <Minus />
      </div>
      <div className="counter-title">{counter}</div>
      {isSecond && (
        <div
          className="button prevent-select"
          onClick={(e) => {
            e.preventDefault();
            updateCounter(counter + 10);
          }}
        >
          <HeavyPlusSign /> 10
        </div>
      )}
      <div
        className={`button prevent-select ${isSecond ? '' : 'big'}`}
        onClick={(e) => {
          e.preventDefault();
          updateCounter(counter + 1);
        }}
      >
        <HeavyPlusSign />
      </div>
    </div>
  );
};
