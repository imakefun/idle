import { useState, useCallback, useEffect } from 'react'
import './App.css'
import useGameLoop from './hooks/useGameLoop'
import useSaveGame from './hooks/useSaveGame'
import useGameData from './hooks/useGameData'
import CharacterCreation from './components/Character/CharacterCreation'
import Inventory from './components/Inventory/Inventory'
import Equipment from './components/Inventory/Equipment'
import Zones from './components/Zones/Zones'
import { createCharacter, consumeItem, equipItem, removeItemFromInventory, addItemToInventory } from './utils/characterHelpers'
import { calculateXPForLevel, calculateDrainRate, formatCurrency, calculateAC } from './utils/calculations'
import { clearCache } from './systems/DataSync'

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
    if (!gameState.gameStarted || !gameState.characterCreated) return;

    setGameState(prev => {
      const updates = {
        tickCount,
        playTime: prev.playTime + deltaTime
      };

      // Drain food and water over time
      if (prev.level) {
        const drainRate = calculateDrainRate(prev.level);
        updates.food = Math.max(0, prev.food - drainRate);
        updates.water = Math.max(0, prev.water - drainRate);
      }

      return {
        ...prev,
        ...updates
      };
    });
  }, [gameState.gameStarted, gameState.characterCreated]);

  // Start the game loop
  const { tickCount } = useGameLoop(onGameTick, gameState.gameStarted);

  const startNewGame = () => {
    setGameState(prev => ({
      ...prev,
      gameStarted: true,
      characterCreated: false,
    }));
  };

  const handleCreateCharacter = (characterInfo) => {
    const newCharacter = createCharacter(characterInfo, gameData);
    setGameState(newCharacter);
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

  // Item handlers
  const handleUseItem = (item) => {
    setGameState(prev => {
      const result = consumeItem(prev.inventory, item.id, prev);
      if (result.success) {
        return { ...prev };
      }
      return prev;
    });
  };

  const handleEquipItem = (item) => {
    setGameState(prev => {
      const result = equipItem(prev.inventory, prev.equipped, item.id);
      if (result.success) {
        // Recalculate AC after equipping
        const newAC = calculateAC(prev.equipped, prev.stats.AGI);
        return { ...prev, ac: newAC };
      }
      return prev;
    });
  };

  const handleDropItem = (item) => {
    if (window.confirm(`Drop ${item.name}?`)) {
      setGameState(prev => {
        removeItemFromInventory(prev.inventory, item.id, 1);
        return { ...prev };
      });
    }
  };

  const handleUnequipItem = (item) => {
    setGameState(prev => {
      // Find the slot the item is in
      const slot = Object.keys(prev.equipped).find(s => prev.equipped[s]?.id === item.id);
      if (slot) {
        // Add to inventory
        const result = addItemToInventory(prev.inventory, item, 1);
        if (result.success) {
          // Remove from equipped
          delete prev.equipped[slot];
          // Recalculate AC
          const newAC = calculateAC(prev.equipped, prev.stats.AGI);
          return { ...prev, ac: newAC };
        }
      }
      return prev;
    });
  };

  // Clear cache and refresh data
  const handleClearCacheAndRefresh = () => {
    clearCache();
    refreshData();
  };

  // Handle zone travel
  const handleZoneChange = (newZoneId) => {
    setGameState(prev => ({
      ...prev,
      currentZone: newZoneId,
      currentCamp: null, // Clear camp when changing zones
      target: null // Clear target when changing zones
    }));
  };

  // Handle camp travel
  const handleCampChange = (zoneId, campId) => {
    setGameState(prev => ({
      ...prev,
      currentZone: zoneId,
      currentCamp: campId,
      target: null // Clear target when changing camps
    }));
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
                <p>• {Object.keys(gameData.camps || {}).length} Camps</p>
                {gameData.items && (
                  <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border)', paddingTop: '0.5rem' }}>
                    <p style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>🔍 Debug - Item Icons:</p>
                    <p>• Rations: {gameData.items.rations?.icon || '(no icon)'}</p>
                    <p>• Water Flask: {gameData.items.water_flask?.icon || '(no icon)'}</p>
                    <p>• Rusty Sword: {gameData.items.rusty_sword?.icon || '(no icon)'}</p>
                  </div>
                )}
                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={refreshData}
                    style={{
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
                  <button
                    onClick={handleClearCacheAndRefresh}
                    style={{
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.75rem',
                      background: 'var(--accent)',
                      border: '1px solid var(--accent)',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      color: 'white'
                    }}
                    title="Clear cached data and refresh from Google Sheets"
                  >
                    🗑️ Clear Cache & Refresh
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : !gameState.characterCreated ? (
          <CharacterCreation
            gameData={gameData}
            onCreateCharacter={handleCreateCharacter}
          />
        ) : (
          <div className="game-content">
            {/* Character Info Header */}
            <div className="game-stats" style={{
              background: 'var(--bg-secondary)',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1rem'
            }}>
              <h3 style={{ marginBottom: '0.5rem' }}>{gameState.name} - Level {gameState.level}</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                {gameState.raceName} {gameState.className} | {gameData?.zones[gameState.currentZone]?.name || gameState.currentZone}
              </p>

              {/* HP and Stamina */}
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>HP:</strong> {gameState.hp}/{gameState.maxHp}
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginTop: '0.25rem'
                }}>
                  <div style={{
                    width: `${(gameState.hp / gameState.maxHp) * 100}%`,
                    height: '100%',
                    background: '#ff0000',
                    transition: 'width 0.3s'
                  }} />
                </div>
              </div>

              <div style={{ marginBottom: '0.5rem' }}>
                <strong>Stamina:</strong> {Math.floor(gameState.stamina)}/{gameState.maxStamina}
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginTop: '0.25rem'
                }}>
                  <div style={{
                    width: `${(gameState.stamina / gameState.maxStamina) * 100}%`,
                    height: '100%',
                    background: '#ffff00',
                    transition: 'width 0.3s'
                  }} />
                </div>
              </div>

              {/* Food and Water */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.5rem' }}>
                <div>
                  <strong>Food:</strong> {Math.floor(gameState.food)}%
                  <div style={{
                    width: '100%',
                    height: '6px',
                    background: 'var(--bg-tertiary)',
                    borderRadius: '3px',
                    overflow: 'hidden',
                    marginTop: '0.25rem'
                  }}>
                    <div style={{
                      width: `${gameState.food}%`,
                      height: '100%',
                      background: gameState.food < 20 ? '#ff0000' : '#00ff00',
                      transition: 'width 0.3s'
                    }} />
                  </div>
                </div>
                <div>
                  <strong>Water:</strong> {Math.floor(gameState.water)}%
                  <div style={{
                    width: '100%',
                    height: '6px',
                    background: 'var(--bg-tertiary)',
                    borderRadius: '3px',
                    overflow: 'hidden',
                    marginTop: '0.25rem'
                  }}>
                    <div style={{
                      width: `${gameState.water}%`,
                      height: '100%',
                      background: gameState.water < 20 ? '#ff0000' : '#00ccff',
                      transition: 'width 0.3s'
                    }} />
                  </div>
                </div>
              </div>

              {/* XP Progress */}
              <div style={{ marginTop: '0.5rem' }}>
                <strong>XP:</strong> {gameState.xp}/{gameState.xpForNextLevel}
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginTop: '0.25rem'
                }}>
                  <div style={{
                    width: `${(gameState.xp / gameState.xpForNextLevel) * 100}%`,
                    height: '100%',
                    background: 'var(--accent)',
                    transition: 'width 0.3s'
                  }} />
                </div>
              </div>

              {/* Stats and Other Info */}
              <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <p>⚔️ AC: {gameState.ac} | 💰 {formatCurrency(gameState.currency)}</p>
                <p>⏱️ Play Time: {formatTime(gameState.playTime)}</p>
              </div>
            </div>

            {/* Equipment and Inventory */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <Equipment
                equipped={gameState.equipped}
                onUnequip={handleUnequipItem}
              />
              <Inventory
                inventory={gameState.inventory}
                onUseItem={handleUseItem}
                onEquipItem={handleEquipItem}
                onDropItem={handleDropItem}
              />
            </div>

            {/* Zone Travel */}
            <div style={{ marginBottom: '1rem' }}>
              <Zones
                gameData={gameData}
                currentZone={gameState.currentZone}
                currentCamp={gameState.currentCamp}
                characterLevel={gameState.level}
                onZoneChange={handleZoneChange}
                onCampChange={handleCampChange}
              />
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
        <p>Norrath Idle v0.3.0 | Phase 3: Inventory & Items ✅</p>
      </footer>
    </div>
  )
}

// Initial game state factory
function getInitialGameState() {
  return {
    gameStarted: false,
    characterCreated: false,
    tickCount: 0,
    playTime: 0,
  };
}

export default App
