import React from 'react';
import styled from 'styled-components/native';
import moment from 'moment';

import weatherIcons from '../../constants/weathericons';
import {ForecastTimestep} from '../../utils/locationforecast';

function maxTemp(forecast: ForecastTimestep | undefined): number | undefined {
  if (!forecast) {
    return;
  }

  const first = forecast.data.next_1_hours?.details?.air_temperature_max;
  const second = forecast.data.next_6_hours?.details?.air_temperature_max;
  const third = forecast.data.next_12_hours?.details?.air_temperature_max;
  if (!first || !second || !third) {
    return undefined;
  }

  return Math.max(first, second, third);
}

function minTemp(forecast: ForecastTimestep | undefined): number | undefined {
  if (!forecast) {
    return;
  }

  const first = forecast.data.next_1_hours?.details?.air_temperature_min;
  const second = forecast.data.next_6_hours?.details?.air_temperature_min;
  const third = forecast.data.next_12_hours?.details?.air_temperature_min;
  if (!first || !second || !third) {
    return undefined;
  }

  return Math.min(first, second, third);
}

function maxPrecipitation(
  forecast: ForecastTimestep | undefined,
): number | undefined {
  if (!forecast) {
    return;
  }

  const first = forecast.data.next_1_hours?.details?.precipitation_amount_max;
  const second = forecast.data.next_6_hours?.details?.precipitation_amount_max;
  const third = forecast.data.next_12_hours?.details?.precipitation_amount_max;
  if (!first || !second || !third) {
    return undefined;
  }

  return Math.max(first, second, third);
}

type DailyProps = {
  day?: string;
  forecast?: ForecastTimestep;
};

export const Daily = (props: DailyProps) => {
  return (
    <DailyContainer>
      <DateContainer>
        <Hour>{moment(props.day).format('ddd')}</Hour>
      </DateContainer>
      <IconTempView>
        {props.forecast?.data.next_6_hours?.summary?.symbol_code ? (
          <WeatherIcon
            source={
              weatherIcons[
                props.forecast?.data.next_6_hours?.summary?.symbol_code
              ]
            }
            resizeMode={'contain'} // cover or contain its upto you view look
          />
        ) : (
          <Degree>N/A</Degree>
        )}
      </IconTempView>
      <IconTempView>
        {props.forecast?.data.next_12_hours?.summary?.symbol_code ? (
          <WeatherIcon
            source={
              weatherIcons[
                props.forecast?.data.next_12_hours?.summary?.symbol_code
              ]
            }
            resizeMode={'contain'} // cover or contain its upto you view look
          />
        ) : (
          <Degree>N/A</Degree>
        )}
      </IconTempView>
      <IconTempView>
        <Temperature>
          {minTemp(props.forecast) || 0}/{maxTemp(props.forecast) || 0}°
        </Temperature>
      </IconTempView>
      <IconTempView>
        <Precipitation>
          {maxPrecipitation(props.forecast) || 0}
          mm
        </Precipitation>
      </IconTempView>
    </DailyContainer>
  );
};

const DailyContainer = styled.View`
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
  tex-align: left;
  flex: 2;
`;

const WeatherIcon = styled.Image`
  width: 40px;
  height: 40px;
`;

const Degree = styled.Text`
  font-size: 12px;
`;

const Temperature = styled.Text`
  font-size: 12px;
  color: red;
`;

const Precipitation = styled.Text`
  font-size: 12px;
  color: #87ceeb;
`;
