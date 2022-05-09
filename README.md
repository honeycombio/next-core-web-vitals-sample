# Core Web Vitals + Nextjs + Honeycomb = ✨

This is a fork of the Next.js [learn SEO course](https://nextjs.org/learn/seo/introduction-to-seo) to explore capturing [CWV data](https://web.dev/vitals/) in [Honeycomb](https://www.honeycomb.io/).

## How to run the app locally

1. Ensure you have a [Honeycomb account](https://www.honeycomb.io/) - it's free to sign up if you don't.
2. Get an API key from your Environment settings (if you're on Honeycomb Classic, you can find it in your Team Settings).
3. Rename `env.local.lol` to `env.local` for local development, and plug in values:
   a. `HNY_API_KEY` is your API key
   b. Leave `HNY_DATASET=cwv-fun` in place, or give it a different name. Up to you!
4. `yarn dev` to run the app interactively! Or run it however you'd like to run a nextjs site.

## How to make it work in Vercel

Ensure you've got a Honeycomb account and API key.

Simply deploy this app to Vercel like you would any other app. However, you'll need to go into your app's Settings to add Environment Variables:

* `HNY_API_KEY` --> your API key
* `HNY_DATASET` --> same dataset as with local development, or not, your choice
* `NEXT_PUBLIC_ENDPOINT` --> Have this point to the _live_ URL of your site, not `localhost:3000`

There's probably a better way to do this, but uhh, it's a demo app! A little bit of jank is okay.
