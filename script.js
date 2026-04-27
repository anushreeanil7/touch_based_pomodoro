let focus = 1500;
let brk = 300;

let timeLeft = focus;
let running = false;
let breakMode = false;
let timer;

let sessions = 0;
let totalMinutes = 0;
let streak = 1;

function updateDisplay(){

let min = Math.floor(timeLeft / 60);
let sec = timeLeft % 60;

document.getElementById("timer").innerText =
String(min).padStart(2,'0') + ":" +
String(sec).padStart(2,'0');
}

function startTimer(){

running = true;

timer = setInterval(()=>{

timeLeft--;
updateDisplay();

if(timeLeft <= 0){

clearInterval(timer);

if(!breakMode){

sessions++;
totalMinutes += 25;

document.getElementById("sessions").innerText = sessions;
document.getElementById("minutes").innerText = totalMinutes;
document.getElementById("streak").innerText = streak;

startBreak();

}else{

resetTimer();
}

}

},1000);
}

function toggleTimer(){

if(running){

clearInterval(timer);
running = false;

}else{

startTimer();
}

}

function resetTimer(){

clearInterval(timer);

running = false;
breakMode = false;
timeLeft = focus;

document.getElementById("mode").innerText = "Focus Session";

updateDisplay();
}

function startBreak(){

breakMode = true;
timeLeft = brk;

document.getElementById("mode").innerText = "Break Time";

updateDisplay();

startTimer();
}

/* =====================
ESP32 SERIAL CONNECTION
===================== */

async function connectESP32(){

try{

const port = await navigator.serial.requestPort();

await port.open({ baudRate:115200 });

const decoder = new TextDecoderStream();
port.readable.pipeTo(decoder.writable);

const reader = decoder.readable.getReader();

while(true){

const {value,done} = await reader.read();

if(done) break;

if(value){

const msg = value.trim();

if(msg.includes("SINGLE")){
toggleTimer();
}

if(msg.includes("DOUBLE")){
resetTimer();
}

if(msg.includes("LONG")){
startBreak();
}

}

}

}catch(error){

console.log(error);

}

}

window.onload = ()=>{

updateDisplay();

setTimeout(()=>{

alert("Select ESP32 COM Port");
connectESP32();

},1000);

}