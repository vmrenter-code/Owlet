import { useNavigation, type NavigationProp, type ParamListBase } from '@react-navigation/native';

/** Navigator that owns AppStack screens (ScreeningInstructions, EKGPlacement, etc.). */
export function useAppStackNavigation(): NavigationProp<ParamListBase> {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  let current: NavigationProp<ParamListBase> | undefined = navigation;
  while (current) {
    const routeNames = current.getState?.()?.routeNames ?? [];
    if (routeNames.includes('ScreeningInstructions')) {
      return current;
    }
    current = current.getParent();
  }

  return navigation;
}
