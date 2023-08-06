import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Providers } from "@/redux/providers";

function MyApp({ Component, pageProps }: AppProps): React.ReactNode {
  return (
    <Providers>
      <Component {...pageProps} />
    </Providers>
  );
}

export default MyApp;
