const { currentLocation } = require('../services/locationData')
const { forecast } = require('../services/locationData')

const locationController = async (req, res)=>{
    const { lat, lon} = req.query

    try{
        const data = await currentLocation(lat, lon)

        res.json(data)
    }catch(error){
        console.log(error.message);
        
    }
}

module.exports = {locationController}