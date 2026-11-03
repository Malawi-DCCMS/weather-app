
  export enum SCREENS {
    Home = "/",
    NoLocation = "NoLocation",
    Hourly = "/FiveDays/Hourly",
    Search = "Search",
    Feedback = "Feedback",
    AboutUs = "AboutUs",
    AboutTheApp = "AboutTheApp",
    PrivacyPolicy = "PrivacyPolicy",
    WeatherWarning = "/Warnings/WeatherWarning",
    Settings = "/settings",
    OnboardingPlaces = "OnboardingPlaces",
    EditFavourites = "EditFavourites",
    More = "/More",
    Favourites = "/More/Favourites"
  };

  // Bottom tab bar / nav rail order (route names under app/(tabs)).
  export const TAB_ROUTES = ['index', 'FiveDays', 'Warnings', 'More'] as const;
