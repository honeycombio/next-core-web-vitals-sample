import {getCLS, getFID, getLCP, getTTFB} from 'web-vitals';

// ---- Helper functions from dev.to/aniket_chauhan/generate-a-css-selector-path-of-a-dom-element-4aim ----
function generateSelector(context) {
  let index, pathSelector;

  if (context == "null") return;
  // call getIndex function
  index = getIndex(context);

  while (context.tagName) {
    // selector path
    pathSelector = context.localName + (pathSelector ? ">" + pathSelector : "");
    context = context.parentNode;
  }
  // selector path for nth of type
  pathSelector = pathSelector + `:nth-of-type(${index})`;
  return pathSelector;
}

// get index for nth of type element
function getIndex(node) {
  let i = 1;
  let tagName = node.tagName;

  while (node.previousSibling) {
    node = node.previousSibling;
    if (
      node.nodeType === 1 &&
      tagName.toLowerCase() == node.tagName.toLowerCase()
    ) {
      i++;
    }
  }
  return i;
}

//------ end helper functions -----


// Threshold to weed out insignificant Layout Shift events
const CLS_THRESHOLD = .015;
// make it easy to generate a unique id
function generateId() {
  return Math.random().toString(36).substr(2, 20);
};
// this will be populated on init
let metadata = {};
let lastSpanID = null;
let trace_id = null;

// This method is called on initial load and lets us capture all metadata
// about the browser and device that might help us dig into patterns
function captureMetadata() {
  metadata = {
    name: 'web_performance',
    pathname: document.location.pathname, 
    // Pixel dimensions of the visible screen
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    // Browser string
    browser: navigator.userAgent
  }

  if (navigator.userAgentData) {
    // Platform info reported by browser
    metadata.platform =  navigator.userAgentData.platform || null;
    // Browser vendor
    metadata.vendor = navigator.userAgentData.vendor || null;
  }
}

function createRootSpan() {
  trace_id = sessionStorage.getItem('HNY_TRACE');
  captureMetadata();
  // trace id is generated once and used for all session pageviews
  if (trace_id) return true;

  // if trace_id does not exist in session storage, this is the first pageview of the session
  trace_id = generateId();
  lastSpanID = generateId();
  sessionStorage.setItem('HNY_TRACE', trace_id);

  send({
    span_event: 'root',
    trace_id,
    ...metadata
  });
}

// -----------------------------------
// FIRST INPUT DELAY (FID) Observability
// -----------------------------------

// Grab the url of every script on the page and determine if the script
// is loaded asynchronously and deferred
function captureScriptData() {
  const inlineCounter = 0;
  const data = {}
  Array.prototype.forEach.call(document.scripts, (script) =>{
    let filename = `inlineScript${inlineCounter}`
    if (script.src) {
      let path = new URL(script.src);
      filename = path.pathname.substr(path.pathname.lastIndexOf('/')+ 1);
    } else {
      inlineCounter += 1;
    }

    return data[filename] = {
      filename,
      deferred: script.hasAttribute('defer'),
      async: script.hasAttribute('asynnc'),
      url: path ? path.href : 'inline',
    }
  });

  return data;
}

// Get all available performance measures. Next creates before-hydration, hydration, by default.
function getPerformanceMeasures() {
  // this measure is not created by default but the marks are available
  performance.measure('Next.js-render');
  const output = {};
  [...performance.getEntriesByType('measure')].forEach((measure) => {
    output[measure.name] = measure.duration;
  });
  return output;
}

// Handler for TTFB
function reportInitialTiming(metric) {
  send({
    span_event: metric.name,
    ttfb_value: metric.value,
    ttfb_delta: metric.delta,
    ...metadata,
    trace_id
  });
}

// Handler for First Input Delay
function reportScriptTiming(metric) {
  send({
    span_event: metric.name,
    fid_value: metric.value,
    fid_delta: metric.delta,
    trace_id,
    scriptsOnPage: document.scripts.length + 1,
    scripts: captureScriptData(),
    ...getPerformanceMeasures(),
    ...metadata
  });
}

// ----------------------------------------------
// CUMULATIVE LAYOUT SHIFT (CLS) Observability
// ----------------------------------------------

// Loops through all CLS events (there can be dozens) to filter out minor ones
// and then pulls out helpful debugging info for all shifts to pass to Honeycomb
function sendLargeShifts(evt) {
  // Adjust the CLS Threshold for to include more events
  const filtered = evt.entries.filter( shift => shift.value >= CLS_THRESHOLD);

  filtered.forEach((shift) => {
    const base = {
      span_event: shift.entryType,
      cls_shift_value: shift.value,
      trace_id,
      ...metadata
    }

    shift.sources.forEach((source) => {
      const el = source.node;
      let report = {
        ...base,
        // generate unique selector for the el
        source_el: el ? generateSelector(el) : null,
        // generate unique selector for the parent note
        parent_el: el ? generateSelector(el.parentNode) : null,
        // This grabs the classes on the source element's previous sibling
        previous_sibling_el: el ? generateSelector(el.previousSibling) : null,
        // Initial height and width of the element that triggered a layout shift
        startHeight: source.previousRect.height,
        startWidth: source.previousRect.width,
        // End height and width of the element. This gives us the pixel value of layout shift size.
        endHeight: source.currentRect.height,
        endWidth: source.currentRect.width,
      };

      send(report);
    });
  });
}

// handler for Cumulative Layout Shift
function handleCLSEvent(evt) {
  let report = {
    span_event: evt.name,
    cls_delta: evt.delta,
    cls_value: evt.value,
    trace_id,
    ...metadata
  };
  
  // send first so shifts will be children of CLS event
  send(report);
  sendLargeShifts(evt);
}

// ----------------------------------------------
// LARGEST CONTENTFUL PAINT (LCP) Observability
// ----------------------------------------------

// Handler for Largest Contentful Paint
function reportLCP(metric) {
  const report = {
    span_event: metric.name,
    lcp_value: metric.value,
    lcp_delta: metric.delta,
    trace_id,
    ...metadata
  };

  // Google claims only the last element in the array is worth reporting
  const lcp = metric.entries.pop();

  // outputs element type and classlist as a string
  if (lcp.element) {
    report.lcp_elementSelector = `${lcp.element.localName}.${[...lcp.element.classList].join('.')}`;  
  }
  // Computed pixel size of the largest content
  report.lcp_sizeInPixels = lcp.size;
  // url if the largest content is media
  report.lcp_url = lcp.url;
  // time it took the browser to load the element
  report.lcp_loadTimeMS = lcp.loadTime

  send(report);
}

// Send events along to the api endpoint from /pages/api/index.js
async function send(metric) {
  // generate these at the point of send
  metric.span_id = generateId();
  metric.timestamp = Date.now();

  if (metric.span_event !== 'root') {
    // first set the parent id of the current span
    metric.parent_id = lastSpanID;
  }
  // then set the last span id to the current span's id
  lastSpanID = metric.span_id;
  
  await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(metric)
  });
  
}

export default function () {
  createRootSpan();
  getCLS(handleCLSEvent);
  getFID(reportScriptTiming);
  getLCP(reportLCP);
  getTTFB(reportInitialTiming);
  return (
    <></>
  );
};