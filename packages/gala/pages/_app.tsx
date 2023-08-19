import { AppProps } from 'next/app';
import Layout from '../components/Layout';
import '../styles/global.css';
import { Analytics } from '@vercel/analytics/react';
import StoreProvider from '../components/StoreProvider';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <StoreProvider>
      <Layout>
        <Component {...pageProps} />
        <Analytics />
      </Layout>
    </StoreProvider>
  );
}

export default CustomApp;
