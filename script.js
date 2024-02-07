
var apiKey = '7d3fe3cb5c6072fb86da5fc471ef7edc';
// Variables created so I can insert some functions to html elements.
var searchBar = document.querySelector('#searchBtn');
var fivedayboxes = document.getElementById('fivedayforec');

// Function that checks status of API source, then runs functions accordingly if status is okay.
function weatherdash(city) {
    var apijson = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;

    fetch(apijson)
    .then(function(response) {
        if (response.status !== 200) {
          alert('Cannot understand your response');
        }
        return response.json();
      })
      .then(function(data) {
        weatherRep(data);
        citylocalstor(city);
        FiveForecast(data.list);
      })
}
// Gets current weather forecast; Make sure nothing is inside the container.
function weatherRep(data) {
    document.getElementById('citydesp').innerHTML = '';

    let cities = data.city.name;
    let icon = data.list[0].weather[0].icon;
    let temperature = data.list[0].main.temp;
    let humidity = data.list[0].main.humidity;
    let wind = data.list[0].wind.speed;

   let weathrcard = `
   <h2>${cities}</h2>
   <img src="http://openweathermap.org/img/w/${icon}.png">
   <p>Temp: ${temperature}°F</p>
  <p>Wind: ${wind} MPH</p>
   <p>Humidity: ${humidity} %</p>
`;

 document.getElementById('weathercardz').innerHTML = weathrcard;
}

// Makes sure container is empty; If the 5-day forecast is available, then it appends the weather.
function FiveForecast(forecastdata) {
    fivedayboxes.innerHTML = '';

    if (forecastdata && forecastdata.length > 0) {
        for (let index = 0; index < Math.min(5, forecastdata.length); index++) {
            fivedayboxes.appendChild(moreboxes(forecastdata[index], index));
        };
    } else {
        console.error("Error");
    }
}

// Creates a container; Set the time correctly and show the weather forecast.
function moreboxes(todaysforec, Indexes) {
    var box = document.createElement('div');
    box.className = 'weather-box';
    var settime = new Date(todaysforec.dt * 1000);
    settime.setDate(settime.getDate() + Indexes);
    var newdates = timeDate(settime);
    var boxicons = todaysforec.weather[0].icon;
    let website = "http://openweathermap.org/img/w/${boxicons}.png";

    box.innerHTML = `
    <p>${newdates}</p>
    <img src="${website}">
    <p>Temp: ${todaysforec.main.temp}°F</p>
    <p>Wind: ${todaysforec.wind.speed} MPH</p>
    <p>Humidity: ${todaysforec.main.humidity} %</p>
 `;

    return box;
}

// Set the time in the correct format.
function timeDate(settime) {
    let dateForm = dayjs(settime).format('MM/DD/YYYY');
    return dateForm;
}

// Saves input in local storage
function citylocalstor(city){localStorage.setItem('PrevCity', city);}
// When the search button is clicked, run the function using added input.
searchBar.addEventListener('click', function() {
    let Binput = document.querySelector('#enterCity').value;
    weatherdash(Binput);
});

// Shows recently searched cities when the page loads.
document.addEventListener('DOMContentLoaded', function() {
    let PrevCity = localStorage.getItem('PrevCity');
    if (PrevCity) { weatherdash(PrevCity);  }
});
