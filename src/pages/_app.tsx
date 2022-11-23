import type { AppProps } from "next/app";
import { globalStyles } from "../styles/globalStyles";
import { ThemeProvider } from "next-themes";
import { darkTheme } from "@escola-ex/react";

export default function App({ Component, pageProps }: AppProps) {
  globalStyles();
  return (
    <ThemeProvider
      attribute="class"
      value={{ light: "light-theme", dark: darkTheme.className }}
      defaultTheme="system"
    >
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
