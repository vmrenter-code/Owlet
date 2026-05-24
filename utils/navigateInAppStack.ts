import { type NavigationProp, type ParamListBase } from '@react-navigation/native';

/**
 * Navigate to a screen in the AppStack from anywhere in the tree.
 * Walks up the navigator hierarchy to find the AppStack (which owns
 * ScreeningInstructions, VideoScreen, etc.) and calls navigate on it.
 */
export function navigateToAppStack(
  navigation: NavigationProp<ParamListBase>,
  screen: string,
  params?: object
): void {
  let nav: NavigationProp<ParamListBase> | undefined = navigation;

  while (nav) {
    const routeNames = nav.getState?.()?.routeNames ?? [];
    if (routeNames.includes('ScreeningInstructions')) {
      (nav as any).navigate(screen, params);
      return;
    }
    nav = nav.getParent();
  }

  // Fallback: try from the given navigator
  (navigation as any).navigate(screen, params);
}
