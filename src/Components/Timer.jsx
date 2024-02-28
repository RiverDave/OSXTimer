import { useState, useEffect, useRef } from "react";
import { Num } from "./Num.jsx";

export function Timer() {
  const [values, setValues] = useState([0, 0, 0]);
  const [seconds, setSeconds] = useState(0);
  const [timer, toggleTimer] = useState(false);
  const [selectedNum, setSelectedNum] = useState(null); //only entity can be selected at once

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
  useEffect(() => {
    // return () => clearInterval(intervalRef.current);

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

        // case "Enter":
        //   toggleTimer(!timer);
        //   break;
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
      // const calculatedData = [nhrs, nmins, nsecs]; //pass to component only if timer was toggled
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
    };
  }, [seconds, timer, selectedNum, values]);

  console.log(selectedNum);
  //DONE: Alternate between numbers with the left & right arrow keys [✅] 🐐

  //TODO: Style timer, based on ios app
  return (
    <main className="timer-content">
      <div className="timer-numbers-space">
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
        <button onClick={() => toggleTimer(!timer)}>
          {timer ? "Stop" : "Start"}
        </button>
      </div>
    </main>
  );
}
