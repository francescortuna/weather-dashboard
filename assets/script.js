// Form input
var cityNameSearch = document.querySelector("#city-name-search");
var zipCodeSearch = document.querySelector("#zip-code-search");
var submitEl = document.querySelector("#search");
var cityNameEl = document.querySelector(".city-name");

// Placeholder for City Name and Date until user searches for city
cityNameEl.textContent = "Search for a City!";

function replaceName() {
    if (zipCodeSearch.value === "" && cityNameSearch.value === "") {
        cityNameEl.textContent = "Retry";
    } else if (zipCodeSearch.value === "") {
        cityNameEl.textContent = cityNameSearch.value;
        cityNameSearch.value = "";
    } else {
        cityNameEl.textContent = zipCodeSearch.value;
        zipCodeSearch.value = "";
    }
}

submitEl.addEventListener("click", replaceName);