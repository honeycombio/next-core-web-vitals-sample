import { createRef, useEffect } from 'react';
import FakeAd from '../components/fakeAd';
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
        <h1>Cumulative Layout Shifts</h1>
        <div className={styles.imagePrep} ref={lcp}></div>
        <p><a href="https://web.dev/cls/">Cumulative Layout Shift (CLS)</a> measures how much (if any) content moves around in the viewport after it is visible.</p>
        <FakeAd />
        <p>CLS can be extremely hard to track down because of the nuances involved in determining causes. The value represents the largest shift that happens in a 5 second period over the lifetime of a page, so elements far down a page can be the source of the issue.In this example, the web-vitals.js plugin is used to detect CLS, and then a rich set of data is sent to Honeycomb to help you understand not just the score, but the source.
        </p>
      </main>
    </div>
  )
}