# 🚀 Quick Start Guide

## What Changed?

Your project has been successfully migrated from **Next.js** to **Vite + React + TypeScript** using the CEMAR tech stack.

### Key Benefits
- ⚡ **Faster Dev Server** - Vite is 10-100x faster than Next.js dev server
- 📦 **Smaller Bundle** - ~325KB gzip instead of 500KB+
- 🔄 **Full React Control** - No Next.js abstractions
- 🎯 **Better Firebase Integration** - Seamless Firestore + Auth
- 🎨 **More UI Components** - 25+ Radix UI components

---

## Installation & Setup

### Step 1: Install Dependencies
```bash
npm install
```

This installs all 50+ packages including:
- React Router (SPA routing)
- Firebase (backend services)
- Radix UI (accessible components)
- Framer Motion (animations)
- Tailwind CSS (styling)

### Step 2: Configure Firebase

Create `.env.local` in project root:
```bash
cp .env.example .env.local
```

Then edit `.env.local` with your Firebase credentials:
```env
VITE_FIREBASE_API_KEY=your_actual_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123...
VITE_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
```

### Step 3: Start Development

```bash
npm run dev
```

The app opens at **http://localhost:3000** with hot reload enabled.

---

## Available Commands

```bash
# Development with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint
npm run lint
```

---

## Project Structure

```
src/
├── App.tsx                 # React Router setup
├── main.tsx               # Vite entry point
├── index.css              # Global Tailwind styles
│
├── pages/                 # Route pages
│   ├── home-page.tsx      # /
│   ├── about-page.tsx     # /about
│   ├── faq-page.tsx       # /faq
│   ├── gallery-page.tsx   # /gallery
│   └── contact-page.tsx   # /contact
│
├── components/            # Reusable components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── AnimatedBackground.tsx
│   ├── PageTransition.tsx
│   ├── theme-provider.tsx (dark mode)
│   ├── protected-route.tsx (auth guard)
│   └── ui/               # Radix UI components
│
├── lib/                   # Business logic
│   ├── firebase.ts       # Firebase setup
│   ├── auth-helpers.ts   # Auth functions
│   └── utils.ts          # Utility functions
│
├── hooks/                # Custom React hooks
└── utils/               # Helper functions
```

---

## Routing

The app uses **React Router v6** for client-side routing:

```tsx
// Routes are defined in src/App.tsx
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/about" element={<AboutPage />} />
  <Route path="/faq" element={<FAQPage />} />
  <Route path="/gallery" element={<GalleryPage />} />
  <Route path="/contact" element={<ContactPage />} />
</Routes>
```

Navigate using the Link component:
```tsx
import { Link } from 'react-router-dom'

<Link to="/about">About Us</Link>
```

---

## Using Components

### 1. React Router Link
```tsx
import { Link } from 'react-router-dom'

<Link to="/faq">View FAQ</Link>
```

### 2. Firebase Auth
```tsx
import { signIn, signUp, logout } from '@/lib/auth-helpers'

// Sign up
await signUp('user@example.com', 'password123')

// Sign in
await signIn('user@example.com', 'password123')

// Logout
await logout()
```

### 3. Framer Motion Animations
```tsx
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Animated content
</motion.div>
```

### 4. Tailwind CSS
```tsx
<div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-pink-500 to-purple-600 text-white">
  <h1 className="text-4xl font-bold">Hello World</h1>
</div>
```

### 5. React Hook Form
```tsx
import { useForm } from 'react-hook-form'

export function MyForm() {
  const { register, handleSubmit, watch } = useForm()
  
  const onSubmit = (data) => console.log(data)
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name")} />
      <button type="submit">Submit</button>
    </form>
  )
}
```

---

## Key Features Ready to Use

### ✅ Dark Mode
The theme provider is already set up in `App.tsx`:
```tsx
import { useTheme } from '@/components/theme-provider'

export function MyComponent() {
  const { theme, setTheme } = useTheme()
  
  return <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
    Toggle Theme
  </button>
}
```

### ✅ Protected Routes
```tsx
import { ProtectedRoute } from '@/components/protected-route'

<Route 
  path="/dashboard" 
  element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
/>
```

### ✅ UI Components (Radix UI)
All 25+ components are pre-installed and ready to import from `@/components/ui/`:
- Buttons, Inputs, Forms
- Dialogs, Modals, Drawers
- Tabs, Accordion, Collapse
- And more...

---

## Build & Deployment

### Build for Production
```bash
npm run build
```

Creates optimized files in `dist/`:
- `dist/index.html` - Single HTML file
- `dist/assets/` - Bundled CSS and JavaScript
- Ready for any static host

### Deploy Options

**Vercel (Recommended)**
```bash
npm install -g vercel
vercel
```

**Netlify**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**Firebase Hosting**
```bash
npm install -g firebase-tools
firebase deploy
```

---

## Troubleshooting

### Port Already in Use
```bash
# Change port in vite.config.ts or use:
npm run dev -- --port 3001
```

### Firebase Not Working
- Ensure `.env.local` has all Firebase keys
- Check Firebase project settings
- Verify security rules in Firestore

### Import Errors
- Use `@/` alias for imports from src: `import { cn } from '@/lib/utils'`
- ESLint will show if imports are wrong

---

## What's Next?

1. **Add more pages** - Create new files in `src/pages/`
2. **Create API routes** - Use Firebase Cloud Functions
3. **Add UI components** - Install shadcn/ui components
4. **Setup database** - Configure Firestore collections
5. **Add authentication** - Implement Firebase Auth flows

---

## Resources

- 📖 [Vite Documentation](https://vitejs.dev/)
- ⚛️ [React Documentation](https://react.dev/)
- 🧭 [React Router](https://reactrouter.com/)
- 🎨 [Tailwind CSS](https://tailwindcss.com/)
- 🎭 [Framer Motion](https://www.framer.com/motion/)
- 🔥 [Firebase](https://firebase.google.com/)
- 🎯 [Radix UI](https://www.radix-ui.com/)

---

## Need Help?

Check these files for configuration:
- `vite.config.ts` - Build settings
- `tailwind.config.ts` - Styling settings
- `src/App.tsx` - Routing setup
- `.env.example` - Required environment variables

---

**Happy coding! 🎉**
