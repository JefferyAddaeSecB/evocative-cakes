import { Suspense, lazy } from 'react'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'sonner'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FloatingBackground from '@/components/FloatingBackground'
const ChatbotWidget = lazy(() => import('@/components/ChatbotWidget'))
const HomePage = lazy(() => import('@/pages/home-page'))
const AboutPage = lazy(() => import('@/pages/about-page'))
const CakesPage = lazy(() => import('@/pages/cakes-page'))
const GalleryPage = lazy(() => import('@/pages/gallery-page'))
const ContactPage = lazy(() => import('@/pages/contact-page'))
const FAQPage = lazy(() => import('@/pages/faq-page'))
const TermsPage = lazy(() => import('@/pages/terms-page'))
const PrivacyPage = lazy(() => import('@/pages/privacy-page'))
const AdminLogin = lazy(() => import('@/pages/admin-login'))
const AdminDashboard = lazy(() => import('@/pages/admin-dashboard'))

function RouteFallback({ withTopPadding = true }: { withTopPadding?: boolean }) {
  return (
    <div
      className={`min-h-screen w-full ${withTopPadding ? 'pt-20' : ''}`}
      aria-hidden="true"
    />
  )
}

const Layout = () => (
  <>
    <FloatingBackground />
    <Navbar />
    <main>
      <Suspense fallback={<RouteFallback />}>
        <Outlet />
      </Suspense>
    </main>
    <Footer />
    <Suspense fallback={null}>
      <ChatbotWidget />
    </Suspense>
    <Toaster position="top-right" richColors />
  </>
)

const AdminLayout = () => (
  <>
    <main>
      <Suspense fallback={<RouteFallback withTopPadding={false} />}>
        <Outlet />
      </Suspense>
    </main>
    <Toaster position="top-right" richColors />
  </>
)

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'cakes', element: <CakesPage /> },
      { path: 'gallery', element: <GalleryPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'faq', element: <FAQPage /> },
      { path: 'terms', element: <TermsPage /> },
      { path: 'privacy', element: <PrivacyPage /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { path: 'login', element: <AdminLogin /> },
      { path: 'dashboard', element: <AdminDashboard /> },
    ],
  },
])

function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
