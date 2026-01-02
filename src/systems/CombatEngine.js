/**
 * Combat Engine
 * Handles all combat calculations and mechanics
 */

/**
 * Calculate if an attack hits
 * @param {number} attackerSkill - Attacker's weapon skill
 * @param {number} attackerLevel - Attacker's level
 * @param {number} defenderLevel - Defender's level
 * @returns {boolean} - True if hit, false if miss
 */
export function calculateHit(attackerSkill = 0, attackerLevel, defenderLevel) {
  const baseChance = 50;
  const skillBonus = (attackerSkill - defenderLevel * 5) * 2;
  const levelPenalty = (defenderLevel - attackerLevel) * 5;

  const hitChance = Math.max(5, Math.min(95, baseChance + skillBonus - levelPenalty));

  return Math.random() * 100 < hitChance;
}

/**
 * Calculate damage dealt
 * @param {number} weaponMin - Weapon minimum damage
 * @param {number} weaponMax - Weapon maximum damage
 * @param {number} strength - Attacker's strength stat
 * @returns {number} - Damage dealt
 */
export function calculateDamage(weaponMin, weaponMax, strength = 0) {
  // Random weapon damage
  const weaponDamage = Math.floor(Math.random() * (weaponMax - weaponMin + 1)) + weaponMin;

  // Strength bonus
  const strBonus = Math.floor(strength / 10);

  // Random 1d4
  const randomBonus = Math.floor(Math.random() * 4) + 1;

  return Math.max(1, weaponDamage + strBonus + randomBonus);
}

/**
 * Apply AC mitigation to damage
 * @param {number} damage - Base damage
 * @param {number} ac - Armor class
 * @param {number} attackerLevel - Attacker's level
 * @returns {number} - Mitigated damage
 */
export function applyACMitigation(damage, ac, attackerLevel) {
  const mitigation = ac / (ac + 50 + attackerLevel * 2);
  const mitigatedDamage = Math.floor(damage * (1 - mitigation));

  return Math.max(1, mitigatedDamage);
}

/**
 * Calculate XP reward with triviality system
 * @param {number} baseXP - Base XP reward
 * @param {number} playerLevel - Player's level
 * @param {number} monsterLevel - Monster's level
 * @returns {number} - Actual XP reward
 */
export function calculateXPReward(baseXP, playerLevel, monsterLevel) {
  const levelDiff = playerLevel - monsterLevel;

  // Green con: 5+ levels below player = 0 XP
  if (levelDiff >= 5) {
    return 0;
  }

  // Reduced XP for lower level mobs (3-4 levels below)
  if (levelDiff >= 3) {
    return Math.floor(baseXP * 0.25);
  }

  return baseXP;
}

/**
 * Get con color based on level difference
 * @param {number} playerLevel - Player's level
 * @param {number} monsterLevel - Monster's level
 * @returns {string} - Con color
 */
export function getConColor(playerLevel, monsterLevel) {
  const diff = playerLevel - monsterLevel;

  if (diff >= 5) return 'green';      // Trivial
  if (diff >= 3) return 'lightblue';  // Easy
  if (diff >= -2) return 'white';     // Fair match
  if (diff >= -4) return 'yellow';    // Tough
  return 'red';                        // Very dangerous
}

/**
 * Get con description
 * @param {number} playerLevel - Player's level
 * @param {number} monsterLevel - Monster's level
 * @returns {string} - Con description
 */
export function getConDescription(playerLevel, monsterLevel) {
  const diff = playerLevel - monsterLevel;

  if (diff >= 5) return 'trivial';
  if (diff >= 3) return 'easy';
  if (diff >= -2) return 'fair';
  if (diff >= -4) return 'tough';
  return 'very dangerous';
}

/**
 * Select random monster from available pool
 * @param {Array} monsters - Array of available monsters
 * @returns {Object} - Monster with initialized combat stats
 */
export function selectRandomMonster(monsters) {
  if (!monsters || monsters.length === 0) return null;

  const monster = monsters[Math.floor(Math.random() * monsters.length)];

  // Create combat instance with current HP
  return {
    ...monster,
    maxHp: parseInt(monster.hp),
    currentHp: parseInt(monster.hp),
    level: parseInt(monster.level),
    ac: parseInt(monster.ac),
    minDmg: parseInt(monster.minDmg),
    maxDmg: parseInt(monster.maxDmg),
    xpReward: parseInt(monster.xpReward)
  };
}

/**
 * Process a full combat round (player attack + monster counter)
 * @param {Object} player - Player state
 * @param {Object} monster - Monster state
 * @param {Object} gameData - Game data
 * @returns {Object} - Combat result with logs and updates
 */
export function processCombatRound(player, monster, gameData) {
  const logs = [];
  const updates = {};

  // Player attack
  const playerWeapon = player.equipped?.primary;
  const weaponMin = playerWeapon ? parseInt(playerWeapon.damage) : 1;
  const weaponMax = playerWeapon ? parseInt(playerWeapon.damage) + 2 : 3;
  const playerSTR = player.stats?.STR || 75;

  const playerHits = calculateHit(0, player.level, monster.level);

  if (playerHits) {
    const damage = calculateDamage(weaponMin, weaponMax, playerSTR);
    const finalDamage = applyACMitigation(damage, monster.ac, player.level);

    monster.currentHp -= finalDamage;

    logs.push({
      type: 'damage-dealt',
      color: '#ff4444',
      message: `You hit ${monster.name} for ${finalDamage} damage!`
    });
  } else {
    logs.push({
      type: 'miss',
      color: '#888888',
      message: `You miss ${monster.name}!`
    });
  }

  // Check if monster died
  if (monster.currentHp <= 0) {
    const xpGained = calculateXPReward(monster.xpReward, player.level, monster.level);

    logs.push({
      type: 'death',
      color: '#ffff44',
      message: `${monster.name} has been slain!`
    });

    if (xpGained > 0) {
      logs.push({
        type: 'xp-gain',
        color: '#4444ff',
        message: `You gain ${xpGained} experience!`
      });

      updates.xp = player.xp + xpGained;
    } else {
      logs.push({
        type: 'system',
        color: '#888888',
        message: `This monster is too trivial to grant experience.`
      });
    }

    updates.target = null;
    updates.inCombat = false;

    return { logs, updates, monsterDied: true };
  }

  // Monster counter-attack
  const monsterHits = calculateHit(0, monster.level, player.level);

  if (monsterHits) {
    const damage = calculateDamage(monster.minDmg, monster.maxDmg, 0);
    const finalDamage = applyACMitigation(damage, player.ac, monster.level);

    updates.hp = Math.max(0, player.hp - finalDamage);

    logs.push({
      type: 'damage-taken',
      color: '#ff8844',
      message: `${monster.name} hits you for ${finalDamage} damage!`
    });

    // Check if player died
    if (updates.hp <= 0) {
      logs.push({
        type: 'death',
        color: '#ff0000',
        message: `You have been slain!`
      });

      updates.playerDied = true;
    }
  } else {
    logs.push({
      type: 'miss',
      color: '#888888',
      message: `${monster.name} misses you!`
    });
  }

  return { logs, updates, monster, monsterDied: false };
}
