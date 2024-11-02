import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import Script from "next/script";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className={GeistSans.className}>
      <Script
        async
        src="https://assets.endorsely.com/endorsely.js"
        data-endorsely="a81bb149-ccba-4422-bd60-2a5d051cbfa8"
      ></Script>
      <Component {...pageProps} />
    </div>
  );
};

export default api.withTRPC(MyApp);
