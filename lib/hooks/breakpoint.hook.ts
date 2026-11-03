import { useWindowDimensions } from 'react-native';

// Matches the Zanyengo redesign's responsive viewport guide:
// <360 Small (entry-level phones), 360-399 Medium (most common in-market),
// 400-599 Large (reference density), >=600 XL (tablets & landscape).
export type Breakpoint = 'small' | 'medium' | 'large' | 'xl';

export function breakpointFor(width: number): Breakpoint {
  if (width < 360) return 'small';
  if (width < 400) return 'medium';
  if (width < 600) return 'large';
  return 'xl';
}

export function useBreakpoint(): Breakpoint {
  const { width } = useWindowDimensions();
  return breakpointFor(width);
}
