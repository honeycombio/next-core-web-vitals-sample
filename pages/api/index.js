import Libhoney from 'libhoney';

// Hey winston!
// The dataset is in dogfood's Testing environment.
// Set the ky and dataset value from there.
const hny = new Libhoney({
  apiHost: 'https://api-dogfood.honeycomb.io',
  writeKey: process.env.HNY_API_KEY,
  dataset: process.env.HNY_DATASET,
});

// There's no notion of "entries" in nextjs's reporting of CWV.
// Since this code was lifted from honeycomb source, we may wanna investigate.
const sendCLS = (metric) => {
  const payload = {
    name: "cumulative-layout-shift",
    web_vitals_metric: metric.name,

    cls_value: metric.value,
    // cls_delta: metric.value - metric.startTime,
    // largest_layout_shift: Math.max(...metric.entries.map((entry) => entry.value)),
    // total_layout_shifts: metric.entries.length,
  };

  const evnt = hny.newEvent();
  evnt.add(payload);
  evnt.send();
};

const sendFID = (metric) => {
  // const entry = metric.entries[0];

  const payload = {
    name: "first-input-delay",
    web_vitals_metric: metric.name,
    fid_value: metric.value,
    // fid_delta: metric.value - metric.startTime,
    // first_input_name: entry.name,
    // first_input_time: entry.startTime,
  };

  const evnt = hny.newEvent();
  evnt.add(payload);
  evnt.send();
};

const sendLCP = (metric) => {
  const payload = {
    name: "largest-contentful-paint",
    web_vitals_metric: metric.name,
    durationMs: metric.value,
    lcp_value: metric.value,
    // lcp_delta: metric.value - metric.startTime,
  };

  const evnt = hny.newEvent();
  evnt.add(payload);
  evnt.send();
};

const sendTTFB = (metric) => {
  const payload = {
    name: "time-to-first-byte",
    web_vitals_metric: metric.name,
    durationMs: metric.value,
    ttfb_value: metric.value,
    // ttfb_delta: metric.value - metric.startTime,
  };
  
  const evnt = hny.newEvent();
  evnt.add(payload);
  evnt.send();
};

const sendFCP = (metric) => {
  const payload = {
    name: "first-contentful-paint",
    web_vitals_metric: metric.name,
    fcp_value: metric.value,
    // fcp_delta: metric.value - metric.startTime,
  };
  
  const evnt = hny.newEvent();
  evnt.add(payload);
  evnt.send();
};

export default function handler(req, res) {
    const { metric } = req.body;

    switch (metric.name) {
        case 'FCP':
          sendFCP(metric);
          break
        case 'LCP':
          sendLCP(metric);
          break
        case 'CLS':
          sendCLS(metric);
          break
        case 'FID':
          sendFID(metric);
          break
        case 'TTFB':
          sendTTFB(metric);
          break
        default:
          break
    }

    res.status(200);
    res.end();
}