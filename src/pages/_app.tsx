import React from "react";
import { ConfigProvider } from "antd";
import type { AppProps } from "next/app";
import "@/styles/globals.css";
import { JobProvider } from "@/context/JobContext";
import pt_BR from "antd/locale/pt_BR";
import { SessionProvider } from "next-auth/react";

const App = ({ Component, pageProps }: AppProps) => (
  <SessionProvider session={pageProps.session}>
    <JobProvider>
      <ConfigProvider locale={pt_BR}>
        <Component {...pageProps} />
      </ConfigProvider>
    </JobProvider>
  </SessionProvider>
);

export default App;
