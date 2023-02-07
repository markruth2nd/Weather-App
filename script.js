
const weatherAPIURL = "https://api.openweathermap.org";
const weatherAPIKey = "3e57f9528237c8e378dd6f85ab408b45";
let searchHistory = []

let searchInput = $("#search-input");
let searchForm = $("#search-form");
let searchHisContainer = $("#history")
let todayContainer = $("#today")
let forecastContainer = $("#forecast")


function renderSearchHistory(){
    searchHisContainer.html("")
        for(let i = 0; i < searchHistory.length; i++){
        let btn = $("<button>");
        btn.attr("type", "button")
        btn.addClass("history-btn btn-history")

        btn.attr("data-search", searchHistory[i])
        btn.text(searchHistory[i])
        searchHisContainer.append(btn)           
    }
}

function appendSearchHistory(search){
    if(searchHistory.indexOf(search) !== -1){
        return
    }
    searchHistory.push(search);

    localStorage.setItem("search-history", JSON.stringify(searchHistory));

    renderSearchHistory()
}

function renderCurrentWeather(city, weatherData){
    let date = moment().format("DD/MM/YYY");
    let tempC = weatherData["main"]["temp"];
    let windKph = weatherData["wind"]["speed"];
    let humidity = weatherData["main"]["humidity"];

    let weatherIcon = $("<img>")
    let card = $("<div>")
    let cardBody = $("<div>")
    let heading = $("<h2>")

    let tempEl = $("<p>")
    let windEl = $("<p>")
    let humidityEl = $("<p>")

    let iconUrl = `https://api.openweathermap.org/img/w/${weatherData.weather[0].icon}.png`
    let iconDescription = weatherData.weather[0].decription || weatherData[0].main

    card.attr("class", "card");

    cardBody,attr("class", "card-body");

    card.append(cardBody);

    heading.attr("class", "h3 card-title")
    tempEl.attr("class", "card-text")
    windEl.attr("class", "card-text")
    humidityEl.attr("class", "card-text")

    heading.text(`${city} (${date})`)
    weatherIcon.attr("src", iconUrl)
    weatherIcon.attr("alt", iconDescription)
    heading.append(weatherIcon)
    tempEl.text(`Temp ${tempC} C`)
    windEl.text(`Wind ${windKph} KPH`)
    humidityEl.text(`Humidity ${humidity} %`)
    cardBody.append(heading, tempEl, windEl, humidityEl);

    todayContainer.html("")
    todayContainer.append(card);

}

function renderForecast(weatherData){
    let headingCol = $("<div>")
    let heading = $("<h4>")

    headingCol.attr("class", "col-12")
    headingCol.attr("5 day forecast")
    headingCol.append(heading)

    forecastContainer.html("")

    forecastContainer.append(headingCol)

    let futureForecast = weatherData.filter(function(forecast){
        return forecast.dt_txt.includes("12")
    })

    console.log()

    for(let i = 0; i < futureForecast.length; i++){
        let iconUrl = `https://api.openweathermap.org/img/w/${futureForecast[i].weather[0].icon}.png`
        let iconDescription = futureForecast[i].weather[0].decription;
        let tempC = futureForecast[i].main.temp;
        let humidity = futureForecast[i].main.humidity;
        let windKph = futureForecast[i].wind.speed;

        let col = $("<div>")
        let card = $("<div>")
        let cardBody = $("<div>")
        let cardTitle = $("<h5>")
        let weatherIcon = $("<img>")
        let tempEl = $("<p>")
        let windEl = $("<p>")
        let humidityEl = $("<p>")

        col.append(card)
        card.append(cardBody)
        cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);

        col.attr("class", "col-md")
        card.attr("class", "card bg-primary h-100 text-white")
        cardTitle.attr("class", "card-title")
        tempEl.attr("class", "card-text")
        windEl.attr("class", "card-text")
        humidityEl.attr("class", "card-text")

        cardTitle.text(moment(futureForecast[i].dt_text.format("DD/MM/YYYY")))
        weatherIcon.attr("src", iconUrl)
        weatherIcon.attr("alt", iconDescription)
        tempEl.text(`Temp ${tempC} C`)
        windEl.text(`Wind: ${windKph} KPH`)
        humidityEl.text(`Humidity ${humidity} %`)

        forecastContainer.append(col)
    }
}



function fetchWeather(Location){
    let latitude = location.lat;
    let longitude = location.lon;

    let city = location.name

    let queryWeatherURL = `${weatherAPIURL}/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${weatherAPIKey}`;
    console.log(queryWeatherURL)

    $.ajax({
        url: queryWeatherURL,
        method: "GET"
    }).then(function(response){
        renderCurrentWeather(city, response.list[0])
        renderForecast(response.list)
    })
}

function fetchCoord(search){
    let queryURL = `${weatherAPIURL}/geo/1.0/direct?q=${search}&limit=5&appid=${weatherAPIKey}`
    console.log(queryURL);


    fetch(queryURL, {method: "GET"}).then(function(data){
        return data.json()
    }).then(function(response){
        if(!response[0]){
            alert("Location not found")
        } else {
            appendSearchHistory(search)
            fetchWeather(response[0])
            }
    })
}

function initialzeHistory(){
    let storedHistory = localStorage.getItem("search-history");

    if(storedHistory) {
        searchHistory = JSON.parse(storedHistory);
    }
    renderSearchHistory()
}

function submitSearch(event){
    event.preventDefault();

    let search = searchInput.val().trim()

    fetchCoord(search);
    searchInput.val("")
}

function clkSearchHistory(event){
    if (!$(event.target).hasClass("btn-history")){
        return
    }
    let search = $(event.target).attr("data-search")
    alert(search)

    fetchCoord(search);
    searchInput.val("")
}

initialzeHistory();

searchForm.on("submit", submitSearch);

searchHisContainer.on("click", clkSearchHistory)