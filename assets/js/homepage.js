var cities = [];

// global variables
var nameFormEl=document.querySelector("#city-search-form");
// var nameEl=document.querySelector("#city");
var weatherContainer=document.querySelector("#current-weather-container");
var nameInputEl = document.querySelector("#city");
var forecastTitle = document.querySelector("#forecast");
var weatherContainerEl = document.querySelector("#fiveday-container");
var recentSearchsEl = document.querySelector("#recent-search-buttons");

// Current Date and Time function
$(document).ready(function () {
 var currentDate = moment().format("dddd MMM Do YYYY, h:mm a");
    $("#date-time").append(currentDate);
    currentTime = moment().hour();
})

// Perform the search on user input, save recent to local storage
var formSumbitHandler = function(event){
    event.preventDefault();
    var city = nameInputEl.value.trim();
    if(city){
        getCityWeather(city);
        get5Day(city);
        cities.unshift({city});
        nameInputEl.value = "";
    } else{
        alert("Enter a City");
    }
    saveSearch();
    recentSearch(city);
}

var saveSearch = function(){
    localStorage.setItem("cities", JSON.stringify(cities));
};

//My API key that was emailed to me with
var getCityWeather = function(city){
    var apiKey = "1a16fe3c1bf7cb4b5145531729d9d547"
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`


    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayWeather(data, city);
            console.log(data)
        });
    });
};

// display the API response and clear old content
var displayWeather = function(weather, searchCity){
    weatherContainer.textContent= "";  
    nameInputEl.textContent=searchCity;

   

   //
   /*var currentDate = document.createElement("span")
   currentDate.textContent=" (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
   nameInputEl.appendChild(currentDate);*/

   //creates an image element for the weather icon
   var weatherIcon = document.createElement("img")
   weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
   nameInputEl.appendChild(weatherIcon);

   //creates an element for temperature data
   var temperatureEl = document.createElement("span");
   temperatureEl.textContent = "Temperature: " + weather.main.temp + " °F";
   temperatureEl.classList = "list-group-item"
  
   //creates an element for Humidity data
   var humidityEl = document.createElement("span");
   humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
   humidityEl.classList = "list-group-item"

   //creates an element for Wind data
   var windSpeedEl = document.createElement("span");
   windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
   windSpeedEl.classList = "list-group-item"

   //append child to container
   weatherContainer.appendChild(temperatureEl);

   //append child to container
   weatherContainer.appendChild(humidityEl);

   //append child to container
   weatherContainer.appendChild(windSpeedEl);

   var lat = weather.coord.lat;
   var lon = weather.coord.lon;
   getUvIndex(lat,lon)
}
//this is how the OpenWeather API works, unique
var getUvIndex = function(lat,lon){
    var apiKey = "1a16fe3c1bf7cb4b5145531729d9d547"
    var apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`
    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayUvIndex(data)
        
        });
    });
 
}
 //variables funtion so the correct color is displayed on the elements
var displayUvIndex = function(index){
    var uvIndexEl = document.createElement("div");
    uvIndexEl.textContent = "UV Index: "
    uvIndexEl.classList = "list-group-item"

    uvIndexValue = document.createElement("span")
    uvIndexValue.textContent = index.value

    if(index.value <=2){
        uvIndexValue.classList = "favorable"
    }else if(index.value >2 && index.value<=8){
        uvIndexValue.classList = "moderate "
    }
    else if(index.value >8){
        uvIndexValue.classList = "severe"
    };

    uvIndexEl.appendChild(uvIndexValue);

    //append child to current weather
    weatherContainer.appendChild(uvIndexEl);
}

//Again, this is how this API works, unique
var get5Day = function(city){
    var apiKey = "1a16fe3c1bf7cb4b5145531729d9d547"
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`
    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
           display5Day(data);
        });
    });
};

// variable display of the 5 day weather
var display5Day = function(weather){
    weatherContainerEl.textContent = ""
    forecastTitle.textContent = "5-Day Weather Forecast:";

    var forecast = weather.list;
        for(var i=5; i < forecast.length; i=i+8){
       var dailyForecast = forecast[i];
        
       
       var forecastEl=document.createElement("div");
       forecastEl.classList = "card bg-primary text-light m-2";


       //creates date for each day
       var forecastDate = document.createElement("h5")
       forecastDate.textContent= moment.unix(dailyForecast.dt).format("MMM D, YYYY");
       forecastDate.classList = "card-header text-center"
       forecastEl.appendChild(forecastDate);

       
       //creates an image weather icon
       var weatherIcon = document.createElement("img")
       weatherIcon.classList = "card-body text-center";
       weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);  

       //append child card
       forecastEl.appendChild(weatherIcon);
       
       //creates a temperature span
       var forecastTempEl=document.createElement("span");
       forecastTempEl.classList = "card-body text-center";
       forecastTempEl.textContent = dailyForecast.main.temp + " °F";

        //append child card
        forecastEl.appendChild(forecastTempEl);

       var forecastHumEl=document.createElement("span");
       forecastHumEl.classList = "card-body text-center";
       forecastHumEl.textContent = dailyForecast.main.humidity + "  %";

       //append child to card
       forecastEl.appendChild(forecastHumEl);
        weatherContainerEl.appendChild(forecastEl);
    }

}
//recent search function
var recentSearch = function(recentSearch){
    recentSearchEl = document.createElement("button");
    recentSearchEl.textContent = recentSearch;
    recentSearchEl.classList = "d-flex w-100 btn-light border p-2";
    recentSearchEl.setAttribute("data-city",recentSearch)
    recentSearchEl.setAttribute("type", "submit");

    recentSearchsEl.prepend(recentSearchEl);
}


var recentSearchHandler = function(event){
    var city = event.target.getAttribute("data-city")
    if(city){
        getCityWeather(city);
        get5Day(city);
    }
}

// listener for submit and click

nameFormEl.addEventListener("submit", formSumbitHandler);
recentSearchsEl.addEventListener("click", recentSearchHandler);