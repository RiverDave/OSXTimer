import { useState, useEffect, useRef } from "react";
import { Num } from "./Num.jsx";

const DEFAULT_TIME = 10;

export function Timer() {
  const [seconds, setSeconds] = useState(DEFAULT_TIME);
  const [timer, toggleTimer] = useState(false);

  //Could've used the moment lib tho...
  const formatTime = (time) => {
    const hrs = Math.floor(time / 3600);
    const mins = Math.floor((time % 3600) / 60);
    const secs = time % 60;
    // [hrs, mins, secs]
    //   .map((v) => (v < 10 ? "0" + v : v)) // add trailing 0 if element is less than 10 (02, 03 ...)
    //   .filter((v, i) => v !== "00" || i > 0) // return elements, not equal to 00
    //   .join(":");

    return [hrs, mins, secs];
  };

  const intervalRef = useRef();
  useEffect(() => {
    if (timer) {
      intervalRef.current = setInterval(() => {
        if (seconds == 0) {
          clearInterval(intervalRef.current);
          setSeconds(DEFAULT_TIME);
          toggleTimer(!timer);
        } else {
          setSeconds((prevSeconds) => prevSeconds - 1); // Timer decrease
        }
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [seconds, timer]);

  const [nhrs, nmins, nsecs] = formatTime(seconds);
  const calculatedData = [nhrs, nmins, nsecs];

  const [selectedNum, setSelectedNum] = useState(null);

  //TODO: Un-toggle selected num if it is already selected
  // - Change field with keyboard, similar to mac-os/ios timer
  return (
    <main className="timer-content">
      <div className="timer-numbers-space">
        {[0, 1, 2].map((num) => {
          //always return elements in a map!
          return (
            <Num
              key={num}
              isSelected={selectedNum === num} //condition depends on current num selected num
              onClick={() => setSelectedNum(num)}
            >
              {calculatedData[num]}
            </Num>
          );
        })}
      </div>
      <div className="timer-extras">
        <button onClick={() => toggleTimer(!timer)}>Start</button>
      </div>
    </main>
  );
}
