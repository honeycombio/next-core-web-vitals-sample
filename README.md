# Core Web Vitals + Nextjs + Honeycomb = ✨

This is a fork of the Next.js [learn SEO course](https://nextjs.org/learn/seo/introduction-to-seo) to explore capturing [CWV data](https://web.dev/vitals/) in [Honeycomb](https://www.honeycomb.io/).

## How to run the app locally

1. Ensure you have a [Honeycomb account](https://www.honeycomb.io/) - it's free to sign up if you don't.
2. Get an API key from your Environment settings (if you're on Honeycomb Classic, you can find it in your Team Settings).
3. Rename `env.local.lol` to `env.local` for local development, and plug in values:
   a. `HNY_API_KEY` is your API key
   b. Leave `HNY_DATASET=cwv-fun` in place, or give it a different name. Up to you!
4. `yarn dev` to run the app interactively! Or run it however you'd like to run a nextjs site.

### How to make it work in Vercel

Ensure you've got a Honeycomb account and API key.

Simply deploy this app to Vercel like you would any other app. However, you'll need to go into your app's Settings to add Environment Variables:

* `HNY_API_KEY` --> Your [API key](https://docs.honeycomb.io/getting-data-in/api-keys/) for sending data.
* `HNY_DATASET` --> A string with the name of the dataset you want to send data to. If it doesn't exist yet, Honeycomb will automatically create it with the first event.
* `NEXT_PUBLIC_ENDPOINT` --> By default in the app this will be `/api` but you can easily change it here if you use a different endpoint.

There's probably a better way to do this, but uhh, it's a demo app! A little bit of jank is okay.

## What this app is doing

There are two components in this app that you can easily use in any existing Next.js app you have, here's a rundown of what they are doing.

### /pages/api/index.js

This component takes advantage of Next.js' built in [API functionality](https://nextjs.org/docs/api-routes/introduction) to simplify the process of sending events from the browser to Honeycomb. This API route prevents your API key from having to be exposed in the browser and allows the app to use [Honeycomb's LibHoney JS](https://github.com/honeycombio/libhoney-js) tool to send JSON events.

(For this example app, we're using LibHoney, in the future the plan is to remake this app using OpenTelemetry, but for now sending data using OTel requires a [collector](https://opentelemetry.io/docs/collector/) which allows for more extensive telemetry, but increases complexity.)

The API route is available at `[baseurl]/api` and accepts a JSON object which it validates and then passes along to Honeycomb. The validation checks that the `span_event` key on the object has a value in the list `['FCP', 'LCP', 'CLS', 'FID', 'TTFB', 'root']`, if so, the JSON is passed along to Honeycomb.

You'll need to setup [environment variables](https://vercel.com/docs/concepts/projects/environment-variables) for your project with the three variables listed above.

### /components/Observability.js

This component handles all the data collection for Core Web Vitals observability. It relies on Google's [Web Vitals js lib](https://github.com/GoogleChrome/web-vitals) as a dependency. Unlike other solutions, the value of using Honeycomb is you can capture a rich set of data on every page, giving you the ability to dig into _what is causing CWV issues_ rather than just knowing what your scores are.

For each CWV event, this module grabs a ton of relevant data to make debugging and understanding scores easier. Here's an overview of the different events.

#### Root Span

This helper function is necessary to connect all events together in Honeycomb, it generates the Trace ID and other metadata necessary for all events to reference. 

#### TTFB: reportInitialTiming()

This function grabs the Time to First Byte (TTFB), which is how long it took from when the browser sent the HTTP request to when data started downloading. You can query for this in Honeycomb with the query `WHERE span_event = TTFB`.

#### FID: reportScriptTIming()

This function reports out all data related to scripts on page, including the First Input Delay (FID) which is a CWV, as well as the number of scripts on page (helpful for determining if a third party script is causing performance delays), the names, urls, and async/defer attributes of all scripts on page, and all Next.js [performance marks](https://nextjs.org/docs/advanced-features/measuring-performance#custom-metrics). With this data, you can query inside Honeycomb to correlate high FID scores to specific scripts or bundles, and explore the relationship between various performance timings and specific scripts. A fun query to explore this data is `VISUALIZE HEATMAP(Next.js-render) GROUP BY scriptsOnPage`, then clicking the BubbleUp tab to try and explore what's causing long render times.

#### LCP: reportLCP()

Along with reporting the LCP score for a given page load, this function captures the element that triggered LCP (so, the largest content that was painted), and includes the element selector, the total pixel size, the load time in MS, and the url if defined (will be defined for images). This data allows you to see if there are patterns in high LCP scores, and dig into causes such as slow or unoptimized images, or font delays. A `VISUALIZE HEATMAP(lcp_value) GROUP BY lcp_sizeInPixels` Honeycomb query will help you start finding sources of major shifts, use Bubble Up to quickly zoom in on the largest events.

#### CLS: handleCLSEvent()

A given page can have multiple CLS events so this method will respond to all of them and extract as much metadata as possible; each large shift will grap the element that shifted (`sourceEl`), its parent element, the previous sibling element, startHeight, endHeight, startWidth, and endWidth. These are nested as a `shift_i` key, this can be a bit confusing but helps you see the number of shifts that led to a given score on a page. The easiest way to dig into this data is a `VISUALIZE HEATMAP(cls_value)` in Honeycomb, then using BubbleUp to select the largest shifts. Bubble Up will make it easy to see the shift events that are associated with high scores, and you can click into traces to find the elements that are moving content around.