# Matdata Mitra — Deployment Guide

## Deploying to Google Cloud Run

### Prerequisites
1. Google Cloud SDK (`gcloud`) installed and authenticated
2. A GCP project with billing enabled
3. APIs enabled: Cloud Run, Cloud Build, Artifact Registry

---

## Step 1 — Add your API keys

Create a `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` with your real keys:
```
VITE_GEMINI_API_KEY=AIza...your_key...
VITE_GROQ_API_KEY=gsk_...your_key...
```

---

## Step 2 — Build the production bundle

```bash
npm run build
```

This creates the `dist/` folder that will be served by nginx inside Docker.

> **⚠️ Important:** API keys are embedded into the compiled JS at build time (Vite inlines `VITE_` prefixed env vars). This is normal for a client-side app. Do not commit `.env` to git.

---

## Step 3 — Deploy to Cloud Run

### Option A: Using Cloud Build (Recommended)

```bash
gcloud run deploy matdata-mitra \
  --source . \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080
```

`--source .` triggers Cloud Build to use the Dockerfile automatically.

### Option B: Manual Docker build + push

```bash
# Set your project ID
export PROJECT_ID=your-gcp-project-id

# Build image
docker build -t gcr.io/$PROJECT_ID/matdata-mitra:latest .

# Push to Container Registry
docker push gcr.io/$PROJECT_ID/matdata-mitra:latest

# Deploy
gcloud run deploy matdata-mitra \
  --image gcr.io/$PROJECT_ID/matdata-mitra:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080
```

---

## Step 4 — Verify

After deployment, Cloud Run gives you a URL like:
```
https://matdata-mitra-xxxxxxxxxx-uc.a.run.app
```

Test the app by opening this URL in a mobile browser.

---

## Later: Vercel Deployment

When you're ready to switch to Vercel:

```bash
npm install -g vercel
vercel --prod
```

The `vercel.json` is already configured with SPA rewrites.

> **Note:** For Vercel, environment variables must be added in the Vercel dashboard (not from `.env`) since the build happens on Vercel's servers.

---

## File Structure Summary

```
Elections-AI-Agent/
├── Dockerfile              ← Cloud Run container
├── nginx.conf              ← SPA routing, port 8080
├── .dockerignore
├── vercel.json             ← Vercel SPA rewrite
├── .env.example            ← Template (copy to .env)
├── package.json
├── vite.config.js
├── tailwind.config.js
├── index.html
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── context/
    │   └── AppContext.jsx
    ├── services/
    │   ├── aiService.js      ← Gemini + Groq + Election system prompt
    │   ├── translationService.js
    │   └── speechService.js
    ├── components/
    │   ├── layout/
    │   │   ├── TopBar.jsx
    │   │   └── BottomNav.jsx
    │   ├── chat/
    │   │   ├── MessageBubble.jsx
    │   │   ├── TypingIndicator.jsx
    │   │   ├── VoiceInput.jsx
    │   │   └── AshokChakraLoader.jsx
    │   └── ui/
    │       ├── MythCard.jsx
    │       ├── ToolCard.jsx
    │       └── ElectionTimeline.jsx
    └── pages/
        ├── WelcomePage.jsx
        ├── OnboardingPage.jsx
        ├── ChatPage.jsx
        ├── LearnPage.jsx
        ├── ToolsPage.jsx
        └── SettingsPage.jsx
```
