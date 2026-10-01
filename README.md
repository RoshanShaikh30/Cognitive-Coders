# AttendSphere AI (桜花インテリジェンス)
### Multi-Organization Smart Attendance & Predictive Analytics Platform

[![Built for Hackathon](https://img.shields.io/badge/Built%20for-AI%20Hackathon%20Competition-f4a7b9?style=for-the-badge)](https://github.com)
[![Design System](https://img.shields.io/badge/Design%20Theme-Sakura%20Intelligence-cf6a3b?style=for-the-badge)](https://github.com)
[![Model](https://img.shields.io/badge/AI%20Engine-Gemini%203.8%20Flash-d8a858?style=for-the-badge)](https://deepmind.google/technologies/gemini/)
[![Three.js](https://img.shields.io/badge/3D%20Graphics-Three.js-241c18?style=for-the-badge)](https://threejs.org/)

---

## Executive Summary
**AttendSphere AI** is a multi-tenant institutional attendance ecosystem designed to replace generic admin dashboards with a luxury **Sakura Intelligence** aesthetic inspired by Apple product pages and high-end Japanese technology studios.

Instead of plain data grids, the platform represents institutional and personal vitality through **interactive 3D Three.js Sakura Trees**, sub-millimeter **facial biometric scanning reticles**, a dockable **Raycast-style AttendAI Copilot**, and continuous **90-day attendance heatmaps**.

---

## Key Innovations

### 1. 3D Procedural Sakura Vitality Tree
- **Hero Canvas**: A swaying Three.js Sakura Tree with continuous falling petal particle physics, dynamic mouse parallax, orbital data spheres, and warm lighting.
- **Attendance Vitality Metric**:
  - **95%+**: Fully Bloomed Tree with glowing golden-pink canopy.
  - **85–95%**: Healthy Tree with balanced blossom density.
  - **75–85%**: Partial Bloom with warning equilibrium.
  - **<75%**: Sparse Petals with autumn leaves and urgent debarment alert aura.

### 2. Optical Facial Biometric Radar Terminal
- Real webcam access or high-resolution biometric radar simulation.
- 468-point spatial face landmark scanning grid with laser sweep animations.
- Real-time confidence ascent reaching **98.7% match accuracy**.
- Emits cryptographic **SHA-256 tamper-evident verification digests**.

### 3. Draggable AttendAI Copilot (Gemini 3.8 Flash)
- Inspired by Raycast, Spotlight Search, and command palettes.
- Movable anywhere on screen, dockable left or right, and minimizable to a floating Sakura petal icon.
- Can process natural language instructions such as:
  - *"Show students below 75%"* (Triggers automated cohort filter)
  - *"Forecast recovery plan for Kenji Sato"* (Simulates lectures needed to clear debarment)
  - *"Draft guardian alert for 3 consecutive absences"* (Generates personalized parental notices)

### 4. Interactive Attendance Simulator
- Interactive projection calculator:
  - *"Current Attendance: 71.8% → Attend next 6 lectures = 75.4% (Threshold cleared) | Miss next 3 = 68.2%"*
- Instant prescription calculation indicating the exact consecutive lectures required to avoid debarment.

### 5. Multi-Tenant Cryptographic Isolation
- Hierarchical Role-Based Access Control:
  `Super Admin → Organizations → Org Admins → Faculty → Students → Parents`
- Pre-seeded with 3 realistic Japanese academic institutions:
  1. **Kyoto Imperial Academy of Advanced Tech** (KIA-TECH)
  2. **Cherry Blossom STEM International Institute** (CB-STEM)
  3. **Osaka Shikon Creative & Business College** (OSK-BIZ)
- Strict Row-Level Security (RLS) ensures zero data leakage between tenants.

---

## 🎨 Sakura Intelligence Color System

| Token | Color Sample | Role in Application |
|---|---|---|
| Deep Espresso 950 | `#0e0a09` | Base application canvas |
| Espresso Brown 900 | `#140f0d` | Elevated containers and cards |
| Sakura Pink | `#f4a7b9` | Brand highlight, blooming petals |
| Rose Gold | `#dfa393` | Hairline borders, glass refractions |
| Burnt Orange | `#cf6a3b` | Primary CTAs, 85–95% attendance tier |
| Terracotta | `#b7533d` | 75–85% borderline alert status |
| Soft Gold | `#d8a858` | 95–100% mastery tier, verification seals |

---

## 👥 Instant 1-Click Persona Switching
For hackathon reviewers, open the **Sign In** modal and click any persona for instant authorization:
1. **Prof. Tanaka (Faculty)**: Roll call marker, biometric radar, add classes.
2. **Kenji Sato (Student)**: Attendance tree, personal simulator, subject telemetry.
3. **Mrs. Yumi Sato (Parent)**: Guardian briefing, absence notice filing.
4. **Dean Eleanor (Org Admin)**: Manage faculty, students, department cohorts.
5. **Super Admin (Global)**: Provision and inspect multi-tenant campuses.

---

## 🛠 Tech Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion, Three.js, Lucide Icons, Canvas Confetti.
- **Backend**: Express, Node.js, tsx, PostgreSQL & Supabase SQL Schema with RLS.
- **AI**: Google Gemini 3.8 Flash (`@google/genai` TypeScript SDK with server-side proxy).
- **Audio**: Web Audio API Procedural Synthesizer (Zero external assets required).

---

## 📦 Project Structure
```
attendsphere-ai/
├── backend/
│   └── supabase_schema.sql      # Production PostgreSQL / Supabase RLS Schema
├── docs/
│   ├── ARCHITECTURE.md          # Technical specifications & tenant isolation
│   └── DEPLOYMENT.md            # Cloud and Docker deployment instructions
├── src/
│   ├── components/
│   │   ├── 3d/                  # Three.js 3D Sakura Tree & Attendance Tree
│   │   ├── attendance/          # Roll call marker, simulator, heatmap, biometrics
│   │   ├── auth/                # Multi-role authentication modal with 1-click test personas
│   │   ├── cinematic/           # 0-100% Sakura growth loader & custom petal cursor
│   │   ├── copilot/             # Draggable & dockable AttendAI Copilot
│   │   ├── dashboards/          # Student, Parent, Faculty, Org Admin, Super Admin
│   │   ├── insights/            # Proactive AI Insights Drawer
│   │   ├── landing/             # 3D Hero landing page
│   │   └── navigation/          # Navigation header with tenant & role switchers
│   ├── context/                 # Multi-tenant state and session management
│   ├── data/                    # Seed institutions, students, faculty, and classes
│   ├── services/                # Web Audio acoustic synthesizer & Gemini client
│   ├── types/                   # TypeScript definitions
│   ├── App.tsx                  # Root application orchestrator
│   ├── index.css                # Sakura Intelligence design tokens & glass styles
│   └── main.tsx                 # Entrypoint
├── server.ts                    # Full-stack Express server with server-side Gemini
├── package.json
└── README.md
```

---

## 🚀 Quickstart
```bash
# Clone repository
git clone https://github.com/your-org/attendsphere-ai.git
cd attendsphere-ai

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:3000` to experience AttendSphere AI.
