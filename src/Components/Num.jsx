import { useCallback, useEffect } from "react";

/*NOTE: (The wiki does not recommend doing prop validation in modern react
 Apparently proper type checking is done in TypeScript. 
// )

*/
export function Num({ value, isSelected, onClick, onValueChange, position }) {
  const handleKeyDown = useCallback(
    (event) => {
      if (!isSelected) return;

      switch (event.key) {
        case "ArrowUp":
          //could nest these condition in a terniary but it would be unreadable
          if (position !== 0) {
            value === 59 ? onValueChange(59) : onValueChange(value + 1);
          } else {
            value === 23 ? onValueChange(23) : onValueChange(value + 1); //since hrs can't be displayed as greater than 23
          }

          break;
        case "ArrowDown":
          value === 0 ? onValueChange(0) : onValueChange(value - 1); //so we don't get negative nums
          break;
        default:
          break;
      }
    },
    [isSelected, onValueChange, position, value]
  );

  //small element children:
  const pos = ["hr", "min", "sec"];

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown); //will trigger func upon event

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSelected, value, onValueChange, position, handleKeyDown]); //dependencies change will re-render component

  //TODO: Change <small> font
  return (
    <div
      className="timer-num-space"
      onKeyDown={handleKeyDown}
      onClick={onClick}
    >
      {/* TODO: Insert a ':' char after each h1, to replicate the ios layout  */}
      <small className="timer-num-tag">{pos[position]}</small>
      <h1 className={`timer-num ${isSelected ? "timer-num-selected" : ""}`}>
        {value < 10 ? "0" : " "}
        {value}
      </h1>
    </div>
  );
}
