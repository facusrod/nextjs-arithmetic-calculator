import type { AppProps } from 'next/app';
import '../../styles/globals.css';
import Layout from '@/components/layout';

function MyApp({ Component, pageProps }: AppProps) {
  const shouldUseLayout = Component.name !== 'Login';
  return shouldUseLayout ? (
    <Layout>
        <Component {...pageProps} />
    </Layout>
  ) : (
      <Component {...pageProps} />
  );
}

export default MyApp;
