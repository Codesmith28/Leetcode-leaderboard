// 1. Import `extendTheme`
import { ThemeConfig, extendTheme, useColorModeValue } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const activeLabelStyles = {
  transform: "scale(0.85) translateY(-25px)",
};

const Form = {
  variants: {
    floating: {
      container: {
        _focusWithin: {
          label: {
            ...activeLabelStyles,
          },
        },
        "input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) ~ label":
          {
            ...activeLabelStyles,
          },
        label: {
          top: 0,
          left: 0,
          zIndex: 2,
          position: "absolute",
          pointerEvents: "none",
          mx: 3,
          px: 1,
          my: 2,
          transformOrigin: "left top",
        },
      },
    },
  },
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
  components: {
    Form,
  },
});
