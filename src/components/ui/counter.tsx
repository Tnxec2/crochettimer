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
    <div className={`alert d-flex align-items-center justify-content-between prevent-select ${isSecond ? "alert-light" : "alert-primary"}`}>
      <div>
        <button
          type="button"
          className="btn btn-outline-secondary prevent-select me-3"
          onClick={(e) => {
            e.preventDefault();
            if (window.confirm("Would you reset this counter")) updateCounter(1);
          }}
        >
          <TimerReset />
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary prevent-select"
          onClick={(e) => {
            e.preventDefault();
            if (counter > 1) updateCounter(counter - 1);
          }}
        >
          <Minus />
        </button>
      </div>
      <h2>{counter}</h2>
      <div> 
      {isSecond && (
        <button
          type="button"
          className="btn btn-outline-secondary prevent-select me-3"
          onClick={(e) => {
            e.preventDefault();
            updateCounter(counter + 10);
          }}
        >
          <HeavyPlusSign /> 10
        </button>
      )}
      <button
        type="button"
        className={`btn btn-outline-secondary prevent-select ${isSecond ? '' : 'btn-lg'}`}
        onClick={(e) => {
          e.preventDefault();
          updateCounter(counter + 1);
        }}
      >
        <HeavyPlusSign />
      </button>
      </div>
    </div>
  );
};
