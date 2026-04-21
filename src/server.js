const express = require('express');
const app = express();
const port = 3000;
const placesRoute = require('./routes/places');

app.use(express.static('public'));
app.use('/places', placesRoute);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});