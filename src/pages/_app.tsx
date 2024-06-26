import type { AppProps } from 'next/app';
import '../../styles/globals.css';
import Layout from '@/components/layout';
import { AuthProvider } from '@/context/authcontext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  )
}

export default MyApp;
