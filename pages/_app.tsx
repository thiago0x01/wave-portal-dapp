import Head from 'next/head';
import '../src/styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>👋 Acene para o thiago0x01</title>
      </Head>
      <Component {...pageProps} />;
    </>
  );
}

export default MyApp;
