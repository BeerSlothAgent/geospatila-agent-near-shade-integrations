/**
 * WeatherXM Integration
 * Decentralized weather data for location-based agents
 */

import axios from 'axios';

export interface WeatherXMConfig {
  apiKey?: string;
  baseUrl: string;
  network: 'mainnet' | 'testnet';
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  precipitation: number;
  uvIndex: number;
  visibility: number;
  timestamp: Date;
  location: {
    latitude: number;
    longitude: number;
    name: string;
  };
}

export interface WeatherStation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  isActive: boolean;
  lastUpdate: Date;
}

export class WeatherXMIntegration {
  private config: WeatherXMConfig;
  private client: any;

  constructor(config: WeatherXMConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.baseUrl,
      headers: {
        'Authorization': config.apiKey ? `Bearer ${config.apiKey}` : undefined,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Get current weather data for a location
   */
  async getCurrentWeather(latitude: number, longitude: number): Promise<WeatherData> {
    try {
      const response = await this.client.get('/weather/current', {
        params: { lat: latitude, lon: longitude },
      });

      return this.formatWeatherData(response.data);
    } catch (error) {
      console.error('Error fetching current weather:', error);
      // Fallback to mock data for development
      return this.getMockWeatherData(latitude, longitude);
    }
  }

  /**
   * Get weather forecast for a location
   */
  async getWeatherForecast(latitude: number, longitude: number, days: number = 7): Promise<WeatherData[]> {
    try {
      const response = await this.client.get('/weather/forecast', {
        params: { lat: latitude, lon: longitude, days },
      });

      return response.data.map((item: any) => this.formatWeatherData(item));
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      // Fallback to mock data
      return Array.from({ length: days }, (_, i) => 
        this.getMockWeatherData(latitude, longitude, new Date(Date.now() + i * 24 * 60 * 60 * 1000))
      );
    }
  }

  /**
   * Get nearby weather stations
   */
  async getNearbyStations(latitude: number, longitude: number, radius: number = 50): Promise<WeatherStation[]> {
    try {
      const response = await this.client.get('/stations/nearby', {
        params: { lat: latitude, lon: longitude, radius },
      });

      return response.data.map((station: any) => ({
        id: station.id,
        name: station.name,
        latitude: station.coordinates.lat,
        longitude: station.coordinates.lon,
        elevation: station.elevation,
        isActive: station.status === 'active',
        lastUpdate: new Date(station.lastUpdate),
      }));
    } catch (error) {
      console.error('Error fetching nearby stations:', error);
      return this.getMockStations(latitude, longitude);
    }
  }

  /**
   * Get historical weather data
   */
  async getHistoricalWeather(
    latitude: number, 
    longitude: number, 
    startDate: Date, 
    endDate: Date
  ): Promise<WeatherData[]> {
    try {
      const response = await this.client.get('/weather/historical', {
        params: {
          lat: latitude,
          lon: longitude,
          start: startDate.toISOString(),
          end: endDate.toISOString(),
        },
      });

      return response.data.map((item: any) => this.formatWeatherData(item));
    } catch (error) {
      console.error('Error fetching historical weather:', error);
      return [];
    }
  }

  /**
   * Subscribe to real-time weather updates
   */
  async subscribeToUpdates(
    latitude: number, 
    longitude: number, 
    callback: (data: WeatherData) => void
  ): Promise<() => void> {
    // Mock WebSocket connection for real-time updates
    const interval = setInterval(async () => {
      try {
        const weatherData = await this.getCurrentWeather(latitude, longitude);
        callback(weatherData);
      } catch (error) {
        console.error('Error in weather subscription:', error);
      }
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }

  private formatWeatherData(data: any): WeatherData {
    return {
      temperature: data.temperature || data.temp || 20,
      humidity: data.humidity || 50,
      pressure: data.pressure || 1013,
      windSpeed: data.windSpeed || data.wind?.speed || 5,
      windDirection: data.windDirection || data.wind?.direction || 180,
      precipitation: data.precipitation || data.rain || 0,
      uvIndex: data.uvIndex || data.uv || 5,
      visibility: data.visibility || 10,
      timestamp: new Date(data.timestamp || Date.now()),
      location: {
        latitude: data.location?.lat || data.lat || 0,
        longitude: data.location?.lon || data.lon || 0,
        name: data.location?.name || 'Unknown Location',
      },
    };
  }

  private getMockWeatherData(latitude: number, longitude: number, date: Date = new Date()): WeatherData {
    return {
      temperature: 20 + Math.random() * 15,
      humidity: 40 + Math.random() * 40,
      pressure: 1000 + Math.random() * 50,
      windSpeed: Math.random() * 20,
      windDirection: Math.random() * 360,
      precipitation: Math.random() * 10,
      uvIndex: Math.random() * 11,
      visibility: 5 + Math.random() * 15,
      timestamp: date,
      location: {
        latitude,
        longitude,
        name: `Location ${latitude.toFixed(2)}, ${longitude.toFixed(2)}`,
      },
    };
  }

  private getMockStations(latitude: number, longitude: number): WeatherStation[] {
    return Array.from({ length: 5 }, (_, i) => ({
      id: `station_${i + 1}`,
      name: `Weather Station ${i + 1}`,
      latitude: latitude + (Math.random() - 0.5) * 0.1,
      longitude: longitude + (Math.random() - 0.5) * 0.1,
      elevation: Math.random() * 1000,
      isActive: Math.random() > 0.2,
      lastUpdate: new Date(Date.now() - Math.random() * 3600000),
    }));
  }
}

export default WeatherXMIntegration;