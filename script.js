let API_KEY;
const URL = "https://api.openweathermap.org/data/2.5/weather";

fetch('./src/config.json').then(resp => resp.json()).then(config => {
  API_KEY = config.API_KEY
})

const elems = {
  container: document.querySelector(".container"),
  weatherContainer: document.querySelector(".weather-container"),
  input: document.querySelector("input"),
  weatherIcon: document.querySelector(".weather-info img"),
  temperature: document.querySelector(".weather-info span"),
  locationTxt: document.querySelector(".weather-container p"),
  error: document.querySelector("#error"),
};

elems.weatherContainer.style.display = "block";
elems.error.style.display = "none";

elems.input.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    const city = elems.input.value.trim();

    if (!city) {
      showError("Enter the name of the city first");
      return;
    }

    try {
      elems.error.style.display = "none";
      const data = await getWeatherData(city);
      updateUI(data);
      elems.weatherContainer.style.display = "block";
    } catch (err) {
      showError(err.message);
    }
  }
});

async function getWeatherData(city) {
  const response = await fetch(
    `${URL}?q=${city}&appid=${API_KEY}&units=metric`
  );

  if (!response.ok) {
    throw new Error("City not found. Please try another location.");
  }

  return await response.json();
}

function updateUI(data) {
  elems.weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  elems.weatherIcon.alt = data.weather[0].description;
  elems.temperature.textContent = `${Math.round(data.main.temp)}°C`;
  elems.locationTxt.textContent = `${data.name}, ${data.sys.country}`;
}

function showError(message) {
  elems.error.textContent = message;
  elems.error.style.display = "block";
  elems.weatherContainer.style.display = "none";
}
