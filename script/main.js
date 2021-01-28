/* 
const getWeather = async () => {
  console.log("ok");
  const resp = await fetch("");
  const ret = await resp.json();

  return ret;
};
console.log(getWeather());
*/

const getTime = () => {
  const weekDays = [
    "Domingo",
    "Segunda-Feira",
    "Terça-Feira",
    "Quarta-Feira",
    "Quinta-Feira",
    "Sexta-Feira",
    "Sabado",
  ];
  const newTime = new Date();
  const newHour = newTime.getHours();
  const newMinute = newTime.getMinutes();
  const newDay = newTime.getDate();
  const newWeekDay = weekDays[newTime.getDay()];

  return [newHour, newMinute, newDay, newWeekDay];
};

const weatherTime = document.getElementById("weather-time");
const handleClock = () => {
  let newTime = getTime();

  weatherTime.innerHTML = `${newTime[0]}:${
    newTime[1] > 9 ? newTime[1] : `0${newTime[1]}`
  }<span>${newTime[2]}, ${newTime[3]}</span>`;
};

const timeRunning = setInterval(handleClock, 5000);
