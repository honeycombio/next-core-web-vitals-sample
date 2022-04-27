import Libhoney from 'libhoney';

// Hey winston!
// The dataset is in dogfood's Testing environment.
// Set the ky and dataset value from there.
const hny = new Libhoney({
  apiHost: 'https://api-dogfood.honeycomb.io',
  writeKey: process.env.HNY_API_KEY,
  dataset: process.env.HNY_DATASET,
});

function sendEvent(metric) {
  const evnt = hny.newEvent();
  evnt.add(metric);
  evnt.send();
}


export default function handler(req, res) {
    const { metric } = req.body;
    const allowedList = ['FCP', 'LCP', 'CLS', 'FID', 'TTFB'];

    if (allowedList.includes(metric.name)) {
      sendEvent(metric);
    }

    res.status(200);
    res.end();
}