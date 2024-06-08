import FetchWrapper from "./fetchwrapper.js";

const API = new FetchWrapper("https://api.openweathermap.org/data/2.5/") 

const locationInput = document.querySelector("#location-input");
const searchButton = document.querySelector("#search-button");
const location = document.querySelector("#location");
const description = document.querySelector("#description");
const currentTemp = document.querySelector("#current-temp");
const highTemp= document.querySelector("#high-temp");
const lowTemp= document.querySelector("#low-temp");
const checkbox = document.getElementById('toggleCheckbox');
const icon = document.querySelector("#weather-icon");
const sunrise = document.querySelector("#sunrise");
const sunset = document.querySelector("#sunset");
const visibility = document.querySelector("#visibility");
const humidity = document.querySelector("#humidity");


// Initial boolean value
let useCelsius = true; // Default to Celsius

// autocomplete suggestions from JSON
document.addEventListener("DOMContentLoaded", () => {
    const autocompleteContainer = document.querySelector("#autocomplete-container");
    const locationInput = document.getElementById("location-input"); // Assuming "location-input" is the correct ID of your input field

    fetch("./cities.json")
    .then(response => response.json())
    .then(data => {
        const cities = data.cities_list.map(city => city.name);
        // console.log(cities);

        locationInput.addEventListener("input", () => {
            const userInput = locationInput.value.trim().toLowerCase();
            const filteredCities = cities.filter(city => city.toLowerCase().includes(userInput));
            console.log(filteredCities);

            autocompleteContainer.innerHTML = "";

            filteredCities.forEach(city => {
                const cityElement = document.createElement("div");
                cityElement.textContent = city;
                cityElement.classList.add("autocomplete-item");
                cityElement.addEventListener("click", () => {
                    locationInput.value = city;
                    console.log(city);
                    autocompleteContainer.innerHTML = "";
                });
                autocompleteContainer.appendChild(cityElement);
            });
        });
        document.addEventListener("click", (event) => {
            if (!autocompleteContainer.contains(event.target)){
                autocompleteContainer.innerHTML = "";
            }
        })
    })
});

    


// Function to toggle the boolean value when the checkbox state changes
checkbox.addEventListener('change', function() {
    useCelsius = !this.checked;
    console.log('Use Celsius:', useCelsius);

    // Call the function to get weather data and update temperature display
    getWeatherData();
});

const getWeatherData = () => {
    API.get(`weather?q=${locationInput.value}&APPID=ff2efc406bd3653075c5faf854354599`)
    .then(data => {
        const kelvinTemperature = data.main.temp;
        let temperature;
        location.textContent = `${data.name}`
        description.textContent = `${data.weather[0].description}`
        icon.innerHTML = "";
        icon.insertAdjacentHTML("beforeend", `<div><i class="wi wi-owm-${data.weather[0].id}"></i></div>`);
        
        const highKelvin = data.main.temp_max;
        const lowKelvin = data.main.temp_min;
        let highCelsius;
        let lowCelsius;
        if (useCelsius) {
            temperature = toCelsius(kelvinTemperature);
            highCelsius = toCelsius(highKelvin);
            lowCelsius  = toCelsius(lowKelvin);
            currentTemp.textContent = `${temperature}°C`;
            highTemp.textContent = `High: ${highCelsius}°C`;
            lowTemp.textContent = `Low: ${lowCelsius}°C`;
          
        } else {
            temperature = toFarenheit(kelvinTemperature);
            highCelsius = toFarenheit(highKelvin);
            lowCelsius  = toFarenheit(lowKelvin);
            currentTemp.textContent = `${temperature}°F`;
            highTemp.textContent = `High: ${highCelsius}°F`;
            lowTemp.textContent = `Low: ${lowCelsius}°F`
        };
        
        const sunRise = convertTime(data.sys.sunrise, data.timezone);
        const sunSet = convertTime(data.sys.sunset, data.timezone);

        sunset.textContent = sunSet;
        sunrise.textContent = sunRise;
        humidity.innerHTML = `${data.main.humidity}%`;
        visibility.innerHTML = `${data.visibility / 1000} km`;
        // console.log(data.visibility);

    }).catch(error => {
        console.error('Error fetching weather data:', error);
    });
}

// event handler for button
searchButton.addEventListener("click", event => {
    getWeatherData()
})

// event handler for enter key
// locationInput.addEventListener("keydown", event => {
//     if (event.keyCode === 13) {
//         getWeatherData()
//     }
// })

const toCelsius = (kelvin) => {
    return Math.round(kelvin - 273);
}

const toFarenheit = (kelvin) => {
    return Math.round((kelvin-273) * (9/5) + 32);
}


// time conversion
const convertTime = (ms, timezone) => {
    
    // Convert ms and timezone from seconds to milliseconds
    const msInMilliseconds = ms * 1000;
    const timezoneOffsetMs = timezone * 1000;

    // Create total milliseconds by adding the timezone offset
    const totalMilliseconds = msInMilliseconds + timezoneOffsetMs;
    // console.log(`total ms : ${totalMilliseconds}`);

    // Create a new JavaScript Date object based on the timestamp
    const date = new Date(totalMilliseconds);

    // Get UTC hours, minutes, and seconds
    const hours = date.getUTCHours();
    const minutes = "0" + date.getUTCMinutes();
    const seconds = "0" + date.getUTCSeconds();

    // Will display time in 10:30:23 format
    const formattedTime = hours + ':' + minutes.substr(-2) + ' hr';

    return formattedTime;
}