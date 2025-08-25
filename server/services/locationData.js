const dotenv = require('dotenv')
dotenv.config()

const API_KEY = process.env.API_KEY

const currentLocation = async (lat, lon)=>{
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`) 

    if(!res.ok){
        throw new Error(`couldn't get data,   status: ${res.status}`);
        
    }

    const data = await res.json()
    // console.log(data);
    
    return data
}

module.exports ={ currentLocation }