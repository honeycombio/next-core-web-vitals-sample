import axios from 'axios';
import {getCLS, getFID, getLCP, getTTFB} from 'web-vitals';

const CLS_THRESHOLD = .02;
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

function extractLargeShifts(entries) {
  let shifts = {};
  let i = 0;

  entries.forEach((shift) => {
    // weed out super minor shifts
    if (shift.value >= CLS_THRESHOLD) {
      
      const resp = shifts[`shift_${i+=1}`] = {
        value: shift.value,
      }

      let classLists = [];
      let parents = [];

      shift.sources.forEach((source) => { 
        classLists.concat([...source.node.classList]);
        parents.concat([...source.node.parentElement.classList]);
        resp.initialHeight = source.previousRect.height;
        resp.initialWidth = source.previousRect.width;
        resp.endHeight = source.currentRect.height;
        resp.endWidth = source.currentRect.width;
      });

      resp.sourceElementClassLists = classLists;
      resp.sourceElementParentClassList = parents;
    }
  });

  return shifts;
}

async function handleCLSEvent(evt) {
  let report = {
    name: evt.name,
    delta: evt.delta,
    value: evt.value,
    ...extractLargeShifts(evt.entries),
    ...metadata
  };

  console.log(report);
  await axios.put(`${process.env.NEXT_PUBLIC_ENDPOINT}`, { metric: report })
}

async function reportFID(metric) {
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

  console.log(report);
  await axios.put(`${process.env.NEXT_PUBLIC_ENDPOINT}`, { metric: report })
}

async function reportTTFB(metric) {
  const report = {
    name: metric.name,
    value: metric.value,
    delta: metric.delta,
    ...metadata
  }

  console.log(report);
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