import Head from 'next/head';
import dynamic from 'next/dynamic';

import _ from 'lodash';

import styles from '../styles/Home.module.css';
import FakeAd from '../components/fakeAd';
import Link from 'next/link';
import FID from '../components/fid-test';

// WebVitals reporting depends on document, so this needs to be lazy-imported to avoid error
const WebPerformanceObserver = dynamic(
  () => import('../components/Observability'),
  {ssr: false}
);

export default function Start() {

  return (
    <div>
      <Head>
        <title>Core Web Vitals</title>
        <meta name="description" content="Core web vitals walk through" />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter"
          rel="stylesheet"
        />
        
      </Head>
      <FID/>
      <main className={styles.container}>
        <h1 className={styles.title}>
          <a href="https://honeycomb.io/">Honeycomb</a> debugs Core Web Vitals!
        </h1>

        <FakeAd/>

        <div>
          <h2 className={styles.secondaryHeading}>Explore more</h2>         
          <Link href="/lcp"><a>Longest Contentful Paint example</a></Link>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=learn&&utm_campaign=core-web-vitals"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by
          <span className={styles.logo}>
            <img src="/vercel.svg" alt="Vercel Logo" />
          </span>
        </a>
      </footer>
      <WebPerformanceObserver/>
    </div>
  );
}