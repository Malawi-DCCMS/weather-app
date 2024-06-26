import moment from "moment";
import { getForecastSymbolAtTime, getWeatherIconAtDay } from "./forecast.utils";
import { ForecastTimestep } from '../common';


describe("select correct weather symbol for today's forecast", () => {
    const forecast = sampleForecast()

    test('early night', () => {
        const symbol = getForecastSymbolAtTime(moment.utc('2023-12-29T02:00:00'), forecast)
        expect(symbol).toBe('12h@4')
    })

    test('early day', () => {
        const symbol = getForecastSymbolAtTime(moment.utc('2023-12-29T06:00:00'), forecast)
        expect(symbol).toBe('6h@10')
    })

    test('late day', () => {
        const symbol = getForecastSymbolAtTime(moment.utc('2023-12-29T17:00:00'), forecast)
        expect(symbol).toBe('1h@17')
    })

    test('midnight', () => {
        const symbol = getForecastSymbolAtTime(moment.utc('2023-12-29T00:00:00'), forecast)
        expect(symbol).toBe('12h@4')
    })
})

describe("select correct weather symbol for a single day", () => {
    let forecast = sampleForecast()
    test('normal case', () => {
        expect(getWeatherIconAtDay(forecast)).toBe('12h@6')
    })
    test('missing 12h forecast', () => {
        forecast[6].data.next_12_hours = undefined
        expect(getWeatherIconAtDay(forecast)).toBe('6h@6')
    })
    test('missing 12h and 6h forecast', () => {
        forecast[6].data.next_6_hours = undefined
        expect(getWeatherIconAtDay(forecast)).toBe('6h@12')
    })
    test('missing all 12h and 6h forecast', () => {
        forecast[12].data.next_6_hours = undefined
        expect(getWeatherIconAtDay(forecast)).toBe('1h@12')
    })
    test('missing all relevant symbols', () => {
        forecast[12].data.next_1_hours = undefined
        expect(getWeatherIconAtDay(forecast)).toBeUndefined()
    })

})

/**
 * Creates a sample forecast for testing. 
 * Each timestep has a symbol code for each time range, with format 6h@3, meaning next_6_hours at 03:00.
 * 
 * @returns 
 */
function sampleForecast(): Array<ForecastTimestep> {
    let ret: Array<ForecastTimestep> = []

    for (let i = 0; i < 24; i++) {
        const doc = {
            time: `2023-12-29T${('00' + i).slice(-2)}:00:00Z`,
            data: {
                instant: {
                    details: {}
                },
                next_1_hours: {
                    summary: {
                        symbol_code: `1h@${i}`
                    }
                },
                next_6_hours: {
                    summary: {
                        symbol_code: `6h@${i}`
                    }
                },
                next_12_hours: {
                    summary: {
                        symbol_code: `12h@${i}`
                    }
                }
            }
        }
        ret.push(doc)
    }

    return ret
}
