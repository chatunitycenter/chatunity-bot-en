import axios from 'axios';

async function handler(m, { conn, args }) {
  if (!args[0]) return m.reply('❗ Please enter a city name. Usage: .weather [city name]');

  try {
    const city = args.join(' ');
    const apiKey = '2d61a72574c11c4f36173b627f8cb177';
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

    const res = await axios.get(url);
    const data = res.data;

    const weather = `
> 🌍 Weather Info for ${data.name}, ${data.sys.country} 🌍
> 🌡 Temperature: ${data.main.temp}°C
> 🌡 Feels Like: ${data.main.feels_like}°C
> 🌡 Min: ${data.main.temp_min}°C
> 🌡 Max: ${data.main.temp_max}°C
> 💧 Humidity: ${data.main.humidity}%
> ☁ Weather: ${data.weather[0].main}
> 🌫 Description: ${data.weather[0].description}
> 💨 Wind: ${data.wind.speed} m/s
> 🔽 Pressure: ${data.main.pressure} hPa

> © Powered By CRISS AI
    `.trim();

    m.reply(weather);
  } catch (e) {
    console.error(e);
    if (e.response && e.response.status === 404) {
      m.reply('🚫 City not found. Check the spelling and try again.');
    } else {
      m.reply('⚠ An error occurred while fetching weather information. Please try again later.');
    }
  }
}

handler.command = /^(weather|meteo)$/i;
handler.help = ['weather <city>'];
handler.tags = ['other'];
handler.description = 'Get weather information for a location';
handler.react = '🌤';
handler.limit = true;
handler.exp = 5;

export default handler;