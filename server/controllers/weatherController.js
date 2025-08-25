const { weatherData } = require('../services/weather')

const weatherController = async (req, res) => {
    try{
    const city =req.query.city

    const data = await weatherData(city)

    res.json(data)

    }catch(error){
    res.status(500).json({ error: error.message });  
    showErrorMessage(error.message);     
    }
}

module.exports = { weatherController }