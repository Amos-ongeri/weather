const {geoController} =require('../controllers/geolocationController')
const route = require('express').Router()

route.get('/', geoController)

module.exports = route