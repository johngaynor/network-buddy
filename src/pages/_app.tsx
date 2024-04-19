import { type AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import Layout from "~/components/layout";

import { api } from "~/utils/api";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <Layout>
      <ClerkProvider {...pageProps}>
        <Toaster />
        <Component {...pageProps} />
      </ClerkProvider>
    </Layout>
  );
};

export default api.withTRPC(MyApp);
