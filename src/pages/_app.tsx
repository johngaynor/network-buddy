import { type AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import Layout from "~/components/layout";

import { api } from "~/utils/api";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <Layout>
        <Toaster />
        <Component {...pageProps} />
      </Layout>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
