# Shibani Roy - Virtual AI Influencer Website & Admin CMS

A clean, modern, and production-ready portfolio and blog website for **SHIBANI ROY**, India's pioneer Virtual AI Influencer and Digital Creator. This application features a fully responsive frontend and a simple WordPress-style admin panel where content can be edited in real-time without writing code.

---

## 🎨 Design Philosophy
* **Apple & OpenAI Inspired Minimalist Aesthetic**: A gorgeous, eye-friendly light theme with a clean white and zinc foundation, rose-pink brand accents, luxurious typography pairs (Cormorant Garamond & Inter), generous margins, card hover micro-animations, and translucent frosted glass panels.
* **Dual Persistence System**: Out of the box, the site runs in **Persistent Sandbox Mode** using local storage, populated with beautiful seed content. Once connected to a live **Supabase** instance, it transitions into production cloud mode instantly!

---

## 📂 Folder Structure
The repository follows a clean, modular structure:

```text
/
├── .env.example             # Documented environment credentials format
├── .gitignore               # Ignored compilation files and dependencies
├── index.html               # Main index HTML entry point
├── metadata.json            # AI Studio applet configurations
├── package.json             # App scripts and dependency configurations
├── supabase-schema.sql      # Database migrations script for Supabase Postgres
├── tsconfig.json            # TypeScript build parameters
├── vite.config.ts           # Vite plugin and alias configurations
└── src/
    ├── App.tsx              # Main entry stage, hash router and core state
    ├── index.css            # Custom global typography & Tailwind v4 theme specs
    ├── main.tsx             # Application mounter
    ├── types.ts             # Shared database types (BlogPost, SiteContent, etc.)
    ├── assets/
    │   └── images/          # Generated, high-resolution AI avatar and banners
    ├── components/
    │   ├── Header.tsx       # Translucent frosted header & database status checker
    │   ├── Footer.tsx       # Elegant minimal footer matching design language
    │   ├── HomeView.tsx     # Hero page, AI companion cards & latest posts preview
    │   ├── AboutView.tsx    # Editorial biography page with native Markdown renderer
    │   ├── BlogView.tsx     # Paginated blog listings, sharing, and read suggestions
    │   ├── ContactView.tsx  # Interactive transmission form and collab card layout
    │   └── AdminView.tsx    # Admin login, post creator, site editor, and inbox
    └── services/
        └── db.ts            # Central database connector routing sandbox/cloud
```

---

## 🛠️ Step-by-Step Setup

### 1. Local Development
Clone this workspace and install dependencies:
```bash
npm install
```

Start the local Vite development server:
```bash
npm run dev
```
The server will start on port `3000` (e.g., `http://localhost:3000`).

---

### 2. Connect Your Supabase Production Database

#### Step A: Create Your Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up for a free account.
2. Click **New Project** and configure your organization, project name, and Database Password.

#### Step B: Run the SQL Schema Setup
1. In your Supabase project dashboard, navigate to the **SQL Editor** tab on the left menu.
2. Click **New query**.
3. Open the `/supabase-schema.sql` file in this repository, copy all of its content, paste it into the editor, and click **Run**.
4. This creates your `blog_posts`, `site_content`, and `contact_messages` tables with secure Row-Level Security (RLS) policies and seed data!

#### Step C: Create Your Storage Bucket (Optional)
To support rich-text feature image uploads:
1. In Supabase, navigate to **Storage**.
2. Click **New Bucket**, name it exactly `shibani-assets`.
3. Toggle the bucket to **Public** (required to display uploads on public screens).
4. Add a policy allowing `Insert` and `Select` permissions for `Authenticated` users.

#### Step D: Create Your Administrator login
1. Go to **Authentication > Users** in Supabase.
2. Click **Add User > Create User** and specify an admin email and password. This account will be used to log in to the admin panel.

---

### 3. Set Up Environment Variables
Create a file named `.env` in the root directory (based on `.env.example`):

```env
VITE_SUPABASE_URL="https://your-supabase-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-key-here"
```

Once Vite detects these keys, the website's database connection pill will glow green showing **"Supabase"**, and all content modifications will automatically read and write live from PostgreSQL!

---

## 🚀 Deploying to Vercel

### Step 1: Create a GitHub Repository
Push this folder to your GitHub, GitLab, or Bitbucket profile:
```bash
git init
git add .
git commit -m "feat: Shibani Roy Influencer website"
# Push to your remote repository...
```

### Step 2: Import into Vercel
1. Log in to your [Vercel Dashboard](https://vercel.com).
2. Click **Add New > Project**.
3. Import your newly pushed GitHub repository.

### Step 3: Configure Build & Environment Variables
* **Framework Preset**: Vercel will auto-detect **Vite**.
* **Build Command**: `npm run build`
* **Output Directory**: `dist`
* **Environment Variables**: Add your production keys in Vercel's Environment Variables card under Project Settings:
  * Key: `VITE_SUPABASE_URL` | Value: Your live Supabase Project URL
  * Key: `VITE_SUPABASE_ANON_KEY` | Value: Your live Supabase Anon Key

Click **Deploy**. Your website will be compiled and live in less than a minute!
