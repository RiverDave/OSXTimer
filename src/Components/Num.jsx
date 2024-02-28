import { useCallback, useEffect } from "react";

//TODO: Implement prop validation since this warning is annoying
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

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown); //will trigger func upon event

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSelected, value, onValueChange, position, handleKeyDown]); //dependencies change will re-render component

  return (
    <div onKeyDown={handleKeyDown} onClick={onClick}>
      <h1 className={`timer-num ${isSelected ? "timer-selected" : ""}`}>
        {value < 10 ? "0" : " "}
        {value}
      </h1>
    </div>
  );
}
