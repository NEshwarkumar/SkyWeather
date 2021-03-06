let API_KEY = '515ed2dd8480272dece089fe1bbcf2ad';

let currentUnit = 0; // 0 - Celsius 1 - Fahrenheit

function parseTemp(temp) {
  let parsedTemp =
    currentUnit === 0 ? Number(temp) - 273.1 : 1.8 * (Number(temp) - 273) + 32;
  return Math.round(parsedTemp * 10) / 10;
}

function filterData(weatherData) {
  let city = weatherData.name;
  let country = weatherData.sys.country;
  let place = `${city}, ${country}`;
  let { main: weatherTitle, description: weatherDesc } = weatherData.weather[0];
  let details = weatherData.main;
  let {
    feels_like: feeling,
    humidity,
    pressure,
    temp,
    temp_max: maxTemp,
    temp_min: minTemp,
  } = details;

  return {
    place,
    weatherTitle,
    weatherDesc,
    feeling: parseTemp(feeling),
    humidity,
    pressure,
    temp: parseTemp(temp),
    maxTemp: parseTemp(maxTemp),
    minTemp: parseTemp(minTemp),
  };
}

function fillResult({
  place,
  weatherTitle,
  weatherDesc,
  feeling,
  humidity,
  pressure,
  temp,
  maxTemp,
  minTemp,
}) {
  let results = [
    { elementId: '#result-temp', value: `${temp}°` },
    { elementId: '#result-place', value: place },
    { elementId: '#result-weather', value: weatherTitle },
    { elementId: '#result-weather-desc', value: weatherDesc },
    { elementId: '#result-feeling', value: `${feeling}°` },
    { elementId: '#result-humidity', value: `${humidity}%` },
    { elementId: '#result-pressure', value: `${pressure}mb` },
    { elementId: '#result-mintemp', value: `${minTemp}°` },
    { elementId: '#result-maxtemp', value: `${maxTemp}°` },
  ];

  for (let { elementId, value } of results) {
    document.querySelector(elementId).innerText = value;
  }
}

//HTTPS
async function weatherRequest(city) {
  try {
    let response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`
    );
    let data = await response.json();
    return data;
  } catch (e) {
    console.log(e);
  }
}

export { weatherRequest, fillResult, filterData, parseTemp, currentUnit };
