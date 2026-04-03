# EVO Cakes - Vite + React + TypeScript

A modern, fully-featured cake ordering website built with the CEMAR tech stack. This is a React SPA (Single Page Application) using Vite for fast development and optimized production builds.

## 🎨 Features

- **Modern UI/UX**: Built with Tailwind CSS, Framer Motion animations, and Radix UI components
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **React Router**: Client-side routing for fast navigation
- **Firebase Integration**: Authentication, Firestore database, and Cloud Storage
- **Form Management**: React Hook Form for efficient form handling
- **Type Safe**: 100% TypeScript coverage for better developer experience
- **Dark Mode**: Theme switching support built-in
- **Animations**: Smooth page transitions and interactive elements with Framer Motion
- **Production Ready**: Optimized build with tree-shaking and code splitting

## 📦 Tech Stack

### Frontend Framework
- **React** 18.2.0 - UI library
- **React DOM** 18.2.0 - DOM rendering
- **React Router DOM** 6.22.1 - Client-side routing
- **TypeScript** 5.2.2 - Type safety

### Build & Bundling
- **Vite** 6.2.3 - Lightning-fast build tool
- **@vitejs/plugin-react** 4.2.0 - React integration

### Styling
- **Tailwind CSS** 3.4.1 - Utility-first CSS framework
- **Tailwind CSS Animate** 1.0.7 - Animation utilities
- **Tailwind Merge** 2.6.0 - Class name merging
- **PostCSS** 8.4.35 - CSS processing
- **Autoprefixer** 10.4.17 - Browser compatibility

### UI Components
- **Radix UI** - 25+ accessible, unstyled components
- **shadcn/ui** - Pre-built component library (ready to extend)
- **Lucide React** 0.330.0 - Icon library with 300+ icons

### State & Forms
- **React Hook Form** 7.55.0 - Form state management
- **React Context API** - Global state management

### Animations
- **Framer Motion** 12.6.3 - Advanced animations
  - Page transitions
  - Component animations
  - Hover effects
  - Scroll animations

### Data Visualization
- **Recharts** 2.15.1 - Charting library

### Backend & Services
- **Firebase** 12.7.0 - Full backend as a service
  - Authentication (Email/Password, Google OAuth)
  - Firestore (NoSQL database)
  - Realtime Database
  - Cloud Storage
  - Cloud Functions

### Utilities
- **Axios** 1.6.0 - HTTP client
- **Date-fns** 3.6.0 - Date manipulation
- **clsx** 2.1.1 - Conditional className utility
- **Class Variance Authority** 0.7.1 - Type-safe component variants

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd evo-cakes-nextjs
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Then fill in your Firebase and other service credentials in `.env.local`:
```
VITE_FIREBASE_API_KEY=your_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_domain_here
# ... other variables
```

### Development

Start the development server with hot module replacement (HMR):
```bash
npm run dev
```

The app will open at `http://localhost:3000` with live reloading as you save changes.

### Build for Production

Build the optimized production bundle:
```bash
npm run build
```

This creates:
- `dist/index.html` - Entry HTML
- `dist/assets/` - Bundled CSS and JavaScript files
- Assets are minified and optimized with code splitting

### Preview Production Build

Test the production build locally:
```bash
npm run preview
```

### Linting

Run ESLint to check code quality:
```bash
npm run lint
```

## 📁 Project Structure

```
src/
├── main.tsx                 # Vite entry point
├── App.tsx                  # Root component with React Router
├── index.css               # Global Tailwind styles
├── pages/
│   ├── home-page.tsx       # Home/landing page
│   ├── about-page.tsx      # About page
│   ├── faq-page.tsx        # Frequently asked questions
│   ├── gallery-page.tsx    # Gallery
│   └── contact-page.tsx    # Contact form
├── components/
│   ├── Navbar.tsx          # Navigation bar
│   ├── Footer.tsx          # Footer
│   ├── AnimatedBackground.tsx # Animated background
│   ├── PageTransition.tsx  # Page animation wrapper
│   ├── theme-provider.tsx  # Dark mode provider
│   ├── protected-route.tsx # Auth guard component
│   └── ui/                 # Radix UI + shadcn components
├── lib/
│   ├── firebase.ts         # Firebase initialization
│   ├── auth-helpers.ts     # Authentication utilities
│   └── utils.ts            # Utility functions (cn, etc)
├── hooks/
│   └── (custom React hooks)
└── utils/
    └── (utility functions)

public/                     # Static assets
index.html                  # HTML template for Vite
vite.config.ts             # Vite configuration
tailwind.config.ts         # Tailwind CSS configuration
postcss.config.mjs         # PostCSS configuration
tsconfig.json              # TypeScript configuration
```

## 🔐 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Firebase
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_DATABASE_URL=

# Google OAuth
VITE_GOOGLE_CLIENT_ID=
VITE_GOOGLE_CLIENT_SECRET=

# API
VITE_API_URL=http://localhost:3000

# N8N Webhook (AI Chatbot)
VITE_N8N_WEBHOOK_URL=

# Optional: Stripe, PayPal, Calendly
VITE_STRIPE_PUBLIC_KEY=
VITE_PAYPAL_CLIENT_ID=
VITE_CALENDLY_API_KEY=
```

## 🎯 Key Pages

- **Home** (`/`) - Landing page with hero section
- **About** (`/about`) - Company story and stats
- **FAQ** (`/faq`) - Customer questions, policies, and ordering guidance
- **Gallery** (`/gallery`) - Portfolio of creations
- **Contact** (`/contact`) - Contact form and information

## 🧩 Component Architecture

### Custom Components
- **Navbar** - Navigation with mobile menu
- **Footer** - Footer with links and contact info
- **AnimatedBackground** - Animated gradient background
- **PageTransition** - Smooth page transitions
- **ThemeProvider** - Dark/light mode management
- **ProtectedRoute** - Authentication guard

## 🎬 Animations

Powered by Framer Motion:
- Page transitions on route changes
- Scroll animations on elements
- Hover effects on interactive elements
- Staggered animations for lists
- Smooth animations for modals and drawers

## 🔄 State Management

The app uses React's built-in hooks and Context API:
- **useContext** - Global theme state
- **useState** - Component-level state
- **useEffect** - Side effects

## 🧪 Code Quality

- **TypeScript** - Full type safety
- **ESLint** - Code linting
- **Tailwind CSS** - Consistent styling
- **100% Coverage** - All components are typed

## 📈 Performance

- **Code Splitting** - Vite automatic chunking
- **Tree Shaking** - Unused code removal
- **CSS Purging** - Tailwind production mode
- **Image Optimization** - Lazy loading
- **Minification** - Production build optimization

## 🚢 Deployment

### Build Artifacts
```bash
npm run build
```

Produces optimized files in `dist/`:
- `dist/index.html` - Single HTML file
- `dist/assets/` - CSS and JS bundles
- Ready for any static hosting

### Hosting Options
- **Vercel** - Recommended for Vite projects
- **Netlify** - Git-based deployment
- **Firebase Hosting** - Integrated with Firebase
- **GitHub Pages** - Static site hosting

## 📚 Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Firebase Documentation](https://firebase.google.com/docs)

---

**Built with ❤️ using React, Vite, and Tailwind CSS**
