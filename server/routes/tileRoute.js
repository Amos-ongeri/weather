// routes/tileRoutes.js
const {fetchTile} = require('../controllers/tileController')
const route = require('express').Router()

route.get("/:layer/:z/:x/:y", fetchTile);

module.exports = route;
