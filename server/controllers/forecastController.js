const {forecastData} = require('../services/forecast')

const forecastController = async (req, res)=>{
    try{
        const city = req.query.city
        const data = await forecastData(city)

        res.json(data)
    }catch(error){
        res.status(500).json('server error')
    }
}

module.exports = {forecastController}