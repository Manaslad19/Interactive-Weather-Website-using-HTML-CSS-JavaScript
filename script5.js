const API_KEY = 'd5583b5766b2ee870f3534ea7acbbae6'; // Replace with your actual API key

const locateBtn = document.getElementById('locate-button');
const searchForm = document.getElementById('search-form');
const locationInput = document.getElementById('location-input');
const weatherDisplay = document.getElementById('weather-display');

locateBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser.');
        return;
    }
    showLoading('Locating you...');
    navigator.geolocation.getCurrentPosition(successPosition, errorPosition, { timeout: 10000 });
});

searchForm.addEventListener('submit', e => {
    e.preventDefault();
    const location = locationInput.value.trim();
    if (location.length === 0) {
        showError('Please enter a location.');
        return;
    }
    fetchWeatherByLocation(location);
});

function successPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    fetchWeatherByCoordinates(lat, lon);
}

function errorPosition() {
    showError('Unable to retrieve your location. Please enter a location manually.');
}

function fetchWeatherByCoordinates(lat, lon) {
    showLoading('Fetching weather...');
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    fetchWeather(url);
}

function fetchWeatherByLocation(location) {
    showLoading('Fetching weather...');
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${API_KEY}&units=metric`;
    fetchWeather(url);
}

async function fetchWeather(url) {
    try {
        weatherDisplay.innerHTML = '';
        const res = await fetch(url);
        if (!res.ok) {
            if (res.status === 404) {
                showError('Location not found. Please check your input.');
            } else {
                showError('Error fetching weather data.');
            }
            return;
        }
        const data = await res.json();
        displayWeather(data);
    } catch (err) {
        showError('Network error. Please check your connection.');
    }
}

function displayWeather(data) {
    const { name, sys, weather, main, wind } = data;
    const icon = weather[0].icon;
    const description = capitalizeFirstLetter(weather[0].description);
    const temp = Math.round(main.temp);
    const feelsLike = Math.round(main.feels_like);
    const humidity = main.humidity;
    const windSpeed = wind.speed;

    weatherDisplay.innerHTML = `
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" width="100" height="100" />
        <div class="weather-main">${description}</div>
        <div class="temp">${temp}&deg;C</div>
        <div class="details">
            <div>Location: ${name}, ${sys.country}</div>
            <div>Feels like: ${feelsLike}&deg;C</div>
            <div>Humidity: ${humidity}%</div>
            <div>Wind speed: ${windSpeed} m/s</div>
        </div>
    `;
}

function showError(msg) {
    weatherDisplay.innerHTML = `<div class="error">${msg}</div>`;
}

function showLoading(msg) {
    weatherDisplay.innerHTML = `<div class="loading">${msg}</div>`;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}