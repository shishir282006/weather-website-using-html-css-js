# Weather Dashboard

A beautiful, dynamic weather website that automatically updates its background theme based on current weather conditions in your location.

## Features

- 🌍 **Automatic Location Detection**: Uses browser geolocation API to detect your location
- 🌤️ **Dynamic Backgrounds**: Background changes based on weather conditions:
  - ☀️ Clear skies - Bright sunny gradient
  - ⛅ Clouds - Cloudy gradient with animated clouds
  - 🌧️ Rain - Rainy gradient with animated raindrops
  - ❄️ Snow - Snowy gradient with falling snowflakes
  - ⛈️ Thunderstorm - Dark stormy gradient with lightning effects
  - 🌫️ Mist/Fog - Foggy gradient
- 🌓 **Light/Dark Mode**: Toggle between light and dark themes
- 📱 **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- 🎨 **Smooth Animations**: Animated clouds, rain, snow, and lightning effects
- 📊 **Detailed Weather Info**: Temperature, feels like, humidity, wind speed, and pressure
- 🔄 **Fallback Support**: Works with demo data if API key is not available

## Setup Instructions

### 1. Get OpenWeatherMap API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to API Keys section
4. Copy your API key

### 2. Configure API Key

Open `weather.js` and replace `YOUR_API_KEY_HERE` with your actual API key:

```javascript
const WEATHER_API_KEY = 'your-actual-api-key-here';
```

### 3. Run the Website

Simply open `weather.html` in your web browser. The website will:
- Request location permission
- Fetch weather data for your location
- Display weather information with appropriate background

## Usage

1. **Allow Location Access**: When prompted, allow the browser to access your location
2. **View Weather**: The website will automatically display current weather conditions
3. **Toggle Theme**: Click the moon/sun icon in the top-right corner to switch between light and dark modes
4. **Retry**: If weather data fails to load, click the "Retry" button

## Weather Conditions Supported

- Clear
- Clouds
- Rain
- Drizzle
- Thunderstorm
- Snow
- Mist
- Fog
- Haze

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

**Note**: Geolocation requires HTTPS in production. For local development, `file://` protocol works in most browsers.

## Customization

### Changing Colors

Edit the CSS variables in `weather.css`:

```css
:root {
    --card-bg-light: rgba(255, 255, 255, 0.85);
    --card-bg-dark: rgba(30, 30, 30, 0.85);
    /* ... */
}
```

### Adjusting Animations

Modify animation speeds and frequencies in `weather.js`:

- Cloud speed: `animation-duration` in `createClouds()`
- Rain density: Number of drops in `createRain()`
- Snow density: Number of flakes in `createSnow()`

## Troubleshooting

### Location Not Working
- Ensure location permissions are granted
- Check browser settings for location access
- The app will fallback to a default location if geolocation fails

### API Errors
- Verify your API key is correct
- Check your API key usage limits
- The app will use demo data if API fails

### Background Not Changing
- Clear browser cache
- Check browser console for errors
- Ensure JavaScript is enabled

## License

Free to use and modify for personal or commercial projects.

