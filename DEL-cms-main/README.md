<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/4a6c9b5c-3f30-4e3e-b9b2-18764df8f04d

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Authentification CMS

Le CMS utilise uniquement le login admin interne DEL-api avec `ADMIN_EMAIL` / `ADMIN_PASSWORD` côté API. Il n’utilise pas Clerk.
