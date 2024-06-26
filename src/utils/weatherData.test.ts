import { DateTime } from "luxon"
import { Forecast } from "../common"
import { WeatherData } from "./weatherData"

describe('interpret forecast', () => {

    const sampleForecast: Forecast = require("./weatherData.test.json")

    test('get days', () => {
        const f = new WeatherData(sampleForecast)
        const days = f.days()
        expect(days.length).toBe(10)
        expect(days[0].setZone('Africa/Blantyre').toISO()).toBe("2024-01-11T00:00:00.000+02:00")
        expect(days[1].setZone('Africa/Blantyre').toISO()).toBe("2024-01-12T00:00:00.000+02:00")
        expect(days[2].setZone('Africa/Blantyre').toISO()).toBe("2024-01-13T00:00:00.000+02:00")
        expect(days[3].setZone('Africa/Blantyre').toISO()).toBe("2024-01-14T00:00:00.000+02:00")
        expect(days[4].setZone('Africa/Blantyre').toISO()).toBe("2024-01-15T00:00:00.000+02:00")
        expect(days[5].setZone('Africa/Blantyre').toISO()).toBe("2024-01-16T00:00:00.000+02:00")
        expect(days[6].setZone('Africa/Blantyre').toISO()).toBe("2024-01-17T00:00:00.000+02:00")
        expect(days[7].setZone('Africa/Blantyre').toISO()).toBe("2024-01-18T00:00:00.000+02:00")
        expect(days[8].setZone('Africa/Blantyre').toISO()).toBe("2024-01-19T00:00:00.000+02:00")
        expect(days[9].setZone('Africa/Blantyre').toISO()).toBe("2024-01-20T00:00:00.000+02:00")
    })

    test('extract day', () => {
        const f = new WeatherData(sampleForecast)
        const summary = f.atDay(f.days()[1])
        if (!summary)
            fail("could not get daily summary")
        expect(summary.day.toISO()).toBe("2024-01-12T00:00:00.000+02:00")
        expect(summary.minTemperature).toBe(18.7)
        expect(summary.maxTemperature).toBe(26.9)
        expect(summary.weatherSymbol).toBe("rain")
        expect(summary.windSpeed).toBe(4.2 * 3.6) // wind speed has been converted to km/h
        expect(summary.steps.length).toBe(24)

        expect(summary.steps[0].time.toISO()).toBe("2024-01-12T00:00:00.000+02:00")
        expect(summary.steps[9].time.toISO()).toBe("2024-01-12T09:00:00.000+02:00")
    })

    test('extract first day', () => {
        const f = new WeatherData(sampleForecast)
        const summary = f.atDay(DateTime.utc(2024, 1, 11, 13, 0, 0, 0).setZone('Africa/Blantyre'))
        if (!summary)
            fail("could not get daily summary")
        expect(summary.day.toISO()).toBe("2024-01-11T00:00:00.000+02:00")
        expect(summary.steps.length).toBe(11)
        expect(summary.steps[0].time.toISO()).toBe("2024-01-11T13:00:00.000+02:00")
        expect(summary.steps[10].time.toISO()).toBe("2024-01-11T23:00:00.000+02:00")
    })

    test('extract day after a specific time', () => {
        const f = new WeatherData(sampleForecast)
        const summary = f.atDay(DateTime.utc(2024, 1, 11, 13, 0, 0, 0).setZone('Africa/Blantyre'), true)
        if (!summary)
            fail("could not get daily summary")
        expect(summary.day.toISO()).toBe("2024-01-11T00:00:00.000+02:00")
        expect(summary.steps.length).toBe(8)
        expect(summary.steps[0].time.toISO()).toBe("2024-01-11T16:00:00.000+02:00")
        expect(summary.steps[7].time.toISO()).toBe("2024-01-11T23:00:00.000+02:00")
    })
})
