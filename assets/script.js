var cityNameSearch = document.querySelector("#city-name-search");
var submitEl = document.querySelector("#search");
var currentConditionsEl = document.querySelector("#current-conditions");
var forecastTitleEl = document.querySelector("#forecast-title");
var cardDeckEl = document.querySelector(".card-deck");
var historyCardEl = document.querySelector("#history-card");
var historyEl = document.querySelector("#history")
var apiKey = "bc7f76e26e1aeea4cf17b448e7f41d71";
var clearBtn = document.querySelector("#clearBtn");

// Empty search history array
var searchHistoryArray = [];

// Placeholder for City Name and Date until user searches for city
forecastTitleEl.textContent = "The 5-Day Forecast will show here!"

function init() {
    // Get stored search history array from local storage
    var storedSearchHistory = JSON.parse(localStorage.getItem("searchHistory"));

    // Updates search history array if there was a stored search history from local storage
    if (storedSearchHistory !== null) {
        searchHistoryArray = storedSearchHistory
    }

    renderSearchHistory();
}

function formSubmitHandler(event) {
    event.preventDefault();
    
    var cityName = cityNameSearch.value.trim();

    if(cityName) {
        // Adds city name to search history array and resets search value
        searchHistoryArray.push(cityName);
        cityNameSearch.value = "";

        storeHistoryArray();
        retrieveConditions(cityName);
        renderSearchHistory();
    } else {
        alert("Please enter a valid city name");
        return;
    }
}

// Stores city names to local storage
function storeHistoryArray() {
    localStorage.setItem("searchHistory", JSON.stringify(searchHistoryArray));
}

function renderSearchHistory() {
    historyEl.innerHTML = "";

    historyCardEl.style.visibility = "visible";
        var searchHistoryList = document.createElement("ul");
        searchHistoryList.className = "list-group list-group-flush";
        historyEl.appendChild(searchHistoryList);
        for (var i = 0; i < searchHistoryArray.length; i++) {
            var searchHistoryListItem = document.createElement("li");
            searchHistoryListItem.className = "list-group-item";
            searchHistoryListItem.textContent = searchHistoryArray[i];
            searchHistoryList.appendChild(searchHistoryListItem);
        }
}

function retrieveConditions(cityName) {
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

            // Empties current weather element
            currentConditionsEl.innerHTML = "";
            cardDeckEl.innerHTML = "";
    
            renderConditions(currentCityWeather, futureCityWeather);
            // showCurrentConditions(currentCityWeather);
            // showFutureConditions(futureCityWeather);
        })
    })
}

function renderConditions(current, future) {
    // Replaces "Search City!" with city name and adds date
    var cityNameEl = document.createElement("h2");
    var today = moment().format("M/DD/YYYY");
    cityNameEl.textContent = current.name + " (" + today + ")";
    currentConditionsEl.appendChild(cityNameEl);

    // Adds icon
    var weatherIconEl = document.createElement('img');
    weatherIconEl.src = "http://openweathermap.org/img/wn/"+current.icon+"@2x.png";
    weatherIconEl.setAttribute("height","45px")
    cityNameEl.appendChild(weatherIconEl);

    // Adds temperature to current conditions
    var tempEl = document.createElement("p");
    tempEl.textContent = "Temperature: " + current.temp + "°F";
    currentConditionsEl.appendChild(tempEl);

    // Adds wind to current conditions
    var windEl = document.createElement("p");
    windEl.textContent = "Wind: " + current.wind + " MPH";
    currentConditionsEl.appendChild(windEl);

    // Adds humidity to current conditions
    var humidityEl = document.createElement("p");
    humidityEl.textContent = "Humidity: " + current.humidity + "%";
    currentConditionsEl.appendChild(humidityEl);

    // Changes text for forecast
    forecastTitleEl.textContent = "5-Day Forecast:";
    cardDeckEl.style.visibility = "visible";

    for (var i = 1; i < 6; i++) {
        var date = moment().add(i, 'd').format("M/DD/YYYY");
        var icon = future[i].weather[0].icon;
        var temp = future[i].main.temp;
        var wind = future[i].wind.speed;
        var humidity = future[i].main.humidity

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

function clearSearchHistory() {
    localStorage.removeItem("searchHistory");
    historyCardEl.style.visibility = "hidden";
    searchHistoryArray = [];
}

init();
submitEl.addEventListener("click", formSubmitHandler);
clearBtn.addEventListener("click",clearSearchHistory);