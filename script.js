//method 1 fetching data from api
// fetch("api_url")
//   .then(Response => {
//     if(!Response.ok){
//         throw new Error("couldnt fetch resource!");
//     }
//     return Response.json();
//   })
//   .then(data => console.log(data))
//   .catch(error => console.log(error));

//   //method 2
//   fetchData();
//   async function fetchData(){
//     try{
//       const response = await fetch("api_url");
//       if(!response.ok){
//         throw new Error("couldnt fetch resource!");
//       }
//       const data = await response.json();
//       console.log(data);
//     }catch(error){
//       console.error(error);
//     }
//   }
 
function getWeather(){
    const apiKey = "de587171300e43836c009932cb200068"
    const city = document.getElementById("city").value;
    if (!city){
        alert("Please enter a city");
        return;
    }
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    //fetching weather data
    fetch(currentWeatherUrl)
  .then(Response => Response.json() )
  .then(data => {
    displayWeather(data);
  })
  .catch(error => {
    console.log("error fetching current weather data", error);

    alert("Error fetching weather data, please try again", error);
});

//fetching forecast data
    fetch(forecastUrl)
    .then(Response => Response.json() )
    .then(data => {
        displayHourlyForecast(data.list);
    })
    .catch(error => {
        console.log("error fetching Hourly forecast data", error);
        alert("Error fetching Hourly forecast data, please try again", error);
    });
}
//display weather data
function displayWeather(data) {
    const tempDivInfo = document.getElementById("temp-div");
    const weatherInfoDiv = document.getElementById("weather-info");
    const weatherIcon = document.getElementById("weather-icon");
    const hourlyForecastDiv = document.getElementById("hourly-forecast");

    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if(data.cod === '404'){
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15);
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const temperatureHtml = `
        <p>${temperature}°C</p>
        `;
        const weatherHTML = `
        <p>${cityName}</p>
        <p>${description}</p>
        `;
        
        tempDivInfo.innerHTML = temperatureHtml;
        weatherInfoDiv.innerHTML = weatherHTML;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        showImage();
    }

}
//display forecast data
function displayHourlyForecast(hourlydata) {
    const hourlyForecastDiv = document.getElementById("hourly-forecast");
    const next24Hours = hourlydata.slice(0, 8);

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000);
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15);
        const description = item.weather[0].description;
        const iconCode = item.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHTML = `
        <div class="hourly-item">
            <span>${hour}:00</span>
            <img src="${iconUrl}" alt="${description}">
            <span>${temperature}°C</span>
        </div>
        `;
        hourlyForecastDiv.innerHTML += hourlyItemHTML;
    });
}

function showImage() {
    const weatherIcon = document.getElementById("weather-icon");
    weatherIcon.style.display = 'block';
}
