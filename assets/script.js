// Variables for form input
var cityNameSearch = document.querySelector("#city-name-search");
var zipCodeSearch = document.querySelector("#zip-code-search");
var submitEl = document.querySelector("#search");
var cityNameEl = document.querySelector(".city-name");
var currentConditionsEl = document.querySelector("#current-conditions");

// Variables to use to get current/past conditions
var apiKey = "bc7f76e26e1aeea4cf17b448e7f41d71";

// Placeholder for City Name and Date until user searches for city
cityNameEl.textContent = "Search for a City!";

function formSubmitHandler(event) {
    event.preventDefault();
    
    var cityName = cityNameSearch.value.trim();

    getLonLat(cityName);

    // Resets search
    cityNameSearch.value = "";
}

// First use API to get the latitude and longitude
function getLonLat(cityName) {

    // First use API to get latitude and longitude
    var latitudeLongitudeSearchUrl = "https://api.openweathermap.org/data/2.5/forecast?q="+ cityName +"&appid="+apiKey;
    fetch(latitudeLongitudeSearchUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        // Variables for city's latitude and longitude
        var cityLocation = {
            latitude: data.city.coord.lat,
            longitude: data.city.coord.lon
        }
        
        getCurrentConditions(cityLocation);
    })
}

function getCurrentConditions(cityLocation) {
    var weatherSearchUrl = "https://api.openweathermap.org/data/2.5/forecast?lat="+cityLocation.latitude+"&lon="+cityLocation.longitude+"&appid="+apiKey+"&units=imperial";
    fetch(weatherSearchUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        // Creates an object containing all the variables to be used for current conditions
        var cityWeather = {
        name: data.city.name,
        temp: data.list[0].main.temp,
        wind: data.list[0].wind.speed,
        humidity: data.list[0].main.humidity,
        icon: data.list[0].weather[0].icon
        }

        showCurrentConditions(cityWeather);
    })
}

function showCurrentConditions(cityWeather) {
    console.log(cityWeather);
    // Replaces "Search City!" with city name and adds date
    var today = moment().format("M/DD/YYYY");
    cityNameEl.textContent = cityWeather.name + " (" + today + ")";

    // Adds icon
    var weatherIconEl = document.createElement('img');
    weatherIconEl.src = "http://openweathermap.org/img/wn/"+cityWeather.icon+"@2x.png";
    weatherIconEl.setAttribute("height","45px")
    cityNameEl.appendChild(weatherIconEl);

    // Takes out the default text of "The temperature, wind speed, and humidity will be shown here!"
    document.querySelector("#default").remove();

    // Adds temperature
    var tempEl = document.createElement("p");
    tempEl.textContent = "Temperature: " + cityWeather.temp + "°F";
    currentConditionsEl.appendChild(tempEl);

    // Adds wind
    var windEl = document.createElement("p");
    windEl.textContent = "Wind: " + cityWeather.wind + " MPH";
    currentConditionsEl.appendChild(windEl);

    // Adds humidity
    var humidityEl = document.createElement("p");
    humidityEl.textContent = "Humidity: " + cityWeather.humidity + "%";
    currentConditionsEl.appendChild(humidityEl);
}

submitEl.addEventListener("click", formSubmitHandler);