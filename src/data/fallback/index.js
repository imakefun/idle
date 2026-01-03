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
      description: 'Masters of melee combat',
      starterWeapon: 'rusty_dagger'
    },
    {
      id: 'monk',
      name: 'Monk',
      hpModifier: '18',
      primaryStat: 'STR',
      description: 'Unarmed combat specialists',
      starterWeapon: ''
    },
    {
      id: 'rogue',
      name: 'Rogue',
      hpModifier: '16',
      primaryStat: 'DEX',
      description: 'Stealth and precision fighters',
      starterWeapon: 'rusty_dagger'
    },
    {
      id: 'cleric',
      name: 'Cleric',
      hpModifier: '15',
      primaryStat: 'WIS',
      description: 'Healers and divine magic users',
      starterWeapon: 'cracked_staff'
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
    },
    {
      id: 'young_spider',
      name: 'a young spider',
      level: '3',
      hp: '45',
      minDmg: '3',
      maxDmg: '6',
      ac: '10',
      xpReward: '22',
      isRare: 'FALSE'
    },
    {
      id: 'gnoll_scout',
      name: 'a gnoll scout',
      level: '5',
      hp: '80',
      minDmg: '5',
      maxDmg: '11',
      ac: '18',
      xpReward: '50',
      isRare: 'FALSE'
    },
    {
      id: 'dark_wolf',
      name: 'a dark wolf',
      level: '5',
      hp: '75',
      minDmg: '5',
      maxDmg: '10',
      ac: '16',
      xpReward: '45',
      isRare: 'FALSE'
    },
    {
      id: 'gnoll_guard',
      name: 'a gnoll guard',
      level: '6',
      hp: '95',
      minDmg: '6',
      maxDmg: '13',
      ac: '20',
      xpReward: '60',
      isRare: 'FALSE'
    },
    {
      id: 'skeletal_warrior',
      name: 'a skeletal warrior',
      level: '7',
      hp: '110',
      minDmg: '7',
      maxDmg: '15',
      ac: '22',
      xpReward: '75',
      isRare: 'FALSE'
    },
    {
      id: 'gnoll_warrior',
      name: 'a gnoll warrior',
      level: '7',
      hp: '115',
      minDmg: '7',
      maxDmg: '16',
      ac: '24',
      xpReward: '80',
      isRare: 'FALSE'
    },
    {
      id: 'gnoll_shaman',
      name: 'a gnoll shaman',
      level: '8',
      hp: '125',
      minDmg: '8',
      maxDmg: '17',
      ac: '26',
      xpReward: '90',
      isRare: 'FALSE'
    },
    {
      id: 'bandit_thug',
      name: 'a bandit thug',
      level: '8',
      hp: '120',
      minDmg: '8',
      maxDmg: '16',
      ac: '25',
      xpReward: '85',
      isRare: 'FALSE'
    },
    {
      id: 'guard_dog',
      name: 'a guard dog',
      level: '8',
      hp: '105',
      minDmg: '7',
      maxDmg: '14',
      ac: '22',
      xpReward: '70',
      isRare: 'FALSE'
    },
    {
      id: 'bandit_guard',
      name: 'a bandit guard',
      level: '9',
      hp: '135',
      minDmg: '9',
      maxDmg: '18',
      ac: '28',
      xpReward: '100',
      isRare: 'FALSE'
    },
    {
      id: 'bandit_archer',
      name: 'a bandit archer',
      level: '10',
      hp: '130',
      minDmg: '9',
      maxDmg: '19',
      ac: '26',
      xpReward: '105',
      isRare: 'FALSE'
    },
    {
      id: 'bandit_veteran',
      name: 'a bandit veteran',
      level: '11',
      hp: '150',
      minDmg: '10',
      maxDmg: '21',
      ac: '30',
      xpReward: '120',
      isRare: 'FALSE'
    },
    {
      id: 'bandit_mage',
      name: 'a bandit mage',
      level: '11',
      hp: '140',
      minDmg: '11',
      maxDmg: '22',
      ac: '28',
      xpReward: '125',
      isRare: 'FALSE'
    },
    {
      id: 'bandit_captain',
      name: 'a bandit captain',
      level: '12',
      hp: '165',
      minDmg: '11',
      maxDmg: '23',
      ac: '32',
      xpReward: '140',
      isRare: 'FALSE'
    },
    {
      id: 'elite_bandit',
      name: 'an elite bandit',
      level: '13',
      hp: '180',
      minDmg: '12',
      maxDmg: '25',
      ac: '34',
      xpReward: '160',
      isRare: 'FALSE'
    },
    {
      id: 'bandit_champion',
      name: 'a bandit champion',
      level: '14',
      hp: '200',
      minDmg: '13',
      maxDmg: '27',
      ac: '36',
      xpReward: '180',
      isRare: 'FALSE'
    },
    {
      id: 'bandit_lord',
      name: 'the bandit lord',
      level: '15',
      hp: '250',
      minDmg: '15',
      maxDmg: '30',
      ac: '40',
      xpReward: '250',
      isRare: 'TRUE'
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
      icon: '🗡️',
      weaponType: 'dagger',
      handedness: '1H',
      shieldType: '',
      armorType: '',
      classes: '',
      races: '',
      ammoType: '',
      requiredAmmo: '',
      STR: '0',
      STA: '0',
      AGI: '1',
      DEX: '0',
      WIS: '0',
      INT: '0',
      CHA: '0'
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
      icon: '⚔️',
      weaponType: 'sword',
      handedness: '1H',
      shieldType: '',
      armorType: '',
      classes: '',
      races: '',
      ammoType: '',
      requiredAmmo: '',
      STR: '1',
      STA: '0',
      AGI: '0',
      DEX: '0',
      WIS: '0',
      INT: '0',
      CHA: '0'
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
      icon: '🪄',
      weaponType: 'staff',
      handedness: '2H',
      shieldType: '',
      armorType: '',
      classes: 'cleric',
      races: '',
      ammoType: '',
      requiredAmmo: '',
      STR: '0',
      STA: '0',
      AGI: '0',
      DEX: '0',
      WIS: '1',
      INT: '1',
      CHA: '0'
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
      icon: '👘',
      weaponType: '',
      handedness: '',
      shieldType: '',
      armorType: 'cloth',
      classes: '',
      races: '',
      ammoType: '',
      requiredAmmo: '',
      STR: '0',
      STA: '0',
      AGI: '0',
      DEX: '0',
      WIS: '0',
      INT: '0',
      CHA: '0'
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
      icon: '🛡️',
      weaponType: '',
      handedness: '',
      shieldType: '',
      armorType: 'leather',
      classes: '',
      races: '',
      ammoType: '',
      requiredAmmo: '',
      STR: '0',
      STA: '1',
      AGI: '0',
      DEX: '0',
      WIS: '0',
      INT: '0',
      CHA: '0'
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
      icon: '👂',
      weaponType: '',
      handedness: '',
      shieldType: '',
      armorType: '',
      classes: '',
      races: '',
      ammoType: '',
      requiredAmmo: '',
      STR: '0',
      STA: '0',
      AGI: '0',
      DEX: '0',
      WIS: '0',
      INT: '0',
      CHA: '0'
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
      icon: '🐍',
      weaponType: '',
      handedness: '',
      shieldType: '',
      armorType: '',
      classes: '',
      races: '',
      ammoType: '',
      requiredAmmo: '',
      STR: '0',
      STA: '0',
      AGI: '0',
      DEX: '0',
      WIS: '0',
      INT: '0',
      CHA: '0'
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
      icon: '🍖',
      weaponType: '',
      handedness: '',
      shieldType: '',
      armorType: '',
      classes: '',
      races: '',
      ammoType: '',
      requiredAmmo: '',
      STR: '0',
      STA: '0',
      AGI: '0',
      DEX: '0',
      WIS: '0',
      INT: '0',
      CHA: '0'
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
      icon: '💧',
      weaponType: '',
      handedness: '',
      shieldType: '',
      armorType: '',
      classes: '',
      races: '',
      ammoType: '',
      requiredAmmo: '',
      STR: '0',
      STA: '0',
      AGI: '0',
      DEX: '0',
      WIS: '0',
      INT: '0',
      CHA: '0'
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
      icon: '👁️',
      weaponType: '',
      handedness: '',
      shieldType: '',
      armorType: '',
      classes: '',
      races: '',
      ammoType: '',
      requiredAmmo: '',
      STR: '0',
      STA: '0',
      AGI: '0',
      DEX: '0',
      WIS: '0',
      INT: '0',
      CHA: '0'
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
      icon: '🦴',
      weaponType: '',
      handedness: '',
      shieldType: '',
      armorType: '',
      classes: '',
      races: '',
      ammoType: '',
      requiredAmmo: '',
      STR: '0',
      STA: '0',
      AGI: '0',
      DEX: '0',
      WIS: '0',
      INT: '0',
      CHA: '0'
    },
    {
      id: 'wooden_buckler',
      name: 'Wooden Buckler',
      type: 'shield',
      stackable: 'FALSE',
      maxStack: '1',
      value: '15',
      damage: '0',
      delay: '0',
      ac: '5',
      slot: 'secondary',
      foodValue: '0',
      waterValue: '0',
      icon: '🛡️',
      weaponType: '',
      handedness: '1H',
      shieldType: 'buckler',
      armorType: '',
      classes: '',
      races: '',
      ammoType: '',
      requiredAmmo: '',
      STR: '0',
      STA: '1',
      AGI: '0',
      DEX: '0',
      WIS: '0',
      INT: '0',
      CHA: '0'
    },
    {
      id: 'oak_bow',
      name: 'Oak Bow',
      type: 'weapon',
      stackable: 'FALSE',
      maxStack: '1',
      value: '30',
      damage: '8',
      delay: '26',
      ac: '0',
      slot: 'range',
      foodValue: '0',
      waterValue: '0',
      icon: '🏹',
      weaponType: 'bow',
      handedness: '2H',
      shieldType: '',
      armorType: '',
      classes: '',
      races: '',
      ammoType: '',
      requiredAmmo: 'arrow',
      STR: '0',
      STA: '0',
      AGI: '1',
      DEX: '1',
      WIS: '0',
      INT: '0',
      CHA: '0'
    },
    {
      id: 'wooden_arrow',
      name: 'Wooden Arrow',
      type: 'ammo',
      stackable: 'TRUE',
      maxStack: '100',
      value: '0.1',
      damage: '0',
      delay: '0',
      ac: '0',
      slot: 'ammo',
      foodValue: '0',
      waterValue: '0',
      icon: '🏹',
      weaponType: '',
      handedness: '',
      shieldType: '',
      armorType: '',
      classes: '',
      races: '',
      ammoType: 'arrow',
      requiredAmmo: '',
      STR: '0',
      STA: '0',
      AGI: '0',
      DEX: '0',
      WIS: '0',
      INT: '0',
      CHA: '0'
    },

    // Junk/Crafting Materials from monsters
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
      icon: '👂',
      weaponType: '',
      handedness: '',
      shieldType: '',
      armorType: '',
      classes: '',
      races: '',
      ammoType: '',
      requiredAmmo: '',
      STR: '0',
      STA: '0',
      AGI: '0',
      DEX: '0',
      WIS: '0',
      INT: '0',
      CHA: '0'
    },
    {
      id: 'snake_fang',
      name: 'Snake Fang',
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
      icon: '🦷',
      weaponType: '',
      handedness: '',
      shieldType: '',
      armorType: '',
      classes: '',
      races: '',
      ammoType: '',
      requiredAmmo: '',
      STR: '0',
      STA: '0',
      AGI: '0',
      DEX: '0',
      WIS: '0',
      INT: '0',
      CHA: '0'
    },
    {
      id: 'gnoll_fang',
      name: 'Gnoll Fang',
      type: 'junk',
      stackable: 'TRUE',
      maxStack: '20',
      value: '3',
      damage: '0',
      delay: '0',
      ac: '0',
      slot: 'none',
      foodValue: '0',
      waterValue: '0',
      icon: '🦷',
      weaponType: '',
      handedness: '',
      shieldType: '',
      armorType: '',
      classes: '',
      races: '',
      ammoType: '',
      requiredAmmo: '',
      STR: '0',
      STA: '0',
      AGI: '0',
      DEX: '0',
      WIS: '0',
      INT: '0',
      CHA: '0'
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
      icon: '🦴',
      weaponType: '',
      handedness: '',
      shieldType: '',
      armorType: '',
      classes: '',
      races: '',
      ammoType: '',
      requiredAmmo: '',
      STR: '0',
      STA: '0',
      AGI: '0',
      DEX: '0',
      WIS: '0',
      INT: '0',
      CHA: '0'
    },
    {
      id: 'spider_silk',
      name: 'Spider Silk',
      type: 'junk',
      stackable: 'TRUE',
      maxStack: '20',
      value: '5',
      damage: '0',
      delay: '0',
      ac: '0',
      slot: 'none',
      foodValue: '0',
      waterValue: '0',
      icon: '🕸️',
      weaponType: '',
      handedness: '',
      shieldType: '',
      armorType: '',
      classes: '',
      races: '',
      ammoType: '',
      requiredAmmo: '',
      STR: '0',
      STA: '0',
      AGI: '0',
      DEX: '0',
      WIS: '0',
      INT: '0',
      CHA: '0'
    },
    {
      id: 'wolf_pelt',
      name: 'Wolf Pelt',
      type: 'junk',
      stackable: 'TRUE',
      maxStack: '20',
      value: '10',
      damage: '0',
      delay: '0',
      ac: '0',
      slot: 'none',
      foodValue: '0',
      waterValue: '0',
      icon: '🐺',
      weaponType: '',
      handedness: '',
      shieldType: '',
      armorType: '',
      classes: '',
      races: '',
      ammoType: '',
      requiredAmmo: '',
      STR: '0',
      STA: '0',
      AGI: '0',
      DEX: '0',
      WIS: '0',
      INT: '0',
      CHA: '0'
    },
    {
      id: 'tattered_pelt',
      name: 'Tattered Pelt',
      type: 'junk',
      stackable: 'TRUE',
      maxStack: '20',
      value: '3',
      damage: '0',
      delay: '0',
      ac: '0',
      slot: 'none',
      foodValue: '0',
      waterValue: '0',
      icon: '🦊',
      weaponType: '',
      handedness: '',
      shieldType: '',
      armorType: '',
      classes: '',
      races: '',
      ammoType: '',
      requiredAmmo: '',
      STR: '0',
      STA: '0',
      AGI: '0',
      DEX: '0',
      WIS: '0',
      INT: '0',
      CHA: '0'
    },
    {
      id: 'beetle_carapace',
      name: 'Beetle Carapace',
      type: 'junk',
      stackable: 'TRUE',
      maxStack: '20',
      value: '4',
      damage: '0',
      delay: '0',
      ac: '0',
      slot: 'none',
      foodValue: '0',
      waterValue: '0',
      icon: '🪲',
      weaponType: '',
      handedness: '',
      shieldType: '',
      armorType: '',
      classes: '',
      races: '',
      ammoType: '',
      requiredAmmo: '',
      STR: '0',
      STA: '0',
      AGI: '0',
      DEX: '0',
      WIS: '0',
      INT: '0',
      CHA: '0'
    }
  ],

  Zones: [
    {
      id: 'qeynos',
      name: 'Town of Qeynos',
      isSafe: 'TRUE',
      minLevel: '1',
      maxLevel: '50',
      description: 'A safe haven where merchants, trainers, and quest givers await. No monsters roam these protected streets.'
    },
    {
      id: 'newbie_yard',
      name: 'Newbie Yard',
      isSafe: 'FALSE',
      minLevel: '1',
      maxLevel: '3',
      description: 'Rolling hills and training grounds outside the city walls. Perfect for new adventurers to test their skills.'
    },
    {
      id: 'dark_forest',
      name: 'Dark Forest',
      isSafe: 'FALSE',
      minLevel: '3',
      maxLevel: '6',
      description: 'Dense woodland shrouded in perpetual twilight. Strange sounds echo from the depths.'
    },
    {
      id: 'blackburrow',
      name: 'Blackburrow',
      isSafe: 'FALSE',
      minLevel: '5',
      maxLevel: '10',
      description: 'A network of gnoll tunnels dug into the hillside. The stench of wet fur and decay fills the air.'
    },
    {
      id: 'high_keep',
      name: 'High Keep',
      isSafe: 'FALSE',
      minLevel: '8',
      maxLevel: '15',
      description: 'Once a proud fortress, now overrun by bandits and fell creatures. Danger lurks in every shadow.'
    }
  ],

  Camps: [
    // Newbie Yard Camps
    {
      id: 'newbie_training_grounds',
      name: 'Training Grounds',
      zoneId: 'newbie_yard',
      minLevel: '1',
      maxLevel: '2',
      description: 'A fenced area where guards watch over new fighters practicing on training dummies and weak creatures.'
    },
    {
      id: 'newbie_practice_yard',
      name: 'Practice Yard',
      zoneId: 'newbie_yard',
      minLevel: '1',
      maxLevel: '2',
      description: 'An open field dotted with scarecrows and inhabited by harmless rats and beetles.'
    },
    {
      id: 'newbie_southern_fields',
      name: 'Southern Fields',
      zoneId: 'newbie_yard',
      minLevel: '2',
      maxLevel: '3',
      description: 'Rolling grasslands south of the training area. Slightly tougher creatures wander here.'
    },
    {
      id: 'newbie_northern_path',
      name: 'Northern Path',
      zoneId: 'newbie_yard',
      minLevel: '2',
      maxLevel: '3',
      description: 'A dirt road leading toward the dark forest, where braver rats and snakes can be found.'
    },

    // Dark Forest Camps
    {
      id: 'forest_edge',
      name: 'Forest Edge',
      zoneId: 'dark_forest',
      minLevel: '3',
      maxLevel: '4',
      description: 'The tree line where sunlight still penetrates. Snakes and spiders lurk in the underbrush.'
    },
    {
      id: 'forest_grove',
      name: 'Shadowed Grove',
      zoneId: 'dark_forest',
      minLevel: '4',
      maxLevel: '5',
      description: 'A clearing surrounded by ancient oaks. Wolves prowl between the trees.'
    },
    {
      id: 'forest_depths',
      name: 'Forest Depths',
      zoneId: 'dark_forest',
      minLevel: '5',
      maxLevel: '6',
      description: 'The heart of the forest where light barely reaches. Dangerous predators make their dens here.'
    },
    {
      id: 'forest_ruins',
      name: 'Forgotten Ruins',
      zoneId: 'dark_forest',
      minLevel: '5',
      maxLevel: '6',
      description: 'Crumbling stone structures overgrown with vines. Undead creatures sometimes rise from the earth.'
    },
    {
      id: 'forest_stream',
      name: 'Dark Stream',
      zoneId: 'dark_forest',
      minLevel: '4',
      maxLevel: '5',
      description: 'A murky creek winding through the woods. Water-dwelling creatures and their prey gather here.'
    },

    // Blackburrow Camps
    {
      id: 'burrow_entrance',
      name: 'Burrow Entrance',
      zoneId: 'blackburrow',
      minLevel: '5',
      maxLevel: '6',
      description: 'The mouth of the gnoll warren. Young gnolls guard the entryway.'
    },
    {
      id: 'burrow_tunnels',
      name: 'Winding Tunnels',
      zoneId: 'blackburrow',
      minLevel: '6',
      maxLevel: '7',
      description: 'Narrow passages carved through earth and stone. Gnoll scouts patrol these halls.'
    },
    {
      id: 'burrow_den',
      name: 'Central Den',
      zoneId: 'blackburrow',
      minLevel: '7',
      maxLevel: '9',
      description: 'A large cavern where gnoll families make their home. Warriors train here.'
    },
    {
      id: 'burrow_depths',
      name: 'Deep Chambers',
      zoneId: 'blackburrow',
      minLevel: '8',
      maxLevel: '10',
      description: 'The lowest levels where the strongest gnolls dwell. Treasure is rumored to be hidden here.'
    },

    // High Keep Camps
    {
      id: 'keep_courtyard',
      name: 'Outer Courtyard',
      zoneId: 'high_keep',
      minLevel: '8',
      maxLevel: '10',
      description: 'The fortress entrance, now controlled by bandits and their guard dogs.'
    },
    {
      id: 'keep_barracks',
      name: 'Ruined Barracks',
      zoneId: 'high_keep',
      minLevel: '9',
      maxLevel: '11',
      description: 'Former soldier quarters now occupied by organized bandit gangs.'
    },
    {
      id: 'keep_armory',
      name: 'Old Armory',
      zoneId: 'high_keep',
      minLevel: '10',
      maxLevel: '12',
      description: 'Where weapons were once stored. Bandit leaders hoard stolen goods here.'
    },
    {
      id: 'keep_towers',
      name: 'Guard Towers',
      zoneId: 'high_keep',
      minLevel: '11',
      maxLevel: '13',
      description: 'Tall watchtowers offering strategic positions. Elite bandits and archers nest here.'
    },
    {
      id: 'keep_throne',
      name: 'Throne Room',
      zoneId: 'high_keep',
      minLevel: '12',
      maxLevel: '15',
      description: 'The heart of the fortress where a bandit lord has claimed the ancient throne.'
    }
  ],

  Spawns: [
    // Newbie Yard - Training Grounds (Level 1-2)
    { id: 'spawn_training_rat', campId: 'newbie_training_grounds', monsterId: 'giant_rat', weight: '100', minLevel: '1', maxLevel: '2' },
    { id: 'spawn_training_beetle', campId: 'newbie_training_grounds', monsterId: 'fire_beetle', weight: '60', minLevel: '1', maxLevel: '2' },
    { id: 'spawn_training_snake', campId: 'newbie_training_grounds', monsterId: 'snake', weight: '30', minLevel: '1', maxLevel: '2' },

    // Newbie Yard - Practice Yard (Level 1-2)
    { id: 'spawn_practice_rat', campId: 'newbie_practice_yard', monsterId: 'giant_rat', weight: '80', minLevel: '1', maxLevel: '2' },
    { id: 'spawn_practice_beetle', campId: 'newbie_practice_yard', monsterId: 'fire_beetle', weight: '80', minLevel: '1', maxLevel: '2' },
    { id: 'spawn_practice_snake', campId: 'newbie_practice_yard', monsterId: 'snake', weight: '40', minLevel: '1', maxLevel: '2' },

    // Newbie Yard - Southern Fields (Level 2-3)
    { id: 'spawn_southern_rat', campId: 'newbie_southern_fields', monsterId: 'giant_rat', weight: '50', minLevel: '2', maxLevel: '3' },
    { id: 'spawn_southern_beetle', campId: 'newbie_southern_fields', monsterId: 'fire_beetle', weight: '70', minLevel: '2', maxLevel: '3' },
    { id: 'spawn_southern_snake', campId: 'newbie_southern_fields', monsterId: 'snake', weight: '100', minLevel: '2', maxLevel: '3' },
    { id: 'spawn_southern_spider', campId: 'newbie_southern_fields', monsterId: 'young_spider', weight: '60', minLevel: '2', maxLevel: '3' },

    // Newbie Yard - Northern Path (Level 2-3)
    { id: 'spawn_northern_rat', campId: 'newbie_northern_path', monsterId: 'giant_rat', weight: '60', minLevel: '2', maxLevel: '3' },
    { id: 'spawn_northern_beetle', campId: 'newbie_northern_path', monsterId: 'fire_beetle', weight: '50', minLevel: '2', maxLevel: '3' },
    { id: 'spawn_northern_snake', campId: 'newbie_northern_path', monsterId: 'snake', weight: '100', minLevel: '2', maxLevel: '3' },
    { id: 'spawn_northern_spider', campId: 'newbie_northern_path', monsterId: 'young_spider', weight: '70', minLevel: '2', maxLevel: '3' },

    // Dark Forest - Forest Edge (Level 3-4)
    { id: 'spawn_edge_snake', campId: 'forest_edge', monsterId: 'snake', weight: '100', minLevel: '3', maxLevel: '4' },
    { id: 'spawn_edge_gnoll', campId: 'forest_edge', monsterId: 'gnoll_pup', weight: '80', minLevel: '3', maxLevel: '4' },
    { id: 'spawn_edge_beetle', campId: 'forest_edge', monsterId: 'fire_beetle', weight: '40', minLevel: '3', maxLevel: '4' },
    { id: 'spawn_edge_spider', campId: 'forest_edge', monsterId: 'young_spider', weight: '70', minLevel: '3', maxLevel: '4' },

    // Dark Forest - Shadowed Grove (Level 4-5)
    { id: 'spawn_grove_gnoll', campId: 'forest_grove', monsterId: 'gnoll_pup', weight: '80', minLevel: '4', maxLevel: '5' },
    { id: 'spawn_grove_snake', campId: 'forest_grove', monsterId: 'snake', weight: '50', minLevel: '4', maxLevel: '5' },
    { id: 'spawn_grove_skeleton', campId: 'forest_grove', monsterId: 'decaying_skeleton', weight: '100', minLevel: '4', maxLevel: '5' },
    { id: 'spawn_grove_wolf', campId: 'forest_grove', monsterId: 'dark_wolf', weight: '70', minLevel: '4', maxLevel: '5' },

    // Dark Forest - Forest Depths (Level 5-6)
    { id: 'spawn_depths_scout', campId: 'forest_depths', monsterId: 'gnoll_scout', weight: '100', minLevel: '5', maxLevel: '6' },
    { id: 'spawn_depths_wolf', campId: 'forest_depths', monsterId: 'dark_wolf', weight: '90', minLevel: '5', maxLevel: '6' },
    { id: 'spawn_depths_skeleton', campId: 'forest_depths', monsterId: 'decaying_skeleton', weight: '70', minLevel: '5', maxLevel: '6' },

    // Dark Forest - Forgotten Ruins (Level 5-6)
    { id: 'spawn_ruins_skeleton', campId: 'forest_ruins', monsterId: 'decaying_skeleton', weight: '100', minLevel: '5', maxLevel: '6' },
    { id: 'spawn_ruins_scout', campId: 'forest_ruins', monsterId: 'gnoll_scout', weight: '80', minLevel: '5', maxLevel: '6' },
    { id: 'spawn_ruins_wolf', campId: 'forest_ruins', monsterId: 'dark_wolf', weight: '60', minLevel: '5', maxLevel: '6' },

    // Dark Forest - Dark Stream (Level 4-5)
    { id: 'spawn_stream_snake', campId: 'forest_stream', monsterId: 'snake', weight: '100', minLevel: '4', maxLevel: '5' },
    { id: 'spawn_stream_gnoll', campId: 'forest_stream', monsterId: 'gnoll_pup', weight: '70', minLevel: '4', maxLevel: '5' },
    { id: 'spawn_stream_skeleton', campId: 'forest_stream', monsterId: 'decaying_skeleton', weight: '80', minLevel: '4', maxLevel: '5' },
    { id: 'spawn_stream_wolf', campId: 'forest_stream', monsterId: 'dark_wolf', weight: '50', minLevel: '4', maxLevel: '5' },

    // Blackburrow - Burrow Entrance (Level 5-6)
    { id: 'spawn_entrance_scout', campId: 'burrow_entrance', monsterId: 'gnoll_scout', weight: '100', minLevel: '5', maxLevel: '6' },
    { id: 'spawn_entrance_pup', campId: 'burrow_entrance', monsterId: 'gnoll_pup', weight: '60', minLevel: '5', maxLevel: '6' },
    { id: 'spawn_entrance_wolf', campId: 'burrow_entrance', monsterId: 'dark_wolf', weight: '70', minLevel: '5', maxLevel: '6' },

    // Blackburrow - Winding Tunnels (Level 6-7)
    { id: 'spawn_tunnels_guard', campId: 'burrow_tunnels', monsterId: 'gnoll_guard', weight: '100', minLevel: '6', maxLevel: '7' },
    { id: 'spawn_tunnels_scout', campId: 'burrow_tunnels', monsterId: 'gnoll_scout', weight: '70', minLevel: '6', maxLevel: '7' },
    { id: 'spawn_tunnels_skeleton', campId: 'burrow_tunnels', monsterId: 'skeletal_warrior', weight: '80', minLevel: '6', maxLevel: '7' },

    // Blackburrow - Central Den (Level 7-9)
    { id: 'spawn_den_warrior', campId: 'burrow_den', monsterId: 'gnoll_warrior', weight: '100', minLevel: '7', maxLevel: '9' },
    { id: 'spawn_den_guard', campId: 'burrow_den', monsterId: 'gnoll_guard', weight: '70', minLevel: '7', maxLevel: '9' },
    { id: 'spawn_den_skeleton', campId: 'burrow_den', monsterId: 'skeletal_warrior', weight: '90', minLevel: '7', maxLevel: '9' },

    // Blackburrow - Deep Chambers (Level 8-10)
    { id: 'spawn_chambers_shaman', campId: 'burrow_depths', monsterId: 'gnoll_shaman', weight: '100', minLevel: '8', maxLevel: '10' },
    { id: 'spawn_chambers_warrior', campId: 'burrow_depths', monsterId: 'gnoll_warrior', weight: '80', minLevel: '8', maxLevel: '10' },
    { id: 'spawn_chambers_skeleton', campId: 'burrow_depths', monsterId: 'skeletal_warrior', weight: '90', minLevel: '8', maxLevel: '10' },

    // High Keep - Outer Courtyard (Level 8-10)
    { id: 'spawn_courtyard_thug', campId: 'keep_courtyard', monsterId: 'bandit_thug', weight: '100', minLevel: '8', maxLevel: '10' },
    { id: 'spawn_courtyard_dog', campId: 'keep_courtyard', monsterId: 'guard_dog', weight: '80', minLevel: '8', maxLevel: '10' },
    { id: 'spawn_courtyard_guard', campId: 'keep_courtyard', monsterId: 'bandit_guard', weight: '60', minLevel: '8', maxLevel: '10' },

    // High Keep - Ruined Barracks (Level 9-11)
    { id: 'spawn_barracks_guard', campId: 'keep_barracks', monsterId: 'bandit_guard', weight: '100', minLevel: '9', maxLevel: '11' },
    { id: 'spawn_barracks_thug', campId: 'keep_barracks', monsterId: 'bandit_thug', weight: '70', minLevel: '9', maxLevel: '11' },
    { id: 'spawn_barracks_archer', campId: 'keep_barracks', monsterId: 'bandit_archer', weight: '80', minLevel: '9', maxLevel: '11' },

    // High Keep - Old Armory (Level 10-12)
    { id: 'spawn_armory_veteran', campId: 'keep_armory', monsterId: 'bandit_veteran', weight: '100', minLevel: '10', maxLevel: '12' },
    { id: 'spawn_armory_archer', campId: 'keep_armory', monsterId: 'bandit_archer', weight: '80', minLevel: '10', maxLevel: '12' },
    { id: 'spawn_armory_captain', campId: 'keep_armory', monsterId: 'bandit_captain', weight: '60', minLevel: '10', maxLevel: '12' },

    // High Keep - Guard Towers (Level 11-13)
    { id: 'spawn_towers_elite', campId: 'keep_towers', monsterId: 'elite_bandit', weight: '100', minLevel: '11', maxLevel: '13' },
    { id: 'spawn_towers_mage', campId: 'keep_towers', monsterId: 'bandit_mage', weight: '90', minLevel: '11', maxLevel: '13' },
    { id: 'spawn_towers_veteran', campId: 'keep_towers', monsterId: 'bandit_veteran', weight: '70', minLevel: '11', maxLevel: '13' },

    // High Keep - Throne Room (Level 12-15)
    { id: 'spawn_throne_champion', campId: 'keep_throne', monsterId: 'bandit_champion', weight: '100', minLevel: '12', maxLevel: '15' },
    { id: 'spawn_throne_elite', campId: 'keep_throne', monsterId: 'elite_bandit', weight: '80', minLevel: '12', maxLevel: '15' },
    { id: 'spawn_throne_captain', campId: 'keep_throne', monsterId: 'bandit_captain', weight: '60', minLevel: '12', maxLevel: '15' },
    { id: 'spawn_throne_lord', campId: 'keep_throne', monsterId: 'bandit_lord', weight: '30', minLevel: '12', maxLevel: '15' }
  ],

  Skills: [
    // Combat Skills
    { id: 'offense', name: 'Offense', type: 'passive', category: 'combat', description: 'Improves your chance to hit enemies', staminaCost: '0', baseProcChance: '0', damageBonus: '0', damageMultiplier: '0', requiresShield: 'FALSE', requiresPiercing: 'FALSE', weaponTypes: '' },
    { id: 'defense', name: 'Defense', type: 'passive', category: 'combat', description: 'Improves your chance to avoid being hit', staminaCost: '0', baseProcChance: '0', damageBonus: '0', damageMultiplier: '0', requiresShield: 'FALSE', requiresPiercing: 'FALSE', weaponTypes: '' },
    { id: 'dodge', name: 'Dodge', type: 'passive', category: 'combat', description: 'Chance to completely avoid an attack', staminaCost: '0', baseProcChance: '0', damageBonus: '0', damageMultiplier: '0', requiresShield: 'FALSE', requiresPiercing: 'FALSE', weaponTypes: '' },

    // Weapon Skills - Slashing
    { id: 'slashing1H', name: '1H Slashing', type: 'passive', category: 'weapon', description: 'Skill with one-handed slashing weapons', staminaCost: '0', baseProcChance: '0', damageBonus: '0', damageMultiplier: '0', requiresShield: 'FALSE', requiresPiercing: 'FALSE', weaponTypes: 'sword,dagger,axe' },
    { id: 'slashing2H', name: '2H Slashing', type: 'passive', category: 'weapon', description: 'Skill with two-handed slashing weapons', staminaCost: '0', baseProcChance: '0', damageBonus: '0', damageMultiplier: '0', requiresShield: 'FALSE', requiresPiercing: 'FALSE', weaponTypes: 'greatsword,greataxe' },

    // Weapon Skills - Piercing
    { id: 'piercing1H', name: '1H Piercing', type: 'passive', category: 'weapon', description: 'Skill with one-handed piercing weapons', staminaCost: '0', baseProcChance: '0', damageBonus: '0', damageMultiplier: '0', requiresShield: 'FALSE', requiresPiercing: 'FALSE', weaponTypes: 'dagger,rapier' },
    { id: 'piercing2H', name: '2H Piercing', type: 'passive', category: 'weapon', description: 'Skill with two-handed piercing weapons (polearms)', staminaCost: '0', baseProcChance: '0', damageBonus: '0', damageMultiplier: '0', requiresShield: 'FALSE', requiresPiercing: 'FALSE', weaponTypes: 'spear,pike,halberd' },

    // Weapon Skills - Blunt
    { id: 'blunt1H', name: '1H Blunt', type: 'passive', category: 'weapon', description: 'Skill with one-handed blunt weapons', staminaCost: '0', baseProcChance: '0', damageBonus: '0', damageMultiplier: '0', requiresShield: 'FALSE', requiresPiercing: 'FALSE', weaponTypes: 'mace,club' },
    { id: 'blunt2H', name: '2H Blunt', type: 'passive', category: 'weapon', description: 'Skill with two-handed blunt weapons (staffs)', staminaCost: '0', baseProcChance: '0', damageBonus: '0', damageMultiplier: '0', requiresShield: 'FALSE', requiresPiercing: 'FALSE', weaponTypes: 'staff,maul,warhammer' },

    // Other Weapon Skills
    { id: 'handToHand', name: 'Hand to Hand', type: 'passive', category: 'weapon', description: 'Skill with unarmed combat (Monk specialty)', staminaCost: '0', baseProcChance: '0', damageBonus: '0', damageMultiplier: '0', requiresShield: 'FALSE', requiresPiercing: 'FALSE', weaponTypes: 'fists' },
    { id: 'archery', name: 'Archery', type: 'passive', category: 'weapon', description: 'Skill with bows and ranged weapons', staminaCost: '0', baseProcChance: '0', damageBonus: '0', damageMultiplier: '0', requiresShield: 'FALSE', requiresPiercing: 'FALSE', weaponTypes: 'bow,longbow,crossbow' },
    { id: 'throwing', name: 'Throwing', type: 'passive', category: 'weapon', description: 'Skill with thrown weapons', staminaCost: '0', baseProcChance: '0', damageBonus: '0', damageMultiplier: '0', requiresShield: 'FALSE', requiresPiercing: 'FALSE', weaponTypes: 'throwingdagger,throwingaxe' },

    // Active Abilities
    { id: 'kick', name: 'Kick', type: 'active', category: 'ability', description: 'Powerful kick attack with bonus damage', staminaCost: '10', baseProcChance: '0.25', damageBonus: '5', damageMultiplier: '0', requiresShield: 'FALSE', requiresPiercing: 'FALSE', weaponTypes: '' },
    { id: 'bash', name: 'Bash', type: 'active', category: 'ability', description: 'Shield bash with bonus damage (requires shield)', staminaCost: '15', baseProcChance: '0.20', damageBonus: '8', damageMultiplier: '0', requiresShield: 'TRUE', requiresPiercing: 'FALSE', weaponTypes: '' },
    { id: 'backstab', name: 'Backstab', type: 'active', category: 'ability', description: 'Devastating attack from behind (Rogue only)', staminaCost: '20', baseProcChance: '0.15', damageBonus: '0', damageMultiplier: '2.5', requiresShield: 'FALSE', requiresPiercing: 'TRUE', weaponTypes: '' },
    { id: 'doubleAttack', name: 'Double Attack', type: 'active', category: 'ability', description: 'Chance to attack twice in one round', staminaCost: '0', baseProcChance: '0.10', damageBonus: '0', damageMultiplier: '0', requiresShield: 'FALSE', requiresPiercing: 'FALSE', weaponTypes: '' }
  ],

  Settings: [
    // Combat - Hit Calculation
    { category: 'combat', settingId: 'hitBaseChance', value: '50', description: 'Base chance to hit before modifiers (%)' },
    { category: 'combat', settingId: 'hitSkillBonusMultiplier', value: '2', description: 'Multiplier for skill bonus in hit calculation' },
    { category: 'combat', settingId: 'hitLevelPenaltyMultiplier', value: '5', description: 'Multiplier for level difference penalty' },
    { category: 'combat', settingId: 'hitDefenderSkillMultiplier', value: '5', description: 'Multiplier for defender level vs skill' },
    { category: 'combat', settingId: 'hitMinChance', value: '5', description: 'Minimum hit chance (%)' },
    { category: 'combat', settingId: 'hitMaxChance', value: '95', description: 'Maximum hit chance (%)' },

    // Combat - Damage Calculation
    { category: 'combat', settingId: 'damageStrengthDivisor', value: '10', description: 'Divisor for strength bonus to damage' },
    { category: 'combat', settingId: 'damageRandomBonusMin', value: '1', description: 'Minimum random bonus damage' },
    { category: 'combat', settingId: 'damageRandomBonusMax', value: '4', description: 'Maximum random bonus damage' },

    // Combat - AC Mitigation
    { category: 'combat', settingId: 'acBaseConstant', value: '50', description: 'Base constant in AC mitigation formula' },
    { category: 'combat', settingId: 'acLevelMultiplier', value: '2', description: 'Level multiplier in AC mitigation formula' },

    // Combat - XP and Con
    { category: 'combat', settingId: 'xpGreenConThreshold', value: '5', description: 'Level difference for green con (trivial)' },
    { category: 'combat', settingId: 'xpReducedThreshold', value: '3', description: 'Level difference for reduced XP' },
    { category: 'combat', settingId: 'xpReducedMultiplier', value: '0.25', description: 'XP multiplier for reduced rewards' },
    { category: 'combat', settingId: 'conGreenThreshold', value: '5', description: 'Level difference for green con color' },
    { category: 'combat', settingId: 'conLightBlueThreshold', value: '3', description: 'Level difference for light blue con' },
    { category: 'combat', settingId: 'conWhiteThreshold', value: '-2', description: 'Level difference for white con' },
    { category: 'combat', settingId: 'conYellowThreshold', value: '-4', description: 'Level difference for yellow con' },

    // Skill - Caps
    { category: 'skill', settingId: 'skillCapLevelMultiplier', value: '5', description: 'Multiplier for skill cap = (level+1) * value' },
    { category: 'skill', settingId: 'skillCapLevelBonus', value: '1', description: 'Bonus added to level in skill cap formula' },

    // Skill - Skill Up Chances
    { category: 'skill', settingId: 'skillUp95PctChance', value: '0.01', description: 'Skill up chance at 95%+ of cap (1%)' },
    { category: 'skill', settingId: 'skillUp80PctChance', value: '0.05', description: 'Skill up chance at 80-95% of cap (5%)' },
    { category: 'skill', settingId: 'skillUp60PctChance', value: '0.15', description: 'Skill up chance at 60-80% of cap (15%)' },
    { category: 'skill', settingId: 'skillUp40PctChance', value: '0.30', description: 'Skill up chance at 40-60% of cap (30%)' },
    { category: 'skill', settingId: 'skillUpBasicChance', value: '0.50', description: 'Skill up chance below 40% of cap (50%)' },
    { category: 'skill', settingId: 'skillUp95PctThreshold', value: '0.95', description: 'Threshold for 95% of cap' },
    { category: 'skill', settingId: 'skillUp80PctThreshold', value: '0.80', description: 'Threshold for 80% of cap' },
    { category: 'skill', settingId: 'skillUp60PctThreshold', value: '0.60', description: 'Threshold for 60% of cap' },
    { category: 'skill', settingId: 'skillUp40PctThreshold', value: '0.40', description: 'Threshold for 40% of cap' },

    // Skill - Abilities
    { category: 'skill', settingId: 'abilitySkillBonusDivisor', value: '100', description: 'Divisor for ability proc skill bonus' },
    { category: 'skill', settingId: 'abilityMaxSkillBonus', value: '0.20', description: 'Maximum skill bonus to ability proc (20%)' },
    { category: 'skill', settingId: 'abilityDamageSkillDivisor', value: '10', description: 'Divisor for ability damage skill bonus' },

    // Skill - Dodge
    { category: 'skill', settingId: 'dodgeBaseChance', value: '0.05', description: 'Base dodge chance (5%)' },
    { category: 'skill', settingId: 'dodgeSkillDivisor', value: '500', description: 'Divisor for dodge skill bonus' },
    { category: 'skill', settingId: 'dodgeMaxSkillBonus', value: '0.20', description: 'Maximum skill bonus to dodge (20%)' }
  ],

  LootTables: [
    // Giant Rat (level 1)
    { monsterId: 'giant_rat', itemId: 'rat_ear', dropChance: '30', minQty: '1', maxQty: '1', currencyMin: '0', currencyMax: '3' },
    { monsterId: 'giant_rat', itemId: 'rusty_dagger', dropChance: '2', minQty: '1', maxQty: '1', currencyMin: '0', currencyMax: '0' },

    // Snake (level 2)
    { monsterId: 'snake', itemId: 'snake_fang', dropChance: '25', minQty: '1', maxQty: '1', currencyMin: '0', currencyMax: '4' },

    // Fire Beetle (level 2)
    { monsterId: 'fire_beetle', itemId: 'beetle_carapace', dropChance: '20', minQty: '1', maxQty: '1', currencyMin: '0', currencyMax: '4' },

    // Gnoll Pup (level 3)
    { monsterId: 'gnoll_pup', itemId: 'gnoll_fang', dropChance: '20', minQty: '1', maxQty: '1', currencyMin: '1', currencyMax: '5' },
    { monsterId: 'gnoll_pup', itemId: 'tattered_pelt', dropChance: '10', minQty: '1', maxQty: '1', currencyMin: '0', currencyMax: '0' },

    // Decaying Skeleton (level 4)
    { monsterId: 'decaying_skeleton', itemId: 'bone_chips', dropChance: '40', minQty: '1', maxQty: '2', currencyMin: '1', currencyMax: '6' },
    { monsterId: 'decaying_skeleton', itemId: 'rusty_dagger', dropChance: '3', minQty: '1', maxQty: '1', currencyMin: '0', currencyMax: '0' },

    // Young Spider (level 3)
    { monsterId: 'young_spider', itemId: 'spider_silk', dropChance: '30', minQty: '1', maxQty: '1', currencyMin: '1', currencyMax: '5' },

    // Gnoll Scout (level 5)
    { monsterId: 'gnoll_scout', itemId: 'gnoll_fang', dropChance: '25', minQty: '1', maxQty: '1', currencyMin: '2', currencyMax: '8' },
    { monsterId: 'gnoll_scout', itemId: 'tattered_pelt', dropChance: '15', minQty: '1', maxQty: '1', currencyMin: '0', currencyMax: '0' },

    // Dark Wolf (level 5)
    { monsterId: 'dark_wolf', itemId: 'wolf_pelt', dropChance: '35', minQty: '1', maxQty: '1', currencyMin: '2', currencyMax: '8' },
    { monsterId: 'dark_wolf', itemId: 'wolf_fang', dropChance: '20', minQty: '1', maxQty: '1', currencyMin: '0', currencyMax: '0' },

    // Gnoll Guard (level 6)
    { monsterId: 'gnoll_guard', itemId: 'gnoll_fang', dropChance: '30', minQty: '1', maxQty: '2', currencyMin: '3', currencyMax: '10' },

    // Skeletal Warrior (level 7)
    { monsterId: 'skeletal_warrior', itemId: 'bone_chips', dropChance: '45', minQty: '2', maxQty: '3', currencyMin: '3', currencyMax: '12' },

    // Gnoll Warrior (level 7)
    { monsterId: 'gnoll_warrior', itemId: 'gnoll_fang', dropChance: '35', minQty: '1', maxQty: '2', currencyMin: '4', currencyMax: '15' },

    // Gnoll Shaman (level 8)
    { monsterId: 'gnoll_shaman', itemId: 'gnoll_fang', dropChance: '25', minQty: '1', maxQty: '1', currencyMin: '5', currencyMax: '18' },

    // Bandit Thug (level 8)
    { monsterId: 'bandit_thug', itemId: 'copper_ring', dropChance: '15', minQty: '1', maxQty: '1', currencyMin: '4', currencyMax: '16' },

    // Guard Dog (level 8)
    { monsterId: 'guard_dog', itemId: 'dog_collar', dropChance: '20', minQty: '1', maxQty: '1', currencyMin: '3', currencyMax: '12' },
    { monsterId: 'guard_dog', itemId: 'rawhide_strip', dropChance: '25', minQty: '1', maxQty: '1', currencyMin: '0', currencyMax: '0' },

    // Bandit Guard (level 9)
    { monsterId: 'bandit_guard', itemId: 'bronze_dagger', dropChance: '5', minQty: '1', maxQty: '1', currencyMin: '6', currencyMax: '20' },
    { monsterId: 'bandit_guard', itemId: 'rations', dropChance: '30', minQty: '1', maxQty: '2', currencyMin: '0', currencyMax: '0' },

    // Bandit Archer (level 10)
    { monsterId: 'bandit_archer', itemId: 'arrows', dropChance: '40', minQty: '5', maxQty: '10', currencyMin: '7', currencyMax: '25' },

    // Bandit Veteran (level 11)
    { monsterId: 'bandit_veteran', itemId: 'silver_ring', dropChance: '6', minQty: '1', maxQty: '1', currencyMin: '10', currencyMax: '30' },

    // Bandit Mage (level 11)
    { monsterId: 'bandit_mage', itemId: 'spell_scroll', dropChance: '8', minQty: '1', maxQty: '1', currencyMin: '10', currencyMax: '35' },

    // Bandit Captain (level 12)
    { monsterId: 'bandit_captain', itemId: 'captain_insignia', dropChance: '12', minQty: '1', maxQty: '1', currencyMin: '15', currencyMax: '40' },

    // Elite Bandit (level 13)
    { monsterId: 'elite_bandit', itemId: 'gold_ring', dropChance: '8', minQty: '1', maxQty: '1', currencyMin: '20', currencyMax: '50' },

    // Bandit Champion (level 14)
    { monsterId: 'bandit_champion', itemId: 'gem_ruby', dropChance: '5', minQty: '1', maxQty: '1', currencyMin: '30', currencyMax: '60' },

    // Bandit Lord (level 15 - rare boss)
    { monsterId: 'bandit_lord', itemId: 'lords_greatsword', dropChance: '15', minQty: '1', maxQty: '1', currencyMin: '50', currencyMax: '100' },
    { monsterId: 'bandit_lord', itemId: 'lords_crown', dropChance: '10', minQty: '1', maxQty: '1', currencyMin: '0', currencyMax: '0' },
    { monsterId: 'bandit_lord', itemId: 'gem_diamond', dropChance: '20', minQty: '1', maxQty: '1', currencyMin: '0', currencyMax: '0' }
  ]
};
