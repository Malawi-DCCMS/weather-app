import Axios, { AxiosError, AxiosRequestConfig } from 'axios';
import {
  ConsecutiveBreaker,
  handleAll,
  circuitBreaker,
  CircuitBreakerPolicy,
  CircuitState,
} from 'cockatiel';

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
  private config: AxiosRequestConfig;
  private breakerPolicy: CircuitBreakerPolicy;

  constructor(userAgent?: string, baseURL?: string) {
    userAgent && (this.userAgent = userAgent);
    baseURL && (this.apiUrl = baseURL);
    this.config = {
      headers: {
        'User-Agent': this.userAgent,
        'Accept-Encoding': 'gzip',
      },
      timeout: 5_000,
    };

    // Stop calling the executed function for 15 seconds if it fails 3 times in a row
    this.breakerPolicy = circuitBreaker(handleAll, {
      halfOpenAfter: 15_000,
      breaker: new ConsecutiveBreaker(3),
    });
    this.setBreakerLogging();
  }

  private setBreakerLogging(): void {
    this.breakerPolicy.onBreak(() => {
      console.warn('💥 Breaker tripped after consecutive failures');
    });

    this.breakerPolicy.onReset(() => {
      console.log('✅ Breaker reset — primary API re-enabled');
    });

    this.breakerPolicy.onStateChange((state) => {
      console.info(`⚡ Breaker state changed to: ${state}`);
    });
  }

  private buildUrl(base: string, lat: number, lon: number, alt?: number): string {
    let url = `${base}?lat=${lat.toFixed(4)}&lon=${lon.toFixed(4)}`;
    if (alt !== undefined) url += `&altitude=${alt}`;
    return url;
  }

  async getForecast(lat: number, lon: number, alt?: number): Promise<Forecast> {
    try {
      console.log(`Quering primary API for forecast over ${lat},${lon} with breaker in state ${this.breakerPolicy.state}...`);
      const url = this.buildUrl(this.apiUrl, lat, lon, alt);

      const { data } = await this.breakerPolicy.execute(() => Axios.get<Forecast>(url, this.config));
      console.log('✅ Successfully got data from primary API.');
      return data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.warn('⚠️ Error from primary API:', axiosError.message);

      if (this.breakerPolicy.state === CircuitState.Open) {
        console.warn('🚨 Breaker is OPEN. Using fallback API.');
        const fallback = this.buildUrl(this.fallbackApiUrl, lat, lon, alt);
        const { data } = await Axios.get<Forecast>(fallback, this.config);
        return data;
      }

      throw axiosError;
    }
  }
}
