import Axios from 'axios';
import { Forecast } from "./types"

/**
 * Download a weather forecast from api.met.no/weatherapi/locationforecast or a similar service.
 *
 * Ensures that a uses agent is set on each request.
 */
export class Forecaster {
  private readonly userAgent: string = 'DCCMS - Zanyengo v1';
  private readonly basURL: string = 'https://aa057bsnsvkzwdeb6.api.met.no/weatherapi/locationforecast/2.0';

  constructor(userAgent?: string, baseURL?: string) {
    userAgent && (this.userAgent = userAgent);
    baseURL && (this.basURL = baseURL);
  }

  async getForecast(lat: number, lon: number, alt?: number): Promise<Forecast> {
    let url = `${this.basURL}?lat=${lat.toFixed(4)}&lon=${lon.toFixed(4)}`;
    alt && (url = `${url}&altitude=${alt}`);

    const reqConfig = {
      headers: {
        'User-Agent': this.userAgent,
        'Accept-Encoding': 'gzip',
      },
      timeout: 20_000,
    };
    const { data } = await Axios.get<Forecast>(url, reqConfig);
    return data;
  }
}
