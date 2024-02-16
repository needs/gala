import { AppProps } from 'next/app';
import Layout, { LayoutInfo } from '../components/Layout';
import '../styles/global.css';
import StoreProvider from '../components/StoreProvider';
import { trpc } from '../utils/trpc';
import { CookiesProvider } from 'react-cookie';
import { UserInfo } from '../lib/auth';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import fr from 'date-fns/locale/fr';
import '../components/TvFrame.css';

export type PageProps = {
  competitionUuid?: string;
  layoutInfo?: LayoutInfo;
  userInfo?: UserInfo;
};

type AppPropsWithProoperties = AppProps & {
  pageProps: PageProps;
};

function CustomApp({ Component, pageProps }: AppPropsWithProoperties) {
  const competitionUuid = pageProps.competitionUuid;

  return (
    <CookiesProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
        {competitionUuid !== undefined ? (
          <StoreProvider competitionUuid={pageProps.competitionUuid}>
            <Layout layoutInfo={pageProps.layoutInfo}>
              <Component {...pageProps} />
            </Layout>
          </StoreProvider>
        ) : (
          <Layout layoutInfo={pageProps.layoutInfo}>
            <Component {...pageProps} />
          </Layout>
        )}
      </LocalizationProvider>
    </CookiesProvider>
  );
}

export default trpc.withTRPC(CustomApp);
