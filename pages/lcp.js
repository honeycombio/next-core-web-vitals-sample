import { createRef, useEffect } from 'react';
import styles from '../styles/Home.module.css';

export default function LCP() {
  const lcp = createRef();

  useEffect(() => {
    setTimeout(() => {
      lcp.current.classList.add(styles.imageLoaded);
    }, 300)
  })

  return(
    <div>
      <main className={styles.container}>
        <h1>Longest Contentful Paint</h1>
        <div className={styles.imagePrep} ref={lcp}></div>
        <p>LCP is the <a href="https://web.dev/lcp/">Largest Contentful Paint</a>, aka the point when the largest visible piece of content shows up on the page. Google defines good LCP as "showing up within 2.5s."</p>

        <p>For sites with lots of different types of content pages, determining the cause of poor LCP scores can be an exercise in Frustration. In this app,
          the Web-Vitals.js reporting library has been used to instrument high-cardinality Honeycomb events, so that you can quickly find pages
          with poor LCP scores and see what elements or images are the source of the problem.
        </p>

      </main>
    </div>
  )
}