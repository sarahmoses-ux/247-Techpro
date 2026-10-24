# 247TECHPRO website

React + Vite website for the parent technology brand. Solar is one of eight services, with its detailed content retained at `/services/solar-inverter`.

## Run locally

```sh
npm install
npm run dev -- --host 127.0.0.1 --port 5174
```

The development preview uses http://127.0.0.1:5174. Port 5173 belongs to a separate project in this workspace environment.

```sh
npm run build
npm run test:e2e
```

The build creates 17 HTML entry points with page-specific metadata. Configure `VITE_SITE_URL` with the official production origin before building to populate canonical URLs and the sitemap. The official domain has not been supplied. `public/_redirects` supports SPA fallback on compatible hosts; configure an equivalent fallback on other hosts.

## Structure

- `src/data/services.js`: eight services, four categories, detailed page content and dynamic question schemas.
- `src/sections/RequestSolution.jsx`: three-step service selection, requirements, contact and review experience.
- `src/pages/ServicePage.jsx`: dedicated service pages; preserves the detailed solar offerings and financing disclaimer.
- `src/sections/TechnologyContent.jsx`: parent-brand homepage sections.
- `src/components/TechNavbar.jsx`: grouped services menu and mobile navigation.
- `src/sections/HeroVideo.jsx`: muted local video with pause/play, reduced-motion, save-data and error fallbacks.
- `src/utils/leads.js`: form validation, API adapter, email handoff and downloadable request.
- `src/technology.css`: responsive technology-brand styling.

Computer requests use the EasyFix-style click-through flow: select an illustrated brand card, select a model tile, select an issue (or purchase use), then fill the scheduling form. Selections advance immediately without a progress wizard. The summary includes the computer, issue and cost status; the form collects date, time and address. Actual cost and appointment availability require team confirmation. Computer category photos are illustrative stock images from Unsplash, stored under `public/computers/`.

## Enquiry delivery

No email backend is configured in this project. With no `VITE_LEAD_ENDPOINT`, the forms prepare an email addressed to `247techpro@gmail.com` and clearly state that it has **not been sent**. Visitors must send it from their email app; a text download is also available.

To enable direct delivery, implement a server endpoint and set `VITE_LEAD_ENDPOINT` to its URL. It receives a JSON POST with `type`, contact details, `service`, `serviceId`, `requirements: [{ question, answer }]`, and `submittedAt`. General contact messages use `type: "contact"`.

The endpoint must validate and limit inputs, protect against abuse, and send using server-side credentials. Return `{ "success": true }` only after the delivery provider accepts the request. The frontend rejects failed, timed-out and unconfirmed submissions. Never place an email API key in a `VITE_` variable or source file. Provider credentials and a verified sender/domain are deployment configuration, not browser configuration.

No WhatsApp account, prices, company metrics, customer testimonials or additional services have been invented.

## Assets and motion

Existing brand logo assets are retained; the header has a white background and the footer uses the existing transparent variant. New technology scenes are illustrative generated assets, not claims of company premises, employees or completed projects. The locally hosted silent montage can be regenerated with:

```sh
node scripts/render-technology-video.mjs
```

The background video uses gentle movement and crossfades. It pauses when offscreen and is replaced by a poster for reduced motion, data saving or a media error. Entrance effects also respect reduced motion.

## Verification

Playwright covers all routes and metadata, responsive widths, the seven service forms and image-based computer repair/purchase flow, scheduling validation, contact validation, service-prefilled CTAs, keyboard/mobile navigation, image loading, video controls and mocked API success/error/unconfirmed states. API tests do not send real messages. On this Windows environment Vite subprocess cleanup can sometimes delay the Playwright process exit after test results are printed.

Computer image sources: [laptop](https://images.unsplash.com/photo-1496181133206-80ce9b88a853), [desktop](https://images.unsplash.com/photo-1547082299-de196ea013d6), [MacBook](https://images.unsplash.com/photo-1517336714731-489689fd1ca8). Images illustrate categories and are not a stock catalogue.
