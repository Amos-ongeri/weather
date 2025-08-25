const geo = async (ip)=>{
    // Call ipapi with your key
    const url = `https://ipwho.is/${ip}`;

    const geoRes = await fetch(url);
    const geoData = await geoRes.json();

    return geoData

}

module.exports ={geo}