import '../styles/globals.css'
import axios from 'axios'

export async function reportWebVitals(metric) {
  await axios.put(`${process.env.NEXT_PUBLIC_ENDPOINT}`, { metric: metric })
}

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
