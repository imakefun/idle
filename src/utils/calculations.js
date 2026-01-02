/**
 * Game Calculations and Formulas
 * All stat calculations, level progression, combat formulas
 */

/**
 * Calculate max HP based on level, class, and stamina
 * Formula: (Level × HPModifier) + (STA × 0.1 × Level)
 */
export function calculateMaxHP(level, classData, stamina) {
  const baseHP = level * classData.hpModifier;
  const staminaBonus = stamina * 0.1 * level;
  return Math.floor(baseHP + staminaBonus);
}

/**
 * Calculate max Stamina
 * Base stamina that increases with level
 */
export function calculateMaxStamina(level) {
  return 100 + (level * 5);
}

/**
 * Calculate total AC (Armor Class) from equipped gear
 */
export function calculateAC(equipped, baseAGI = 0) {
  let totalAC = 0;

  // Add AC from all equipped items
  Object.values(equipped).forEach(item => {
    if (item && item.stats) {
      totalAC += item.stats.ac || 0;
    }
  });

  // AGI provides a small AC bonus (1 AC per 10 AGI)
  const agiBonus = Math.floor(baseAGI / 10);

  return totalAC + agiBonus;
}

/**
 * Calculate XP required for next level
 * Formula: Level^1.9 * 100
 * This creates a smooth exponential curve
 */
export function calculateXPForLevel(level) {
  return Math.floor(Math.pow(level, 1.9) * 100);
}

/**
 * Calculate current level based on total XP
 */
export function calculateLevelFromXP(totalXP) {
  let level = 1;
  let xpNeeded = 0;

  while (xpNeeded <= totalXP) {
    level++;
    xpNeeded = calculateXPForLevel(level);
  }

  return level - 1;
}

/**
 * Calculate melee damage based on weapon and stats
 * Primary stat provides damage bonus
 */
export function calculateMeleeDamage(weapon, primaryStat, statValue) {
  if (!weapon || !weapon.stats) {
    // Unarmed damage (Monk specialty)
    const baseDamage = 2;
    const statBonus = Math.floor(statValue / 20);
    return {
      min: baseDamage + statBonus,
      max: baseDamage + statBonus + 2
    };
  }

  const weaponDamage = weapon.stats.damage || 1;
  const statBonus = Math.floor(statValue / 20);

  return {
    min: Math.max(1, weaponDamage - 1 + statBonus),
    max: weaponDamage + 2 + statBonus
  };
}

/**
 * Roll damage within a range
 */
export function rollDamage(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Calculate attack delay (in milliseconds)
 * Lower delay = faster attacks
 */
export function calculateAttackDelay(weapon) {
  if (!weapon || !weapon.stats) {
    return 2000; // Unarmed attack delay (2 seconds)
  }

  return (weapon.stats.delay || 20) * 100; // Delay in deciseconds → milliseconds
}

/**
 * Get combined stats from race and any bonuses
 */
export function calculateTotalStats(raceStats, levelBonuses = {}, equipmentBonuses = {}) {
  const stats = { ...raceStats };

  // Add level-up bonuses
  Object.keys(levelBonuses).forEach(stat => {
    stats[stat] = (stats[stat] || 0) + (levelBonuses[stat] || 0);
  });

  // Add equipment bonuses
  Object.keys(equipmentBonuses).forEach(stat => {
    stats[stat] = (stats[stat] || 0) + (equipmentBonuses[stat] || 0);
  });

  return stats;
}

/**
 * Calculate food/water drain rate per tick
 * Drains slower to make food/water last longer
 */
export function calculateDrainRate(level) {
  const baseRate = 0.015; // Reduced from 0.05 to make it 3x slower
  const levelMultiplier = 1 + (level * 0.01); // +1% per level
  return baseRate * levelMultiplier;
}

/**
 * Calculate HP regeneration per tick
 * Higher out of combat, lower in combat
 * @param {number} maxHp - Character's max HP
 * @param {number} stamina - Character's stamina stat
 * @param {boolean} inCombat - Whether character is in combat
 * @param {boolean} isResting - Whether character is resting
 * @param {number} food - Food percentage (0-100)
 * @param {number} water - Water percentage (0-100)
 * @returns {number} - HP regenerated per tick
 */
export function calculateHPRegen(maxHp, stamina, inCombat, isResting, food, water) {
  // Base regen scales with max HP and stamina
  const baseRegen = (maxHp * 0.001) + (stamina * 0.01);

  // In combat: very slow regen
  if (inCombat) {
    return Math.max(0.1, baseRegen * 0.1);
  }

  // Out of combat: normal regen
  let multiplier = 1.0;

  // Resting bonus (if food and water > 30%)
  if (isResting && food > 30 && water > 30) {
    multiplier = 3.0; // 3x regen when resting
  }

  // Starvation/dehydration penalty
  if (food < 1 || water < 1) {
    multiplier *= 0.1; // 90% penalty when starving/dehydrated
  }

  return Math.max(0.1, baseRegen * multiplier);
}

/**
 * Check if character needs to eat/drink
 */
export function needsFood(foodLevel) {
  return foodLevel < 20; // Warning threshold
}

export function needsWater(waterLevel) {
  return waterLevel < 20; // Warning threshold
}

/**
 * Calculate currency display (copper → platinum conversion)
 * 1000 copper = 1 platinum
 * 100 copper = 1 gold
 * 10 copper = 1 silver
 */
export function formatCurrency(copper) {
  const platinum = Math.floor(copper / 1000);
  const gold = Math.floor((copper % 1000) / 100);
  const silver = Math.floor((copper % 100) / 10);
  const copperRemainder = copper % 10;

  const parts = [];
  if (platinum > 0) parts.push(`${platinum}p`);
  if (gold > 0) parts.push(`${gold}g`);
  if (silver > 0) parts.push(`${silver}s`);
  if (copperRemainder > 0 || parts.length === 0) parts.push(`${copperRemainder}c`);

  return parts.join(' ');
}

/**
 * Calculate stat modifier for class compatibility
 * Returns multiplier for xp/skill gains based on primary stat
 */
export function getStatModifier(statValue) {
  if (statValue >= 100) return 1.1; // +10% bonus
  if (statValue >= 80) return 1.05; // +5% bonus
  if (statValue >= 60) return 1.0; // Normal
  if (statValue >= 40) return 0.95; // -5% penalty
  return 0.9; // -10% penalty
}
