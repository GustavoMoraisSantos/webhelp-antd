import React from "react";
import { ConfigProvider } from "antd";
import type { AppProps } from "next/app";
import "@/styles/globals.css";
import { JobProvider } from "@/context/JobContext";

const App = ({ Component, pageProps }: AppProps) => (
  <JobProvider>
    <ConfigProvider>
      <Component {...pageProps} />
    </ConfigProvider>
  </JobProvider>
);

export default App;
