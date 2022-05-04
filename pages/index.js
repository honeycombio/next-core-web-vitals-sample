import Head from 'next/head';

import styles from '../styles/Home.module.css';
import FakeAd from '../components/fakeAd';
import Link from 'next/link';
import FID from '../components/fid-test';

export default function Start() {

  return (
    <div>
      <Head>
        <title>Core Web Vitals</title>
        <meta name="description" content="Core web vitals walk through" />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@800"
          rel="stylesheet"
        />
        
      </Head>
      <FID/>
      <main className={styles.container}>
        <h1 className={styles.title}>
          <a href="https://honeycomb.io/">Honeycomb</a> makes web performance improvement easy!
        </h1>

        

        <div>
          <h2 className={styles.secondaryHeading}>Explore more</h2>         
          <ul>
          <li><Link href="/lcp"><a>Longest Contentful Paint example</a></Link></li>
          <li><Link href="/cls"><a>Cumulative Layout Shift example</a></Link></li>
          </ul>
          <p>Some percentage of the time when you load this page, it will hang for a few seconds before becoming interactive. This is an instance of poor <a href="https://web.dev/fid/">First Input Delay (FID).</a> It's super annoying, and because it seems to happen randomly, incredibly hard to determine why it's happening. Luckily, using this app can send performance data to Honeycomb, so determining the problem is much easier.</p>
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
      
    </div>
  );
}