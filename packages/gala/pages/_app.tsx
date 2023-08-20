import { AppProps } from 'next/app';
import Layout from '../components/Layout';
import '../styles/global.css';
import { Analytics } from '@vercel/analytics/react';
import StoreProvider from '../components/StoreProvider';
import { trpc } from '../utils/trpc';
import { NextPage } from 'next';

export type NextPageWithProperties<P = {}, IP = P> = NextPage<P, IP> & {
  disableStoreProvider?: boolean
  disableLayout?: boolean
}

type AppPropsWithProoperties = AppProps & {
  Component: NextPageWithProperties
}

function CustomApp({ Component, pageProps }: AppPropsWithProoperties) {
  return (
    <StoreProvider disabled={Component.disableStoreProvider}>
      <Layout disabled={Component.disableLayout}>
        <Component {...pageProps} />
        <Analytics />
      </Layout>
    </StoreProvider>
  );
}

export default trpc.withTRPC(CustomApp);
