// Weather API Configuration
const WEATHER_API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your OpenWeatherMap API key
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM Elements
const weatherContainer = document.getElementById('weatherContainer');
const weatherCard = document.getElementById('weatherCard');
const weatherContent = document.getElementById('weatherContent');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('errorMessage');
const themeToggle = document.getElementById('themeToggle');
const retryBtn = document.getElementById('retryBtn');

// Weather display elements
const locationName = document.getElementById('locationName');
const locationTime = document.getElementById('locationTime');
const weatherIcon = document.getElementById('weatherIcon');
const temperature = document.getElementById('temperature');
const weatherDescription = document.getElementById('weatherDescription');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const pressure = document.getElementById('pressure');

// Animation containers
const cloudsContainer = document.getElementById('clouds');
const rainContainer = document.getElementById('rain');
const snowContainer = document.getElementById('snow');
const lightningContainer = document.getElementById('lightning');

// State
let isDarkMode = false;
let currentWeather = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadThemePreference();
    setupThemeToggle();
    setupRetryButton();
    getWeatherData();
});

// Theme Management
function loadThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        isDarkMode = true;
        weatherContainer.classList.add('dark');
        themeToggle.querySelector('.theme-icon').textContent = '☀️';
    }
}

function setupThemeToggle() {
    themeToggle.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        weatherContainer.classList.toggle('dark');
        
        const icon = themeToggle.querySelector('.theme-icon');
        icon.textContent = isDarkMode ? '☀️' : '🌙';
        
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        
        // Update background based on current weather
        if (currentWeather) {
            updateBackground(currentWeather);
        }
    });
}

function setupRetryButton() {
    retryBtn.addEventListener('click', () => {
        getWeatherData();
    });
}

// Geolocation
function getWeatherData() {
    showLoading();
    hideError();
    
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser.');
        return;
    }
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeatherData(latitude, longitude);
        },
        (error) => {
            console.error('Geolocation error:', error);
            // Fallback to default location (London)
            fetchWeatherData(51.5074, -0.1278);
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
        }
    );
}

// Fetch Weather Data
async function fetchWeatherData(lat, lon) {
    try {
        // Check if API key is set
        if (WEATHER_API_KEY === 'YOUR_API_KEY_HERE') {
            // Use fallback demo data
            console.warn('API key not set. Using demo data.');
            useDemoData();
            return;
        }
        
        const url = `${WEATHER_API_URL}?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Weather API error: ${response.status}`);
        }
        
        const data = await response.json();
        currentWeather = data;
        displayWeather(data);
        updateBackground(data);
    } catch (error) {
        console.error('Error fetching weather:', error);
        // Fallback to demo data
        useDemoData();
    }
}

// Display Weather Data
function displayWeather(data) {
    hideLoading();
    showContent();
    
    // Location
    locationName.textContent = data.name || 'Unknown Location';
    
    // Time
    const now = new Date();
    locationTime.textContent = now.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Temperature
    const temp = Math.round(data.main.temp);
    temperature.textContent = `${temp}°`;
    
    // Weather Description
    const description = data.weather[0].description;
    weatherDescription.textContent = description;
    
    // Weather Icon
    const iconCode = data.weather[0].icon;
    const iconEmoji = getWeatherEmoji(data.weather[0].main, iconCode);
    weatherIcon.textContent = iconEmoji;
    
    // Details
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°`;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`; // Convert m/s to km/h
    pressure.textContent = `${data.main.pressure} hPa`;
}

// Get Weather Emoji
function getWeatherEmoji(main, iconCode) {
    const emojiMap = {
        'Clear': '☀️',
        'Clouds': iconCode.includes('d') ? '⛅' : '☁️',
        'Rain': '🌧️',
        'Drizzle': '🌦️',
        'Thunderstorm': '⛈️',
        'Snow': '❄️',
        'Mist': '🌫️',
        'Fog': '🌫️',
        'Haze': '🌫️',
        'Dust': '🌪️',
        'Sand': '🌪️',
        'Ash': '🌋',
        'Squall': '💨',
        'Tornado': '🌪️'
    };
    
    return emojiMap[main] || '🌤️';
}

// Update Background Based on Weather
function updateBackground(data) {
    // Remove all weather classes
    weatherContainer.classList.remove('clear', 'clouds', 'rain', 'snow', 'thunderstorm', 'mist', 'fog', 'drizzle');
    
    // Stop all animations
    stopAllAnimations();
    
    const mainWeather = data.weather[0].main.toLowerCase();
    const description = data.weather[0].description.toLowerCase();
    
    // Determine weather type
    let weatherType = 'clear';
    
    if (mainWeather === 'clear') {
        weatherType = 'clear';
    } else if (mainWeather === 'clouds') {
        weatherType = 'clouds';
        createClouds();
    } else if (mainWeather === 'rain' || description.includes('rain')) {
        weatherType = 'rain';
        createRain();
    } else if (mainWeather === 'drizzle') {
        weatherType = 'drizzle';
        createRain();
    } else if (mainWeather === 'snow' || description.includes('snow')) {
        weatherType = 'snow';
        createSnow();
    } else if (mainWeather === 'thunderstorm' || description.includes('thunder')) {
        weatherType = 'thunderstorm';
        createRain();
        createLightning();
    } else if (mainWeather === 'mist' || mainWeather === 'fog' || mainWeather === 'haze') {
        weatherType = mainWeather;
    }
    
    // Add weather class
    weatherContainer.classList.add(weatherType);
}

// Animation Functions
function createClouds() {
    cloudsContainer.innerHTML = '';
    
    for (let i = 0; i < 3; i++) {
        const cloud = document.createElement('div');
        cloud.className = `cloud cloud${i + 1}`;
        cloudsContainer.appendChild(cloud);
    }
}

function createRain() {
    rainContainer.style.display = 'block';
    rainContainer.innerHTML = '';
    
    for (let i = 0; i < 100; i++) {
        const drop = document.createElement('div');
        drop.className = 'rain-drop';
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.animationDuration = `${0.5 + Math.random() * 0.5}s`;
        drop.style.animationDelay = `${Math.random() * 2}s`;
        drop.style.height = `${10 + Math.random() * 20}px`;
        rainContainer.appendChild(drop);
    }
}

function createSnow() {
    snowContainer.style.display = 'block';
    snowContainer.innerHTML = '';
    
    const snowflakes = ['❄', '❅', '❆'];
    
    for (let i = 0; i < 50; i++) {
        const flake = document.createElement('div');
        flake.className = 'snowflake';
        flake.textContent = snowflakes[Math.floor(Math.random() * snowflakes.length)];
        flake.style.left = `${Math.random() * 100}%`;
        flake.style.animationDuration = `${3 + Math.random() * 5}s`;
        flake.style.animationDelay = `${Math.random() * 5}s`;
        flake.style.fontSize = `${0.5 + Math.random() * 1}em`;
        snowContainer.appendChild(flake);
    }
}

function createLightning() {
    lightningContainer.style.display = 'block';
    lightningContainer.innerHTML = '';
    
    const flash = document.createElement('div');
    flash.className = 'lightning-flash';
    lightningContainer.appendChild(flash);
}

function stopAllAnimations() {
    cloudsContainer.innerHTML = '';
    rainContainer.style.display = 'none';
    rainContainer.innerHTML = '';
    snowContainer.style.display = 'none';
    snowContainer.innerHTML = '';
    lightningContainer.style.display = 'none';
    lightningContainer.innerHTML = '';
}

// UI State Management
function showLoading() {
    loading.classList.remove('hidden');
    weatherContent.classList.add('hidden');
    errorMessage.classList.add('hidden');
}

function hideLoading() {
    loading.classList.add('hidden');
}

function showContent() {
    weatherContent.classList.remove('hidden');
    errorMessage.classList.add('hidden');
}

function showError(message) {
    hideLoading();
    weatherContent.classList.add('hidden');
    errorMessage.classList.remove('hidden');
    errorMessage.querySelector('p').textContent = message || 'Unable to fetch weather data. Please check your connection or try again later.';
}

function hideError() {
    errorMessage.classList.add('hidden');
}

// Demo Data (Fallback)
function useDemoData() {
    const demoData = {
        name: 'Demo Location',
        main: {
            temp: 22,
            feels_like: 20,
            humidity: 65,
            pressure: 1013
        },
        weather: [{
            main: 'Clear',
            description: 'clear sky',
            icon: '01d'
        }],
        wind: {
            speed: 3.5
        }
    };
    
    currentWeather = demoData;
    displayWeather(demoData);
    updateBackground(demoData);
    
    // Show a message that demo data is being used
    setTimeout(() => {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 193, 7, 0.9);
            color: #333;
            padding: 15px 25px;
            border-radius: 10px;
            z-index: 1000;
            font-weight: 600;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        `;
        message.textContent = '⚠️ Using demo data. Please add your OpenWeatherMap API key.';
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 5000);
    }, 1000);
}

