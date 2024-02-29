/* TODO: to be shippable i need that:
  - It creates a sound when it is toggled
  - The cancel button is fixed

*/
import { useState, useEffect, useRef } from "react";
import { Num } from "./Num.jsx";

export function Timer() {
  const [startedCountdown, setStartedCountdown] = useState(() => {
    const valuesFromStorage = window.localStorage.getItem("startedCountdown");
    return valuesFromStorage ? JSON.parse(valuesFromStorage) : null;
  });

  const [values, setValues] = useState(() => {
    const valuesFromStorage = window.localStorage.getItem("values");
    return valuesFromStorage && startedCountdown
      ? JSON.parse(valuesFromStorage)
      : Array(3).fill(0);
  });

  const [seconds, setSeconds] = useState(0);
  const [timer, toggleTimer] = useState(false);
  const [selectedNum, setSelectedNum] = useState(null); //only entity can be selected at once
  const [preservedValues, setPreservedValues] = useState(Array(3).fill(0)); //copy of values, used to restore timer if cancel button is toggled

  //Still need to figure out what this does...
  const handleValueChange = (index, nvalue) => {
    setValues(values.map((value, i) => (i === index ? nvalue : value)));
  };

  //convert secs to array
  const formatTime = (totalSecs) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    return [hrs, mins, secs];
  };

  const intervalRef = useRef(); //function reference
  console.log(window.localStorage);
  useEffect(() => {
    //preserve values if page is refreshed
    if (!startedCountdown) {
      //this was causing an issue before...
      setPreservedValues((prevValues) => (!timer ? values : prevValues)); // -[✅?]
      window.localStorage.setItem("values", JSON.stringify(values));
      // window.localStorage.setItem(
      //   "startedCountdown",
      //   JSON.stringify(startedCountdown)
    }

    const handleKeyDown = (event) => {
      if (event.key === "Enter") toggleTimer(!timer);
      if (timer) return;
      switch (event.key) {
        case "ArrowRight":
          //block below looks ugly, but it fixes the issue of pressing left when null
          if (selectedNum === null) {
            setSelectedNum(0);
            return;
          }
          selectedNum >= 2
            ? setSelectedNum(0)
            : setSelectedNum((prevSelected) => prevSelected + 1);
          break;

        case "ArrowLeft":
          // if (selectedNum === null) setSelectedNum(2);
          selectedNum <= 0
            ? setSelectedNum(2)
            : setSelectedNum((prevSelected) => prevSelected - 1);
          break;

        case "Escape":
          setSelectedNum(null);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // rationale : ARR -> [parser(passes array of values to seconds)] -> ARR

    //converts array to seconds
    const parseTime = () => {
      const [hrs, mins, secs] = values;
      const minsTosecs = Math.floor(mins * 60);
      const hrsToSecs = Math.floor(hrs * 60 * 60);
      return secs + minsTosecs + hrsToSecs;
    };

    if (timer) {
      setStartedCountdown(true);
      setSelectedNum(null); //freezes any type of user input

      const [nhrs, nmins, nsecs] = formatTime(seconds);
      setValues[(nhrs, nmins, nsecs)];
      const totalSeconds = parseTime();
      setSeconds(totalSeconds);

      intervalRef.current = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds <= 0) {
            console.log("timer went off");
            setStartedCountdown(false);
            clearInterval(intervalRef.current);
            toggleTimer(!timer);
            return 0;
          } else {
            setValues(formatTime(prevSeconds - 1));
            return prevSeconds - 1;
          }
        });
      }, 1000);
    }

    return () => {
      clearInterval(intervalRef.current);
      window.removeEventListener("keydown", handleKeyDown);
      window.localStorage.removeItem("values");
    };
  }, [seconds, timer, selectedNum, values, startedCountdown]);

  //DONE: Alternate between numbers with the left & right arrow keys [✅] 🐐

  /*(TODO: Style timer, based on the ios app, have a modern ui
   
   - [x] Add a progress bar animation when timer is toggled?? will have to reasearch a about this
  TODO:
   Add a sound when timer is off
  */

  return (
    <main className="timer-content">
      <div className="timer-box">
        {values.map((value, index) => {
          //always return elements in a map!

          return (
            <Num
              position={index}
              onValueChange={(newValue) => handleValueChange(index, newValue)}
              value={value}
              key={index}
              isSelected={selectedNum === index} //condition depends on current selected index
              onClick={() => {
                selectedNum === index
                  ? setSelectedNum(null)
                  : setSelectedNum(index);
              }}
            >
              {values[index]}
            </Num>
          );
        })}
      </div>
      <div className="timer-extras">
        <button
          className={
            timer || startedCountdown ? "btn-cancel" : "btn-cancel-off"
          }
          tabIndex={-1}
          onClick={() => {
            if (startedCountdown) {
              toggleTimer(false);
              setStartedCountdown(false);
              setValues(preservedValues); //should go back to values pre-started countdown(localStorage?)
            }
          }}
        >
          Cancel
        </button>

        <button
          className={!timer ? "btn-start" : "btn-counting"}
          onClick={() => toggleTimer(!timer)}
          tabIndex={-1}
        >
          {startedCountdown && timer
            ? "Pause"
            : startedCountdown && !timer
              ? "Resume"
              : "Start"}
        </button>

        {/* <button tabIndex={0}>restart</button> */}
      </div>
    </main>
  );
}
