import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { darkTheme, globalStyles, fontsImport } from "@ace-ex/react";

export default function App({ Component, pageProps }: AppProps) {
  fontsImport();
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
