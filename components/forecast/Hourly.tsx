import React from 'react';
import styled from 'styled-components/native';

import weatherIcons from '../../constants/weathericons';

import {TimestepForecast} from '../../utils/locationforecast';

type HourlyProps = {
  hour?: string;
  forecast?: TimestepForecast;
};

export const Hourly = (props: HourlyProps) => {
  return (
    <HourlyContainer>
      <DateContainer>
        <Hour>{props.hour}</Hour>
      </DateContainer>
      <IconTempView>
        {props.forecast?.summary?.symbol_code ? (
          <WeatherIcon
            source={weatherIcons[props.forecast?.summary?.symbol_code]}
            resizeMode={'contain'} // cover or contain its upto you view look
          />
        ) : null}
      </IconTempView>
      <IconTempView>
        <Temperature>
          {Math.round(props.forecast?.details?.air_temperature_min || 0)}/
          {Math.round(props.forecast?.details?.air_temperature_max || 0)}°
        </Temperature>
      </IconTempView>
      <IconTempView>
        <Precipitation>
          {Math.round(props.forecast?.details?.precipitation_amount_min || 0)}mm
        </Precipitation>
      </IconTempView>
      <IconTempView>
        <Precipitation>
          {Math.round(props.forecast?.details?.precipitation_amount_max || 0)}mm
        </Precipitation>
      </IconTempView>
    </HourlyContainer>
  );
};

const HourlyContainer = styled.View`
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 10px;
  margin: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 95%;
  max-width: 478px;
`;

const DateContainer = styled.View`
  text-align: right;
  padding: 10px;
  flex: 1;
`;

const Hour = styled.Text`
  font-size: 12px;
  text-align: center;
  margin: 3px;
`;

const IconTempView = styled.View`
  text-align: center;
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: left;
  flex: 2;
`;

const WeatherIcon = styled.Image`
  width: 40px;
  height: 40px;
`;

const Temperature = styled.Text`
  font-size: 12px;
  color: red;
`;

const Precipitation = styled.Text`
  font-size: 12px;
  color: #87ceeb;
`;
