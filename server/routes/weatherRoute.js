const { weatherController } = require("../controllers/weatherController")
const route = require('express').Router()

route.get('/', weatherController)

module.exports = route