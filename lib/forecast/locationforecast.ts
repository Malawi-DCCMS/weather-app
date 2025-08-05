import Axios from 'axios';
import { Forecast } from "./types"

/**
 * Download a weather forecast from api.met.no/weatherapi/locationforecast or a similar service.
 *
 * Ensures that a uses agent is set on each request.
 */
export class Forecaster {
  private readonly userAgent: string = 'DCCMS - Zanyengo v1';
  private readonly apiUrl: string = 'https://api.metmalawi.gov.mw';
  private readonly fallbackApiUrl: string = 'https://aa057bsnsvkzwdeb6.api.met.no/weatherapi/locationforecast/2.0';

  constructor(userAgent?: string, baseURL?: string) {
    userAgent && (this.userAgent = userAgent);
    baseURL && (this.apiUrl = baseURL);
  }

  async getForecast(lat: number, lon: number, alt?: number): Promise<Forecast> {
    const reqConfig = {
      headers: {
        'User-Agent': this.userAgent,
        'Accept-Encoding': 'gzip',
      },
      timeout: 5_000,
    };

    try {
      console.log(`Quering Zanyengo API for forecast over ${lat},${lon}...`);
      let url = `${this.apiUrl}?lat=${lat.toFixed(4)}&lon=${lon.toFixed(4)}`;
      alt && (url = `${url}&altitude=${alt}`);
      return (await Axios.get<Forecast>(url, reqConfig)).data;
    } catch(error) {
      let fallback = `${this.fallbackApiUrl}?lat=${lat.toFixed(4)}&lon=${lon.toFixed(4)}`;
      alt && (fallback = `${fallback}&altitude=${alt}`);
      console.error('Querying Zanyengo API failed, falling back to Yr...');
      return (await Axios.get<Forecast>(fallback, reqConfig)).data;
    }
  }
}
