const {forecastController} = require('../controllers/forecastController')
const route = require('express').Router()

route.get('/', forecastController)

module.exports = route