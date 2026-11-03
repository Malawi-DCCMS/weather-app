# Tech Stack & Architecture

This document outlines the technology stack, architectural patterns, and core libraries used in the Climweb Weather App.

## 1. Core Technologies
* **Framework**: React Native (with Expo)
* **Language**: TypeScript

## 2. Navigation Pattern
The application uses **Expo Router** instead of using React Navigation directly. This provides several key advantages for Expo projects:
* **File-based routing**: Automatically maps your file structure to app routes, reducing boilerplate.
* **Better Expo integration**: Built seamlessly into the Expo ecosystem.
* **Easier deep linking**: Simplifies universal links and deep linking configurations across platforms.

## 3. State Management & Data Fetching
We enforce a strict separation between client UI state and server-cached data to ensure high performance and maintainability.

* **Client State**: **Zustand**
  * A minimalist, hook-based library that has gained immense popularity.
  * It requires no provider to wrap your app and offers a simple, intuitive API.
  * Zustand is incredibly lightweight (~2KB) and its fine-grained updates minimize re-renders, making it highly performant for mobile apps.
  * *Use cases*: Theme preference, unit system (Metric/Imperial), language selection, local app settings.
* **Server State & Data Fetching**: **TanStack Query + Axios**
  * **Axios**: Powers the `WeatherApiClient` to make raw HTTP requests to our external REST APIs.
  * **TanStack Query (React Query)**: Manages the server state by orchestrating the Axios requests. It automatically handles caching, retries, refetching, loading states, stale data management, and synchronization.
  * Together, they work seamlessly with our offline storage to serve stale data immediately while fetching fresh data in the background, significantly reducing boilerplate code.

## 4. Storage & Offline-First Strategy
The application employs an **Offline-First Strategy**, ensuring users can view critical weather data seamlessly even without an active network connection.

* **Relational Data Cache**: **Expo SQLite**
  * A robust, local SQLite database used to persistently store complex, structured weather data.
  * *Use cases*: Storing forecast history, querying cached location data, and supporting robust offline viewing of extensive meteorological datasets.
* **Key-Value Storage**: **MMKV** (`react-native-mmkv`)
  * An extremely fast, synchronous key-value storage engine natively written in C++.
  * *Use cases*: High-performance client-side storage, such as user settings, UI preferences, and persisting TanStack Query state or tokens.

## 5. Localization (i18n)
* **Library**: **i18next** (along with `react-i18next`)
  * Handles translations and internationalization seamlessly across the application, plugging easily into our state and UI layers.

## 6. Architectural Pattern: Layered Architecture
The application follows a **Layered Architecture** using the **Repository Pattern** to decouple the UI from data fetching and logic. This ensures that our UI components remain clean, testable, and strictly responsible for presentation.

### Architecture Diagram

```text
┌────────────────────────────────────────────────────────────────────────┐
│                                UI Layer                                │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                          ForecastScreen                          │  │
│  │ ┌───────────────┐      ┌────────────────┐      ┌───────────────┐ │  │
│  │ │ NowcastScreen │      │ HourlyForecast │      │ DailyForecast │ │  │
│  │ │               │      │ Screen         │      │ Screen        │ │  │
│  │ └───────────────┘      └────────────────┘      └───────────────┘ │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  ┌───────────────┐  ┌────────────────┐  ┌───────────────┐ ┌──────────┐ │
│  │FavoritesScreen│  │ SearchLocation │  │ SettingsScreen│ │ Language │ │
│  │               │  │ Screen         │  │               │ │ Switcher │ │
│  └───────────────┘  └────────────────┘  └───────────────┘ └──────────┘ │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │ (uses Custom Hooks)
┌────────────────────────────────────▼───────────────────────────────────┐
│                          Application/Logic Layer                       │
│  ┌───────────────┐        ┌─────────────┐        ┌────────────┐        │
│  │useWeather     │        │useSettings  │        │useLocation │        │
│  │(TanStack Query│        │(Zustand)    │        │(permission)│        │
│  └───────┬───────┘        └──────┬──────┘        └──────┬─────┘        │
└──────────┼───────────────────────┼──────────────────────┼──────────────┘
           │                       │                      │
┌──────────▼───────────────────────▼──────────────────────▼──────────────┐
│                              Domain Layer                              │
│  ┌──────────────────┐               ┌──────────────────────────┐       │
│  │ Entities         │               │ IForecastRepository      │       │
│  │ (Core Models)    │               │ (interface)              │       │
│  └──────────────────┘               └──────────────────────────┘       │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │ (implemented by)
┌────────────────────────────────────▼───────────────────────────────────┐
│                        Data Layer (Offline-First)                      │
│  ┌─────────────────────────┐            ┌───────────────────┐          │
│  │ Remote Data             │            │ Local Data        │          │
│  │ ┌─────────────────────┐ │            │ ┌───────────────┐ │          │
│  │ │ApiForecastRepository│ │            │ │CachedForecast │ │          │
│  │ │ ┌─────────────────┐ │ │            │ │Repository     │ │          │
│  │ │ │WeatherApiClient │ │ │            │ │(SQLite)       │ │          │
│  │ │ │(Axios)          │ │ │            │ └───────────────┘ │          │
│  │ │ └─────────────────┘ │ │            └───────────────────┘          │
│  │ └─────────────────────┘ │                                           │
│  └─────────────────────────┘                                           │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │ (Hydrates & Persists)
┌────────────────────────────────────▼───────────────────────────────────┐
│                              Storage Engine                            │
│  ┌──────────────────┐               ┌──────────────────────┐           │
│  │MMKV              │               │Expo SQLite           │           │
│  │(Settings/Keys)   │               │(Structured Data)     │           │
│  └──────────────────┘               └──────────────────────┘           │
└────────────────────────────────────────────────────────────────────────┘
```

### Layer Responsibilities

| Layer | Technology | Responsibility |
| :--- | :--- | :--- |
| **UI/Presentation** | React Components + i18n | Renders UI, uses translation keys, handles user interactions. |
| **State (Client)** | Zustand | Manages UI state (theme, unit system, language, local preferences). |
| **State (Server)** | TanStack Query + Axios | Axios fetches HTTP data; TanStack Query manages cache, retries, refetching, loading states, and offline syncing. |
| **Application Logic** | Custom Hooks | Orchestrates data fetching, combines stores, prepares data for UI. |
| **Domain Layer** | TypeScript Interfaces | Contains core business models (**Entities**) and defines repository contracts (`IForecastRepository`). |
| **Data Abstraction** | Repository Pattern | Implements repository interfaces. Splits logic into **Remote Data** (`WeatherApiClient` via Axios) and **Local Data** (SQLite) to orchestrate an offline-first experience. |
| **Storage Engine** | MMKV & Expo SQLite | Physical persistence layer. MMKV for simple high-performance keys; SQLite for robust, queryable relational weather data. |
| **Localization** | i18next | Handles translations and internationalization. |
