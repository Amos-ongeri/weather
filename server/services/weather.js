const dotenv = require('dotenv')
dotenv.config()

const API_KEY = process.env.API_KEY

const weatherData = async (query) => {
    // console.log("API KEY:", API_KEY); // Debug

    // const geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${API_KEY}`)

    // if(!geoRes.ok){
    //     throw new Error(`Failed to get coordinates. Status: ${geoRes.status}`);
    // }
    // const geoData = await geoRes.json();

    // if (!geoData.length) {
    // throw new Error(`City "${query}" not found`);
    // }

    // console.log(geoData);
    
    // const { lat, lon } = geoData[0];
    
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&appid=${API_KEY}`)

    if(!res.ok){
        throw new Error(`Couldnt get data!, status:${res.status}`);
    }

    const data = await res.json()
    // console.log(data);
    return data
    
}

module.exports = { weatherData }