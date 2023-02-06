
const weatherAPIURL = "https://api.openweathermap.org";
const weatherAPIKey = "3e57f9528237c8e378dd6f85ab408b45";
let searchHistory = []

let searchInput = $("#search-input");
let searchForm = $("#search-form");
let searchHisContainer = $("#history")

function fetchCoord(search){
    let queryURL = `${weatherAPIURL}/geo/1.0/direct?q=${search}&limit=5&appid=${weatherAPIKey}`
    console.log(queryURL);


    fetch(queryURL, {method: "GET"}).then(function(data){
        return data.json()
    }).then(function(response){
        if(!response[0]){
            alert("Location not found")
        } else {

            if(searchHistory.indexOf(search) !== -1){
                return
            }
            searchHistory.push(search);

            localStorage.setItem("search-history", JSON.stringify(searchHistory));

            searchHisContainer.html("")

            for(let i = 0; i < searchHistory.length; i++){
                let btn = $("<button>");
                btn.attr("type", "button")
                btn.addClass("history-btn btn-history")

                btn.attr("data-search", searchHistory[i])
                searchHisContainer.append(btn)
            }
        };
    })
}

function submitSearch(event){
    event.preventDefault();

    let search = searchInput.val().trim()

    fetchCoord(search);
}

searchForm.on("submit", submitSearch);