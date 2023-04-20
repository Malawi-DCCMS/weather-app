import { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import { Stack, useRouter } from "expo-router";

import { COLORS, icons, images, SIZES } from "../constants";
import {
  Nearbyjobs,
  Popularjobs,
  ScreenHeaderBtn,
  Welcome,
} from "../components";
import { Forecaster, WeatherForecast } from "../utils/locationforecast";
import ForecastSummary from "../components/home/forecast/ForecastSummary";

const Home = () => {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("");

  const [forecast, setForecast] = useState<WeatherForecast | undefined>(undefined);

  const updateForecast = async () => {
    let forecaster = new Forecaster("met_malawi")
    const f = await forecaster.getForecast(-15.7861, 35.0058)
    setForecast(f)
  }

  useEffect(() => {
    updateForecast()
  }, [])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerLeft: () => (
            <ScreenHeaderBtn iconUrl={icons.menu} dimension='60%' />
          ),
          headerRight: () => (
            <ScreenHeaderBtn iconUrl={images.profile} dimension='100%' />
          ),
          headerTitle: "",
        }}
      />

      <ForecastSummary forecast={forecast} size={256} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            flex: 1,
            padding: SIZES.medium,
          }}
        >
          <Welcome
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleClick={() => {
              if (searchTerm) {
                router.push(`/search/${searchTerm}`)
              }
            }}
          />

          <Popularjobs />
          <Nearbyjobs />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
