import { AppProps } from 'next/app';
import Layout, { LayoutInfo } from '../components/Layout';
import '../styles/global.css';
import { Analytics } from '@vercel/analytics/react';
import StoreProvider from '../components/StoreProvider';
import { trpc } from '../utils/trpc';
import { CookiesProvider } from 'react-cookie';
import { UserInfo } from '../lib/auth';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import fr from 'date-fns/locale/fr';
import '../components/TvFrame.css';

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
    <CookiesProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
        <StoreProvider galaUuid={pageProps.galaUuid}>
          <Layout layoutInfo={pageProps.layoutInfo}>
            <Component {...pageProps} />
            <Analytics />
          </Layout>
        </StoreProvider>
      </LocalizationProvider>
    </CookiesProvider>
  );
}

export default trpc.withTRPC(CustomApp);
