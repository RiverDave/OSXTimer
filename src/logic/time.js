

const targetTime = 10000;
let currentSeconds = 0; 

/*
 Track the time target
 Track time passed
 If time pased === time target
 End interval
*/

//block inside will run every seconds
const intervalID = setInterval(() => {
currentSeconds++;
console.log(`time passed: ${currentSeconds} : timeTarget ${targetTime}`);

if(currentSeconds === targetTime){
    clearInterval(intervalID);
}
}, 1000);