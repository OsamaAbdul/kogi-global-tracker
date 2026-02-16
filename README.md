# 🌍 Kogi Global Tracker (KGT)
### Anywhere, Anytime • Verified Diaspora Network

![KGT Banner](https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop)

## 📋 Overview
**Kogi Global Tracker** is a premium, state-of-the-art platform designed to connect the Kogi State Diaspora across the globe. Built with a "Privacy-First" approach, KGT enables verified citizens to share their presence, engage with live community telemetry, and contribute to the collective pulse of Kogi people worldwide.

This platform serves as a digital bridge, fostering collaboration, identity verification, and real-time activity tracking for the global Kogi community.

---

## ✨ Key Features

### 🛰️ Live Satellite Heartbeat
Experience the global distribution of Kogi citizens through a high-definition, interactive satellite map. Visual markers pulsate in real-time as the community grows.

### 🛡️ Verified Heritage Check
A secure verification layer ensures that only citizens with authentic Kogi roots (mapped to their respective LGAs) are displayed on the public telemetry feed.

### 👻 Ghost Mode (Privacy)
User privacy is paramount. Citizens can toggle **Ghost Mode** to blur their precise location, appearing as a generalized regional signal while maintaining their contribution to the global count.

### 📊 Real-time Intelligence
A sophisticated analytics sidebar provides live feeding of community signals, top global hubs, and total reach metrics, powered by Supabase Real-time.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS (Premium Dark Theme) |
| **Animations** | Framer Motion |
| **Backend/DB** | Supabase (PostgreSQL, Real-time) |
| **Maps** | React Simple Maps (High-Contrast Projection) |
| **Icons** | Lucide React |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm / yarn / pnpm

### Installation
1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd global-kogite-pulse
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

4. **Launch Development Server**
   ```bash
   npm run dev
   ```

---

## 📐 Architecture
The project follows a modular React architecture:
- `/src/components`: Reusable UI components (shadcn-based)
- `/src/hooks`: Custom logic for Auth, Real-time Tracking, and UI state
- `/src/lib`: Geolocation utilities and constants
- `/src/pages`: High-fidelity landing and dashboard experiences

---

## 🔒 Security & Privacy
- **Supabase RLS**: Row Level Security policies ensure that sensitive location data is only accessible to authorized viewers.
- **Anonymous Tracking**: Visitors are tracked via unique session IDs until they verify their heritage.
- **GDPR Compliant Design**: No persistent PII is collected without explicit user verification.

---

## 🤝 Contributing
We welcome contributions from the Kogi global community. Please follow our code of conduct and submit pull requests for review.

---

## 📄 License
This project is proprietary and developed for the **Kogi State Innovation Challenge**.

---
*Developed with Passion • Powered by the Diaspora • 2026*
