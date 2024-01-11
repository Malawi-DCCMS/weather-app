import { DateTime } from "luxon";
import { ForecastTimestep, WeatherForecast } from "./locationforecast";

const timeZone = 'Africa/Blantyre'

export class Forecast {
    timeSteps: ForecastStep[]

    constructor(forecastDocument: WeatherForecast) {
        this.timeSteps = []

        for (const timestep of forecastDocument.properties.timeseries) {
            let data = new ForecastStep(timestep)
            this.timeSteps.push(data)
        }
    }

    days(): DateTime[] {
        let ret = [this.timeSteps[0].time.startOf('day')]
        for (const step of this.timeSteps) {
            const t = step.time.startOf('day')
            if (!t.equals(ret[ret.length-1]))
                ret.push(t)
        }
        return ret
    }

    atDay(day: DateTime): DaySummary {
        day = day.setZone(timeZone).startOf('day')

        const relevantSteps = this.timeSteps.
            filter(step => step.time.year == day.year && step.time.month == day.month && step.time.day == day.day)

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

export class ForecastStep {
    time: DateTime

    temperature?: number
    windSpeed?: number
    precipitation_1h?: number
    weatherSymbol_1h?: string
    weatherSymbol_6h?: string
    weatherSymbol_12h?: string

    constructor(timestep: ForecastTimestep) {
        this.time = DateTime.fromISO(timestep.time).setZone(timeZone)
        this.temperature = timestep.data.instant.details.air_temperature
        this.precipitation_1h = timestep.data.next_1_hours?.details?.precipitation_amount
        this.windSpeed = timestep.data.instant.details.wind_speed
        this.weatherSymbol_1h = timestep.data.next_1_hours?.summary?.symbol_code
        this.weatherSymbol_6h = timestep.data.next_6_hours?.summary?.symbol_code
        this.weatherSymbol_12h = timestep.data.next_12_hours?.summary?.symbol_code

        // console.log(this)
    }
}

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
