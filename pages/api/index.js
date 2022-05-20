import Libhoney from 'libhoney';

const hny = new Libhoney({
  apiHost: 'https://api-dogfood.honeycomb.io',
  writeKey: process.env.HNY_API_KEY,
  dataset: process.env.HNY_DATASET,
});

console.log(process.env.HNY_DATASET);

function sendEvent(metric) {
  const evnt = hny.newEvent();
  evnt.add(metric);
  evnt.send();
}

export default function handler(req, res) {
  const metric = req.body;
  const allowedList = ['FCP', 'LCP', 'CLS', 'FID', 'TTFB', 'root'];
  console.log(metric);
  try {

    if (allowedList.includes(metric.span_event)) {
      sendEvent(metric);
    }
    res.status(200);
    res.end();  
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({msg: error.message})
    }
  }
}