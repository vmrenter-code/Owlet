// components/GlobalStyle.ts
import { Text } from "react-native";

export function applyGlobalFont() {
  (Text as any).defaultProps = (Text as any).defaultProps || {};
  (Text as any).defaultProps.style = [
    (Text as any).defaultProps.style,
    { fontFamily: "Roboto" },
  ];
}