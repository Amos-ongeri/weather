# Weather & Geolocation Map App

This app is an interactive weather and map dashboard that combines real-time geolocation, weather, and forecast data with rich visualization using [Leaflet](https://leafletjs.com/) and [Chart.js](https://www.chartjs.org/). It leverages multiple APIs to provide current weather and forecast information for your location or any city you search for, overlaying weather layers on an interactive map.

## Features

- **Current Location Weather:** Detects your location using IP-based geolocation and displays current weather and forecast.
- **City Search:** Enter any city to view its weather, forecast, and map overlay.
- **Weather Layers:** Toggle between layers like Clouds, Precipitation, Temperature, Wind, Pressure, and Snow on the map.
- **Forecast Charts:** Visualizes forecast data (cloud cover, temperature, wind speed, pressure, humidity) as interactive bar graphs.
- **Custom Legends:** Weather layer overlays include detailed legends with color gradients and units.
- **Responsive UI:** Adapts for both mobile and desktop screens.
- **Loading States:** Displays loading indicators for async operations.

## How It Works

- **Geolocation:** On load, the app fetches your location via `/api/geolocation` (uses [ipwho.is](https://ipwhois.io/) on backend).
- **Weather Data:** Fetches weather from `/api/current/?lat={lat}&lon={lon}` and `/api/forecast?city={city}`.
- **Map & Layers:** Uses Leaflet to render OpenStreetMap tiles and overlays weather layers via `/api/tiles/{layer}/{z}/{x}/{y}`.
- **Charts:** Uses Chart.js to plot forecast data for multiple weather metrics.
- **UI Controls:** Includes search, layer toggles, map fly-to, and forecast display.

## API Endpoints

These endpoints must be implemented in your backend for the app to function:

- `/api/geolocation`: Returns user's location based on IP.
- `/api/weather?city={city}`: Returns current weather for searched city.
- `/api/current/?lat={lat}&lon={lon}`: Returns current weather for coordinates.
- `/api/forecast?city={city}`: Returns weather forecast for a city.
- `/api/tiles/{layer}/{z}/{x}/{y}`: Returns weather overlay tiles (e.g., clouds, precipitation).

## Setup

1. **Clone the repository.**
2. **Install dependencies** (if using a framework, e.g. Node.js, Express for backend).
3. **Implement the required API endpoints** (see above).
4. **Add OpenWeatherMap and ipwho.is API keys to your backend (if required).**
5. **Serve the static files and backend.**
6. **Open in your browser.**

## Usage

- **On load:** Your location's weather and map is displayed.
- **Search:** Use the search bar to view weather for another city.
- **Layers:** Toggle weather overlays using the map’s layer control.
- **Forecast:** View upcoming weather in the forecast panel and charts.
- **Map Controls:** Use the GPS button to refocus map to current weather marker.

## UI Overview

- **Map:** Interactive, centers on selected location, overlays weather layers.
- **Weather Marker:** Shows city, country, weather icon, and major stats. Click to expand/hide details.
- **Forecast Panel:** Scrollable list of forecast entries with icons and details.
- **Charts:** Visualizes metrics over forecast period.
- **Search Bar:** Animated, responsive; enter city name to update data.

## Technologies

- **Leaflet.js:** Interactive maps.
- **Chart.js:** Graphical data visualization.
- **OpenWeatherMap API:** Weather & forecast data.
- **ipwho.is:** IP-based geolocation.
- **Vanilla JS:** All logic and interactivity.

## Customization

- **Add/Remove weather layers** via the `OWM_LAYERS` object.
- **Configure legend colors/units** in the `legends` and `units` objects.
- **Style** via CSS and Leaflet/Chart.js options.

## Code Structure

- **GeoLocation, bySearch, fromIpwho:** Async functions for location/weather API calls.
- **initMapAndWeather:** Main UI updater for map and weather marker/forecast.
- **graphs:** Draws/updates forecast charts.
- **UI Handlers:** Search, animation, toggling panels, loading states.

## Example

```js
const geoData = await GeoLocation(); // get current location
const weatherData = await fetch(`/api/current/?lat=${geoData.latitude}&lon=${geoData.longitude}`);
const forecastData = await fetch(`/api/forecast?city=${geoData.city}`);
initMapAndWeather(await weatherData.json(), await forecastData.json());
```
## Credits

- OpenWeatherMap for weather data and tiles.
- ipwho.is for geolocation.
- OpenStreetMap contributors.
