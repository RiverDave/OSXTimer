import { useState, useEffect, useRef } from "react";
import { Num } from "./Num.jsx";

const DEFAULT_TIME = 10;

export function Timer() {
  const [values, setValues] = useState([0, 0, 0]); //TODO: according to this state, parse to time units(secs)
  const [seconds, setSeconds] = useState(DEFAULT_TIME);
  const [timer, toggleTimer] = useState(false);

  const formatTime = (time) => {
    const hrs = Math.floor(time / 3600);
    const mins = Math.floor((time % 3600) / 60);
    const secs = time % 60;
    return [hrs, mins, secs];
  };

  const handleValueChange = (index, nvalue) => {
    setValues(values.map((value, i) => (i === index ? nvalue : value)));
  };

  const [selectedNum, setSelectedNum] = useState(null); //only entity can be selected at once

  const handleKeyDown = (event) => {
    switch (event.key) {
      case "ArrowRight":
        selectedNum === 2 ? setSelectedNum(0) : setSelectedNum(selectedNum + 1);
        break;

      case "ArrowLeft":
        selectedNum === 0 ? setSelectedNum(2) : setSelectedNum(selectedNum - 1);
        break;
    }
  };

  // const intervalRef = useRef(); //function reference
  useEffect(() => {
    // return () => clearInterval(intervalRef.current);

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      //TODO: If timer is toggled, parse state of values in here && translate each pos to (hrs, mins , secs)

      if (timer) {
        const [hrs, mins, secs] = values;
        console.log(`vals : ${hrs} ${mins} ${secs}`);
      }

      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedNum, setSelectedNum]);

  // const [nhrs, nmins, nsecs] = formatTime(seconds);

  // console.log(keyboardFocus);
  console.log(values);
  console.log(`Selected num : ${selectedNum}`);

  //DONE: Alternate between numbers with the left & right arrow keys [✅] 🐐

  //
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
        <button onClick={() => toggleTimer(!timer)}>Start</button>
      </div>
    </main>
  );
}
