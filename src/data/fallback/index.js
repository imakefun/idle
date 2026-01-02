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
  ]
};
