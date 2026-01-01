import { useState, useCallback, useEffect } from 'react'
import './App.css'
import useGameLoop from './hooks/useGameLoop'
import useSaveGame from './hooks/useSaveGame'
import useGameData from './hooks/useGameData'

function App() {
  // Load game data from Google Sheets
  const { data: gameData, loading: dataLoading, error: dataError, refresh: refreshData } = useGameData();

  // Initialize game state
  const [gameState, setGameState] = useState(() => {
    // Try to load saved game on mount
    const savedState = localStorage.getItem('norrathIdleSave_v21');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        return parsed.state || getInitialGameState();
      } catch (e) {
        return getInitialGameState();
      }
    }
    return getInitialGameState();
  });

  // Save/load hooks
  const { saveGame, loadGame, hasSave, deleteSave } = useSaveGame(gameState, setGameState, true, 1000);

  // Game loop callback
  const onGameTick = useCallback(({ deltaTime, tickCount }) => {
    if (!gameState.gameStarted) return;

    setGameState(prev => ({
      ...prev,
      tickCount,
      playTime: prev.playTime + deltaTime,
      // Increment experience as a demo (1 XP per tick)
      experience: prev.experience + 1,
    }));
  }, [gameState.gameStarted]);

  // Start the game loop
  const { tickCount } = useGameLoop(onGameTick, gameState.gameStarted);

  const startNewGame = () => {
    setGameState(prev => ({
      ...prev,
      gameStarted: true,
    }));
  };

  const handleLoadGame = () => {
    const loaded = loadGame();
    if (!loaded) {
      alert('No save game found!');
    }
  };

  const handleDeleteSave = () => {
    if (window.confirm('Are you sure you want to delete your save?')) {
      deleteSave();
      setGameState(getInitialGameState());
    }
  };

  // Format time display
  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  };

  // Show loading screen while data is loading
  if (dataLoading) {
    return (
      <div className="app">
        <header className="header">
          <h1>Norrath Idle</h1>
          <p className="subtitle">A Text-Based Idle RPG</p>
        </header>
        <main className="main-content">
          <div className="welcome-screen">
            <h2>Loading Game Data...</h2>
            <p style={{ marginTop: '1rem' }}>🌐 Fetching data from Google Sheets...</p>
            <div style={{
              marginTop: '2rem',
              width: '100%',
              maxWidth: '300px',
              height: '4px',
              background: 'var(--bg-secondary)',
              borderRadius: '2px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                background: 'var(--accent)',
                animation: 'loading 1.5s ease-in-out infinite'
              }} />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Norrath Idle</h1>
        <p className="subtitle">A Text-Based Idle RPG</p>
      </header>

      <main className="main-content">
        {!gameState.gameStarted ? (
          <div className="welcome-screen">
            <h2>Welcome to Norrath</h2>
            <p>Embark on an epic idle adventure inspired by classic MMORPGs.</p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                className="btn btn-primary"
                onClick={startNewGame}
              >
                New Game
              </button>

              {hasSave() && (
                <button
                  className="btn btn-primary"
                  onClick={handleLoadGame}
                >
                  Load Game
                </button>
              )}
            </div>

            <div style={{ marginTop: '2rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <p>✅ Phase 1.1: Project Setup Complete</p>
              <p>✅ Phase 1.2: Game Loop Active</p>
              <p>✅ Phase 1.3: Save/Load System Working</p>
              <p>✅ Phase 1.5: Google Sheets Integration Active</p>
            </div>

            {/* Data status indicator */}
            {gameData && (
              <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                background: 'var(--bg-secondary)',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}>
                <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>📊 Game Data Loaded:</p>
                <p>• {Object.keys(gameData.races || {}).length} Races</p>
                <p>• {Object.keys(gameData.classes || {}).length} Classes</p>
                <p>• {Object.keys(gameData.monsters || {}).length} Monsters</p>
                <p>• {Object.keys(gameData.items || {}).length} Items</p>
                <p>• {Object.keys(gameData.zones || {}).length} Zones</p>
                <button
                  onClick={refreshData}
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.75rem',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border)',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    color: 'var(--text-primary)'
                  }}
                >
                  🔄 Refresh Data
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="game-content">
            <div className="game-stats" style={{
              background: 'var(--bg-secondary)',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1rem'
            }}>
              <h3 style={{ marginBottom: '0.5rem' }}>Demo Stats (Phase 1 Test)</h3>
              <p>⏱️ Play Time: {formatTime(gameState.playTime)}</p>
              <p>🔄 Tick Count: {gameState.tickCount.toLocaleString()}</p>
              <p>⭐ Experience: {gameState.experience.toLocaleString()}</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                Game Loop: Running at 10 ticks/second
              </p>
            </div>

            <div className="game-controls" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary"
                onClick={() => saveGame()}
              >
                💾 Manual Save
              </button>

              <button
                className="btn btn-primary"
                onClick={handleDeleteSave}
              >
                🗑️ Delete Save
              </button>

              <button
                className="btn btn-primary"
                onClick={() => setGameState(getInitialGameState())}
              >
                🔄 Reset Game
              </button>
            </div>

            <p style={{
              marginTop: '1rem',
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              padding: '1rem',
              background: 'var(--bg-tertiary)',
              borderRadius: '8px'
            }}>
              💡 The game auto-saves every second and when you close the page.
              Try closing the tab and reopening - your progress will be saved!
            </p>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Norrath Idle v0.1.5 | Phase 1.5: Data Integration ✅</p>
      </footer>
    </div>
  )
}

// Initial game state factory
function getInitialGameState() {
  return {
    gameStarted: false,
    tickCount: 0,
    playTime: 0,
    experience: 0,
  };
}

export default App
