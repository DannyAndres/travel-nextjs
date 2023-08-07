import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Providers } from "@/redux/providers";
import Layout from "@/components/layouts/layout";
import AuthContext from "@/context/AuthContext";

/*
  this is quite a big import file, normally you would want to import it in every file
  that you'll use it and not on __app.tsx which means it will get imported in every
  single page, but in this scenario I do want to use it in every page to do a type
  of middleware.

  An Option would be separate the middleware into a layout so you can have pages without amplify
*/
import { Amplify } from "aws-amplify";
import awsconfig from "@/aws-exports";

Amplify.configure({ ...awsconfig, ssr: true });

function MyApp({ Component, pageProps }: AppProps): React.ReactNode {
  return (
    <AuthContext>
      <Providers>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Providers>
    </AuthContext>
  );
}

export default MyApp;
