import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import moment from 'moment';
import {ScrollView} from 'react-native';

import weatherIcons from '../../constants/weathericons';
import {ForecastTimestep, WeatherForecast} from '../../utils/locationforecast';
import {Hourly} from './Hourly';
import {NavigationProp, ParamListBase} from '@react-navigation/native';

type CurrentProps = {
  navigation: NavigationProp<ParamListBase>;
  lat: number;
  long: number;
  locationName: string;
};

function getCurrentForecast(
  forecast: WeatherForecast,
): ForecastTimestep | undefined {
  const value = forecast.properties.timeseries.find(f => {
    const now = moment().format('YYYY-MM-DD HH');
    const timeOfForecast = moment(f.time).format('YYYY-MM-DD HH');
    return now === timeOfForecast;
  });

  return value;
}

export const CurrentForecast = ({
  navigation,
  lat,
  long,
  locationName,
}: CurrentProps) => {
  const [current, setCurrent] =
    useState<ForecastTimestep['data']['next_1_hours']>();
  const [instant, setInstant] = useState<ForecastTimestep['data']['instant']>();
  const [timestap, setTimestep] = useState<ForecastTimestep>();
  const [forecasts, setForecasts] = useState<Array<ForecastTimestep>>();

  useEffect(() => {
    fetch(
      `https://api.met.no/weatherapi/locationforecast/2.0?lat=${lat}&lon=${long}`,
      {
        headers: {'User-Agent': 'met_malawi'},
      },
    )
      .then(res => res.json())
      .then((data: WeatherForecast) => {
        const forecast = getCurrentForecast(data);
        setCurrent(forecast?.data.next_1_hours);
        setInstant(forecast?.data.instant);
        setTimestep(forecast);
        setForecasts(data.properties.timeseries);
      })
      .catch(console.error);
  }, [lat, long]);

  return (
    <ScrollView>
      <CurrentView>
        <Timezone>{moment().utcOffset()}</Timezone>
        <MainInfoContainer>
          <WeatherIconView>
            {current?.summary?.symbol_code ? (
              <WeatherIcon
                source={weatherIcons[current.summary.symbol_code]}
                resizeMode={'contain'}
              />
            ) : null}
          </WeatherIconView>
          <CurrentTempView>
            <CurrentDegrees>
              {Math.round(instant?.details.air_temperature || 0)}
              °C
            </CurrentDegrees>
          </CurrentTempView>
          <Description>{moment().format('ddd, DD MMM')}</Description>
        </MainInfoContainer>
        <SecondaryInfoContainer>
          <Row>
            <DetailsBox>
              <Label>Feels Like</Label>
              <Details>
                {Math.round(instant?.details.air_temperature || 0)}
                °C
              </Details>
            </DetailsBox>
            <DetailsBox>
              <Label>Min. Temp</Label>
              <Details>
                {Math.round(current?.details?.air_temperature_min || 0)}
                °C
              </Details>
            </DetailsBox>
            <DetailsBox>
              <Label>Max. Temp</Label>
              <Details>
                {Math.round(current?.details?.air_temperature_max || 0)}
                °C
              </Details>
            </DetailsBox>
          </Row>
          <Row>
            <DetailsBox>
              <Label>Wind</Label>
              <Details>{instant?.details.wind_speed || 0} m/s</Details>
            </DetailsBox>
            <DetailsBox>
              <Label>Direction</Label>
              <Details>{instant?.details?.wind_from_direction || 0} °</Details>
            </DetailsBox>
            <DetailsBox>
              <Label>Humidity</Label>
              <Details>{instant?.details.relative_humidity || 0}%</Details>
            </DetailsBox>
          </Row>
          <DaysView>
            <SummaryButton
              title="7 days >"
              color={'grey'}
              onPress={() =>
                navigation.navigate('7 days forecast', {
                  location: locationName,
                  forecast: forecasts,
                })
              }
            />
          </DaysView>
        </SecondaryInfoContainer>
        <SecondaryInfoContainer>
          <Hourly hour={'1 hr'} forecast={timestap?.data.next_1_hours} />
          <Hourly hour={'6 hrs'} forecast={timestap?.data.next_6_hours} />
          <Hourly hour={'12 hrs'} forecast={timestap?.data.next_12_hours} />
        </SecondaryInfoContainer>
      </CurrentView>
    </ScrollView>
  );
};

const CurrentView = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const CurrentTempView = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const WeatherIconView = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const DaysView = styled.View`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

const MainInfoContainer = styled.View`
  display: flex;
  align-items: center;
`;

const SecondaryInfoContainer = styled.View`
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 10px;
  width: 95%;
  max-width: 478px;
`;

const WeatherIcon = styled.Image`
  width: 100px;
  height: 100px;
  display: flex;
`;

const Timezone = styled.Text`
  color: white;
  display: flex;
  justify-content: center;
  margin-top: 10px;
  font-size: 15px;
`;

const CurrentDegrees = styled.Text`
  color: white;
  display: flex;
  justify-content: center;
  margin-top: 10px;
  font-size: 60px;
`;

const Row = styled.View`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  color: black;
  padding: 10px 30px;
`;

const DetailsBox = styled.View`
  display: flex;
`;

const Label = styled.Text`
  font-size: 18px;
`;

const Details = styled.Text`
  color: black;
  font-size: 15px;
  text-transform: capitalize;
`;

const SummaryButton = styled.Button`
  font-size: 10px;
  align-items: center;
`;

const Description = styled.Text`
  color: white;
  font-size: 15px;
  text-transform: capitalize;
`;
