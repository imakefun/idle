/**
 * Skill System
 * Handles skill checks, skill-ups, and ability procs
 */

import {
  SKILL_DEFINITIONS,
  calculateSkillCap,
  calculateSkillUpChance
} from '../data/skills';

/**
 * Initialize skills for a new character
 */
export function initializeSkills(className, startingSkills) {
  const skills = {};

  startingSkills.forEach(skillId => {
    skills[skillId] = {
      current: 1,
      max: calculateSkillCap(1) // Level 1 cap
    };
  });

  return skills;
}

/**
 * Update skill caps when player levels up
 */
export function updateSkillCaps(skills, newLevel) {
  const newCap = calculateSkillCap(newLevel);
  const updated = { ...skills };

  Object.keys(updated).forEach(skillId => {
    updated[skillId] = {
      ...updated[skillId],
      max: newCap
    };
  });

  return updated;
}

/**
 * Attempt to skill up
 * Returns { success: boolean, newValue: number, skillId: string, skillName: string }
 */
export function attemptSkillUp(skillId, currentSkill, skillCap, skillDefinitions = SKILL_DEFINITIONS) {
  const skill = skillDefinitions[skillId];
  if (!skill) return { success: false };

  // Can't skill up if at cap
  if (currentSkill >= skillCap) {
    return { success: false };
  }

  // Calculate chance based on current skill level
  const chance = calculateSkillUpChance(currentSkill, skillCap);
  const roll = Math.random();

  if (roll < chance) {
    return {
      success: true,
      newValue: currentSkill + 1,
      skillId,
      skillName: skill.name
    };
  }

  return { success: false };
}

/**
 * Check if an active ability should proc
 * Returns { success: boolean, abilityId: string, abilityName: string }
 */
export function checkAbilityProc(abilityId, skillLevel, stamina, skillDefinitions = SKILL_DEFINITIONS) {
  const ability = skillDefinitions[abilityId];
  if (!ability || ability.type !== 'active') {
    return { success: false };
  }

  // Check stamina cost
  if (stamina < ability.staminaCost) {
    return { success: false, reason: 'insufficient_stamina' };
  }

  // Base proc chance increases with skill level
  const skillBonus = Math.min(skillLevel / 100, 0.20); // Max +20% from skill
  const procChance = ability.baseProcChance + skillBonus;
  const roll = Math.random();

  if (roll < procChance) {
    return {
      success: true,
      abilityId,
      abilityName: ability.name,
      staminaCost: ability.staminaCost
    };
  }

  return { success: false };
}

/**
 * Calculate bonus damage from an ability
 */
export function calculateAbilityDamage(abilityId, weaponDamage, skillLevel, skillDefinitions = SKILL_DEFINITIONS) {
  const ability = skillDefinitions[abilityId];
  if (!ability) return 0;

  // Kick and Bash use flat bonus
  if (ability.damageBonus) {
    const skillBonus = Math.floor(skillLevel / 10);
    return ability.damageBonus + skillBonus;
  }

  // Backstab uses multiplier
  if (ability.damageMultiplier) {
    return Math.floor(weaponDamage * ability.damageMultiplier);
  }

  return 0;
}

/**
 * Check if player has the requirements for an ability
 */
export function checkAbilityRequirements(abilityId, equipped, skillDefinitions = SKILL_DEFINITIONS) {
  const ability = skillDefinitions[abilityId];
  if (!ability) return false;

  // Check for shield requirement (Bash)
  if (ability.requiresShield) {
    const hasShield = equipped.secondary?.type === 'shield';
    if (!hasShield) return false;
  }

  // Check for piercing weapon requirement (Backstab)
  if (ability.requiresPiercingWeapon) {
    const weaponType = equipped.primary?.weaponType;
    if (weaponType !== 'dagger' && weaponType !== 'spear' && weaponType !== 'rapier') {
      return false;
    }
  }

  return true;
}

/**
 * Get active abilities for current class
 */
export function getActiveAbilities(skills, skillDefinitions = SKILL_DEFINITIONS) {
  const activeAbilities = [];

  Object.keys(skills).forEach(skillId => {
    const skill = skillDefinitions[skillId];
    if (skill && skill.type === 'active') {
      activeAbilities.push({
        id: skillId,
        name: skill.name,
        description: skill.description,
        staminaCost: skill.staminaCost,
        currentSkill: skills[skillId].current
      });
    }
  });

  return activeAbilities;
}

/**
 * Calculate dodge chance based on dodge skill
 */
export function calculateDodgeChance(dodgeSkill = 0) {
  // Base 5% + skill bonus
  const baseChance = 0.05;
  const skillBonus = Math.min(dodgeSkill / 500, 0.20); // Max +20% at skill 100
  return baseChance + skillBonus;
}

/**
 * Process a skill check (for skill usage)
 */
export function performSkillCheck(skillId, skillLevel, difficulty = 50) {
  const roll = Math.random() * 100;
  const modifiedSkill = skillLevel - difficulty;
  const successChance = 50 + modifiedSkill;

  return roll < successChance;
}
