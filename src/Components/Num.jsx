import { useState } from "react";

//TODO: Style elegantly
export function Num({ children, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`timer-num ${isSelected ? "timer-selected" : ""}`}
    >
      <h1>
        {children < 10 ? "0" : " "}
        {children}
      </h1>
    </div>
  );
}
