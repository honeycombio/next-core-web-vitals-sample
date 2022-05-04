
import '../styles/globals.css'
import Script from 'next/script';

function MyApp({ Component, pageProps }) {
  return(
  <>
    <Script dangerouslySetInnerHTML={{_html: performance.mark('docStart') }}/>
    <Component {...pageProps} />
  </>

  )}

export default MyApp
