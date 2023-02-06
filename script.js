
const weatherAPIURL = "https://api.openweathermap.org";
const weatherAPIKey = "3e57f9528237c8e378dd6f85ab408b45";
let searchHistory = []

let searchInput = $("#search-input");
let searchForm = $("#search-form");
let searchHisContainer = $("#history")


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
}

initialzeHistory();

searchForm.on("submit", submitSearch);