import { AppProps } from 'next/app';
import Layout from '../components/Layout';
import '../styles/global.css';
import { Analytics } from '@vercel/analytics/react';


function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
      <Analytics />
    </Layout>
  );
}

export default CustomApp;
