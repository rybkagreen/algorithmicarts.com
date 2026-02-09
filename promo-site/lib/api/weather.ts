import { WeatherData } from '@/types/demos';

const WEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

export async function fetchWeatherData(city: string = 'London'): Promise<WeatherData> {
  try {
    // Если нет API ключа, возвращаем mock данные
    if (!WEATHER_API_KEY) {
      return getMockWeatherData(city);
    }

    const response = await fetch(
      `${WEATHER_API_URL}?q=${city}&appid=${WEATHER_API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error('Weather API error');
    }

    const data = await response.json();

    return {
      city: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: Math.round(data.wind.speed * 3.6), // m/s to km/h
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Weather fetch error:', error);
    return getMockWeatherData(city);
  }
}

function getMockWeatherData(city: string): WeatherData {
  const mockData: Record<string, Partial<WeatherData>> = {
    London: { temperature: 15, humidity: 75, windSpeed: 20, description: 'Cloudy' },
    Moscow: { temperature: 8, humidity: 65, windSpeed: 15, description: 'Clear' },
    'New York': { temperature: 22, humidity: 60, windSpeed: 25, description: 'Partly cloudy' },
  };

  const base = mockData[city] || mockData.London;

  return {
    city,
    country: 'GB',
    temperature: base.temperature!,
    feelsLike: base.temperature! - 2,
    humidity: base.humidity!,
    pressure: 1013,
    windSpeed: base.windSpeed!,
    description: base.description!,
    icon: '03d',
    timestamp: Date.now(),
  };
}

export const POPULAR_CITIES = [
  'London',
  'Moscow',
  'New York',
  'Tokyo',
  'Paris',
  'Berlin',
  'Dubai',
  'Singapore',
];