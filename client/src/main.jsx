import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import { AppProvider } from './context/AppContext.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const root = createRoot(document.getElementById('root'))

if (!PUBLISHABLE_KEY) {
  // A missing key used to throw before React rendered, giving a blank page.
  root.render(
    <div className='min-h-screen flex flex-col items-center justify-center gap-3 px-6 text-center'>
      <h1 className='text-2xl font-semibold'>Configuration error</h1>
      <p className='text-gray-400 max-w-md'>
        VITE_CLERK_PUBLISHABLE_KEY is missing. Add it to <code>client/.env</code> and restart the dev server.
      </p>
    </div>
  )
} else {
  root.render(
    <ErrorBoundary>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <BrowserRouter>
          <AppProvider>
            <App />
          </AppProvider>
        </BrowserRouter>
      </ClerkProvider>
    </ErrorBoundary>,
  )
}