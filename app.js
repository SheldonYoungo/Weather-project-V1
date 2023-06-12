import express from 'express';
import https from 'https';
import 'dotenv/config';
import ejs from 'ejs';

const app = express();
const port = 3000;

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index', {containerDisplay: 'none', currentCity: '', temperatureSimbol: '', imgURL: '', weatherDescription: ''});
})

app.post('/', (req, res) => {

    const query = req.body.cityName; //City requested
    const apiKey = process.env.API_KEY; //OpenWeather API Key
    const tempUnit = req.body.units; //Temperature units
    const APIurl = `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=${tempUnit}&appid=${apiKey}`; //API URL
    
    let tempSimbol; //The variable where the temperature simbol will be stored
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

    https.get(APIurl, (response) => {
    
        response.on('data', (data) => {

            const weatherData = JSON.parse(data);

            try {
                const icon = weatherData.weather[0].icon;
                const imageURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;

                res.render('index', {
                    containerDisplay: 'block',
                    currentCity: weatherData.name,
                    imgURL: imageURL,
                    temperature: weatherData.main.temp,
                    weatherDescription:  weatherData.weather[0].description,
                    temperatureSimbol: tempSimbol
                });

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

