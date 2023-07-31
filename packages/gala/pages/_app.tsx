import { AppProps } from 'next/app';
import Layout from '../components/Layout';
import '../styles/global.css';
import { Analytics } from '@vercel/analytics/react';
import { useEffect } from 'react';
import { initStore } from '../lib/store';


function CustomApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("init store");
      return initStore();
    }
  }, []);

  return (
    <Layout>
      <Component {...pageProps} />
      <Analytics />
    </Layout>
  );
}

export default CustomApp;
