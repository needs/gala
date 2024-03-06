import { AppProps } from 'next/app';
import Layout, { LayoutInfo } from '../components/Layout';
import '../styles/global.css';
import StoreProvider from '../components/StoreProvider';
import { trpc } from '../utils/trpc';
import { UserInfo } from '../lib/auth';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import fr from 'date-fns/locale/fr';
import '../components/TvFrame.css';
import { AuthProvider } from '../components/AuthProvider';
import { GoogleAnalytics } from '@next/third-parties/google'

export type PageProps = {
  competitionUuid?: string;
  layoutInfo?: LayoutInfo;
  userInfo?: UserInfo;
};

type AppPropsWithProoperties = AppProps & {
  pageProps: PageProps;
};

const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

function CustomApp({ Component, pageProps }: AppPropsWithProoperties) {
  const competitionUuid = pageProps.competitionUuid;

  return (
    <AuthProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
        {gaId !== undefined && <GoogleAnalytics gaId={gaId} />}
        {competitionUuid !== undefined ? (
          <StoreProvider competitionUuid={competitionUuid}>
            <Layout
              layoutInfo={pageProps.layoutInfo}
              competitionUuid={competitionUuid}
            >
              <Component {...pageProps} />
            </Layout>
          </StoreProvider>
        ) : (
          <Layout layoutInfo={pageProps.layoutInfo}>
            <Component {...pageProps} />
          </Layout>
        )}
      </LocalizationProvider>
    </AuthProvider>
  );
}

export default trpc.withTRPC(CustomApp);
