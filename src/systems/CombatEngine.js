/**
 * Combat Engine
 * Handles all combat calculations and mechanics
 */

import { attemptSkillUp, checkAbilityProc, calculateAbilityDamage, checkAbilityRequirements, calculateDodgeChance } from './SkillSystem';
import { getWeaponSkill } from '../data/skills';

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
  // Ensure all values are numbers
  const min = parseInt(weaponMin) || 1;
  const max = parseInt(weaponMax) || 3;
  const str = parseInt(strength) || 0;

  // Random weapon damage
  const weaponDamage = Math.floor(Math.random() * (max - min + 1)) + min;

  // Strength bonus
  const strBonus = Math.floor(str / 10);

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
  // Ensure all values are numbers
  const baseDamage = parseInt(damage) || 1;
  const armorClass = parseInt(ac) || 0;
  const level = parseInt(attackerLevel) || 1;

  const mitigation = armorClass / (armorClass + 50 + level * 2);
  const mitigatedDamage = Math.floor(baseDamage * (1 - mitigation));

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
  const skillUps = [];

  // Player attack - safely parse weapon damage
  const playerWeapon = player.equipped?.primary;
  let weaponMin = 1;
  let weaponMax = 3;
  let weaponType = null;

  if (playerWeapon && playerWeapon.damage) {
    const weaponDamage = parseInt(playerWeapon.damage);
    if (!isNaN(weaponDamage)) {
      weaponMin = weaponDamage;
      weaponMax = weaponDamage + 2;
    }
    weaponType = playerWeapon.weaponType;
  }

  const playerSTR = parseInt(player.stats?.STR) || 75;
  const playerLevel = parseInt(player.level) || 1;
  const playerAC = parseInt(player.ac) || 0;

  // Determine weapon skill
  const skillDefs = gameData?.skills || {};
  const weaponSkillId = getWeaponSkill(weaponType, skillDefs);
  const weaponSkill = player.skills?.[weaponSkillId]?.current || 0;
  const offenseSkill = player.skills?.offense?.current || 0;
  const combinedSkill = Math.floor((weaponSkill + offenseSkill) / 2);

  const playerHits = calculateHit(combinedSkill, playerLevel, monster.level);

  if (playerHits) {
    let damage = calculateDamage(weaponMin, weaponMax, playerSTR);
    let abilityUsed = null;

    // Check for active ability procs
    const activeAbilities = ['kick', 'bash', 'backstab', 'doubleAttack'];
    for (const abilityId of activeAbilities) {
      if (player.skills?.[abilityId] && !abilityUsed) {
        // Check requirements (shield for bash, piercing weapon for backstab, etc.)
        if (checkAbilityRequirements(abilityId, player.equipped, skillDefs)) {
          const abilityResult = checkAbilityProc(abilityId, player.skills[abilityId].current, player.stamina, skillDefs);

          if (abilityResult.success) {
            abilityUsed = abilityId;

            // Deduct stamina
            if (abilityResult.staminaCost > 0) {
              updates.stamina = Math.max(0, player.stamina - abilityResult.staminaCost);
            }

            // Add ability damage (except doubleAttack which just attacks twice)
            if (abilityId !== 'doubleAttack') {
              const abilityDamage = calculateAbilityDamage(abilityId, damage, player.skills[abilityId].current, skillDefs);
              damage += abilityDamage;

              logs.push({
                type: 'ability',
                color: '#ff44ff',
                message: `You execute ${abilityResult.abilityName}!`
              });
            }

            break;
          }
        }
      }
    }

    const finalDamage = applyACMitigation(damage, monster.ac, playerLevel);
    monster.currentHp -= finalDamage;

    logs.push({
      type: 'damage-dealt',
      color: '#ff4444',
      message: `You hit ${monster.name} for ${finalDamage} damage!`
    });

    // Skill-up check for weapon skill
    if (weaponSkillId && player.skills?.[weaponSkillId]) {
      const skillUpResult = attemptSkillUp(
        weaponSkillId,
        player.skills[weaponSkillId].current,
        player.skills[weaponSkillId].max,
        skillDefs
      );

      if (skillUpResult.success) {
        skillUps.push(skillUpResult);
        logs.push({
          type: 'skill-up',
          color: '#44ff44',
          message: `Your ${skillUpResult.skillName} skill has increased to ${skillUpResult.newValue}!`
        });
      }
    }

    // Skill-up check for offense
    if (player.skills?.offense) {
      const offenseUpResult = attemptSkillUp(
        'offense',
        player.skills.offense.current,
        player.skills.offense.max,
        skillDefs
      );

      if (offenseUpResult.success) {
        skillUps.push(offenseUpResult);
        logs.push({
          type: 'skill-up',
          color: '#44ff44',
          message: `Your ${offenseUpResult.skillName} skill has increased to ${offenseUpResult.newValue}!`
        });
      }
    }

    // Double Attack - second hit
    if (abilityUsed === 'doubleAttack') {
      logs.push({
        type: 'ability',
        color: '#ff44ff',
        message: `You execute a double attack!`
      });

      const secondHit = calculateHit(combinedSkill, playerLevel, monster.level);
      if (secondHit) {
        const secondDamage = calculateDamage(weaponMin, weaponMax, playerSTR);
        const secondFinalDamage = applyACMitigation(secondDamage, monster.ac, playerLevel);
        monster.currentHp -= secondFinalDamage;

        logs.push({
          type: 'damage-dealt',
          color: '#ff4444',
          message: `You hit ${monster.name} for ${secondFinalDamage} damage!`
        });
      } else {
        logs.push({
          type: 'miss',
          color: '#888888',
          message: `Your second attack misses!`
        });
      }
    }
  } else {
    logs.push({
      type: 'miss',
      color: '#888888',
      message: `You miss ${monster.name}!`
    });
  }

  // Check if monster died
  if (monster.currentHp <= 0) {
    const xpGained = calculateXPReward(monster.xpReward, playerLevel, monster.level);

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

    return { logs, updates, skillUps, monsterDied: true };
  }

  // Monster counter-attack - check for dodge first
  const dodgeSkill = player.skills?.dodge?.current || 0;
  const dodgeChance = calculateDodgeChance(dodgeSkill);
  const dodgeRoll = Math.random();

  if (dodgeRoll < dodgeChance) {
    logs.push({
      type: 'dodge',
      color: '#44ffff',
      message: `You dodge ${monster.name}'s attack!`
    });

    // Skill-up check for dodge
    if (player.skills?.dodge) {
      const dodgeUpResult = attemptSkillUp(
        'dodge',
        player.skills.dodge.current,
        player.skills.dodge.max,
        skillDefs
      );

      if (dodgeUpResult.success) {
        skillUps.push(dodgeUpResult);
        logs.push({
          type: 'skill-up',
          color: '#44ff44',
          message: `Your ${dodgeUpResult.skillName} skill has increased to ${dodgeUpResult.newValue}!`
        });
      }
    }

    return { logs, updates, skillUps, monster, monsterDied: false };
  }

  // Monster counter-attack - ensure values are numbers
  const monsterMinDmg = parseInt(monster.minDmg) || 1;
  const monsterMaxDmg = parseInt(monster.maxDmg) || 3;
  const monsterLevel = parseInt(monster.level) || 1;

  const defenseSkill = player.skills?.defense?.current || 0;
  const monsterHits = !calculateHit(defenseSkill, playerLevel, monsterLevel);

  if (monsterHits) {
    const damage = calculateDamage(monsterMinDmg, monsterMaxDmg, 0);
    const finalDamage = applyACMitigation(damage, playerAC, monsterLevel);

    updates.hp = Math.max(0, player.hp - finalDamage);

    logs.push({
      type: 'damage-taken',
      color: '#ff8844',
      message: `${monster.name} hits you for ${finalDamage} damage!`
    });

    // Skill-up check for defense
    if (player.skills?.defense) {
      const defenseUpResult = attemptSkillUp(
        'defense',
        player.skills.defense.current,
        player.skills.defense.max,
        skillDefs
      );

      if (defenseUpResult.success) {
        skillUps.push(defenseUpResult);
        logs.push({
          type: 'skill-up',
          color: '#44ff44',
          message: `Your ${defenseUpResult.skillName} skill has increased to ${defenseUpResult.newValue}!`
        });
      }
    }

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

  return { logs, updates, skillUps, monster, monsterDied: false };
}
