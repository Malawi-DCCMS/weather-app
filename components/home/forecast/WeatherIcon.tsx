import React from 'react';
import { Text, Image } from 'react-native';
import { weatherIcons } from '../../../constants';

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

    const icon = weatherIcons[props.symbol_code]

    if (icon == undefined)
        return <Text>???</Text>
    return <Image source={icon} style={{width: props.size, height: props.size}} />
}

