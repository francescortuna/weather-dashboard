var cityNameSearch = document.querySelector("#city-name-search");
var zipCodeSearch = document.querySelector("#zip-code-search");
var submitEl = document.querySelector("#search");
var cityNameEl = document.querySelector(".city-name");
var currentConditionsEl = document.querySelector("#current-conditions");
var forecastTitleEl = document.querySelector("#forecast-title");
var cardDeckEl = document.querySelector(".card-deck");
var historyEl = document.querySelector("#history");
var apiKey = "bc7f76e26e1aeea4cf17b448e7f41d71";
var clearBtn = document.querySelector("#clearBtn");
var searchHistoryArray = [];

// Placeholder for City Name and Date until user searches for city
cityNameEl.textContent = "Search for a City!";
forecastTitleEl.textContent = "The 5-Day Forecast will show here!"

function formSubmitHandler(event) {
    event.preventDefault();
    
    var cityName = cityNameSearch.value.trim();

    if(cityName) {
        getLonLat(cityName);
        searchHistory(cityName);
        // Resets search
        cityNameSearch.value = "";
    } else {
        alert("Please enter a valid city name");
    }
}

function searchHistory(cityName) {
    // Adds most recent search to local storage
    searchHistoryArray.push(cityName);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistoryArray));
    console.log(searchHistoryArray.length);

    // Shows search history
    if(searchHistoryArray.length = 1) {
        historyEl.style.visibility = "visible";
        var searchHistoryList = document.createElement("ul");
        searchHistoryList.className = "list-group list-group-flush";
        historyEl.appendChild(searchHistoryList);
        var searchHistoryListItem = document.createElement("li");
        searchHistoryListItem.className = "list-group-item";
        searchHistoryListItem.textContent = cityName;
        searchHistoryList.appendChild(searchHistoryListItem);
    } else {
        var searchHistoryListItem = document.createElement("li");
        searchHistoryListItem.className = "list-group-item";
        searchHistoryListItem.textContent = cityName;
        document.querySelector("#search-history").appendChild(searchHistoryListItem);
    }
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
        // Creates an object containing all the variables to be used for current conditions
        var currentCityWeather = {
        name: data.city.name,
        temp: data.list[0].main.temp,
        wind: data.list[0].wind.speed,
        humidity: data.list[0].main.humidity,
        icon: data.list[0].weather[0].icon
        }

        var futureCityWeather = data.list;

        showCurrentConditions(currentCityWeather);
        showFutureConditions(futureCityWeather);
    })
}

function showCurrentConditions(cityWeather) {
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

function showFutureConditions(cityWeather) {
    forecastTitleEl.textContent = "5-Day Forecast:";
    cardDeckEl.style.visibility = "visible";

    for (var i = 1; i < 6; i++) {
        var date = moment().add(i, 'd').format("M/DD/YYYY");
        var icon = cityWeather[i].weather[0].icon;
        var temp = cityWeather[i].main.temp;
        var wind = cityWeather[i].wind.speed;
        var humidity = cityWeather[i].main.humidity

        // Creates card elements to use with Bootstrap
        var cardEl = document.createElement("div");
        cardEl.className = "card";
        cardDeckEl.appendChild(cardEl);
        var cardBodyEl = document.createElement("div");
        cardBodyEl.className = "card-body";
        cardEl.appendChild(cardBodyEl);
        // Displays date
        var cardTitleEl = document.createElement("h5");
        cardTitleEl.className = "card-title";
        cardTitleEl.textContent = date;
        cardBodyEl.appendChild(cardTitleEl);
        // Displays icon
        var weatherIconEl = document.createElement('img');
        weatherIconEl.src = "http://openweathermap.org/img/wn/"+icon+"@2x.png";
        cardBodyEl.appendChild(weatherIconEl);
        // Displays temp, wind, humidity
        var cardTextEl = document.createElement("div");
        cardTextEl.className = "card-text";
        cardBodyEl.appendChild(cardTextEl);
        var tempEl = document.createElement("p");
        tempEl.textContent = "Temperature: " + temp + "°F";
        cardTextEl.appendChild(tempEl);
        var windEl = document.createElement("p");
        windEl.textContent = "Wind: " + wind + " MPH";
        cardTextEl.appendChild(windEl);
        var humidityEl = document.createElement("p");
        humidityEl.textContent = "Humidity: " + humidity + "%";
        cardTextEl.appendChild(humidityEl);
    }
}

function loadSearchHistory() {
    searchHistoryArray = JSON.parse(localStorage.getItem("searchHistory"));

    if(searchHistoryArray) {
        historyEl.style.visibility = "visible";
        var searchHistoryList = document.createElement("ul");
        searchHistoryList.className = "list-group list-group-flush";
        historyEl.appendChild(searchHistoryList);
        for (var i = 0; i < searchHistoryArray.length; i++) {
            var searchHistoryListItem = document.createElement("li");
            searchHistoryListItem.className = "list-group-item";
            searchHistoryListItem.textContent = searchHistoryArray[i];
            searchHistoryList.appendChild(searchHistoryListItem);
        }
    } else {
        searchHistoryArray = [];
    }
}

function clearSearchHistory() {
    localStorage.removeItem("searchHistory");
    historyEl.style.visibility = "hidden";
    searchHistoryArray = [];
}

loadSearchHistory();
submitEl.addEventListener("click", formSubmitHandler);
clearBtn.addEventListener("click",clearSearchHistory);