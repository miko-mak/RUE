const { Router } = require("express");
const router = Router();

router.get('/', async(req, res) => {
    const bbox = req.query.bbox.split(',');
    const south = bbox[0];
    const north = bbox[1];
    const west = bbox[2];
    const east = bbox[3];

    const query = `[out:json];
    (
      nwr["abandoned:building"](${south},${west},${north},${east});
      nwr["ruins"="yes"](${south},${west},${north},${east});
    );
    out center;`

    const response = await fetch(`https://overpass.openstreetmap.fr/api/interpreter?data=${query}`, {
        headers: {
          "User-Agent": "RUE/1.0"
        }
    });

    if (!response.ok) {
        return res.status(500).json({error: "An API error has occured"});
    }

    const data = await response.json();
    if (data.elements.length < 1) {
        return res.status(404).json({error: "No places found"});
    }

    const random = Math.floor(Math.random() * data.elements.length);
    const randomPlace = data.elements[random];
    res.json(randomPlace);
});

module.exports = router;