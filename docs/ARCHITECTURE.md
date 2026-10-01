# AttendSphere AI — System Architecture & Technical Specifications

## 1. System Overview
**AttendSphere AI** is a multi-tenant institutional attendance and predictive telemetry platform built with the **Sakura Intelligence** luxury technology design philosophy.

### Core Architectural Pillars
- **Zero Cross-Tenant Leakage**: Strict tenant isolation at database (PostgreSQL Row-Level Security), API session level, and frontend context.
- **Biometric Optical Turnstile**: Sub-millimeter face landmark scanning with client-side canvas telemetry and SHA-256 tamper-evident verification hashing.
- **Gemini 3.8 Flash Integration**: Proactive telemetry analysis, natural-language command execution (Raycast-inspired Copilot), and automated parent notification drafting.
- **Three.js 3D Visual Computing**: Real-time rendering of procedural Sakura vitality trees reflecting actual attendance standing.

---

## 2. Multi-Organization Hierarchy
```
Super Admin (Global Infrastructure)
  │
  ├── Tenant 1: Kyoto Imperial Academy of Advanced Tech (KIA-TECH)
  │     ├── Org Admins (Dean Fujimoto)
  │     ├── Faculty (Prof. Tanaka, Dr. Morimoto)
  │     ├── Classes & Cohorts (CS-301, CS-402)
  │     ├── Students (Kenji Sato, Sakura Takahashi)
  │     └── Parents (Mrs. Yumi Sato)
  │
  ├── Tenant 2: Cherry Blossom STEM International Institute (CB-STEM)
  └── Tenant 3: Osaka Shikon Creative & Business College (OSK-BIZ)
```

---

## 3. Sakura Intelligence Color System
All UI components, charts, and 3D scenes conform to this bespoke luxury palette:

| Token | Hex Code | Purpose |
|---|---|---|
| Deep Espresso 950 | `#0e0a09` | Base application canvas background |
| Espresso Brown 900 | `#140f0d` | Elevated containers, cards, tables |
| Charcoal Brown 800 | `#231a16` | Hairline dividers, secondary buttons |
| Warm Cream | `#faf5ee` | High-contrast display typography |
| Soft Beige | `#e4d8c8` | Body prose, secondary labels |
| Sakura Pink | `#f4a7b9` | Brand accent, active copilot aura, petals |
| Rose Gold | `#dfa393` | Borders, subtle glass reflection highlights |
| Burnt Orange | `#cf6a3b` | Primary CTAs, 85–95% heatmap tiers |
| Terracotta | `#b7533d` | 75–85% borderline alert status |
| Soft Gold | `#d8a858` | 95–100% mastery tier, verification seals |

---

## 4. Biometric Face Recognition Pipeline
1. **Frame Capture**: Continuous 60 FPS video capture via `navigator.mediaDevices.getUserMedia`.
2. **Face Landmark Mesh**: 468-point spatial facial landmark estimation canvas overlay with circular target reticle.
3. **Verification Vector Match**: Real-time confidence ascent (reaching 98.7% verification).
4. **Cryptographic Proof**: Generation of an immutable SHA-256 audit digest (`marked_at`, `student_id`, `turnstile_id`).
5. **Database Transaction**: Instant trigger recalculation updating attended lectures and firing debarment warnings if `< 75%`.

---

## 5. AttendAI Copilot Specifications
- **Model**: `gemini-3.8-flash` via `@google/genai` TypeScript SDK on server side.
- **Interface**: Draggable, dockable floating glass console with keyboard shortcuts (`Ctrl+K`).
- **Telemetry Context Injection**: Injects current institution, active class attendance rate, and list of at-risk students into prompt system instructions.
- **Action Execution Protocol**: The Copilot emits structured tokens `[ACTION: action_name | payload]` which the frontend parses to trigger filter updates, recovery calculations, and automated parent advisories.
