import { DateTime } from "luxon";
import { ForecastTimestep, WeatherForecast } from "./locationforecast";

const timeZone = 'Africa/Blantyre'

/**
 * Prepared forecast data. 
 * The purpose of this class is to move all logic related to selecting forecast data to show into a single location.
 * Presentation code should just call method or read data from here instead of making their own aggregations/selections of data.
 */
export class Forecast {
    timeSteps: ForecastStep[]

    constructor(forecastDocument: WeatherForecast) {
        this.timeSteps = []

        for (const timestep of forecastDocument.properties.timeseries) {
            let data = new ForecastStep(timestep)
            this.timeSteps.push(data)
        }
    }

    /**
     * Get a list of all days we have data for.
     * 
     * @returns A list of dates for which we have data, all with the clock set to 00:00
     */
    days(): DateTime[] {
        let ret = [this.timeSteps[0].time.startOf('day')]
        for (const step of this.timeSteps) {
            const t = step.time.startOf('day')
            if (!t.equals(ret[ret.length-1]))
                ret.push(t)
        }
        return ret
    }

    /**
     * Get a summary of the forecast for a single day.
     * 
     * @param day The day to get a summary for. Only the date part of this argument will be considered.
     * @returns A summary of the forecast for the given day.
     */
    atDay(day: DateTime): DaySummary|undefined {
        day = day.setZone(timeZone).startOf('day')

        const relevantSteps = this.timeSteps.
            filter(step => step.time.year == day.year && step.time.month == day.month && step.time.day == day.day)

        if (relevantSteps.length == 0)
            return undefined

        const temperature = getMinMaxTemperature(relevantSteps);
        const windSpeed = getMaxWindSpeed(relevantSteps);
        const weatherSymbol = getWeatherSymbol(relevantSteps);

        return {
            day: day,
            weatherSymbol: weatherSymbol,
            windSpeed: windSpeed,
            maxTemperature: temperature.max,
            minTemperature: temperature.min,
            steps: this.timeSteps.filter(step => step.time.startOf('day').equals(day))
        }
    }
}

/**
 * Weather data for a single time step.
 * Note that a time step is not neccessarily one hour - it can also be six hours.
 */
export class ForecastStep {
    time: DateTime

    temperature?: number
    windSpeed?: number
    precipitation_1h?: number
    precipitation_6h?: number
    weatherSymbol_1h?: string
    weatherSymbol_6h?: string
    weatherSymbol_12h?: string

    constructor(timestep: ForecastTimestep) {
        this.time = DateTime.fromISO(timestep.time).setZone(timeZone)
        this.temperature = timestep.data.instant.details.air_temperature
        this.precipitation_1h = timestep.data.next_1_hours?.details?.precipitation_amount
        this.precipitation_6h = timestep.data.next_6_hours?.details?.precipitation_amount
        let windSpeed = timestep.data.instant.details.wind_speed 
        if (windSpeed) {
            // Convert to km/h
            windSpeed *= 3.6
        }
        this.windSpeed = windSpeed
        this.weatherSymbol_1h = timestep.data.next_1_hours?.summary?.symbol_code
        this.weatherSymbol_6h = timestep.data.next_6_hours?.summary?.symbol_code
        this.weatherSymbol_12h = timestep.data.next_12_hours?.summary?.symbol_code

        // console.log(this)
    }

    /**
     * Get the precipitation amount for this time step - either for the next hour or for the next six hours.
     */
    precipitation(): number | "??" {
        if (this.precipitation_1h !== undefined)
            return this.precipitation_1h
        if (this.precipitation_6h !== undefined)
            return this.precipitation_6h
        return "??"
    }

    /**
     * Get the weather symbol for this time step - either for the next hour or for the next six hours.
     */
    weatherSymbol(): string {
        if (this.weatherSymbol_1h !== undefined) 
            return this.weatherSymbol_1h
        if (this.weatherSymbol_6h !== undefined) 
            return this.weatherSymbol_6h
        return "??"
    }
}

/**
 * Summary of the weather for a single day
 */
export interface DaySummary {
    day: DateTime
    weatherSymbol?: string
    maxTemperature?: number
    minTemperature?: number
    windSpeed?: number

    steps: ForecastStep[]
}

interface minmax {
    min?: number
    max?: number
}
function getMinMaxTemperature(relevantSteps: ForecastStep[]): minmax {
    let max: number | undefined = -1000;
    let min: number | undefined = 1000;
    for (const step of relevantSteps) {
        const t = step.temperature;
        if (t === undefined) {
            return {}
        }
        if (t > max)
            max = t;
        if (t < min)
            min = t;
    }
    return {
        min: min,
        max: max
    };
}

function getMaxWindSpeed(relevantSteps: ForecastStep[]): number| undefined {
    let max = 0 
    for (const step of relevantSteps) {
        const val = step.windSpeed;
        if (val === undefined) {
            return undefined
        }
        if (val > max)
            max = val;
    }
    return max;
}

function getWeatherSymbol(relevantSteps: ForecastStep[]): string | undefined {
    if (relevantSteps.length == 0)
        return undefined

    if (relevantSteps[0].time.hour <= 6) {
        return dailySummary(relevantSteps)
    }
    if (relevantSteps[0].time.hour <= 12) {
        return relevantSteps.find(v => v.time.hour == 12)?.weatherSymbol_6h
    }
    return relevantSteps[0].weatherSymbol_1h
}

function dailySummary(relevantSteps: ForecastStep[]): string | undefined {
    let ret = relevantSteps.find(v => v.time.hour == 6)?.weatherSymbol_12h
    if (ret === undefined) {
        // TODO: programatically find time step (of 0,6,12,18 utc) closest to 6 local time, and use that instead
        ret = relevantSteps.find(v => v.time.setZone('utc').hour == 6)?.weatherSymbol_12h
    }
    return ret
}
