const express = require('express');
const https = require('https');
const ejs = require('ejs');
const app = express();
const port = 3000;

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.ejs`);
})

app.post('/', (req, res) => {

    const query = req.body.cityName; //City
    const apiKey = process.env.API_KEY;
    const tempUnit = req.body.units;
    let tempSimbol;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=${tempUnit}&appid=${apiKey}`;
    
    switch (tempUnit) {
        case 'standard':
            tempSimbol = 'K';
            break;
        
        case 'metric':
            tempSimbol = 'C';
            break;

        case 'imperial':
            tempSimbol = 'F';
            break;
    };

    https.get(url, (response) => {
    
        response.on('data', (data) => {

            const weatherData = JSON.parse(data);

            try {
                const icon = weatherData.weather[0].icon;
                const imageURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;

                res.render('index', {
                    cityName: weatherData.name,
                    imgSrc: imageURL,
                    temperature:  weatherData.weather[0].description,
                    temperatureSimbol: tempSimbol
                });
    
                // res.write(`<h1>The current temperature in ${weatherData.name} is: ${weatherData.main.temp} ${tempSimbol}</h1>`);
                // res.write(`<p>The weather is currently ${weatherData.weather[0].description}</p>`);
                // res.write(`<img src='${imageURL}'>`)
            } catch {
                res.write('<h1>Error 404. The city you typed was not found.<h1>')
                res.send();
            }
            
        })
    })
})


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})

