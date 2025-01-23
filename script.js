const API_KEY = 'c64e7badcfe734bc213d6e95f6f10c14'; // OpenWeather API anahtarınızı buraya ekleyin
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

// Hava durumu verilerini çek
async function getWeatherData(city) {
    try {
        // Mevcut hava durumu verilerini çek
        const currentWeatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=tr&appid=${API_KEY}`
        );
        
        
        if (!currentWeatherResponse.ok) {
            const errorData = await currentWeatherResponse.json();
            throw new Error(errorData.message);
        }
        
        const currentWeatherData = await currentWeatherResponse.json();

        
        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&lang=tr&appid=${API_KEY}`
        );
        
        
        if (!forecastResponse.ok) {
            const errorData = await forecastResponse.json();
            throw new Error(errorData.message);
        }
        
        const forecastData = await forecastResponse.json();

        updateWeatherUI(currentWeatherData, forecastData);
    } catch (error) {
        console.error('Hata detayı:', error);
        if (error.message === 'city not found') {
            alert('Şehir bulunamadı. Lütfen geçerli bir şehir adı girin.');
        } else if (error.message === 'Invalid API key') {
            alert('API anahtarı geçersiz. Lütfen doğru API anahtarını kullanın.');
        } else {
            alert('Bir hata oluştu: ' + error.message);
        }
    }
}


function updateWeatherUI(current, forecast) {
   
    document.querySelector('.city').textContent = `${current.name}, ${current.sys.country}`;
    document.querySelector('.temp').textContent = Math.round(current.main.temp);
    document.querySelector('.description').textContent = current.weather[0].description;
    document.getElementById('feels-like').textContent = `${Math.round(current.main.feels_like)}°C`;
    document.getElementById('humidity').textContent = `${current.main.humidity}%`;
    document.getElementById('wind-speed').textContent = `${(current.wind.speed * 3.6).toFixed(1)} km/s`;
    
    
    const iconCode = current.weather[0].icon;
    document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    
    const sunrise = new Date(current.sys.sunrise * 1000);
    const sunset = new Date(current.sys.sunset * 1000);
    document.getElementById('sunrise-time').textContent = sunrise.toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit'
    });
    document.getElementById('sunset-time').textContent = sunset.toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit'
    });

  
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = '';

    const dailyForecasts = forecast.list.filter(item => item.dt_txt.includes('12:00:00'));
    dailyForecasts.forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('tr-TR', { weekday: 'short' });
        
        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        forecastItem.innerHTML = `
            <div class="forecast-day">${dayName}</div>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="hava-durumu">
            <div class="forecast-temp">${Math.round(day.main.temp)}°C</div>
        `;
        forecastContainer.appendChild(forecastItem);
    });
}


searchButton.addEventListener('click', () => {
    const city = searchInput.value.trim();
    if (city) getWeatherData(city);
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = searchInput.value.trim();
        if (city) getWeatherData(city);
    }
});


window.addEventListener('load', () => {
    getWeatherData('Istanbul');
}); 