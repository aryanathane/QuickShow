import React from 'react'

// Catches render errors anywhere below it, so a crash shows a message
// instead of a blank page.
class ErrorBoundary extends React.Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('UI crashed:', error, info?.componentStack)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className='min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center'>
        <h1 className='text-2xl font-semibold'>Something went wrong</h1>
        <p className='text-gray-400 max-w-md'>
          The page hit an unexpected error. Reloading usually fixes it.
        </p>
        <div className='flex gap-3'>
          <button
            onClick={() => window.location.reload()}
            className='px-6 py-2 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer'
          >
            Reload page
          </button>
          <button
            onClick={() => { window.location.href = '/' }}
            className='px-6 py-2 text-sm bg-gray-700 hover:bg-gray-800 transition rounded-md font-medium cursor-pointer'
          >
            Go home
          </button>
        </div>
      </div>
    )
  }
}

export default ErrorBoundary