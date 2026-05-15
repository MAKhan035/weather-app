const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherResult = document.getElementById('weatherResult');
const error = document.getElementById('error');

// Using Open-Meteo API (free, no API key required)
const GEOCODING_URL = '[geocoding-api.open-meteo.com](https://geocoding-api.open-meteo.com/v1/search)';
const WEATHER_URL = '[api.open-meteo.com](https://api.open-meteo.com/v1/forecast)';

const weatherIcons = {
    0: '☀️',   // Clear sky
    1: '🌤️',  // Mainly clear
    2: '⛅',   // Partly cloudy
    3: '☁️',   // Overcast
    45: '🌫️', // Fog
    48: '🌫️', // Depositing rime fog
    51: '🌧️', // Light drizzle
    53: '🌧️', // Moderate drizzle
    55: '🌧️', // Dense drizzle
    61: '🌧️', // Slight rain
    63: '🌧️', // Moderate rain
    65: '🌧️', // Heavy rain
    71: '🌨️', // Slight snow
    73: '🌨️', // Moderate snow
    75: '🌨️', // Heavy snow
    77: '🌨️', // Snow grains
    80: '🌧️', // Slight rain showers
    81: '🌧️', // Moderate rain showers
    82: '🌧️', // Violent rain showers
    85: '🌨️', // Slight snow showers
    86: '🌨️', // Heavy snow showers
    95: '⛈️', // Thunderstorm
    96: '⛈️', // Thunderstorm with hail
    99: '⛈️'  // Thunderstorm with heavy hail
};

const weatherDescriptions = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Foggy',
    51: 'Light drizzle',
    53: 'Drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Rainy',
    65: 'Heavy rain',
    71: 'Light snow',
    73: 'Snowy',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Rain showers',
    81: 'Rain showers',
    82: 'Heavy showers',
    85: 'Snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with hail',
    99: 'Severe thunderstorm'
};

async function getWeather(city) {
    try {
        hideError();
        weatherResult.classList.add('hidden');

        // Get coordinates for the city
        const geoResponse = await fetch(`${GEOCODING_URL}?name=${encodeURIComponent(city)}&count=1`);
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            showError('City not found. Please try another city.');
            return;
        }

        const { latitude, longitude, name, country } = geoData.results[0];

        // Get weather data
        const weatherResponse = await fetch(
            `${WEATHER_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`
        );
        const weatherData = await weatherResponse.json();

        displayWeather(name, country, weatherData.current);

    } catch (err) {
        showError('Something went wrong. Please try again.');
        console.error(err);
    }
}

function displayWeather(city, country, current) {
    document.getElementById('cityName').textContent = `${city}, ${country}`;
    document.getElementById('weatherIcon').textContent = weatherIcons[current.weather_code] || '🌡️';
    document.getElementById('temperature').textContent = `${Math.round(current.temperature_2m)}°C`;
    document.getElementById('description').textContent = weatherDescriptions[current.weather_code] || 'Unknown';
    document.getElementById('humidity').textContent = `${current.relative_humidity_2m}%`;
    document.getElementById('wind').textContent = `${current.wind_speed_10m} km/h`;

    weatherResult.classList.remove('hidden');
}

function showError(message) {
    error.textContent = message;
    error.classList.remove('hidden');
}

function hideError() {
    error.classList.add('hidden');
}

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            getWeather(city);
        }
    }
});
