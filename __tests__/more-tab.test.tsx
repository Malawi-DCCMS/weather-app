import React from 'react';
import TestRenderer, { act, ReactTestInstance } from 'react-test-renderer';

import en from '@/lib/localization/translations/english.json';
import { SCREENS, TAB_ROUTES } from '@/lib/layout/constants';

// Kept out of app/ so expo-router doesn't treat it as a route.

const mockPush = jest.fn();
const mockListeners: Record<string, () => void> = {};
const mockNavigation = {
  canGoBack: jest.fn(() => false),
  goBack: jest.fn(),
  addListener: jest.fn((event: string, cb: () => void) => {
    mockListeners[event] = cb;
    return () => {};
  }),
};

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const dict = require('@/lib/localization/translations/english.json') as Record<string, any>;
      if (typeof dict[key] === 'string') return dict[key];
      const nested = key.split('.').reduce<any>((obj, k) => obj?.[k], dict);
      return typeof nested === 'string' ? nested : key;
    },
  }),
}));
jest.mock('expo-router', () => ({

  useRouter: () => ({ push: mockPush, replace: jest.fn(), navigate: jest.fn() }),
  useNavigation: () => mockNavigation,
  useGlobalSearchParams: () => ({}),
}));
// Icons load their font on mount, which needs an asset registry Jest doesn't
// have; report fonts as already loaded instead.
jest.mock('expo-font', () => ({ ...jest.requireActual('expo-font'), isLoaded: () => true }));
jest.mock('react-native-safe-area-context',() => require('react-native-safe-area-context/jest/mock').default);
jest.mock('@/lib/hooks/use-color-scheme', () => ({ useColorScheme: () => 'light' }));
jest.mock('@/lib/hooks/alerts.hook', () => ({ useAlertsQuery: () => ({ data: [] }) }));
jest.mock('@/lib/hooks/use-units', () => ({
  useUnits: () => ({
    temp: (v?: number) => `${v ?? 0}°C`,
    tempSpoken: (v?: number) => `${v ?? 0} degrees Celsius`,
  }),
}));

// eslint-disable-next-line import/first
import AppTabBar from '@/components/AppTabBar';
// eslint-disable-next-line import/first
import MoreConditionsScreen from '@/app/(tabs)/More/index';
// eslint-disable-next-line import/first
import AppBar from '@/components/AppBar';
import FiveHourSummary from '@/components/FiveHourSummary';
import { DateTime } from 'luxon';

const textOf = (node: ReactTestInstance): string =>
  node.children.map(c => (typeof c === 'string' ? c : textOf(c))).join('');

// Entries on the More conditions screen, top to bottom (each is a
// SettingItem's pressable row; AppBar's controls don't set a role).
const entriesOf = (root: ReactTestInstance) =>
  root.findAll(n => typeof n.type !== 'string' && n.props.accessibilityRole === 'button' && !!n.props.onPress, { deep: false });

const render = (element: React.ReactElement) => {
  let renderer!: TestRenderer.ReactTestRenderer;
  act(() => {
    // @types/react-test-renderer bundles an older @types/react whose
    // ReactElement doesn't accept React 19's — the runtime is the same.
    renderer = TestRenderer.create(element as unknown as Parameters<typeof TestRenderer.create>[0]);
  });
  return renderer;
};

// expo-router 58 tab bar props; every tab's descriptor shares one dispatch
// mock so tests can assert on the POP_TO_TOP sent to a nested stack.
const tabBarProps = (state: { routes: { key: string }[] }) => {
  const dispatch = jest.fn();
  const descriptors = Object.fromEntries(state.routes.map(r => [r.key, { navigation: { dispatch } }]));
  return {
    state,
    descriptors,
    emitter: { emit: () => ({ defaultPrevented: false }) },
    navigateToTab: jest.fn(),
    dispatch,
  };
};

describe('bottom tab bar', () => {
  test('tabs read Today, Five Days, Alerts, More in that order', () => {
    const state = { index: 0, routes: TAB_ROUTES.map(name => ({ key: `${name}-key`, name })) };
    const { root } = render(<AppTabBar {...tabBarProps(state)} />);
    const labels = root
      .findAll(n => n.props.accessibilityRole === 'button' && typeof n.type !== 'string')
      .filter((n, i, all) => all.findIndex(m => m.props.accessibilityLabel === n.props.accessibilityLabel) === i)
      .map(n => n.props.accessibilityLabel);

    expect(labels).toEqual(['Today', 'Five Days', 'Alerts', 'More']);
  });

  test('re-tapping the current tab on a sub-page returns to its first screen', () => {
    // Alerts tab focused, its stack showing warning details (index 1).
    const routes = TAB_ROUTES.map(name => ({
      key: `${name}-key`,
      name,
      ...(name === 'Warnings' ? { state: { key: 'warnings-stack', index: 1 } } : {}),
    }));
    const state = { index: TAB_ROUTES.indexOf('Warnings'), routes };
    const props = tabBarProps(state);

    const { root } = render(<AppTabBar {...props} />);
    const alertsTab = root.find(n => typeof n.type !== 'string' && n.props.accessibilityLabel === 'Alerts' && !!n.props.onPress);
    act(() => alertsTab.props.onPress());

    expect(props.dispatch).toHaveBeenCalledWith({ type: 'POP_TO_TOP', target: 'warnings-stack' });
    expect(props.navigateToTab).not.toHaveBeenCalled();
  });
});

describe('More conditions screen', () => {
  beforeEach(() => mockPush.mockClear());

  test('is titled "More conditions"', () => {
    const { root } = render(<MoreConditionsScreen />);
    expect(root.findAll(n => typeof n.type === 'string' && textOf(n) === en['More conditions']).length).toBeGreaterThan(0);
  });

  test('Favourites card is the first entry', () => {
    const { root } = render(<MoreConditionsScreen />);
    const cards = entriesOf(root);

    expect(cards[0].props.testID).toBe('more-favourites');
    expect(textOf(cards[0])).toContain(en['Favourites']);
    expect(textOf(cards[0])).toContain(en.more.favourites.description);
  });

  test('tapping the Favourites card opens the Favourites page', () => {
    const { root } = render(<MoreConditionsScreen />);
    const card = entriesOf(root)[0];

    act(() => card.props.onPress());

    expect(mockPush).toHaveBeenCalledWith(SCREENS.Favourites);
    expect(SCREENS.Favourites).toBe('/More/Favourites');
  });
});

describe('AppBar back arrow', () => {
  beforeEach(() => {
    mockNavigation.canGoBack.mockReset();
    mockNavigation.goBack.mockClear();
  });

  // Regression: a screen re-rendered while covered (Today, on a language
  // change while Settings was open) kept a stale back arrow after the cover
  // was popped; tapping it threw "GO_BACK was not handled by any navigator".
  test('hides once there is nowhere to go back to, and never calls goBack then', () => {
    mockNavigation.canGoBack.mockReturnValue(true);
    const { root } = render(<AppBar location="Today" />);
    const backButtons = () => root.findAll(n => typeof n.type !== 'string' && n.props.accessibilityLabel === 'Go back' && !!n.props.onPress);
    expect(backButtons().length).toBeGreaterThan(0);
    const staleOnPress = backButtons()[0].props.onPress;

    // Settings popped: Today regains focus with no history behind it.
    mockNavigation.canGoBack.mockReturnValue(false);
    act(() => mockListeners.focus());

    expect(backButtons()).toHaveLength(0);
    act(() => staleOnPress());
    expect(backButtons()).toHaveLength(0);
    act(() => staleOnPress());
    expect(mockNavigation.goBack).not.toHaveBeenCalled();
  });

  test('shows back button and invokes custom onBack even when navigation.canGoBack() is false (e.g. Today hourly details)', () => {
    mockNavigation.canGoBack.mockReturnValue(false);
    const customOnBack = jest.fn();
    const { root } = render(<AppBar location="Addis Ababa" onBack={customOnBack} />);
    const backButtons = root.findAll(n => typeof n.type !== 'string' && n.props.accessibilityLabel === 'Go back' && !!n.props.onPress);

    expect(backButtons.length).toBeGreaterThan(0);
    act(() => backButtons[0].props.onPress());
    expect(customOnBack).toHaveBeenCalledTimes(1);
    expect(mockNavigation.goBack).not.toHaveBeenCalled();
  });
});

describe('Hourly details navigation', () => {
  beforeEach(() => mockPush.mockClear());

  test('tapping FiveHourSummary navigates to Hourly with startAtCurrentTime=yes', () => {
    const futureStepTime = DateTime.now().plus({ hours: 2 }).toISO()!;
    const daySummary = {
      day: DateTime.now().toISODate()!,
      steps: [
        {
          time: futureStepTime,
          temperature: 24,
          weatherSymbol: 'clearsky_day',
          precipitation: 0,
          windSpeed: 3,
        },
      ],
    };

    const { root } = render(<FiveHourSummary daySummary={daySummary as any} location="Addis Ababa" />);
    const card = root.find(n => typeof n.type !== 'string' && !!n.props.onPress);

    act(() => card.props.onPress());

    expect(SCREENS.Hourly).toBe('/FiveDays/Hourly');
    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/FiveDays/Hourly',
      params: {
        location: 'Addis Ababa',
        dayString: daySummary.day,
        startAtCurrentTime: 'yes',
        title: en.time.today,
      },
    });
  });

  test('highlights Today tab when viewing Today hourly details and Five Days tab when viewing 24h hourly forecast', () => {
    // Hourly opened from Today (startAtCurrentTime === 'yes'): Today tab should be highlighted
    const todayHourlyState = {
      index: TAB_ROUTES.indexOf('FiveDays'),
      routes: TAB_ROUTES.map(name => ({
        key: `${name}-key`,
        name,
        ...(name === 'FiveDays'
          ? {
              state: {
                key: 'fivedays-stack',
                index: 1,
                routes: [
                  { key: 'index-key', name: 'index' },
                  { key: 'hourly-key', name: 'Hourly', params: { startAtCurrentTime: 'yes' } },
                ],
              },
            }
          : {}),
      })),
    };
    const { root: todayRoot } = render(<AppTabBar {...tabBarProps(todayHourlyState)} />);
    const todayTab = todayRoot.find(n => typeof n.type !== 'string' && n.props.accessibilityLabel === 'Today' && !!n.props.onPress);
    const fiveDaysTabOnToday = todayRoot.find(n => typeof n.type !== 'string' && n.props.accessibilityLabel === 'Five Days' && !!n.props.onPress);
    expect(todayTab.props.accessibilityState).toEqual({ selected: true });
    expect(fiveDaysTabOnToday.props.accessibilityState).toEqual({});

    // Initial mount of FiveDays when opened from Today (state is undefined, params has startAtCurrentTime: 'yes')
    const initialMountTodayHourlyState = {
      index: TAB_ROUTES.indexOf('FiveDays'),
      routes: TAB_ROUTES.map(name => ({
        key: `${name}-key`,
        name,
        ...(name === 'FiveDays'
          ? {
              params: { screen: 'Hourly', params: { startAtCurrentTime: 'yes' } },
            }
          : {}),
      })),
    };
    const { root: initialRoot } = render(<AppTabBar {...tabBarProps(initialMountTodayHourlyState)} />);
    const initialTodayTab = initialRoot.find(n => typeof n.type !== 'string' && n.props.accessibilityLabel === 'Today' && !!n.props.onPress);
    const initialFiveDaysTab = initialRoot.find(n => typeof n.type !== 'string' && n.props.accessibilityLabel === 'Five Days' && !!n.props.onPress);
    expect(initialTodayTab.props.accessibilityState).toEqual({ selected: true });
    expect(initialFiveDaysTab.props.accessibilityState).toEqual({});

    // Hourly opened for 24h full forecast (startAtCurrentTime === 'no'): Five Days tab should be highlighted
    const fiveDaysHourlyState = {
      index: TAB_ROUTES.indexOf('FiveDays'),
      routes: TAB_ROUTES.map(name => ({
        key: `${name}-key`,
        name,
        ...(name === 'FiveDays'
          ? {
              state: {
                key: 'fivedays-stack',
                index: 1,
                routes: [
                  { key: 'index-key', name: 'index' },
                  { key: 'hourly-key', name: 'Hourly', params: { startAtCurrentTime: 'no' } },
                ],
              },
            }
          : {}),
      })),
    };
    const { root: fiveDaysRoot } = render(<AppTabBar {...tabBarProps(fiveDaysHourlyState)} />);
    const todayTabOnFiveDays = fiveDaysRoot.find(n => typeof n.type !== 'string' && n.props.accessibilityLabel === 'Today' && !!n.props.onPress);
    const fiveDaysTab = fiveDaysRoot.find(n => typeof n.type !== 'string' && n.props.accessibilityLabel === 'Five Days' && !!n.props.onPress);
    expect(fiveDaysTab.props.accessibilityState).toEqual({ selected: true });
    expect(todayTabOnFiveDays.props.accessibilityState).toEqual({});
  });
});
