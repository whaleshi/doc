import "@/styles/globals.css";
import type { AppProps } from "next/app";
import type { ReactElement } from 'react';
import Head from 'next/head';
import "@/i18n"
import { useEffect, useState } from 'react';
import QueryProvider from '@/providers/queryProvider'
import PrivyProviders from '@/providers/privyProvider'
import { BalanceProvider } from '@/providers/balanceProvider'
import { EchoProvider } from '@/providers/EchoProvider';

type NextPageWithLayout = AppProps['Component'] & {
  getLayout?: (page: ReactElement) => ReactElement;
};
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  useEffect(() => {

  }, [])
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <>
      <Head>
        <title>makememenow</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
      {/* <PrivyProviders> */}
      <QueryProvider>
        <BalanceProvider>
          <EchoProvider>
            {getLayout(<Component {...pageProps} />)}
          </EchoProvider>
        </BalanceProvider>
      </QueryProvider>
      {/* </PrivyProviders> */}
    </>
  );
}


export default App;