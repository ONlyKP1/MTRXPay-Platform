import { useState, useEffect } from 'react'

function App() {
  const [status, setStatus] = useState('checking...')

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setStatus(data.status))
      .catch(() => setStatus('offline'))
  }, [])

  return (
    <div className="app">
      <h1>MTRX Pay</h1>
      <p>API Status: <span className={status === 'ok' ? 'online' : 'offline'}>{status}</span></p>
    </div>
  )
}

export default App
