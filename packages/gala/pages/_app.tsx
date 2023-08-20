import { AppProps } from 'next/app';
import Layout, { LayoutInfo } from '../components/Layout';
import '../styles/global.css';
import { Analytics } from '@vercel/analytics/react';
import StoreProvider from '../components/StoreProvider';
import { trpc } from '../utils/trpc';
import { NextPage } from 'next';

export type NextPageWithProperties<P = {}, IP = P> = NextPage<P, IP> & {
  disableStoreProvider?: boolean
  layoutInfo?: LayoutInfo
}

type AppPropsWithProoperties = AppProps & {
  Component: NextPageWithProperties
  pageProps: {
    galaUuid?: string
  }
}

function CustomApp({ Component, pageProps }: AppPropsWithProoperties) {
  return (
    <StoreProvider galaUuid={pageProps.galaUuid}>
      <Layout layoutInfo={Component.layoutInfo}>
        <Component {...pageProps} />
        <Analytics />
      </Layout>
    </StoreProvider>
  );
}

export default trpc.withTRPC(CustomApp);
