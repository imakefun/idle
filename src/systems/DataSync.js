/**
 * Data Synchronization System
 * Manages loading game data from Google Sheets with caching and fallback
 */

import { fetchMultipleSheets } from '../utils/sheetsApi';
import { fallbackData } from '../data/fallback';

const CACHE_KEY = 'norrathIdleGameData_v1';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// List of all sheets to fetch
const SHEET_NAMES = ['Races', 'Classes', 'Monsters', 'Items', 'Zones', 'Camps', 'Skills'];

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

    // Check if any REQUIRED sheets failed to load
    const requiredSheets = ['Races', 'Classes', 'Monsters', 'Items', 'Zones'];
    const failedRequiredSheets = requiredSheets.filter(name => rawData[name] === null);

    if (failedRequiredSheets.length > 0) {
      console.warn('⚠️ Required sheets failed to load:', failedRequiredSheets);
      throw new Error(`Failed to load required sheets: ${failedRequiredSheets.join(', ')}`);
    }

    // Check optional sheets and use fallback if missing
    if (rawData.Camps === null || rawData.Camps === undefined) {
      console.log('📋 Camps sheet not found, using fallback camps data');
      rawData.Camps = fallbackData.Camps || [];
    }

    if (rawData.Skills === null || rawData.Skills === undefined) {
      console.log('📋 Skills sheet not found, using fallback skills data');
      rawData.Skills = fallbackData.Skills || [];
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
    zones: transformZones(rawData.Zones || []),
    camps: transformCamps(rawData.Camps || []),
    skills: transformSkills(rawData.Skills || [])
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
      description: row.description || '',
      starterWeapon: row.starterWeapon || ''
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

    // Parse class restrictions (comma-separated, empty = all classes)
    const allowedClasses = row.classes && row.classes !== ''
      ? row.classes.split(',').map(c => c.trim())
      : [];

    // Parse race restrictions (comma-separated, empty = all races)
    const allowedRaces = row.races && row.races !== ''
      ? row.races.split(',').map(r => r.trim())
      : [];

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
      icon: row.icon || '',

      // Weapon properties
      weaponType: row.weaponType || '',
      handedness: row.handedness || '', // MH, OH, 1H, 2H

      // Shield properties
      shieldType: row.shieldType || '', // buckler, small, medium, large, tower

      // Armor properties
      armorType: row.armorType || '', // cloth, leather, chain, plate

      // Class and race restrictions
      allowedClasses: allowedClasses, // Empty array = all classes
      allowedRaces: allowedRaces, // Empty array = all races

      // Ammo system
      ammoType: row.ammoType || '', // arrow, bolt (for ammo items)
      requiredAmmo: row.requiredAmmo || '', // arrow, bolt (for ranged weapons)

      // Stat bonuses
      bonusStats: {
        STR: parseInt(row.STR) || 0,
        STA: parseInt(row.STA) || 0,
        AGI: parseInt(row.AGI) || 0,
        DEX: parseInt(row.DEX) || 0,
        WIS: parseInt(row.WIS) || 0,
        INT: parseInt(row.INT) || 0,
        CHA: parseInt(row.CHA) || 0
      }
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
 * Transform Camps sheet data
 */
function transformCamps(rows) {
  const camps = {};
  rows.forEach(row => {
    if (!row.id) return;

    camps[row.id] = {
      id: row.id,
      name: row.name,
      zoneId: row.zoneId || '',
      minLevel: parseInt(row.minLevel) || 1,
      maxLevel: parseInt(row.maxLevel) || 1,
      description: row.description || ''
    };
  });
  return camps;
}

/**
 * Transform Skills sheet data
 */
function transformSkills(rows) {
  const skills = {};
  rows.forEach(row => {
    if (!row.id) return;

    // Parse weapon types (comma-separated)
    const weaponTypes = row.weaponTypes && row.weaponTypes !== ''
      ? row.weaponTypes.split(',').map(t => t.trim())
      : [];

    skills[row.id] = {
      id: row.id,
      name: row.name,
      type: row.type || 'passive',
      category: row.category || 'combat',
      description: row.description || '',
      staminaCost: parseInt(row.staminaCost) || 0,
      baseProcChance: parseFloat(row.baseProcChance) || 0,
      damageBonus: parseInt(row.damageBonus) || 0,
      damageMultiplier: parseFloat(row.damageMultiplier) || 0,
      requiresShield: row.requiresShield === 'TRUE' || row.requiresShield === true,
      requiresPiercingWeapon: row.requiresPiercing === 'TRUE' || row.requiresPiercing === true,
      weaponTypes: weaponTypes
    };
  });
  return skills;
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
  if (Object.keys(data.camps || {}).length === 0) {
    console.warn('⚠️ No camps loaded - add a Camps sheet for micro-progression zones');
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
