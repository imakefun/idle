import { useCallback, useEffect } from 'react';
import SaveSystem from '../systems/SaveSystem';

/**
 * Custom hook for game save/load functionality
 * @param {Object} gameState - Current game state
 * @param {Function} setGameState - Function to update game state
 * @param {boolean} autoSave - Whether to auto-save on state changes
 * @param {number} autoSaveInterval - Auto-save interval in milliseconds (default: 1000ms)
 */
export function useSaveGame(gameState, setGameState, autoSave = true, autoSaveInterval = 1000) {
  // Manual save function
  const saveGame = useCallback(() => {
    const success = SaveSystem.save(gameState);
    return success;
  }, [gameState]);

  // Load game function
  const loadGame = useCallback(() => {
    const loadedState = SaveSystem.load();
    if (loadedState) {
      setGameState(loadedState);
      return true;
    }
    return false;
  }, [setGameState]);

  // Delete save function
  const deleteSave = useCallback(() => {
    const success = SaveSystem.delete();
    return success;
  }, []);

  // Auto-save effect
  useEffect(() => {
    if (!autoSave || !gameState) {
      return;
    }

    // Debounce auto-save to avoid too frequent saves
    const timer = setTimeout(() => {
      SaveSystem.save(gameState);
    }, autoSaveInterval);

    return () => clearTimeout(timer);
  }, [gameState, autoSave, autoSaveInterval]);

  // Auto-save on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (gameState) {
        SaveSystem.save(gameState);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [gameState]);

  return {
    saveGame,
    loadGame,
    deleteSave,
    hasSave: SaveSystem.hasSave,
    getSaveMetadata: SaveSystem.getSaveMetadata,
    exportSave: SaveSystem.export,
    importSave: SaveSystem.import,
  };
}

export default useSaveGame;
