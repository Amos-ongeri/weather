// controllers/tileController.js
const { getTile } = require("../services/tileService");

const fetchTile = async (req, res) => {
    try {
        const { layer, z, x, y } = req.params;

        const tileBuffer = await getTile(layer, z, x, y);

        res.setHeader("Content-Type", "image/png");
        res.send(tileBuffer);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {fetchTile}