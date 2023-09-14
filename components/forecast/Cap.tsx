import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';

import {CAPClient, LOGGER} from '../../src/lib';
import {CAPAlert} from '../../src/types/cap-feed.type';

type CapProps = {
  lat: number;
  lon: number;
};

export const CAP = ({lat, lon}: CapProps) => {
  const [alerts, setAlerts] = useState<Array<CAPAlert>>([]);

  useEffect(() => {
    CAPClient.getAlerts(lat, lon)
      .then(data => {
        setAlerts(data);
      })
      .catch(LOGGER.error);
  }, [lat, lon]);

  return (
    <SecondaryInfoContainer>
      <Row>
        {alerts.length
          ? alerts.map((alert, idx) => (
              <DetailsBox key={idx}>
                <Details>{alert.alert.info.description}</Details>
              </DetailsBox>
            ))
          : null}
      </Row>
    </SecondaryInfoContainer>
  );
};

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

const Details = styled.Text`
  color: crimson;
  font-size: 15px;
  text-transform: capitalize;
`;
