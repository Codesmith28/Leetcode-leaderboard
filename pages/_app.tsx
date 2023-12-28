import "@/styles/globals.css";
import { theme } from "@/styles/theme";
import { ChakraProvider } from "@chakra-ui/react";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { GoogleAnalytics } from "nextjs-google-analytics";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <SessionProvider session={session}>
      <ChakraProvider theme={theme}>
        <GoogleAnalytics trackPageViews />
        <Component {...pageProps} />
      </ChakraProvider>
    </SessionProvider>
  );
}
