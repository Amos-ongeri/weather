const {locationController} = require('../controllers/locationDataController')
const route = require('express').Router()

route.get('/', locationController)

module.exports = route