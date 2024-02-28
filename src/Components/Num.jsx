import { useEffect } from "react";

//TODO: Understand deeply the onValueChange prop
export function Num({ value, isSelected, onClick, onValueChange, position }) {
  const handleKeyDown = (event) => {
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
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown); //will trigger func upon event

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSelected, value, onValueChange, position]); //dependencies change will re-render component
  //TODO: Fix the warning above

  return (
    <div
      onKeyDown={handleKeyDown}
      onClick={onClick}
      className={`timer-num ${isSelected ? "timer-selected" : ""}`}
    >
      <h1>
        {value < 10 ? "0" : " "}
        {value}
      </h1>
    </div>
  );
}
