/**
 * Skill Definitions
 * All skills in the game with their properties
 */

export const SKILL_DEFINITIONS = {
  // Passive Combat Skills
  offense: {
    id: 'offense',
    name: 'Offense',
    type: 'passive',
    description: 'Improves your chance to hit enemies',
    category: 'combat'
  },
  defense: {
    id: 'defense',
    name: 'Defense',
    type: 'passive',
    description: 'Improves your chance to avoid being hit',
    category: 'combat'
  },
  dodge: {
    id: 'dodge',
    name: 'Dodge',
    type: 'passive',
    description: 'Chance to completely avoid an attack',
    category: 'combat'
  },

  // Weapon Skills
  slashing: {
    id: 'slashing',
    name: 'Slashing',
    type: 'passive',
    description: 'Skill with slashing weapons',
    category: 'weapon',
    weaponTypes: ['longsword', 'dagger', 'axe']
  },
  piercing: {
    id: 'piercing',
    name: 'Piercing',
    type: 'passive',
    description: 'Skill with piercing weapons',
    category: 'weapon',
    weaponTypes: ['dagger', 'spear', 'rapier']
  },
  blunt: {
    id: 'blunt',
    name: 'Blunt',
    type: 'passive',
    description: 'Skill with blunt weapons',
    category: 'weapon',
    weaponTypes: ['mace', 'staff', 'hammer']
  },
  handToHand: {
    id: 'handToHand',
    name: 'Hand to Hand',
    type: 'passive',
    description: 'Skill with unarmed combat (Monk specialty)',
    category: 'weapon',
    weaponTypes: ['fists']
  },

  // Active Abilities
  kick: {
    id: 'kick',
    name: 'Kick',
    type: 'active',
    description: 'Powerful kick attack with bonus damage',
    category: 'ability',
    staminaCost: 10,
    baseProcChance: 0.25, // 25% chance per attack
    damageBonus: 5,
    cooldown: 0, // No cooldown, just proc chance
    classes: ['warrior', 'monk', 'rogue']
  },
  bash: {
    id: 'bash',
    name: 'Bash',
    type: 'active',
    description: 'Shield bash with bonus damage (requires shield)',
    category: 'ability',
    staminaCost: 15,
    baseProcChance: 0.20, // 20% chance per attack
    damageBonus: 8,
    cooldown: 0,
    classes: ['warrior', 'cleric'],
    requiresShield: true
  },
  backstab: {
    id: 'backstab',
    name: 'Backstab',
    type: 'active',
    description: 'Devastating attack from behind (Rogue only)',
    category: 'ability',
    staminaCost: 20,
    baseProcChance: 0.15, // 15% chance per attack
    damageMultiplier: 2.5, // 2.5x weapon damage
    cooldown: 0,
    classes: ['rogue'],
    requiresPiercingWeapon: true
  },
  doubleAttack: {
    id: 'doubleAttack',
    name: 'Double Attack',
    type: 'active',
    description: 'Chance to attack twice in one round',
    category: 'ability',
    staminaCost: 0, // Free when it procs
    baseProcChance: 0.10, // 10% chance, increases with skill
    cooldown: 0,
    classes: ['warrior', 'monk', 'rogue']
  }
};

// Class starting skills (skills available at level 1)
export const CLASS_STARTING_SKILLS = {
  warrior: ['offense', 'defense', 'slashing1H', 'slashing2H', 'blunt1H', 'kick'],
  monk: ['offense', 'defense', 'dodge', 'handToHand', 'blunt1H', 'blunt2H', 'kick'],
  rogue: ['offense', 'dodge', 'slashing1H', 'piercing1H', 'kick'],
  cleric: ['offense', 'defense', 'blunt1H', 'blunt2H']
};

// Trainable skills (can be learned from Guild Master)
export const TRAINABLE_SKILLS = {
  warrior: [
    { skillId: 'bash', level: 5, cost: 100 },
    { skillId: 'doubleAttack', level: 10, cost: 500 },
    { skillId: 'piercing1H', level: 3, cost: 50 },
    { skillId: 'archery', level: 5, cost: 100 }
  ],
  monk: [
    { skillId: 'doubleAttack', level: 8, cost: 400 },
    { skillId: 'throwing', level: 5, cost: 100 }
  ],
  rogue: [
    { skillId: 'backstab', level: 10, cost: 750 },
    { skillId: 'doubleAttack', level: 12, cost: 500 },
    { skillId: 'dodge', level: 3, cost: 75 },
    { skillId: 'archery', level: 6, cost: 150 },
    { skillId: 'throwing', level: 4, cost: 75 }
  ],
  cleric: [
    { skillId: 'bash', level: 8, cost: 200 },
    { skillId: 'slashing1H', level: 5, cost: 100 }
  ]
};

/**
 * Calculate skill cap based on level
 */
export function calculateSkillCap(level, settings = {}) {
  const levelBonus = settings.skillCapLevelBonus || 1;
  const multiplier = settings.skillCapLevelMultiplier || 5;
  return (level + levelBonus) * multiplier;
}

/**
 * Calculate chance for skill-up based on current skill and level
 */
export function calculateSkillUpChance(currentSkill, skillCap, settings = {}) {
  // Higher skill = lower chance to skill up
  const percentOfCap = currentSkill / skillCap;

  const threshold95 = settings.skillUp95PctThreshold || 0.95;
  const threshold80 = settings.skillUp80PctThreshold || 0.80;
  const threshold60 = settings.skillUp60PctThreshold || 0.60;
  const threshold40 = settings.skillUp40PctThreshold || 0.40;

  const chance95 = settings.skillUp95PctChance || 0.01;
  const chance80 = settings.skillUp80PctChance || 0.05;
  const chance60 = settings.skillUp60PctChance || 0.15;
  const chance40 = settings.skillUp40PctChance || 0.30;
  const chanceBasic = settings.skillUpBasicChance || 0.50;

  if (percentOfCap >= threshold95) return chance95;
  if (percentOfCap >= threshold80) return chance80;
  if (percentOfCap >= threshold60) return chance60;
  if (percentOfCap >= threshold40) return chance40;
  return chanceBasic;
}

/**
 * Get weapon skill for a given weapon type
 * @param {string} weaponType - The weapon type
 * @param {Object} skillDefinitions - Optional skill definitions from gameData
 */
export function getWeaponSkill(weaponType, skillDefinitions = SKILL_DEFINITIONS) {
  if (!weaponType) return 'handToHand';

  for (const [skillId, skill] of Object.entries(skillDefinitions)) {
    if (skill.category === 'weapon' && skill.weaponTypes?.includes(weaponType)) {
      return skillId;
    }
  }

  return 'offense'; // Fallback to general offense
}
