const BACKEND = "https://weather-server-side.onrender.com";
const GeoLocation = async ()=>{
  //current location
  try{
    //ipwho.is geolocation data for current location
          const geoRes = await fetch(`${BACKEND}/api/geolocation`)
        
          if(!geoRes.ok){
              throw new Error("an error occured");
          }

          const geoData = await geoRes.json()
          console.log('geolocation: ', geoData);
          return geoData

  }catch(error){
    console.log(error.message);
  }
}

const bySearch = async (city)=>{
  try{
    //weather data by search
    const searchRes = await fetch(`${BACKEND}/api/weather?city=${city}`);

    if(!searchRes.ok){
        alert('something went wrong, please enter a valid city name')
    }

    //forecast data
    const forecastRes = await fetch(`${BACKEND}/api/forecast?city=${city}`)

        if(!forecastRes.ok){
            throw new Error("couldnt fetch data");
        }

        const forecastData = await forecastRes.json()

        console.log('forecast:', forecastData);

    const searchData = await searchRes.json()
    console.log('weather',searchData);
    initMapAndWeather(searchData, forecastData)
  }catch(error){
    console.log(error.message); 
  }
}

const fromIpwho = async ()=>{
  try{
    const geoData = await GeoLocation()
  // Get weather data from backend
  console.log("Calling: ", `${BACKEND}/api/current?lat=${geoData.latitude}&lon=${geoData.longitude}`);
        const res = await fetch(`${BACKEND}/api/current?lat=${geoData.latitude}&lon=${geoData.longitude}`);
        if (!res.ok) throw new Error("Failed to fetch weather");

        const forecastRes = await fetch(`${BACKEND}/api/forecast?city=${geoData.city}`);
        if (!forecastRes.ok) throw new Error("Failed to fetch weather");

        const forecastData = await forecastRes.json();
        console.log("Current location forecast:", forecastData);

        const weatherData = await res.json();
        console.log("Current location weather:", weatherData);
        initMapAndWeather(weatherData, forecastData)
  }catch(error){
    console.log(error.message);
  }
}

//layers
const OWM_LAYERS = {
  Clouds: "clouds_new",
  CloudsClassic: "clouds",   // legacy
  Precipitation: "precipitation_new",
  PrecipitationClassic: "precipitation",
  Pressure: "pressure_new",
  PressureClassic: "pressure",
  Wind: "wind_new",
  WindClassic: "wind",
  Temperature: "temp_new",
  TemperatureClassic: "temp",
  Snow: "snow"
};
let charts = {};
const graphs = (element, labels, label, data) => {
  const id = element.id;
  if (charts[id]) {
    charts[id].data.labels = labels;
    charts[id].data.datasets[0].data = data;
    charts[id].update();
  } else {
    charts[id] = new Chart(element, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label,
          data,
          borderWidth: 1,
          backgroundColor: "rgba(0,123,255,0.5)"
        }]
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true } }
      }
    });
  }
};


let map;        // global map reference
let weatherMarker; // keep track of marker
async function initMapAndWeather(weather, forecast=null) {
    try {
      //only make the map and it's conponents if it doesnt exist
      if(!map){
        // Initialize map using the coords
         map = L.map('weather-map', {
                center: [weather.coord.lat, weather.coord.lon], //can't drag
                zoom: 5,
                minZoom: 2,  // Prevent zooming out too much
                maxZoom: 18, // Prevent zooming in too far
                maxBounds: [
                    [-90, -180], // Southwest corner of world
                    [90, 180]    // Northeast corner of world
                ],
                worldCopyJump: true // allows infinite horizontal panning
        }).setView([weather.coord.lat, weather.coord.lon], 6);

        setTimeout(() => {
            map.invalidateSize();
        }, 0);

        //attach tile to the map *display actual map as png
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { 
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        const layers = {
          // --- OpenWeatherMap Overlays ---
          "Clouds": L.tileLayer(`/api/tiles/${OWM_LAYERS.CloudsClassic}/{z}/{x}/{y}`),
          "Precipitation": L.tileLayer(`/api/tiles/${OWM_LAYERS.PrecipitationClassic}/{z}/{x}/{y}`),
          "Temperature": L.tileLayer(`/api/tiles/${OWM_LAYERS.Temperature}/{z}/{x}/{y}`),
          "Wind": L.tileLayer(`/api/tiles/${OWM_LAYERS.Wind}/{z}/{x}/{y}`),
          "Pressure": L.tileLayer(`/api/tiles/${OWM_LAYERS.Pressure}/{z}/{x}/{y}`),
          "Snow": L.tileLayer(`/api/tiles/${OWM_LAYERS.Snow}/{z}/{x}/{y}`)
        };

        const baseLayers = {
          "Clouds": layers["Clouds"],
          "Precipitation": layers["Precipitation"],
          "Temperature": layers["Temperature"],
          "Wind": layers["Wind"],
          "Pressure": layers["Pressure"],
          "Snow": layers["Snow"]
        };

          // Add control to toggle
          //accepts 2 parameters 1.*baseLayer, 2.overlays 
        L.control.layers(baseLayers,{}).addTo(map);

        // Store legends definitions
        const legends = {
          "Precipitation": [
          [0, "rgba(225, 200, 100, 0)"],
          [0.1, "rgba(200, 150, 150, 0)"],
          [0.2, "rgba(150, 150, 170, 0)"],
          [0.5, "rgba(120, 120, 190, 0)"],
          [1, "rgba(110, 110, 205, 0.3)"],
          [10, "rgba(80, 80, 225, 0.7)"],
          [140, "rgba(20, 20, 255, 0.9)"]
        ],
          "Snow": [
            [0, "transparent"],
            [5, "#00d8ff"],
            [10, "#00b6ff"],
            [25.076, "#9549ff"]
  ]       ,
          "Clouds": [
            [0, "rgba(255,255,255,0.0)"],
            [50, "rgba(247,247,255,0.5)"],
            [100, "rgba(240,240,255,1)"]
          ],
          "Temperature": [
            [-65, "rgba(130,22,146,1)"],
            [-30, "rgba(130,87,219,1)"],
            [-20, "rgba(32,140,236,1)"],
            [-10, "rgba(32,196,232,1)"],
            [0, "rgba(35,221,221,1)"],
            [10, "rgba(194,255,40,1)"],
            [20, "rgba(255,240,40,1)"],
            [25, "rgba(255,194,40,1)"],
            [30, "rgba(252,128,20,1)"]
          ],
          "Wind": [
          [1,   "rgba(255,255,255,0)"],
          [5,   "rgba(238,206,206,0.4)"],
          [15,  "rgba(179,100,188,0.7)"],
          [25,  "rgba(63,33,59,0.8)"],
          [50,  "rgba(116,76,172,0.9)"],
          [100, "rgba(70,0,175,1)"],
          [200, "rgba(13,17,38,1)"]
        ],
          "Pressure": [
            [94000, "rgba(0,115,255,1)"],
            [100000, "rgba(141,231,199,1)"],
            [101000, "rgba(176,247,32,1)"],
            [104000, "rgba(251,85,21,1)"],
            [108000, "rgba(198,0,0,1)"]
          ]
        };

        const units = {
            "Temperature": "\u00B0C",
            "Pressure": "hPa",
            "Wind": "m/s",
            "Precipitation": "mm/h",
            "Clouds": "%",
            "Snow": "mm/h"
        }

        let currentLegend = null;

        // Legend builder
        function createLegend(layerName, stops) {
          //container
          const container = document.createElement("div");
          container.className = "legend";
          container.id = "map-legend";

          //create title
          const title = document.createElement("div");
          title.className = "legend-title";
          const unit = units[`${layerName}`] ? units[`${layerName}`] : ''
          title.textContent = layerName + ', ' + unit;
          container.appendChild(title);

          const bar = document.createElement("div");
          bar.className = "legend-bar";
          let gradient = "linear-gradient(to right, ";
          gradient += stops.map(([val, color], i) => {
            //gradient percentage for each color in the stop. for example
            //linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(238,206,206,0.4) 50%, rgba(179,100,188,0.7) 100%)
            const pct = (i / (stops.length - 1)) * 100;
            return `${color} ${pct}%`;
          }).join(", ");
          gradient += ")";
          bar.style.background = gradient;
          container.appendChild(bar);

          const labels = document.createElement("div");
          labels.className = "legend-labels";
          stops.forEach(([val]) => {
            const span = document.createElement("span");
            span.textContent = val;
            labels.appendChild(span);
          });
          container.appendChild(labels);

          document.getElementById("legend").innerHTML = "";
          document.getElementById("legend").appendChild(container);
          currentLegend = container;
        }

        // Show legend when overlay is added(*byClick)
        map.on("baselayerchange", (e) => {
          for (let name in baseLayers) {
            if (baseLayers[name] === e.layer) {
              if (legends[name]) {
                if (currentLegend) currentLegend.remove();
                createLegend(name, legends[name]);
              }
            }
          }
        });

        // Remove legend when overlay is removed
        map.on("overlayremove", (e) => {
          for (let name in baseLayers) {
            if (baseLayers[name] === e.layer) {
              if (currentLegend) {
                currentLegend.remove();
                currentLegend = null;
              }
            }
          }
        });
        }
          // update map view *after map being created above
        map.setView([weather.coord.lat, weather.coord.lon], 6);

        // update marker
        if (weatherMarker) {
          //if marker exists(*when map create || update)
          map.removeLayer(weatherMarker);
        }

        const WeatherIcon = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`

        // You could add a marker or popup with weather info
        //reassing the marker with the new data
        weatherMarker =L.marker([weather.coord.lat, weather.coord.lon], {
            icon: L.divIcon({
            className: 'weather-label',
            html: `
            <div class="weather-box" onclick="toggleWeather(this)">
                <h3 class="weather-title">${weather.name}, ${weather.sys.country}</h3>

                <div class="weather-details">
                    <div style="display:flex; align-items:center;"><img style="width:60px" src=${WeatherIcon}> ${weather.weather[0].description}</div>
                    temp: ${weather.main.temp} &deg;C<br>
                    cloud cover: ${weather.clouds.all}%<br>
                    Humidity: ${weather.main.humidity}%<br>
                    Wind speed: ${(weather.wind.speed * 3.6).toFixed(1)}km/h<br>
                    pressure: ${(weather.main.pressure)}hpa
                </div>
            </div>`,
            iconSize: null   // centers it on the point
        })}).addTo(map)

        if(forecast !== null){
          const forecastContainer = document.querySelector('.forecastContainer')
          forecastContainer.innerHTML = ''

          forecast.list.forEach((f, i)=>{
            const forecastIcon = `https://openweathermap.org/img/wn/${f.weather[0].icon}@2x.png`
            const date = new Date(f.dt * 1000);
            const options = { weekday: "short", hour: "2-digit", minute: "2-digit" };
            const dateStr = date.toLocaleString("en-US", options);

            forecastContainer.innerHTML += `
              <div class="forecastInfo">
                <p>${dateStr}</p>
                <div style="display:flex; align-items:center; justify-content:start;">
                <img style="width: 65px; height: 65px;" src=${forecastIcon}>
                <p>${f.weather[0].description}</p>
                </div>
                <div class='details'>
                  <p>temp: ${Math.floor(f.main.temp)}&deg;C</p>
                  <p>cloud cover: ${f.clouds.all}%</p>
                  <p>wind speed: ${(f.wind.speed * 3.6).toFixed(1)} km/h</p>
                  <p>pressure: ${f.main.pressure} hpa</p>
                  <p>humidity: ${f.main.humidity}%</p>
                </div>
              </div>
            `
          })
        }

        //prevents flying to the same location all the time even after search
        const gpsBtn = document.querySelector('#gps');
        // Remove any old listener first
        gpsBtn.replaceWith(gpsBtn.cloneNode(true)); 
        const newGpsBtn = document.querySelector('#gps');

        newGpsBtn.addEventListener('click', () => {
            map.flyTo([weather.coord.lat, weather.coord.lon], 8, {
                animate: true,
                duration: 2
            });
        });
        if (forecast) {
      const labels = forecast.list.map(f => {
        const date = new Date(f.dt * 1000);
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      });

      const cloudData = forecast.list.map(f => f.clouds.all);
      const tempData = forecast.list.map(f => f.main.temp);
      const windData = forecast.list.map(f => (f.wind.speed * 3.6).toFixed(1));
      const pressureData = forecast.list.map(f => f.main.pressure);
      const humidityData = forecast.list.map(f => f.main.humidity);

      const ctx = document.getElementById('cloudCover');
      const ctx1 = document.getElementById('temp');
      const ctx2 = document.getElementById('wind');
      const ctx3 = document.getElementById('pressure');
      const ctx4 = document.getElementById('humidity');
      const graphsData = [
        {
          element: ctx,
          labels: labels,
          label:'cloud cover (%)',
          data: cloudData
        },
        {
          element: ctx1,
          labels: labels,
          label:'temperature (\u00B0C)',
          data: tempData
        },
        {
          element: ctx2,
          labels: labels,
          label:'wind speed (km/h)',
          data: windData
        },
        {
          element: ctx3,
          labels: labels,
          label:'pressure (hpa)',
          data: pressureData
        },
        {
          element: ctx4,
          labels: labels,
          label:'humidity (%)',
          data: humidityData
        }
      ]
      graphsData.forEach(data => graphs(data.element,data.labels, data.label, data.data) )     
    }

    } catch (error) {
        console.error("Error:", error.message);
    }
}

const search = document.querySelector('#searchIcon')
const searchComponent = document.querySelector('#searchComponent')
const searchContainer = document.querySelector('#searchDiv')
let isClick = false
let toggle = false
const searchInput = document.querySelector('#search')
const cancel = document.querySelector('#cancelIcon')
const searchValue = document.querySelector('#search')
const searchBtn = document.querySelector('#searchBtn')
const myForecast = document.querySelector('#forecastDetails')
const show = document.querySelector('.container')
const arrow = document.querySelector('#Layer_1')
const hold = document.querySelector('#hold')
const terminate = document.querySelector('#terminateBtn')
const mobile = document.querySelector('#mobile')

function toggleLoading(show) {
    document.getElementById("loading").style.display = show ? "block" : "none";
}

const showContainer = ()=>{
  if(!toggle){
    arrow.style.transform = 'rotate(180deg)'
    show.style.display = 'block'
    mobile.style.animation = 'none'
    toggle = !toggle
    console.log(toggle);
  } else {
    arrow.style.transform = 'rotate(360deg)'
    show.style.display = 'none'
    mobile.style.animation = 'bounce 1s linear infinite'
    toggle = !toggle
    console.log(toggle);
    
  }
}

const graphic = ()=>{
  searchBtn.addEventListener('click', async () => {
    let value = searchValue.value.trim();
    if (value) {
      toggleLoading(true)
      try{
      await bySearch(value);
      } catch(e){
        console.log(e.message);
      } finally {
        toggleLoading(false)
      }
    } else {
      alert('please enter a city name!')
    }
})
}

const clearValue = ()=>{
    searchInput.value = ''
}

const searchToggle = async ()=>{
    if(!isClick){
        searchContainer.style.width =window.innerWidth <= 500 ? '65vw' : window.innerWidth <= 800 ? '50vw' : '35vw'
        search.style.width = '45px'
        search.style.height = '45px'
        searchContainer.style.paddingLeft = '.5%'
        setTimeout(()=> searchComponent.style.display = 'block' ,20)
        isClick = !isClick
    }else {
        search.style.width = '100%'
        search.style.height = '100%'
        searchContainer.style.paddingLeft = '0'
        searchComponent.style.display = 'none'
        setTimeout(()=> searchContainer.style.width = '50px' ,10)
        isClick = !isClick
    }
}

function toggleWeather(el) {
  el.classList.toggle("expanded");
}

document.addEventListener('DOMContentLoaded', async () => {
    myForecast.addEventListener('click', showContainer);
    mobile.addEventListener('click', showContainer);
    cancel.addEventListener('click', clearValue);
    search.addEventListener('click', searchToggle);
    terminate.addEventListener('click', ()=> {show.style.display = 'none'; toggle = !toggle; arrow.style.transform = 'rotate(360deg)'; mobile.style.animation = 'bounce 1s linear infinite'} )

    hold.style.display = 'none';
    toggleLoading(true);

    try {
        await fromIpwho();
        hold.style.display = 'block';
    } catch (err) {
        console.error("Failed to load data:", err);
    } finally {
        toggleLoading(false);
    }

    graphic();
});
