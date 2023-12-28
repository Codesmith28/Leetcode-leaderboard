// 1. Import `extendTheme`
import {
  ThemeConfig,
  theme as chakraTheme,
  extendTheme,
  useColorModeValue,
} from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

export const theme = extendTheme({
  config,
  styles: {
    global: () => ({
      body: {},
    }),
  },
  fonts: {
    heading: "Ubuntu, sans-serif",
    body: "Ubuntu, sans-serif",
  },
});
