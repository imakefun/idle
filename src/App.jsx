import { useState } from 'react'
import './App.css'

function App() {
  const [gameStarted, setGameStarted] = useState(false)

  return (
    <div className="app">
      <header className="header">
        <h1>Norrath Idle</h1>
        <p className="subtitle">A Text-Based Idle RPG</p>
      </header>

      <main className="main-content">
        {!gameStarted ? (
          <div className="welcome-screen">
            <h2>Welcome to Norrath</h2>
            <p>Embark on an epic idle adventure inspired by classic MMORPGs.</p>
            <button
              className="btn btn-primary"
              onClick={() => setGameStarted(true)}
            >
              Start Your Journey
            </button>
          </div>
        ) : (
          <div className="game-content">
            <p>Game content will go here...</p>
            <p>Phase 1: Core Foundation in progress</p>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Norrath Idle v0.1.0 | Phase 1: Core Foundation</p>
      </footer>
    </div>
  )
}

export default App
