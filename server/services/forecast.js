const API_KEY = process.env.API_KEY

const forecastData = async (query)=>{
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${query}&units=metric&appid=${API_KEY}`)

    if(!res.ok){
        throw new Error("failed to fetch data");        
    }

    const data = await res.json()
    // console.log(data);
    

    return data
}

module.exports = {forecastData}