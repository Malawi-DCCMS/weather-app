import React from 'react';
import styled from 'styled-components/native';

type SearchProps = {
  city: string;
  setCity: React.Dispatch<React.SetStateAction<string>>;
  fetchLatLongHandler: Function;
};

export const ForecastSearch = ({
  city,
  setCity,
  fetchLatLongHandler,
}: SearchProps) => {
  const handleSubmit = () => {
    fetchLatLongHandler();
  };

  return (
    <Container>
      <SearchCity
        onChangeText={setCity}
        value={city}
        placeholder={'Search by city'}
        onSubmitEditing={handleSubmit}
      />
    </Container>
  );
};

const Container = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 35px;
`;

const SearchCity = styled.TextInput`
  height: 50px;
  margin: 12px;
  background-color: white;
  padding: 15px;
  border-radius: 10px;
  width: 95%;
  max-width: 700px;
`;
