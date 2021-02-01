// clock
const getTime = (onlyWD = false) => {
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

  if (onlyWD) {
    return [newWeekDay, weekDays];
  }
  return [newHour, newMinute, newDay, newWeekDay];
};

const getNextDays = (nDays) => {
  let daysList = getTime(true);
  let retDays = [];

  let index = daysList[1].indexOf(daysList[0]) + 1;
  for (let i = 0; i <= nDays; i++) {
    if (index > 6) {
      index = 0;
    }
    retDays.push(daysList[1][index]);
    index++;
  }

  return retDays;
};

const weatherTime = document.getElementById("weather-time");
const handleClock = () => {
  let newTime = getTime();

  weatherTime.innerHTML = `${newTime[0]}:${
    newTime[1] > 9 ? newTime[1] : `0${newTime[1]}`
  }<span>${newTime[2]}, ${newTime[3]}</span>`;
};

// remove
const removeError = () => {
  document.getElementById("error").style.display = "none";
};

const removeWelcome = () => {
  document.getElementById("welcome-div").style.display = "none";
};

const removeLoading = () => {
  document.getElementById("main-container").classList.remove("loading");
};

const removeAll = () => {
  removeWelcome();
  removeLoading();
  removeError();
};

// error
let hasFetch = false;
const seeDemo = () => {
  removeError();
  removeLoading();
};

const showError = () => {
  document.getElementById("error").style.display = "block";
  removeWelcome();
};

// handle weather
const selectImg = (id) => {
  if (id >= 200 && id <= 232) {
    return "/images/tempestate.png";
  } else if ((id >= 300 && id <= 321) || (id >= 520 && id <= 531)) {
    return "/images/garoa.png";
  } else if (id >= 500 && id <= 504) {
    return "/images/chuva.png";
  } else if (id === 511) {
    return "/images/chuva-congelante.png";
  } else if (id >= 600 && id <= 622) {
    return "/images/neve.png";
  } else if (id >= 701 && id <= 781) {
    return "/images/atmosfera.png";
  } else if (id === 800) {
    return "/images/ceu-limpo.png";
  } else if (id === 801 || id === 802) {
    return "/images/algumas-nuvens.png";
  } else if (id === 803 || id === 804) {
    return "/images/muitas-nuvens.png";
  } else {
    return "/images/clima.png";
  }
};

const handleObj = (obj) => {
  const {
    temp,
    feels_like,
    humidity,
    clouds,
    wind_speed,
    weather,
  } = obj.current;
  const {
    temp: { min, max },
  } = obj.daily[0];

  const kelvinToC = (value) => value - 273.15;

  const weatherImg = document.getElementById("weather-img");
  weatherImg.firstElementChild.src = selectImg(weather[0].id);
  weatherImg.firstElementChild.alt = weather[0].description;
  weatherImg.lastElementChild.textContent = `${kelvinToC(temp).toFixed(1)}º`;

  const weatherInfo = document.getElementById("weather-info").children;
  weatherInfo[0].textContent = `${weather[0].description}`;
  weatherInfo[1].textContent = `Sensação Termica: ${kelvinToC(
    feels_like
  ).toFixed(2)}º`;
  weatherInfo[2].textContent = `Máxima: ${kelvinToC(max).toFixed(2)}º`;
  weatherInfo[3].textContent = `Mínima: ${kelvinToC(min).toFixed(2)}º`;
  weatherInfo[4].textContent = `Humidade: ${humidity}%`;
  weatherInfo[5].textContent = `Nebulosidade: ${clouds}%`;
  weatherInfo[6].textContent = `Velocidade do Vento: ${wind_speed.toFixed(
    2
  )}m/s`;

  const weatherDays = document.getElementById("weather-days").children;
  const nextDays = getNextDays(6);
  for (let i = 0; i < weatherDays.length; i++) {
    const {
      temp: { min: dailyMin, max: dailyMax },
      weather: dailyWeather,
    } = obj.daily[i + 1];
    weatherDays[i].children[0].src = selectImg(dailyWeather[0].id);
    weatherDays[i].children[0].alt = dailyWeather[0].description;
    weatherDays[i].children[1].textContent = `${nextDays[i].slice(0, 3)}`;
    weatherDays[i].children[2].textContent = `${parseInt(
      kelvinToC(dailyMin)
    )}º / ${parseInt(kelvinToC(dailyMax))}º`;
  }
};

//"https://api.openweathermap.org/data/2.5/onecall?lat=33.441792&lon=-94.037689&lang=pt_br&exclude=hourly,minutely&appid=b60cdd3bc4b5e2602c1e98fa10709a32"

//"https://api.openweathermap.org/data/2.5/onecall?lat=-27.433330&lon=-48.408810&lang=pt_br&exclude=hourly,minutely&appid=b60cdd3bc4b5e2602c1e98fa10709a32"

const handleWeather = async (posLatLon) => {
  try {
    const resp = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${posLatLon[0]}&lon=${posLatLon[1]}&lang=pt_br&exclude=hourly,minutely&appid=b60cdd3bc4b5e2602c1e98fa10709a32`
    );
    const ret = await resp.json();

    handleObj(ret);
    hasFetch = true;
    removeAll();
  } catch (error) {
    hasFetch = false;
  }
};

//map
function initMap(posLatLon) {
  let map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: posLatLon[0], lng: posLatLon[1] },
    zoom: 15,
  });
}

// init
const welcome = async () => {
  const welcomeDiv = document.getElementById("welcome-div");

  // get position
  let posLatLon = [];
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      posLatLon = [pos.coords.latitude, pos.coords.longitude];

      // call weather
      handleWeather(posLatLon);
      initMap(posLatLon);
    },
    (err) => {
      if (err.code === 2) {
        alert(
          "ERROR(" +
            err.code +
            "): " +
            err.message +
            ". Será usado a localização padrão!\nPossivel erro com firefox, veja como tratar em https://github.com/LGPossatto/weather-site-mini-project"
        );
      } else {
        alert(
          "ERROR(" +
            err.code +
            "): " +
            err.message +
            ". Será usado a localização padrão!"
        );
      }

      posLatLon = [-27.5969, -48.5495];
      handleWeather(posLatLon);
      initMap(posLatLon);
    }
  );

  setTimeout(() => {
    welcomeDiv.lastElementChild.style.visibility = "visible";
    welcomeDiv.lastElementChild.style.opacity = "1";
  }, 1000);

  setTimeout(() => {
    if (!hasFetch) {
      showError();
    }
  }, 5000);
};

// at start
(() => {
  handleClock();
  setInterval(handleClock, 5000);
  document.getElementById("btn-see-demo").addEventListener("click", seeDemo);
  welcome();
})();
