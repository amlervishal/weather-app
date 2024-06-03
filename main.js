import FetchWrapper from "./fetchwrapper.js";

const API = new FetchWrapper("http://api.openweathermap.org/data/2.5/") 

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


// Initial boolean value
let useCelsius = true; // Default to Celsius

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
        const timezone = data.timezone;
        const sunRise = convertTime(data.sys.sunrise, timezone);
        const sunSet = convertTime(data.sys.sunset, timezone);
        
        sunset.textContent = sunSet;
        sunrise.textContent = sunRise

    }).catch(error => {
        console.error('Error fetching weather data:', error);
    });
}

searchButton.addEventListener("click", event => {
    getWeatherData()
})

const toCelsius = (kelvin) => {
    return Math.round(kelvin - 273);
}

const toFarenheit = (kelvin) => {
    return Math.round((kelvin-273) * (9/5) + 32);
}

const convertTime = (ms, timezone) => {
    const timestamp = ms;
    const timezoneOffsetInSeconds = timezone; // Assuming data.timezone contains the timezone offset in seconds

    // Convert Unix timestamp to milliseconds
    const timeMilliseconds = timestamp * 1000;

    // Create a new Date object from the milliseconds
    const timeDate = new Date(timeMilliseconds);

    // Adjust time by adding the timezone offset
    timeDate.setSeconds(timeDate.getSeconds() + timezoneOffsetInSeconds);

    // Get the hours and minutes from the Date object
    const hours = timeDate.getHours();
    const minutes = timeDate.getMinutes();

    console.log("Time (adjusted for timezone) in hours and minutes:", hours, ":", minutes);
    
    return `${hours} : ${minutes}`
}


