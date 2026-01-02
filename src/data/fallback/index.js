/**
 * Fallback game data (used when Google Sheets API is unavailable)
 * This data structure matches the Google Sheets format
 */

export const fallbackData = {
  Races: [
    {
      id: 'human',
      name: 'Human',
      STR: '75',
      STA: '75',
      AGI: '75',
      DEX: '75',
      WIS: '75',
      INT: '75',
      CHA: '75',
      description: 'Versatile and adaptable'
    },
    {
      id: 'barbarian',
      name: 'Barbarian',
      STR: '103',
      STA: '95',
      AGI: '77',
      DEX: '70',
      WIS: '60',
      INT: '60',
      CHA: '55',
      description: 'Strong warriors from the frozen north'
    },
    {
      id: 'wood_elf',
      name: 'Wood Elf',
      STR: '65',
      STA: '75',
      AGI: '95',
      DEX: '85',
      WIS: '80',
      INT: '75',
      CHA: '75',
      description: 'Agile forest dwellers'
    },
    {
      id: 'dark_elf',
      name: 'Dark Elf',
      STR: '60',
      STA: '75',
      AGI: '90',
      DEX: '75',
      WIS: '83',
      INT: '99',
      CHA: '60',
      description: 'Wielders of dark magic'
    },
    {
      id: 'dwarf',
      name: 'Dwarf',
      STR: '90',
      STA: '100',
      AGI: '70',
      DEX: '90',
      WIS: '83',
      INT: '60',
      CHA: '45',
      description: 'Stout and resilient mountain folk'
    }
  ],

  Classes: [
    {
      id: 'warrior',
      name: 'Warrior',
      hpModifier: '22',
      primaryStat: 'STR',
      description: 'Masters of melee combat'
    },
    {
      id: 'monk',
      name: 'Monk',
      hpModifier: '18',
      primaryStat: 'STR',
      description: 'Unarmed combat specialists'
    },
    {
      id: 'rogue',
      name: 'Rogue',
      hpModifier: '16',
      primaryStat: 'DEX',
      description: 'Stealth and precision fighters'
    },
    {
      id: 'cleric',
      name: 'Cleric',
      hpModifier: '15',
      primaryStat: 'WIS',
      description: 'Healers and divine magic users'
    }
  ],

  Monsters: [
    {
      id: 'giant_rat',
      name: 'a giant rat',
      level: '1',
      hp: '25',
      minDmg: '1',
      maxDmg: '3',
      ac: '5',
      xpReward: '10',
      isRare: 'FALSE'
    },
    {
      id: 'snake',
      name: 'a snake',
      level: '2',
      hp: '35',
      minDmg: '2',
      maxDmg: '5',
      ac: '8',
      xpReward: '15',
      isRare: 'FALSE'
    },
    {
      id: 'gnoll_pup',
      name: 'a gnoll pup',
      level: '3',
      hp: '50',
      minDmg: '3',
      maxDmg: '7',
      ac: '12',
      xpReward: '25',
      isRare: 'FALSE'
    },
    {
      id: 'fire_beetle',
      name: 'a fire beetle',
      level: '2',
      hp: '30',
      minDmg: '2',
      maxDmg: '4',
      ac: '10',
      xpReward: '12',
      isRare: 'FALSE'
    },
    {
      id: 'decaying_skeleton',
      name: 'a decaying skeleton',
      level: '4',
      hp: '65',
      minDmg: '4',
      maxDmg: '9',
      ac: '15',
      xpReward: '35',
      isRare: 'FALSE'
    }
  ],

  Items: [
    {
      id: 'rusty_dagger',
      name: 'Rusty Dagger',
      type: 'weapon',
      stackable: 'FALSE',
      maxStack: '1',
      value: '5',
      damage: '3',
      delay: '20',
      ac: '0',
      slot: 'primary',
      foodValue: '0',
      waterValue: '0',
      icon: '🗡️'
    },
    {
      id: 'worn_short_sword',
      name: 'Worn Short Sword',
      type: 'weapon',
      stackable: 'FALSE',
      maxStack: '1',
      value: '8',
      damage: '5',
      delay: '25',
      ac: '0',
      slot: 'primary',
      foodValue: '0',
      waterValue: '0',
      icon: '⚔️'
    },
    {
      id: 'cracked_staff',
      name: 'Cracked Staff',
      type: 'weapon',
      stackable: 'FALSE',
      maxStack: '1',
      value: '6',
      damage: '4',
      delay: '30',
      ac: '0',
      slot: 'primary',
      foodValue: '0',
      waterValue: '0',
      icon: '🪄'
    },
    {
      id: 'tattered_cloth_robe',
      name: 'Tattered Cloth Robe',
      type: 'armor',
      stackable: 'FALSE',
      maxStack: '1',
      value: '3',
      damage: '0',
      delay: '0',
      ac: '2',
      slot: 'chest',
      foodValue: '0',
      waterValue: '0',
      icon: '👘'
    },
    {
      id: 'leather_tunic',
      name: 'Leather Tunic',
      type: 'armor',
      stackable: 'FALSE',
      maxStack: '1',
      value: '5',
      damage: '0',
      delay: '0',
      ac: '4',
      slot: 'chest',
      foodValue: '0',
      waterValue: '0',
      icon: '🛡️'
    },
    {
      id: 'rat_ear',
      name: 'Rat Ear',
      type: 'junk',
      stackable: 'TRUE',
      maxStack: '20',
      value: '1',
      damage: '0',
      delay: '0',
      ac: '0',
      slot: 'none',
      foodValue: '0',
      waterValue: '0',
      icon: '👂'
    },
    {
      id: 'snake_scales',
      name: 'Snake Scales',
      type: 'junk',
      stackable: 'TRUE',
      maxStack: '20',
      value: '2',
      damage: '0',
      delay: '0',
      ac: '0',
      slot: 'none',
      foodValue: '0',
      waterValue: '0',
      icon: '🐍'
    },
    {
      id: 'rations',
      name: 'Rations',
      type: 'consumable',
      stackable: 'TRUE',
      maxStack: '20',
      value: '3',
      damage: '0',
      delay: '0',
      ac: '0',
      slot: 'none',
      foodValue: '15',
      waterValue: '0',
      icon: '🍖'
    },
    {
      id: 'water_flask',
      name: 'Water Flask',
      type: 'consumable',
      stackable: 'TRUE',
      maxStack: '20',
      value: '2',
      damage: '0',
      delay: '0',
      ac: '0',
      slot: 'none',
      foodValue: '0',
      waterValue: '20',
      icon: '💧'
    },
    {
      id: 'beetle_eye',
      name: 'Beetle Eye',
      type: 'junk',
      stackable: 'TRUE',
      maxStack: '20',
      value: '2',
      damage: '0',
      delay: '0',
      ac: '0',
      slot: 'none',
      foodValue: '0',
      waterValue: '0',
      icon: '👁️'
    },
    {
      id: 'bone_chips',
      name: 'Bone Chips',
      type: 'junk',
      stackable: 'TRUE',
      maxStack: '20',
      value: '1',
      damage: '0',
      delay: '0',
      ac: '0',
      slot: 'none',
      foodValue: '0',
      waterValue: '0',
      icon: '🦴'
    }
  ],

  Zones: [
    {
      id: 'newbie_yard',
      name: 'Newbie Yard',
      isSafe: 'TRUE',
      minLevel: '1',
      maxLevel: '3',
      description: 'A safe training area for beginners'
    },
    {
      id: 'dark_forest',
      name: 'Dark Forest',
      isSafe: 'FALSE',
      minLevel: '2',
      maxLevel: '5',
      description: 'A shadowy forest teeming with danger'
    }
  ]
};
