import React from 'react';
import { Text, Image } from 'react-native';

export interface WeatherIconProps {
    symbol_code: string|undefined
    size: number
}

/**
 * An icon, displaying the weather. Consists of cloudiness, precipitation, and thunder.
 * 
 * @param props 
 * @returns 
 */
export function WeatherIcon(props: WeatherIconProps) {
    if (props.symbol_code == undefined)
        return <Text></Text>
    let icon = symbols[props.symbol_code]
    if (icon == undefined)
        return <Text>???</Text>
    return <Image source={icon} style={{width: props.size, height: props.size}} />
}

const symbols = {
    clearsky_day: require("../assets/weather_icon/png/clearsky_day.png"),
    clearsky_night: require("../assets/weather_icon/png/clearsky_night.png"),
    clearsky_polartwilight: require("../assets/weather_icon/png/clearsky_polartwilight.png"),
    cloudy: require("../assets/weather_icon/png/cloudy.png"),
    fair_day: require("../assets/weather_icon/png/fair_day.png"),
    fair_night: require("../assets/weather_icon/png/fair_night.png"),
    fair_polartwilight: require("../assets/weather_icon/png/fair_polartwilight.png"),
    fog: require("../assets/weather_icon/png/fog.png"),
    heavyrainandthunder: require("../assets/weather_icon/png/heavyrainandthunder.png"),
    heavyrain: require("../assets/weather_icon/png/heavyrain.png"),
    heavyrainshowersandthunder_day: require("../assets/weather_icon/png/heavyrainshowersandthunder_day.png"),
    heavyrainshowersandthunder_night: require("../assets/weather_icon/png/heavyrainshowersandthunder_night.png"),
    heavyrainshowersandthunder_polartwilight: require("../assets/weather_icon/png/heavyrainshowersandthunder_polartwilight.png"),
    heavyrainshowers_day: require("../assets/weather_icon/png/heavyrainshowers_day.png"),
    heavyrainshowers_night: require("../assets/weather_icon/png/heavyrainshowers_night.png"),
    heavyrainshowers_polartwilight: require("../assets/weather_icon/png/heavyrainshowers_polartwilight.png"),
    heavysleetandthunder: require("../assets/weather_icon/png/heavysleetandthunder.png"),
    heavysleet: require("../assets/weather_icon/png/heavysleet.png"),
    heavysleetshowersandthunder_day: require("../assets/weather_icon/png/heavysleetshowersandthunder_day.png"),
    heavysleetshowersandthunder_night: require("../assets/weather_icon/png/heavysleetshowersandthunder_night.png"),
    heavysleetshowersandthunder_polartwilight: require("../assets/weather_icon/png/heavysleetshowersandthunder_polartwilight.png"),
    heavysleetshowers_day: require("../assets/weather_icon/png/heavysleetshowers_day.png"),
    heavysleetshowers_night: require("../assets/weather_icon/png/heavysleetshowers_night.png"),
    heavysleetshowers_polartwilight: require("../assets/weather_icon/png/heavysleetshowers_polartwilight.png"),
    heavysnowandthunder: require("../assets/weather_icon/png/heavysnowandthunder.png"),
    heavysnow: require("../assets/weather_icon/png/heavysnow.png"),
    heavysnowshowersandthunder_day: require("../assets/weather_icon/png/heavysnowshowersandthunder_day.png"),
    heavysnowshowersandthunder_night: require("../assets/weather_icon/png/heavysnowshowersandthunder_night.png"),
    heavysnowshowersandthunder_polartwilight: require("../assets/weather_icon/png/heavysnowshowersandthunder_polartwilight.png"),
    heavysnowshowers_day: require("../assets/weather_icon/png/heavysnowshowers_day.png"),
    heavysnowshowers_night: require("../assets/weather_icon/png/heavysnowshowers_night.png"),
    heavysnowshowers_polartwilight: require("../assets/weather_icon/png/heavysnowshowers_polartwilight.png"),
    lightrainandthunder: require("../assets/weather_icon/png/lightrainandthunder.png"),
    lightrain: require("../assets/weather_icon/png/lightrain.png"),
    lightrainshowersandthunder_day: require("../assets/weather_icon/png/lightrainshowersandthunder_day.png"),
    lightrainshowersandthunder_night: require("../assets/weather_icon/png/lightrainshowersandthunder_night.png"),
    lightrainshowersandthunder_polartwilight: require("../assets/weather_icon/png/lightrainshowersandthunder_polartwilight.png"),
    lightrainshowers_day: require("../assets/weather_icon/png/lightrainshowers_day.png"),
    lightrainshowers_night: require("../assets/weather_icon/png/lightrainshowers_night.png"),
    lightrainshowers_polartwilight: require("../assets/weather_icon/png/lightrainshowers_polartwilight.png"),
    lightsleetandthunder: require("../assets/weather_icon/png/lightsleetandthunder.png"),
    lightsleet: require("../assets/weather_icon/png/lightsleet.png"),
    lightsleetshowers_day: require("../assets/weather_icon/png/lightsleetshowers_day.png"),
    lightsleetshowers_night: require("../assets/weather_icon/png/lightsleetshowers_night.png"),
    lightsleetshowers_polartwilight: require("../assets/weather_icon/png/lightsleetshowers_polartwilight.png"),
    lightsnowandthunder: require("../assets/weather_icon/png/lightsnowandthunder.png"),
    lightsnow: require("../assets/weather_icon/png/lightsnow.png"),
    lightsnowshowers_day: require("../assets/weather_icon/png/lightsnowshowers_day.png"),
    lightsnowshowers_night: require("../assets/weather_icon/png/lightsnowshowers_night.png"),
    lightsnowshowers_polartwilight: require("../assets/weather_icon/png/lightsnowshowers_polartwilight.png"),
    lightssleetshowersandthunder_day: require("../assets/weather_icon/png/lightssleetshowersandthunder_day.png"),
    lightssleetshowersandthunder_night: require("../assets/weather_icon/png/lightssleetshowersandthunder_night.png"),
    lightssleetshowersandthunder_polartwilight: require("../assets/weather_icon/png/lightssleetshowersandthunder_polartwilight.png"),
    lightssnowshowersandthunder_day: require("../assets/weather_icon/png/lightssnowshowersandthunder_day.png"),
    lightssnowshowersandthunder_night: require("../assets/weather_icon/png/lightssnowshowersandthunder_night.png"),
    lightssnowshowersandthunder_polartwilight: require("../assets/weather_icon/png/lightssnowshowersandthunder_polartwilight.png"),
    partlycloudy_day: require("../assets/weather_icon/png/partlycloudy_day.png"),
    partlycloudy_night: require("../assets/weather_icon/png/partlycloudy_night.png"),
    partlycloudy_polartwilight: require("../assets/weather_icon/png/partlycloudy_polartwilight.png"),
    rainandthunder: require("../assets/weather_icon/png/rainandthunder.png"),
    rain: require("../assets/weather_icon/png/rain.png"),
    rainshowersandthunder_day: require("../assets/weather_icon/png/rainshowersandthunder_day.png"),
    rainshowersandthunder_night: require("../assets/weather_icon/png/rainshowersandthunder_night.png"),
    rainshowersandthunder_polartwilight: require("../assets/weather_icon/png/rainshowersandthunder_polartwilight.png"),
    rainshowers_day: require("../assets/weather_icon/png/rainshowers_day.png"),
    rainshowers_night: require("../assets/weather_icon/png/rainshowers_night.png"),
    rainshowers_polartwilight: require("../assets/weather_icon/png/rainshowers_polartwilight.png"),
    sleetandthunder: require("../assets/weather_icon/png/sleetandthunder.png"),
    sleet: require("../assets/weather_icon/png/sleet.png"),
    sleetshowersandthunder_day: require("../assets/weather_icon/png/sleetshowersandthunder_day.png"),
    sleetshowersandthunder_night: require("../assets/weather_icon/png/sleetshowersandthunder_night.png"),
    sleetshowersandthunder_polartwilight: require("../assets/weather_icon/png/sleetshowersandthunder_polartwilight.png"),
    sleetshowers_day: require("../assets/weather_icon/png/sleetshowers_day.png"),
    sleetshowers_night: require("../assets/weather_icon/png/sleetshowers_night.png"),
    sleetshowers_polartwilight: require("../assets/weather_icon/png/sleetshowers_polartwilight.png"),
    snowandthunder: require("../assets/weather_icon/png/snowandthunder.png"),
    snow: require("../assets/weather_icon/png/snow.png"),
    snowshowersandthunder_day: require("../assets/weather_icon/png/snowshowersandthunder_day.png"),
    snowshowersandthunder_night: require("../assets/weather_icon/png/snowshowersandthunder_night.png"),
    snowshowersandthunder_polartwilight: require("../assets/weather_icon/png/snowshowersandthunder_polartwilight.png"),
    snowshowers_day: require("../assets/weather_icon/png/snowshowers_day.png"),
    snowshowers_night: require("../assets/weather_icon/png/snowshowers_night.png"),
    snowshowers_polartwilight: require("../assets/weather_icon/png/snowshowers_polartwilight.png")
}
