import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Providers } from "@/redux/providers";
import Layout from "@/components/layouts/layout";

function MyApp({ Component, pageProps }: AppProps): React.ReactNode {
  return (
    <Providers>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Providers>
  );
}

export default MyApp;
