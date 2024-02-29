import { useState, useEffect, useRef } from "react";
import { Num } from "./Num.jsx";
// import  Alarm  from "./assets/mixkit-alarm-tone.wav"
import { playAlarm } from "../sound/sounds.js";

export function Timer() {
  //conditional states
  const [startedCountdown, setStartedCountdown] = useState(false);
  const [timer, toggleTimer] = useState(false);
  const [timerOff, setTimerOff] = useState(false);

  //value states
  const [values, setValues] = useState(() => {
    const valuesFromStorage = window.localStorage.getItem("values");
    return valuesFromStorage && startedCountdown
      ? JSON.parse(valuesFromStorage)
      : Array(3).fill(0); //will trigger this for now...
  });
  const [preservedValues, setPreservedValues] = useState(Array(3).fill(0)); //copy of values, used to restore timer if cancel button is toggled
  const [seconds, setSeconds] = useState(0);
  const [selectedNum, setSelectedNum] = useState(null); //only entity can be selected at once

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

  const handleStartButtonChild = () => {
    if (timerOff) {
      return "Stop";
    }

    if (startedCountdown && timer) {
      return "Pause";
    } else if (startedCountdown && !timer) {
      return "Resume";
    } else {
      return "Start";
    }
  };

  const handleCancelButtonClass = () => {
    if (timerOff) {
      return "btn-cancel-off";
    }

    return timer || startedCountdown ? "btn-cancel" : "btn-cancel-off";
  };
  useEffect(() => {
    //preserve values if page is refreshed
    if (!startedCountdown) {
      setPreservedValues((prevValues) => (!timer ? values : prevValues)); // -[✅?]
      window.localStorage.setItem("values", JSON.stringify(values));
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
        //Timer goes off logic:
        setSeconds((prevSeconds) => {
          if (prevSeconds <= 0) {
            setTimerOff(true);

            //alarm, waits for user input to go off(or ...)
            if (!timerOff) {
              playAlarm();
              console.log("timer went off");
              return 0;
            }

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
    //FIXME: Fix dependency warning
  }, [seconds, timer, selectedNum, values, startedCountdown]);

  //DONE: Alternate between numbers with the left & right arrow keys [✅] 🐐

  /*(TODO: Style timer, based on the osx app, have a modern ui
   - [x] Add a progress bar animation when timer is toggled?? will have to reasearch a about this
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
          className={handleCancelButtonClass()}
          tabIndex={-1}
          onClick={() => {
            //this button shouldn't work when !timer && !startedCountdown
            toggleTimer(false);
            setStartedCountdown(false);
            setValues(preservedValues); //should go back to values pre-started countdown(localStorage?)
          }}
        >
          Cancel
        </button>

        <button
          className={!timer ? "btn-start" : "btn-counting"}
          onClick={() => {
            //basically if stop is hit after timer ends
            if (timerOff) {
              setTimerOff(!timerOff);
              toggleTimer(!timer);
              setStartedCountdown(!startedCountdown);
              setValues(preservedValues); //should go back to values pre-started countdown(localStorage?)
            } else {
              //if stop is hit before timer ends
              toggleTimer(!timer);
            }
          }}
          tabIndex={-1}
        >
          {handleStartButtonChild()}
        </button>

        {/* <button tabIndex={0}>restart</button> */}
      </div>
    </main>
  );
}
