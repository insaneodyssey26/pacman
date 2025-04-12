import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [currentTheme, setCurrentTheme] = useState(0)
  
  // Array of background themes that will rotate
  const themes = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(to right, #fc5c7d, #6a82fb)',
    'linear-gradient(to right, #00b09b, #96c93d)',
    'linear-gradient(to right, #ff8177 0%, #ff867a 0%, #ff8c7f 21%, #f99185 52%, #cf556c 78%, #b12a5b 100%)'
  ]
  
  // Auto-rotate themes every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTheme(prev => (prev + 1) % themes.length)
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="app-wrapper" style={{
      background: themes[currentTheme],
      minHeight: '100vh',
      transition: 'background 2s ease',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      textShadow: '1px 1px 3px rgba(0,0,0,0.3)'
    }}>
      <div className="logo-container" style={{
        display: 'flex',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        <a href="https://vite.dev" target="_blank" style={{ 
          filter: 'drop-shadow(0 0 0.75rem rgba(255,255,255,0.5))' 
        }}>
          <img src={viteLogo} className="logo" alt="Vite logo" style={{ height: '8em' }} />
        </a>
        <a href="https://react.dev" target="_blank" style={{ 
          filter: 'drop-shadow(0 0 0.75rem rgba(255,255,255,0.5))' 
        }}>
          <img src={reactLogo} className="logo react" alt="React logo" style={{ height: '8em' }} />
        </a>
      </div>
      <h1 style={{ 
        fontSize: '3.2em', 
        marginBottom: '1rem',
        fontWeight: 'bold',
        letterSpacing: '2px'
      }}>Vite + React</h1>
      <div className="card" style={{
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        padding: '2rem',
        borderRadius: '1rem',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        textAlign: 'center',
        width: '80%',
        maxWidth: '500px'
      }}>
        <button onClick={() => setCount((count) => count + 1)} style={{
          padding: '0.8em 1.6em',
          borderRadius: '8px',
          border: 'none',
          background: 'white',
          color: '#333',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'transform 0.1s',
          transform: 'scale(1)',
          fontSize: '1rem',
          marginBottom: '1rem'
        }}
        onMouseDown={() => { document.activeElement.style.transform = 'scale(0.95)' }}
        onMouseUp={() => { document.activeElement.style.transform = 'scale(1)' }}
        >
          count is {count}
        </button>
        <p style={{ fontSize: '1.1em' }}>
          Edit <code style={{ background: 'rgba(0,0,0,0.2)', padding: '0.2em 0.4em', borderRadius: '4px' }}>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs" style={{
        marginTop: '2rem',
        opacity: '0.8',
        fontSize: '0.9em'
      }}>
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
