import dynamic from 'next/dynamic';
import '../styles/globals.css'


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
