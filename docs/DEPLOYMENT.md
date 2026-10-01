# AttendSphere AI — Deployment & Setup Guide

## 1. Prerequisites
- Node.js >= 20.x
- npm or pnpm
- Google Gemini API Key
- (Optional) Supabase Project URL & Anon Key for cloud hosting

---

## 2. Local Development Setup

```bash
# 1. Clone repository
git clone https://github.com/your-org/attendsphere-ai.git
cd attendsphere-ai

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env and supply your GEMINI_API_KEY

# 4. Start full-stack development server (Express + Vite)
npm run dev
```

Server will initialize at: `http://localhost:3000`

---

## 3. Supabase Cloud Database Provisioning

1. Log into your [Supabase Dashboard](https://supabase.com).
2. Create a new project (e.g. `attendsphere-prod`).
3. Navigate to **SQL Editor**.
4. Copy the entire contents of `backend/supabase_schema.sql` into the SQL editor and execute.
5. Verify that tables (`organizations`, `users`, `classes`, `subjects`, `students`, `attendance_records`) and RLS policies are active.
6. Copy your **Project URL** and **anon public key** into `.env`.

---

## 4. Production Build & Deployment

```bash
# Build production client bundle
npm run build

# Start production server
npm run start
```

### Docker Deployment
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
```
