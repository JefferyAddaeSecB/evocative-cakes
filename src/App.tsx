import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'sonner'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FloatingBackground from '@/components/FloatingBackground'

// Pages
import HomePage from '@/pages/home-page'
import AboutPage from '@/pages/about-page'
import CakesPage from '@/pages/cakes-page'
import GalleryPage from '@/pages/gallery-page'
import ContactPage from '@/pages/contact-page'

const Layout = () => (
  <>
    <FloatingBackground />
    <Navbar />
    <main>
      <Outlet />
    </main>
    <Footer />
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
