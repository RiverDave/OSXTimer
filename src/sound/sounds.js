//TODO: Add a selection of alarms that the user can choose.
//make this module more reusable..

import Alarm from "../assets/mixkit-alarm-tone.wav";

export const playAlarm = () => {
  const wavFile = new Audio(Alarm);
  !wavFile ? console.log("Couldnt load audio asset ") : wavFile.play();
};
