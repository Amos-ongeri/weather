const {geo} = require('../services/geolocation')

const geoController = async (req, res)=>{
    try{
        // Get the client IP
    let ip =
      req.headers['x-forwarded-for']?.split(',')[0] || // if behind proxy
      req.socket.remoteAddress; // fallback

    // Local dev will often show "::1" (IPv6 loopback), so use a test IP
    if (ip === '::1') ip = '8.8.8.8';

        const data = await geo(ip)

        res.json(data);
    }catch(error){
        console.error(error);
    res.status(500).json({ error: 'Unable to fetch location' });
    }
}

module.exports = {geoController}