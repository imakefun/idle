/**
 * Data Synchronization System
 * Manages loading game data from Google Sheets with caching and fallback
 */

import { fetchMultipleSheets } from '../utils/sheetsApi';
import { fallbackData } from '../data/fallback';

const CACHE_KEY = 'norrathIdleGameData_v1';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// List of all sheets to fetch
const SHEET_NAMES = ['Races', 'Classes', 'Monsters', 'Items', 'Zones'];

/**
 * Load game data with caching and fallback support
 * @returns {Promise<Object>} Transformed game data
 */
export async function loadGameData() {
  // Check cache first
  const cached = getCachedData();
  if (cached) {
    console.log('📦 Using cached game data');
    return cached.data;
  }

  // Try to fetch from Google Sheets
  try {
    console.log('🌐 Fetching game data from Google Sheets...');
    const rawData = await fetchMultipleSheets(SHEET_NAMES);

    // Check if any sheets failed to load
    const failedSheets = Object.entries(rawData)
      .filter(([_, data]) => data === null)
      .map(([name]) => name);

    if (failedSheets.length > 0) {
      console.warn('⚠️ Some sheets failed to load:', failedSheets);
      throw new Error(`Failed to load sheets: ${failedSheets.join(', ')}`);
    }

    // Transform the data
    const transformedData = transformGameData(rawData);

    // Validate the data
    validateGameData(transformedData);

    // Cache the data
    cacheData(transformedData);

    console.log('✅ Game data loaded from Google Sheets successfully');
    return transformedData;

  } catch (error) {
    console.error('❌ Failed to load from Google Sheets:', error);
    console.log('📂 Using fallback static data');
    return transformGameData(fallbackData);
  }
}

/**
 * Transform raw sheet data into structured game data
 * @param {Object} rawData - Raw data from sheets
 * @returns {Object} Transformed data
 */
function transformGameData(rawData) {
  return {
    races: transformRaces(rawData.Races || []),
    classes: transformClasses(rawData.Classes || []),
    monsters: transformMonsters(rawData.Monsters || []),
    items: transformItems(rawData.Items || []),
    zones: transformZones(rawData.Zones || [])
  };
}

/**
 * Transform Races sheet data
 */
function transformRaces(rows) {
  const races = {};
  rows.forEach(row => {
    if (!row.id) return; // Skip invalid rows

    races[row.id] = {
      id: row.id,
      name: row.name,
      stats: {
        STR: parseInt(row.STR) || 75,
        STA: parseInt(row.STA) || 75,
        AGI: parseInt(row.AGI) || 75,
        DEX: parseInt(row.DEX) || 75,
        WIS: parseInt(row.WIS) || 75,
        INT: parseInt(row.INT) || 75,
        CHA: parseInt(row.CHA) || 75
      },
      description: row.description || ''
    };
  });
  return races;
}

/**
 * Transform Classes sheet data
 */
function transformClasses(rows) {
  const classes = {};
  rows.forEach(row => {
    if (!row.id) return;

    classes[row.id] = {
      id: row.id,
      name: row.name,
      hpModifier: parseInt(row.hpModifier) || 15,
      primaryStat: row.primaryStat || 'STR',
      description: row.description || ''
    };
  });
  return classes;
}

/**
 * Transform Monsters sheet data
 */
function transformMonsters(rows) {
  const monsters = {};
  rows.forEach(row => {
    if (!row.id) return;

    monsters[row.id] = {
      id: row.id,
      name: row.name,
      level: parseInt(row.level) || 1,
      hp: parseInt(row.hp) || 10,
      damage: {
        min: parseInt(row.minDmg) || 1,
        max: parseInt(row.maxDmg) || 2
      },
      ac: parseInt(row.ac) || 0,
      xpReward: parseInt(row.xpReward) || 5,
      isRare: row.isRare === 'TRUE' || row.isRare === true
    };
  });
  return monsters;
}

/**
 * Transform Items sheet data
 */
function transformItems(rows) {
  const items = {};
  rows.forEach(row => {
    if (!row.id) return;

    items[row.id] = {
      id: row.id,
      name: row.name,
      type: row.type || 'junk',
      stackable: row.stackable === 'TRUE' || row.stackable === true,
      maxStack: parseInt(row.maxStack) || 1,
      value: parseInt(row.value) || 0,
      stats: {
        damage: parseInt(row.damage) || 0,
        delay: parseInt(row.delay) || 0,
        ac: parseInt(row.ac) || 0
      },
      slot: row.slot || 'none',
      consumable: {
        foodValue: parseInt(row.foodValue) || 0,
        waterValue: parseInt(row.waterValue) || 0
      },
      icon: row.icon || ''
    };
  });
  return items;
}

/**
 * Transform Zones sheet data
 */
function transformZones(rows) {
  const zones = {};
  rows.forEach(row => {
    if (!row.id) return;

    zones[row.id] = {
      id: row.id,
      name: row.name,
      isSafe: row.isSafe === 'TRUE' || row.isSafe === true,
      minLevel: parseInt(row.minLevel) || 1,
      maxLevel: parseInt(row.maxLevel) || 1,
      description: row.description || ''
    };
  });
  return zones;
}

/**
 * Validate loaded game data
 */
function validateGameData(data) {
  const errors = [];

  // Check that we have data for each category
  if (Object.keys(data.races).length === 0) {
    errors.push('No races loaded');
  }
  if (Object.keys(data.classes).length === 0) {
    errors.push('No classes loaded');
  }
  if (Object.keys(data.monsters).length === 0) {
    errors.push('No monsters loaded');
  }
  if (Object.keys(data.items).length === 0) {
    errors.push('No items loaded');
  }
  if (Object.keys(data.zones).length === 0) {
    errors.push('No zones loaded');
  }

  if (errors.length > 0) {
    console.warn('⚠️ Data validation warnings:', errors);
  }

  return errors.length === 0;
}

/**
 * Get cached data if still valid
 */
function getCachedData() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const parsed = JSON.parse(cached);
    const age = Date.now() - parsed.timestamp;

    if (age > CACHE_TTL) {
      console.log('📦 Cache expired');
      return null;
    }

    return parsed;
  } catch (error) {
    console.error('Failed to read cache:', error);
    return null;
  }
}

/**
 * Cache data to localStorage
 */
function cacheData(data) {
  try {
    const cacheObj = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheObj));
    console.log('💾 Game data cached');
  } catch (error) {
    console.error('Failed to cache data:', error);
  }
}

/**
 * Clear cached data (useful for debugging)
 */
export function clearCache() {
  localStorage.removeItem(CACHE_KEY);
  console.log('🗑️ Cache cleared');
}

/**
 * Force refresh data from Google Sheets
 */
export async function refreshGameData() {
  clearCache();
  return loadGameData();
}
