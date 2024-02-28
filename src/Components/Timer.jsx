import { useState, useEffect, useRef } from "react";
import { Num } from "./Num.jsx";

export function Timer() {
  const [values, setValues] = useState(() => {
    const valuesFromStorage = window.localStorage.getItem("values");
    return valuesFromStorage ? JSON.parse(valuesFromStorage) : Array(3).fill(0);
  });

  const [seconds, setSeconds] = useState(0);
  const [timer, toggleTimer] = useState(false);
  const [selectedNum, setSelectedNum] = useState(null); //only entity can be selected at once
  const [preservedValues, setPreservedValues] = useState(Array(3).fill(0));

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

  console.log("values: " + values);

  const intervalRef = useRef(); //function reference
  // setPreservedValues(values); // in case a restart is needed
  useEffect(() => {
    setPreservedValues((prevValues) => (!timer ? values : prevValues));
    //preserve values if page is refreshed
    window.localStorage.setItem("values", JSON.stringify(values));

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
      setSelectedNum(null); //freezes any type of user input

      const [nhrs, nmins, nsecs] = formatTime(seconds);
      setValues[(nhrs, nmins, nsecs)];
      const totalSeconds = parseTime();
      setSeconds(totalSeconds);

      intervalRef.current = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds <= 0) {
            console.log("timer went off");
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
  }, [seconds, timer, selectedNum, values]);

  //DONE: Alternate between numbers with the left & right arrow keys [✅] 🐐

  /*(TODO: Style timer, based on the ios app, have a modern ui
   
   - [x] timer-numbers-space should have a box with a lighter color that denotes the space where the numbers are
   - [x] There should be an indicative of which time unit denotes what(ie: first position denotes hrs, second mins etc...)
   - [x] Im still not convinced about the font, perhaps i could find one where the numbers are thinner?
   - [x] Change the box around selected num, since it is pretty barebones as of now.
   - [x] increese te amount of space between the numbers & extras.
  BUTTONS:
   - [x] When timer is not running the space button should be grayed, and when it is on its font should glow
   - [x] The start button should be highlighted with any sort of color.
  WHEN TIMER IS ON:
   - [x] Add a progress bar animation when timer is toggled?? will have to reasearch a about this
  FUTURE TODO:
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
          className="btn-cancel"
          tabIndex={0}
          onClick={() => {
            if (timer) {
              toggleTimer(false);
              setValues(preservedValues);
            }
          }}
          //TODO: Figure out what to do with the cancel button, since it's not working as it should
          // rationale: When the timer has started even if it gets paused, when the cancel button is toggled
          // the timer values should go back to the state as it was before it had been toggled for the first time.
          // timer -> 10s -> 8s -> pause -> 5s -> cancel -> 10s(back to here)
        >
          Cancel
        </button>

        <button
          className={!timer ? "btn-start" : "btn-counting"}
          tabIndex={0}
          onClick={() => toggleTimer(!timer)}
        >
          {timer ? "Pause" : "Start"}
        </button>

        {/* <button tabIndex={0}>restart</button> */}
      </div>
    </main>
  );
}
