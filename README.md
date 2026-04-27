# Matdata Mitra | मतदाता मित्र 🇮🇳
### Your Trusted AI Guide to India's Election Process

**Matdata Mitra** (Voter's Friend) is a smart, multilingual AI assistant designed to simplify the complex landscape of the Indian electoral process. Built for the ECI Challenge 2, it provides neutral, educational, and accessible guidance to every citizen, from first-time voters to overseas electors (NRIs) and elderly citizens.

---

## 🗳️ Chosen Vertical
**Vertical**: Election Process Education Agent
**Target**: All Indian Citizens (Focus on Inclusion and Accessibility)

---

## 🚀 Key Features
- **Dynamic Personas**: Tailored guidance for First-time Voters, Registered Voters, Elderly, NRI Voters, Polling Officials, and Curious Learners.
- **Google Cloud Powered Translation**: Real-time translation in 15+ Indian languages using **Google Cloud Translation API** for superior accuracy.
- **Primary Intelligence**: Uses **Google Gemini 1.5 Flash** as the primary engine for deep reasoning and multilingual generation.
- **Admin Intelligence Dashboard**: A premium analytics hub protected by **Google Identity (Firebase Auth)** to monitor user intents, language adoption, and safety incidents in real-time.
- **Real-time Monitoring**: Safety logs and metrics are synced via **Firebase Firestore** for instant remote visibility.
- **Interactive Booth Locator**: Integrated **Google Maps Platform** allowing users to visually locate polling stations and get one-tap directions.
- **Premium Cloud TTS**: High-quality, human-like voice synthesis using **Google Cloud Text-to-Speech API** (Wavenet) for superior accessibility in regional languages.
- **Proactive Security**: Automatic **PII Redaction** (Phone, Aadhaar, PAN) and HTML sanitization to prevent XSS.
- **Comprehensive Testing**: 100% test coverage for core services using **Vitest** and **React Testing Library**.
- **Offline Knowledge**: Built-in procedural guidance for core tasks even when connectivity is intermittent.

---

## 🏗️ Architecture & Logic

### Block Diagram
```mermaid
graph TD
    User((User)) -->|Interacts| UI[React Frontend]
    UI -->|Context| AppContext[State Management]
    AppContext -->|Auth| Firebase_Auth[Google Identity]
    UI -->|Map| Google_Maps[Google Maps Platform]
    
    AIService -->|Primary| Gemini[Google Gemini 1.5 Flash]
    AIService -->|Log| Firestore[Firebase Firestore]
    AIService -->|TTS| Cloud_TTS[Premium Google TTS]
    AIService -->|Security| PII_Redactor[PII Redactor]
    
    Firestore -->|Sync| Admin_Dashboard[Admin Analytics]
    Firebase_Auth -->|Protect| Admin_Dashboard
```

---

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- Google Cloud API Key (with Gemini and Translation APIs enabled)

### 2. Installation
```bash
git clone <repo-url>
cd Elections-AI-Agent
npm install
```

### 3. Configuration
Create a `.env` file in the root directory:
```env
VITE_GEMINI_API_KEY=your_key_here
VITE_GOOGLE_CLOUD_API_KEY=your_key_here
VITE_GROQ_API_KEY=your_fallback_key_here
VITE_GOOGLE_MAPS_API_KEY=your_maps_key
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_PROJECT_ID=your_project_id
# ... see .env for full firebase config placeholders
```

### 4. Running Locally
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

### 5. Accessing Admin Dashboard
The Admin Intelligence Dashboard can be accessed by navigating to:
`http://localhost:5173/admin`

### 6. Running Tests
```bash
# Run unit & component tests
npm test

# Run tests with coverage report
npm run coverage
```

---

## 🛡️ Security & Quality
- **PII Redaction**: Automatic stripping of sensitive identifiers before AI processing.
- **HTML Sanitization**: Responses are sanitized using custom security utilities to prevent XSS.
- **Testing**: 13+ unit and component tests ensuring 100% pass rate for critical flows.
- **Google Cloud Integration**: Deep integration with Google's ecosystem for AI and Translation.

## 🌍 Live Deployment
The application is deployed on **Google Cloud Run** and is globally accessible:
- **Application URL**: [https://matdata-mitra-tvotrbxe4q-uc.a.run.app](https://matdata-mitra-tvotrbxe4q-uc.a.run.app)
- **Infrastructure**: Scalable, serverless container orchestration on Google Cloud Platform.

---

Developed with ❤️ for the Indian Voter.
