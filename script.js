
const weatherAPIURL = "https://api.openweathermap.org";
const weatherAPIKey = "3e57f9528237c8e378dd6f85ab408b45";
let searchInput = $("#search-input");

let searchForm = $("#search-form");

function fetchCoord(search){
    let queryURL = `${weatherAPIURL}/geo/1.0/direct?q=${search}&limit=5&appid=${weatherAPIKey}`
    console.log(queryURL);


    fetch(queryURL).then(function(data){
        return data.json()
    }).then(function(response){
        console.log(response);
    })
}

function submitSearch(event){
    event.preventDefault();

    let search = searchInput.val().trim()

    fetchCoord(search);
}

searchForm.on("submit", submitSearch);