import React from 'react';
import styled from 'styled-components/native';
import {ScrollView, StyleSheet, ImageBackground} from 'react-native';
import moment from 'moment';
import {maxBy} from 'lodash';

import backgroundImage from '../../assets/6.png';
import {ForecastTimestep} from '../../utils/locationforecast';
import {Daily} from './Daily';

type GroupedForecasts = Record<string, Array<ForecastTimestep>>;
function groupForecastsByDay(
  forecasts: Array<ForecastTimestep>,
): GroupedForecasts {
  return forecasts.reduce((acc: GroupedForecasts, val) => {
    const key = moment(val.time).format('YYYY-MM-DD');
    !acc[key] && (acc[key] = []);
    acc[key].push(val);
    return acc;
  }, {});
}

function getLatestForecastForEachDay(
  forecasts: GroupedForecasts,
): Record<string, ForecastTimestep> {
  return Object.entries(forecasts).reduce(
    (acc: Record<string, ForecastTimestep>, [k, v]) => (
      (acc[k] = maxBy(v, 'time') as ForecastTimestep), acc
    ),
    {},
  );
}

const Detailed = (props: Record<string, any>) => {
  const forecasts = props.route.params.forecast as Array<ForecastTimestep>;
  const grouped = groupForecastsByDay(forecasts);
  const recents = getLatestForecastForEachDay(grouped);

  return (
    <Container>
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <ScrollView>
          <CurrentView>
            <Location>{props.route.params.location}</Location>
            <SecondaryInfoContainer>
              {Object.entries(recents)
                .slice(0, 7)
                .map(([day, forecast], idx) => {
                  return <Daily key={idx} day={day} forecast={forecast} />;
                })}
            </SecondaryInfoContainer>
          </CurrentView>
        </ScrollView>
      </ImageBackground>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: dodgerblue;
`;

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  contentContainerFlexGrow: {
    flexGrow: 1,
  },
  contentContainerFlex: {
    flex: 1,
  },
});

const CurrentView = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
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

const Location = styled.Text`
  color: white;
  display: flex;
  justify-content: center;
  margin-top: 10px;
  font-size: 15px;
`;

export default Detailed;
