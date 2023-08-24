import { AppProps } from 'next/app';
import Layout, { LayoutInfo } from '../components/Layout';
import '../styles/global.css';
import { Analytics } from '@vercel/analytics/react';
import StoreProvider from '../components/StoreProvider';
import { trpc } from '../utils/trpc';
import { CookiesProvider } from 'next-client-cookies';
import { UserInfo } from '../lib/auth';
import { cookies } from 'next/dist/client/components/headers';

export type PageProps = {
  galaUuid?: string;
  layoutInfo?: LayoutInfo;
  userInfo?: UserInfo;
};

type AppPropsWithProoperties = AppProps & {
  pageProps: PageProps;
};

function CustomApp({ Component, pageProps }: AppPropsWithProoperties) {
  return (
    <CookiesProvider value={cookies().getAll()}>
      <StoreProvider galaUuid={pageProps.galaUuid}>
        <Layout layoutInfo={pageProps.layoutInfo}>
          <Component {...pageProps} />
          <Analytics />
        </Layout>
      </StoreProvider>
    </CookiesProvider>
  );
}

export default trpc.withTRPC(CustomApp);
