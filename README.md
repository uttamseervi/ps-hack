# HealthBridge (ps-hack)

HealthBridge is an AI‑assisted healthcare access platform designed to support refugees and NGOs with multilingual triage, a symptom checker, a service locator map, and basic coordination tools.

> Important: This project is an early prototype intended for hackathon/demo purposes only. It does not provide medical advice. Always consult qualified professionals for diagnosis and treatment.

## Features

- Multilingual AI Chatbot: Text + image triage using Google Gemini (Vision).
- Symptom Checker: Risk assessment and care guidance (UI scaffolded).
- Healthcare Locator Map: Nearby NGOs/clinics with directions using Google Maps.
- Role‑based Onboarding: Separate flows for Refugees and NGOs/Providers.
- Dashboards: Basic pages for refugee and NGO views (placeholder scaffolds).
- Modern UI: Next.js App Router, Tailwind CSS, Radix UI components, Framer Motion.

## Tech Stack

- Next.js 14 (App Router) + React 18
- Tailwind CSS 4 + Radix UI + ShadCN‑style components
- Google Gemini (`@google/generative-ai`) for AI triage
- Google Maps (`@react-google-maps/api`) for maps and routing
- Supabase (`@supabase/supabase-js`) client (data layer placeholder)
- TypeScript, Zod, React Hook Form, Recharts, Framer Motion

## Directory Overview

```
app/
  api/chatbot/analyze/route.ts  # AI triage endpoint (Gemini Vision)
  auth/login/                   # Login page
  auth/signup/                  # Refugee/NGO signup flows
  chatbot/                      # Chatbot UI
  dashboard/refugee/            # Refugee dashboard (scaffold)
  dashboard/ngo/                # NGO dashboard (scaffold)
  health-hub/                   # Education hub (scaffold)
  map/ and maps/                # Map pages using Google Maps
components/
  MapView.tsx                   # Google Maps view + directions
  ui/*                          # Radix/ShadCN UI primitives
lib/
  db.ts                         # Supabase client init
```

## Getting Started

Prerequisites:
- Node.js 18+ (recommended)
- pnpm 9+

Install dependencies:

```cmd
pnpm install
```

Run the dev server:

```cmd
pnpm dev
```

Build and start:

```cmd
pnpm build
pnpm start
```

Lint:

```cmd
pnpm lint
```

Open http://localhost:3000 to view the app.

## Environment Variables

Create a `.env.local` at the project root with the following variables:

```bash
# Google Gemini (used by /api/chatbot/analyze)
GOOGLE_API_KEY=your_gemini_api_key

# Google Maps JavaScript API (client‑side)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_js_api_key

# Supabase (server‑side key used here for prototyping only)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

Notes:
- The AI chatbot endpoint requires `GOOGLE_API_KEY`.
- The map pages require `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.
- `lib/db.ts` currently initializes Supabase using the service role key for convenience during prototyping. Do not use service role keys in client‑accessible code in production; switch to an anon/public key and move privileged operations to server routes.

## Key Routes

- `/` Landing page
- `/auth/login` and `/auth/signup` Onboarding flows
  - Signup supports `role=refugee` or `role=ngo` query param
- `/chatbot` AI health assistant UI
- `/symptom-checker` Symptom checker UI (scaffold)
- `/map` and `/maps` Service locator map
- `/dashboard/refugee` and `/dashboard/ngo` Dashboards (scaffold)

### API: AI Triage

POST `/api/chatbot/analyze`
- Content-Type: `multipart/form-data`
- Fields:
  - `message` (string) – user message/symptoms
  - `language` (string) – e.g., `en`, `fr`, `ar`
  - `images` (File[]) – optional medical images/photos

Example (PowerShell/CMD with curl):

```cmd
curl -X POST http://localhost:3000/api/chatbot/analyze ^
  -H "Content-Type: multipart/form-data" ^
  -F "message=I have a severe headache and blurred vision" ^
  -F "language=en" ^
  -F "images=@sample.jpg"
```

Response shape (example):

```json
{
  "response": {
    "classification": "CRITICAL | MODERATE | NOT CRITICAL",
    "summary": "...",
    "reasoning": "...",
    "recommended_care": ["..."],
    "next_steps": "Rest at Home | Visit Clinic | Go to ER"
  },
  "images_processed": 1
}
```

## Development Notes

- Some backend endpoints referenced by the signup flows (e.g., `/api/register/refugee`, `/api/auth/register/ngo`) are not yet implemented in this repo. They are placeholders for future integration with a database (e.g., Supabase/Postgres) and authentication.
- The map currently uses static NGO data in `components/MapView.tsx`. Replace with real data sources as needed.
- Tailwind CSS and component utilities are preconfigured; global styles live in `app/globals.css` and `styles/globals.css`.

## Deployment

- Vercel is recommended for Next.js. Set the same environment variables in your Vercel Project Settings.
- Ensure the Google Maps JavaScript API and Gemini API are enabled for your Google Cloud project and restricted appropriately.

## Roadmap

- Implement secure auth and session management
- Connect signup flows to real APIs and persistence
- Persist NGO/clinic directory and add search/filters
- Enhance symptom checker with validated medical triage flows
- Add i18n, accessibility, and offline support

## Security & Medical Disclaimer

- Do not commit secrets. Use `.env.local` and managed secrets in CI/CD.
- The AI outputs may be inaccurate or harmful if misused. The application is not a substitute for professional medical advice, diagnosis, or treatment. In emergencies, call local emergency services immediately.

## License

No license specified. All rights reserved by the authors. If you plan to use this project, add an appropriate license file.
