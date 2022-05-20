import dynamic from 'next/dynamic';
import '../styles/globals.css'

export function reportWebVitals(metric) {
  if (metric.label === 'web-vital') {
    console.log('next.js', metric) // The metric object ({ id, name, startTime, value, label }) is logged to the console
  }
}


// WebVitals reporting depends on document, so this needs to be lazy-imported to avoid error
const WebPerformanceObserver = dynamic(
  () => import('../components/Observability'),
  {ssr: false}
);

function MyApp({ Component, pageProps }) {
  return(
    <>
      <Component {...pageProps} />
      <WebPerformanceObserver/>
    </>
  )}

export default MyApp
