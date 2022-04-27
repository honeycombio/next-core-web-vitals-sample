import axios from 'axios';
import {getCLS, getFID, getLCP, getTTFB} from 'web-vitals';

const sessionID =  '_' + Math.random().toString(36).substr(2, 9);

let metadata = {};

function captureMetadata() {
  metadata = {
    // Pixel dimensions of the visible screen
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    // Browser string
    browser: navigator.userAgent,
    // Platform info reported by browser
    platform: navigator.userAgentData.platform || null ,
    // Browser vendor
    vendor: navigator.userAgentData.vendor || null,
    sessionID
  }
}


async function handleCLSEvent(evt) {
  console.log('cls', evt);
  let report = {
    name: evt.name,
    delta: evt.delta,
    value: evt.value,
    ...metadata
  };
  evt.entries.map((shift, i) => {
    // weed out super minor shifts
    if (shift.value >= .01) {
      let classLists = [];
      let parents = [];
      shift.sources.forEach((source) => { 
        classLists.concat([...source.node.classList])
        parents.concat([...source.node.parentElement.classList])
      });
      
      console.log(classLists, parents);
      report[`shift_${i}`] = {
        value: shift.value,
        previousRect: shift.previousRect,
        currentRect: shift.currentRect,
        classLists,
        parents,
      }
    }
  });

  await axios.put(`${process.env.NEXT_PUBLIC_ENDPOINT}`, { metric: report })
}

async function reportFID(metric) {
  console.log('fid', metric);
  const report = {
    name: metric.name,
    value: metric.value,
    delta: metric.delta,
    ...metadata
  }

  console.log(report);
  await axios.put(`${process.env.NEXT_PUBLIC_ENDPOINT}`, { metric: report })
}

async function reportLCP(metric) {
  console.log('lcp', metric);
  console.log('metadata', metadata);
  const report = {
    name: metric.name,
    value: metric.value,
    delta: metric.delta,
    ...metadata
  };

  if (metric.entries.length > 0 ) {
    let lcp = metric.entries[0];
    report.size = lcp.size;
    report.duration = lcp.duration;
    report.url = lcp.url;

  }

  await axios.put(`${process.env.NEXT_PUBLIC_ENDPOINT}`, { metric: report })
}

async function reportTTFB(metric) {
  const report = {
    name: metric.name,
    value: metric.value,
    delta: metric.delta,
    ...metadata
  }
  await axios.put(`${process.env.NEXT_PUBLIC_ENDPOINT}`, { metric: report })
}


export default function ({children}) {
  captureMetadata();
  getCLS(handleCLSEvent);
  getFID(reportFID);
  getLCP(reportLCP);
  getTTFB(reportTTFB);
  return (
    <>
      {children}
    </>
  );
};