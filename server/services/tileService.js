const dotenv = require('dotenv')
dotenv.config()

const API_KEY = process.env.API_KEY
// services/tileService.js
const getTile = async (layer, z, x, y) => {
    const url = `https://tile.openweathermap.org/map/${layer}/${z}/${x}/${y}.png?appid=${process.env.API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch tile: ${response.statusText}`);
    }

    //It’s sending binary image data (PNG/JPEG tiles)
    //an image can’t be parsed as JSON
    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer);
};

module.exports = {getTile}