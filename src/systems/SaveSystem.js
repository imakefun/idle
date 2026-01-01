/**
 * Save System - Handles localStorage persistence
 * Save format: norrathIdleSave_v21
 */

const SAVE_KEY = 'norrathIdleSave_v21';
const SAVE_VERSION = 21;

/**
 * Save game state to localStorage
 * @param {Object} gameState - The complete game state to save
 * @returns {boolean} - Success status
 */
export function saveGame(gameState) {
  try {
    const saveData = {
      version: SAVE_VERSION,
      timestamp: Date.now(),
      state: gameState,
    };

    const serialized = JSON.stringify(saveData);
    localStorage.setItem(SAVE_KEY, serialized);

    console.log('[SaveSystem] Game saved successfully');
    return true;
  } catch (error) {
    console.error('[SaveSystem] Failed to save game:', error);
    return false;
  }
}

/**
 * Load game state from localStorage
 * @returns {Object|null} - The loaded game state or null if no save exists
 */
export function loadGame() {
  try {
    const serialized = localStorage.getItem(SAVE_KEY);

    if (!serialized) {
      console.log('[SaveSystem] No save data found');
      return null;
    }

    const saveData = JSON.parse(serialized);

    // Version check
    if (saveData.version !== SAVE_VERSION) {
      console.warn('[SaveSystem] Save version mismatch. Migration needed.');
      // TODO: Implement save migration in the future
      return migrateSave(saveData);
    }

    console.log('[SaveSystem] Game loaded successfully');
    return saveData.state;
  } catch (error) {
    console.error('[SaveSystem] Failed to load game:', error);
    return null;
  }
}

/**
 * Delete save data from localStorage
 * @returns {boolean} - Success status
 */
export function deleteSave() {
  try {
    localStorage.removeItem(SAVE_KEY);
    console.log('[SaveSystem] Save deleted successfully');
    return true;
  } catch (error) {
    console.error('[SaveSystem] Failed to delete save:', error);
    return false;
  }
}

/**
 * Check if a save exists
 * @returns {boolean} - Whether a save exists
 */
export function hasSave() {
  return localStorage.getItem(SAVE_KEY) !== null;
}

/**
 * Get save metadata without loading full save
 * @returns {Object|null} - Save metadata (version, timestamp) or null
 */
export function getSaveMetadata() {
  try {
    const serialized = localStorage.getItem(SAVE_KEY);

    if (!serialized) {
      return null;
    }

    const saveData = JSON.parse(serialized);

    return {
      version: saveData.version,
      timestamp: saveData.timestamp,
      date: new Date(saveData.timestamp),
    };
  } catch (error) {
    console.error('[SaveSystem] Failed to get save metadata:', error);
    return null;
  }
}

/**
 * Migrate old save data to current version
 * @param {Object} oldSave - Old save data
 * @returns {Object|null} - Migrated save state or null if migration fails
 */
function migrateSave(oldSave) {
  // TODO: Implement proper migration logic
  console.warn('[SaveSystem] Save migration not yet implemented');

  // For now, return null to force new game
  // In the future, implement version-by-version migrations
  return null;
}

/**
 * Export save data as downloadable file
 */
export function exportSave() {
  try {
    const serialized = localStorage.getItem(SAVE_KEY);

    if (!serialized) {
      throw new Error('No save data to export');
    }

    const blob = new Blob([serialized], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `norrath-idle-save-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    console.log('[SaveSystem] Save exported successfully');
  } catch (error) {
    console.error('[SaveSystem] Failed to export save:', error);
  }
}

/**
 * Import save data from file
 * @param {File} file - The save file to import
 * @returns {Promise<boolean>} - Success status
 */
export async function importSave(file) {
  try {
    const text = await file.text();
    const saveData = JSON.parse(text);

    // Validate save data structure
    if (!saveData.version || !saveData.state) {
      throw new Error('Invalid save file format');
    }

    localStorage.setItem(SAVE_KEY, text);
    console.log('[SaveSystem] Save imported successfully');
    return true;
  } catch (error) {
    console.error('[SaveSystem] Failed to import save:', error);
    return false;
  }
}

export default {
  save: saveGame,
  load: loadGame,
  delete: deleteSave,
  hasSave,
  getSaveMetadata,
  export: exportSave,
  import: importSave,
};
