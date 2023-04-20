/**
 * Download a weather forecast from api.met.no/weatherapi/locationforecast or a similar service.
 * 
 * Ensures that a uses agent is set on each request.
 */
export class Forecaster {
    readonly userAgent: string;
    readonly baseURL: string = "https://api.met.no/weatherapi/locationforecast/2.0/";

    constructor(userAgent: string, baseURL?: string) {
        this.userAgent = userAgent;
        if (baseURL !== undefined)
            this.baseURL = baseURL;
    }

    async getForecast(latitude: number, longitude: number, altitude?: number): Promise<WeatherForecast> {
        let url = this.baseURL + "?lat=" + latitude.toFixed(4) + "&lon=" + longitude.toFixed(4)
        if (altitude != undefined)
            url += "&altitude=" + altitude.toFixed(0);

        console.log(url)

        let response = await fetch(url, {
            headers: {
                "User-Agent": this.userAgent
            }
        })
        return await response.json()
    }
}

export interface WeatherForecast {
    type: string
    geometry: {
        type: "Point",
        coordinates: number[]
    }
    properties: {
        meta: {
            updated_at: string,
            units: {
                air_pressure_at_sea_level: string,
                air_temperature: string,
                cloud_area_fraction: string,
                precipitation_amount: string,
                relative_humidity: string,
                wind_from_direction: string,
                wind_speed: string,
            }
        }
        timeseries: ForecastTimestep[]
    }
}

export interface ForecastTimestep {
    time: string,
    data: {
        instant: {
            details: {
                air_pressure_at_sea_level?: number,
                air_temperature?: number,
                cloud_area_fraction?: number,
                relative_humidity?: number,
                wind_from_direction?: number,
                wind_speed?: number,
            }
        }
        next_1_hours?: {
            details?: {
                precipitation_amount?: number,
            }
            summary?: {
                symbol_code: string | null
            }
        } | null
        next_6_hours?: {
            details?: {
                precipitation_amount?: number,
            }
            summary?: {
                symbol_code: string | undefined
            }
        }
        next_12_hours?: {
            summary?: {
                symbol_code: string
            }
        }
    }
}
