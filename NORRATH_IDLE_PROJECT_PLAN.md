# Norrath Idle - Claude Project Plan

## Project Overview

**Project Name:** Norrath Idle
**Type:** Text-based Idle RPG (Browser-based)
**Inspiration:** Classic MMORPG (EverQuest)
**Platform:** Web (Mobile-optimized)
**Tech Stack:** React (Functional Components + Hooks)

### Core Concept
A slow-progression idle RPG focusing on skill grinding, inventory management, and a player-driven economy simulated through scarcity. The game runs entirely in the browser with automatic save functionality.

---

## Technical Architecture

### Technology Stack
- **Frontend Framework:** React (Functional Components)
- **State Management:**
  - `useState` for UI reactivity
  - `useRef` for high-frequency game loop timers
- **Persistence:** localStorage (Key: `norrathIdleSave_v21`)
- **Game Loop:** setInterval running at 100ms (10 ticks/second)
- **Build Tool:** Create React App or Vite (recommended)
- **Data Management:** Google Sheets API for game config/metadata synchronization

### Key Technical Requirements
1. **Delta-time calculation** for frame-independent timing
2. **Auto-save** on every tick or state change
3. **Mobile-responsive** design (text-based UI)
4. **Performance optimization** for continuous game loop
5. **State serialization** for localStorage persistence
6. **Google Sheets integration** for centralized game data management and balancing

---

## Implementation Phases

### Phase 1: Core Foundation (Week 1-2)

#### 1.1 Project Setup
- [ ] Initialize React project (Vite recommended)
- [ ] Set up project structure and folder organization
- [ ] Configure TypeScript (optional but recommended)
- [ ] Install UI dependencies (if any)
- [ ] Set up Git repository and initial commit

**File Structure:**
```
src/
├── components/
│   ├── Character/
│   ├── Combat/
│   ├── Inventory/
│   ├── Quests/
│   ├── Tradeskills/
│   └── UI/
├── data/
│   ├── races.js          (synced from Google Sheets)
│   ├── classes.js        (synced from Google Sheets)
│   ├── monsters.js       (synced from Google Sheets)
│   ├── items.js          (synced from Google Sheets)
│   ├── zones.js          (synced from Google Sheets)
│   ├── recipes.js        (synced from Google Sheets)
│   └── fallback/         (static fallback data)
├── systems/
│   ├── GameLoop.js
│   ├── SaveSystem.js
│   ├── CombatEngine.js
│   ├── SkillSystem.js
│   └── DataSync.js       (Google Sheets integration)
├── utils/
│   ├── calculations.js
│   ├── random.js
│   └── sheetsApi.js      (Google Sheets API wrapper)
├── hooks/
│   ├── useGameLoop.js
│   ├── useSaveGame.js
│   └── useGameData.js    (data loading with cache)
└── App.js
```

#### 1.2 Game Loop Implementation
- [ ] Create `useGameLoop` hook with 100ms interval
- [ ] Implement delta-time tracking
- [ ] Add tick counter for time-based events
- [ ] Ensure cleanup on component unmount

**Key Code Pattern:**
```javascript
const useGameLoop = (callback) => {
  const requestRef = useRef();
  const previousTimeRef = useRef();

  useEffect(() => {
    const interval = setInterval(() => {
      const deltaTime = Date.now() - (previousTimeRef.current || Date.now());
      previousTimeRef.current = Date.now();
      callback(deltaTime);
    }, 100);

    return () => clearInterval(interval);
  }, [callback]);
};
```

#### 1.3 Save/Load System
- [ ] Create localStorage save function
- [ ] Create localStorage load function
- [ ] Implement auto-save on tick
- [ ] Add manual save/load buttons (for testing)
- [ ] Handle save data versioning (`norrathIdleSave_v21`)
- [ ] Add save migration logic for future updates

---

### Phase 1.5: Google Sheets Data Integration (Week 1.5-2)

> **Purpose:** Centralize all game configuration and metadata in Google Sheets for easy balancing, content scaling, and collaboration without code changes.

#### 1.5.1 Google Sheets Setup
- [ ] Create Google Cloud Project
- [ ] Enable Google Sheets API
- [ ] Create API credentials (API Key for read-only public access OR OAuth 2.0 for private sheets)
- [ ] Set up spreadsheet structure with multiple sheets:
  - **Races** (columns: id, name, STR, STA, AGI, DEX, WIS, INT, CHA)
  - **Classes** (columns: id, name, hpModifier, primaryStat, skills, startWeapon)
  - **Monsters** (columns: id, name, level, hp, minDmg, maxDmg, ac, xpReward, rareVariant)
  - **Items** (columns: id, name, type, stackable, maxStack, value, stats, slot)
  - **Zones** (columns: id, name, isSafe, minLevel, maxLevel, monsters, npcs)
  - **Recipes** (columns: id, name, skill, trivialLevel, ingredients, result, container)
  - **LootTables** (columns: monsterId, itemId, dropChance, minQty, maxQty, currencyMin, currencyMax)
  - **Skills** (columns: id, name, type, staminaCost, procChance, damageBonus)
  - **NPCs** (columns: id, name, type, zone, inventory, dialogue)
  - **QuestTemplates** (columns: id, type, targetType, minLevel, maxLevel, xpReward, copperReward)
- [ ] Populate initial data rows for MVP content
- [ ] Share spreadsheet (public read-only OR configure OAuth)

**Example Spreadsheet Structure:**

Sheet: **Monsters**
| id | name | level | hp | minDmg | maxDmg | ac | xpReward | rareVariant |
|----|------|-------|-----|--------|--------|-----|----------|-------------|
| giant_rat | a giant rat | 1 | 25 | 1 | 3 | 5 | 10 | FALSE |
| snake | a snake | 2 | 35 | 2 | 5 | 8 | 15 | FALSE |
| gnoll_pup | a gnoll pup | 3 | 50 | 3 | 7 | 12 | 25 | TRUE |

Sheet: **Items**
| id | name | type | stackable | maxStack | value | damage | delay | ac | slot |
|----|------|------|-----------|----------|-------|--------|-------|-----|------|
| rusty_dagger | Rusty Dagger | weapon | FALSE | 1 | 5 | 3 | 20 | 0 | primary |
| rat_ear | Rat Ear | junk | TRUE | 20 | 1 | 0 | 0 | 0 | NULL |
| rations | Rations | consumable | TRUE | 20 | 3 | 0 | 0 | 0 | NULL |

#### 1.5.2 API Integration
- [ ] Install Google API client library: `npm install gapi-script` or use fetch API directly
- [ ] Create `sheetsApi.js` utility:
  ```javascript
  // Fetch data from a specific sheet
  async function fetchSheetData(spreadsheetId, sheetName) {
    const range = `${sheetName}!A:Z`;
    const apiKey = process.env.REACT_APP_GOOGLE_SHEETS_API_KEY;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();
    return parseSheetToJSON(data.values);
  }

  // Convert 2D array to array of objects
  function parseSheetToJSON(rows) {
    const headers = rows[0];
    return rows.slice(1).map(row => {
      const obj = {};
      headers.forEach((header, i) => {
        obj[header] = row[i];
      });
      return obj;
    });
  }
  ```
- [ ] Add environment variable for Spreadsheet ID and API Key
- [ ] Implement error handling for API failures
- [ ] Add retry logic with exponential backoff

#### 1.5.3 Data Synchronization System
- [ ] Create `DataSync.js` system:
  - Fetch all sheets on app initialization
  - Transform sheet data to match internal data structures
  - Type coercion (convert string numbers to integers, parse JSON columns)
  - Validate required fields
- [ ] Implement caching strategy:
  ```javascript
  {
    data: {...},
    lastFetch: timestamp,
    ttl: 300000 // 5 minutes
  }
  ```
- [ ] Store fetched data in localStorage for offline capability
- [ ] Add "Refresh Data" button in dev/admin UI

**Data Transform Examples:**
```javascript
// Transform Monsters sheet data
function transformMonsterData(sheetRows) {
  return sheetRows.reduce((acc, row) => {
    acc[row.id] = {
      name: row.name,
      level: parseInt(row.level),
      hp: parseInt(row.hp),
      damage: {
        min: parseInt(row.minDmg),
        max: parseInt(row.maxDmg)
      },
      ac: parseInt(row.ac),
      xpReward: parseInt(row.xpReward),
      isRare: row.rareVariant === 'TRUE'
    };
    return acc;
  }, {});
}

// Transform LootTables sheet data
function transformLootTableData(sheetRows) {
  const lootTables = {};
  sheetRows.forEach(row => {
    if (!lootTables[row.monsterId]) {
      lootTables[row.monsterId] = {
        currency: {
          min: parseInt(row.currencyMin),
          max: parseInt(row.currencyMax)
        },
        items: []
      };
    }
    if (row.itemId) {
      lootTables[row.monsterId].items.push({
        itemId: row.itemId,
        chance: parseFloat(row.dropChance),
        quantity: {
          min: parseInt(row.minQty),
          max: parseInt(row.maxQty)
        }
      });
    }
  });
  return lootTables;
}
```

#### 1.5.4 Fallback System
- [ ] Create static fallback data files in `src/data/fallback/`
- [ ] Implement fallback logic if API fails:
  ```javascript
  async function loadGameData() {
    try {
      const data = await fetchFromGoogleSheets();
      cacheData(data);
      return data;
    } catch (error) {
      console.warn('Failed to fetch from Sheets, using fallback', error);
      return loadFallbackData();
    }
  }
  ```
- [ ] Display warning banner if using fallback data
- [ ] Log sync status to console (dev mode)

#### 1.5.5 Custom Hook for Data Access
- [ ] Create `useGameData.js` hook:
  ```javascript
  export function useGameData() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [usingFallback, setUsingFallback] = useState(false);

    useEffect(() => {
      async function loadData() {
        try {
          const gameData = await DataSync.load();
          setData(gameData);
          setUsingFallback(false);
        } catch (err) {
          setError(err);
          const fallback = await loadFallbackData();
          setData(fallback);
          setUsingFallback(true);
        } finally {
          setLoading(false);
        }
      }
      loadData();
    }, []);

    return { data, loading, error, usingFallback };
  }
  ```
- [ ] Use hook in App.js to load data before rendering game
- [ ] Show loading screen while data fetches

#### 1.5.6 Development Workflow
- [ ] **Local Development:** Use cached/fallback data for fast iteration
- [ ] **Testing:** Fetch fresh data on demand with "Refresh" button
- [ ] **Production:** Fetch on app load, cache for 5 minutes
- [ ] **Hot-reload:** Add webhook or polling to detect sheet changes (optional)

#### 1.5.7 Data Validation
- [ ] Validate all required fields exist
- [ ] Check data types match expectations
- [ ] Warn on missing IDs or broken references (e.g., monster references non-existent item)
- [ ] Add schema validation (optional: use Zod or Yup)

#### 1.5.8 Benefits Summary
✅ **Easy Balancing:** Change numbers in Sheets, refresh game—no code deploy
✅ **Content Scaling:** Add new monsters, items, zones without touching code
✅ **Collaboration:** Non-programmers can add content
✅ **Version Control:** Sheets has built-in revision history
✅ **A/B Testing:** Duplicate sheet to test different balance configs
✅ **Offline Mode:** Cached data works without internet

---

### Phase 2: Character System (Week 2-3)

#### 2.1 Race & Class Data
- [ ] Define race data structure with base stats (STR, STA, AGI, DEX, WIS, INT, CHA)
  - Human, Barbarian, Wood Elf, Dark Elf, Dwarf
- [ ] Define class data structure
  - Warrior, Monk, Rogue, Cleric
  - Include HPModifier, PrimaryStat, available skills
- [ ] Create character creation UI

#### 2.2 Character State Management
- [ ] Create character state object:
  ```javascript
  {
    name: string,
    race: string,
    class: string,
    level: number,
    xp: number,
    hp: number,
    maxHp: number,
    stamina: number,
    maxStamina: number,
    stats: { STR, STA, AGI, DEX, WIS, INT, CHA },
    ac: number,
    food: number (0-100),
    water: number (0-100),
    currency: number (in copper),
    bindPoint: string,
    skills: {},
    inventory: [],
    equipped: {},
    activeQuests: [],
    completedQuestsToday: number,
    currentZone: string,
    target: null
  }
  ```

#### 2.3 Stat Calculations
- [ ] HP calculation: `(Level × HPModifier) + (STA × modifier)`
- [ ] Stamina calculation
- [ ] AC calculation from equipped gear
- [ ] XP curve implementation: `Level^1.9`
- [ ] Level-up logic and stat increases

#### 2.4 Starter Gear
- [ ] Generate class-appropriate starting weapon (except Monk)
- [ ] Add 20 Rations to starting inventory
- [ ] Add 20 Water Flasks to starting inventory

---

### Phase 3: Inventory & Items (Week 3-4)

#### 3.1 Item Data Structure
- [ ] Define item types: Weapon, Armor, Container, Consumable, Junk, Tradeskill
- [ ] Create item properties:
  ```javascript
  {
    id: string,
    name: string,
    type: string,
    stackable: boolean,
    maxStack: number,
    value: number (in copper),
    stats: { damage, delay, ac, etc. },
    consumable: { foodValue, waterValue },
    slot: string (for equipment)
  }
  ```

#### 3.2 Inventory System
- [ ] Fixed 10-slot inventory
- [ ] Stacking logic:
  - General items/consumables: stack to 20
  - Weapons, armor, containers: no stacking
- [ ] Add item to inventory function (with overflow check)
- [ ] Remove item from inventory function
- [ ] Stack merging logic

#### 3.3 Equipment System
- [ ] Equipment slots: Head, Chest, Legs, Feet, Hands, Primary, Secondary
- [ ] Equip item logic
- [ ] Unequip item logic
- [ ] AC recalculation on equipment change
- [ ] Weapon stats application

#### 3.4 Currency System
- [ ] Display as PP/GP/SP/CP
- [ ] Store internally as copper
- [ ] Conversion utilities:
  - 100 CP = 1 SP
  - 10 SP = 1 GP
  - 10 GP = 1 PP
- [ ] Currency formatting function

---

### Phase 4: Zone System (Week 4)

#### 4.1 Zone Data Structure
- [ ] Define zones:
  ```javascript
  {
    name: string,
    levelRange: { min, max },
    isSafe: boolean,
    monsters: [],
    description: string
  }
  ```
- [ ] Zones to implement:
  - Town of Qeynos (safe zone)
  - Newbie Yard
  - Blackburrow
  - High Keep

#### 4.2 Zone Travel
- [ ] Zone selection UI
- [ ] Travel button/system
- [ ] Zone transition logic
- [ ] Combat enable/disable based on zone safety
- [ ] Clear target on zone change

---

### Phase 5: Combat System (Week 5-6)

#### 5.1 Monster Data
- [ ] Define monster structure:
  ```javascript
  {
    id: string,
    name: string,
    level: number,
    hp: number,
    damage: { min, max },
    ac: number,
    xpReward: number,
    lootTable: [],
    isRare: boolean (5% spawn chance)
  }
  ```
- [ ] Create monster pool for each zone
- [ ] Implement rare "Named" variants

#### 5.2 Combat Mechanics
- [ ] "Attack" button (enabled only in hostile zones)
- [ ] Random target selection from current zone
- [ ] Weapon speed timing (Delay / 10 = seconds between attacks)
- [ ] Hit calculation:
  ```javascript
  baseChance = 50%
  skillBonus = (Skill - MobLevel*5) * 2%
  levelPenalty = LevelDelta * 5%
  hitChance = baseChance + skillBonus - levelPenalty
  ```
- [ ] Damage calculation: `WeaponDmg + StrBonus + 1d4`
- [ ] AC mitigation: `AC / (AC + 50 + MobLevel*2)`

#### 5.3 Combat Loop (in Game Tick)
- [ ] Check if target exists
- [ ] Check weapon delay timer
- [ ] Player attack round
- [ ] Monster counter-attack
- [ ] HP updates
- [ ] Combat log messages
- [ ] Check for death conditions

#### 5.4 Death & Respawn
- [ ] Death detection (HP <= 0)
- [ ] Clear current target
- [ ] Stop combat
- [ ] Teleport to bind point (Town)
- [ ] Restore 50% HP and Stamina
- [ ] Death message

#### 5.5 Triviality System
- [ ] "Con" system (level difference calculation)
- [ ] Green con: 5+ levels below player
- [ ] Zero XP reward for trivial kills
- [ ] UI indicator for trivial mobs

---

### Phase 6: Skill System (Week 6-7)

#### 6.1 Skill Data Structure
- [ ] Define skills:
  ```javascript
  {
    name: string,
    current: number,
    max: number, // (Level + 1) * 5
    type: string (passive/active),
    staminaCost: number
  }
  ```
- [ ] Combat skills: Defense, Dodge, Offense, Slashing, Piercing, Blunt
- [ ] Active abilities: Kick, Bash, Backstab, Double Attack

#### 6.2 Skill Progression
- [ ] Skill-up chance on successful use
- [ ] Skill cap enforcement: `(Level + 1) * 5`
- [ ] Skill check rolls
- [ ] Skill-up notification

#### 6.3 Active Abilities
- [ ] Kick: % chance to proc, consumes stamina, bonus damage
- [ ] Bash: % chance to proc, consumes stamina, bonus damage
- [ ] Backstab (Rogue): Higher damage from behind
- [ ] Double Attack: % chance for second hit

#### 6.4 Skill Trainer
- [ ] Guild Master NPC in Town
- [ ] Skill unlock requirements (level + currency)
- [ ] "Train" button for unlocking new skills
- [ ] Skill purchase UI

---

### Phase 7: Survival System (Week 7)

#### 7.1 Hunger & Thirst Meters
- [ ] Food meter (0-100%)
- [ ] Water meter (0-100%)
- [ ] Decay rate: decrease every 15 seconds
- [ ] UI display (progress bars or text)

#### 7.2 Consumption System
- [ ] Auto-consume when < 20% and items available
- [ ] Manual "Use" button on food/water items
- [ ] Block consumption if meter is full
- [ ] Meter restoration values per item

#### 7.3 Starvation/Dehydration Penalties
- [ ] Check if Food < 1 or Water < 1
- [ ] Apply 90% regeneration penalty to HP and Stamina
- [ ] Status indicator (Starving/Dehydrated)
- [ ] Warning messages

#### 7.4 Regeneration System
- [ ] HP regeneration tick (based on STA stat)
- [ ] Stamina regeneration tick
- [ ] Apply survival penalties
- [ ] Regeneration only out of combat (optional design choice)

---

### Phase 8: Quest System (Week 8)

#### 8.1 Quest Data Structure
- [ ] Define quest object:
  ```javascript
  {
    id: string,
    type: 'kill' | 'collect',
    target: string,
    required: number,
    progress: number,
    status: 'available' | 'active' | 'ready' | 'completed',
    rewards: { xp, copper },
    description: string
  }
  ```

#### 8.2 Quest Generation
- [ ] Generate 3 available quests at a time
- [ ] Timer: new quest every 5 minutes (if slots available)
- [ ] Prevent duplicate targets across active quests
- [ ] Random target selection from available mobs/items

#### 8.3 Quest Progression
- [ ] Kill tracking (increment on monster death)
- [ ] Collect tracking (increment on loot)
- [ ] Status update to "Ready" when complete
- [ ] Progress display in UI

#### 8.4 Quest Turn-In
- [ ] Town-only turn-in restriction
- [ ] Reward distribution (XP + Currency)
- [ ] Remove from active quests
- [ ] Increment daily completed counter
- [ ] Daily limit: 5 completed quests per day

#### 8.5 Quest Management
- [ ] Accept quest button
- [ ] Abandon quest button (2-click confirmation)
- [ ] Quest log UI
- [ ] Captain Tillin NPC

---

### Phase 9: Economy & Loot (Week 9)

#### 9.1 Loot Tables
- [ ] Define loot table structure per monster:
  ```javascript
  {
    currency: { min, max }, // in copper
    items: [
      { itemId, dropChance, quantity }
    ]
  }
  ```
- [ ] Scarcity settings:
  - Coin drops: 0-5 copper (very low)
  - Gear drops: 2% chance
  - Junk drops: 30% chance

#### 9.2 Loot Distribution
- [ ] Roll for currency drop
- [ ] Roll for each item in loot table
- [ ] Add items to inventory (check for space)
- [ ] Loot notification/log
- [ ] Auto-loot vs manual loot UI

#### 9.3 Merchant System
- [ ] NPC merchant in Town
- [ ] Buy interface:
  - Food (Rations)
  - Water (Flasks)
  - Basic gear
- [ ] Sell interface:
  - Sell any inventory item
  - Price = item.value in copper
- [ ] Currency transaction logic

---

### Phase 10: Tradeskills (Week 10)

#### 10.1 Recipe Data
- [ ] Define recipe structure:
  ```javascript
  {
    id: string,
    name: string,
    skill: string,
    trivialLevel: number,
    ingredients: [
      { itemId, quantity }
    ],
    result: { itemId, quantity },
    discovered: boolean
  }
  ```
- [ ] Create initial recipes for Baking, Brewing

#### 10.2 Container System
- [ ] Container items: Mixing Bowl, Brew Barrel
- [ ] Purchase from tradeskill merchants
- [ ] Click container to open crafting UI
- [ ] Container-specific recipe filtering

#### 10.3 Crafting Interface
- [ ] Ingredient selection from inventory
- [ ] Recipe matching logic
- [ ] Combine button
- [ ] Success/failure resolution:
  - Check valid recipe
  - Skill check vs Trivial Level
  - Success: Create item, chance to skill up
  - Failure: Consume ingredients, no yield

#### 10.4 Recipe Discovery
- [ ] Experimentation (try random combinations)
- [ ] Tradeskill trainer: pay to reveal recipes
- [ ] Recipe book UI (discovered vs unknown)

#### 10.5 Tradeskill Leveling
- [ ] Skill levels for each tradeskill
- [ ] Skill-up chance on successful combine
- [ ] Trivial level no-gain threshold

---

### Phase 11: NPC System (Week 11)

#### 11.1 NPC Types
- [ ] Merchants (buy/sell goods)
- [ ] Guild Masters (train skills)
- [ ] Quest Givers (Captain Tillin)
- [ ] Tradeskill Trainers (teach recipes, sell containers)

#### 11.2 NPC Interaction UI
- [ ] Click NPC to open dialog
- [ ] Dialog options based on NPC type
- [ ] Transaction interfaces
- [ ] Hail/greeting system (optional)

#### 11.3 Specific NPCs
- [ ] **Merchant:** Food/Water vendor
- [ ] **Guild Master:** Skill training for player's class
- [ ] **Captain Tillin:** Quest hub
- [ ] **Tradeskill Trainer:** Recipe teaching, container sales

---

### Phase 12: UI/UX Polish (Week 12)

#### 12.1 Layout Design
- [ ] Mobile-first responsive design
- [ ] Text-based interface (minimal graphics)
- [ ] Clear information hierarchy
- [ ] Tabs or sections for:
  - Character stats
  - Inventory
  - Combat log
  - Quests
  - Tradeskills
  - Map/Zones

#### 12.2 Combat Log
- [ ] Scrollable text feed
- [ ] Color-coded messages (damage, healing, skill-ups, loot)
- [ ] Timestamp (optional)
- [ ] Auto-scroll to bottom
- [ ] Max message limit (performance)

#### 12.3 Notifications
- [ ] Level up notifications
- [ ] Skill up notifications
- [ ] Quest completion alerts
- [ ] Low food/water warnings
- [ ] Death message

#### 12.4 Mobile Optimization
- [ ] Touch-friendly buttons (min 44x44px)
- [ ] Prevent zoom on input focus
- [ ] Optimized font sizes
- [ ] Minimal scrolling needs
- [ ] Portrait orientation focus

---

## Data Files Reference

> **Note:** All data files below are automatically generated from Google Sheets. Edit the spreadsheet to modify game content, then refresh the data sync in-game.

### races.js
*Synced from Google Sheets → "Races" tab*
```javascript
export const RACES = {
  HUMAN: {
    name: 'Human',
    baseStats: { STR: 75, STA: 75, AGI: 75, DEX: 75, WIS: 75, INT: 75, CHA: 75 }
  },
  BARBARIAN: {
    name: 'Barbarian',
    baseStats: { STR: 103, STA: 95, AGI: 82, DEX: 70, WIS: 70, INT: 60, CHA: 55 }
  },
  // ... etc
};
```

### classes.js
*Synced from Google Sheets → "Classes" tab*
```javascript
export const CLASSES = {
  WARRIOR: {
    name: 'Warrior',
    hpModifier: 20,
    primaryStat: 'STR',
    skills: ['Slashing', 'Piercing', 'Blunt', 'Defense', 'Bash', 'Kick'],
    startWeapon: 'rusty_longsword'
  },
  // ... etc
};
```

### monsters.js
*Synced from Google Sheets → "Monsters" and "LootTables" tabs*
```javascript
export const MONSTERS = {
  GIANT_RAT: {
    name: 'a giant rat',
    level: 1,
    hp: 25,
    damage: { min: 1, max: 3 },
    ac: 5,
    xpReward: 10,
    lootTable: {
      currency: { min: 0, max: 3 },
      items: [
        { itemId: 'rat_ear', chance: 30 },
        { itemId: 'rusty_dagger', chance: 2 }
      ]
    }
  },
  // ... etc
};
```

### zones.js
*Synced from Google Sheets → "Zones" tab*
```javascript
export const ZONES = {
  QEYNOS: {
    name: 'Town of Qeynos',
    isSafe: true,
    levelRange: { min: 1, max: 50 },
    npcs: ['merchant', 'guild_master', 'quest_giver', 'tradeskill_trainer']
  },
  NEWBIE_YARD: {
    name: 'Newbie Yard',
    isSafe: false,
    levelRange: { min: 1, max: 5 },
    monsters: ['GIANT_RAT', 'SNAKE', 'BAT']
  },
  // ... etc
};
```

---

## Key Formulas & Constants

### Combat
- **Hit Chance:** `50% + (Skill - MobLevel*5)*2% - LevelDelta*5%`
- **Damage:** `WeaponDmg + floor(STR/10) + 1d4`
- **Mitigation:** `AC / (AC + 50 + MobLevel*2)` (soft cap at AC 50)
- **Weapon Speed:** `Delay / 10 = seconds` (e.g., Delay 20 = 2.0s)

### Progression
- **XP to Level:** `Level^1.9 * 100`
- **Skill Cap:** `(Level + 1) * 5`
- **Trivial Con:** `PlayerLevel - MobLevel >= 5`

### Survival
- **Regen Rate:** Based on STA stat
- **Starvation Penalty:** 90% reduction when Food or Water < 1
- **Decay Rate:** 15-second intervals

### Economy
- **Currency Conversion:** 100 CP = 1 SP, 10 SP = 1 GP, 10 GP = 1 PP
- **Coin Drops:** 0-5 copper per kill (avg 2.5cp)
- **Gear Drop Rate:** 2%
- **Junk Drop Rate:** 30%

---

## Testing Checklist

### Core Systems
- [ ] Game loop runs at consistent 100ms
- [ ] Delta-time calculation is accurate
- [ ] Save/load persists all character data
- [ ] No data loss on page refresh

### Character
- [ ] All race/class combinations work
- [ ] Stats calculate correctly
- [ ] HP/Stamina pools accurate
- [ ] XP curve levels correctly (test levels 1-20)

### Combat
- [ ] Hit calculation feels balanced
- [ ] Damage scaling works
- [ ] AC mitigation has noticeable effect
- [ ] Weapon speeds are accurate
- [ ] Death/respawn functions properly
- [ ] Trivial XP penalty works

### Inventory
- [ ] 10-slot limit enforced
- [ ] Stacking works correctly
- [ ] Equipment changes AC
- [ ] Overflow items don't disappear

### Quests
- [ ] Quest generation timer works
- [ ] Kill tracking increments
- [ ] Collect tracking increments
- [ ] Turn-in only works in Town
- [ ] Daily limit enforced
- [ ] Abandon confirmation works

### Tradeskills
- [ ] Recipe matching works
- [ ] Skill checks feel fair
- [ ] Failed combines consume ingredients
- [ ] Skill-ups occur appropriately
- [ ] Container requirement enforced

### Survival
- [ ] Food/water decay at correct rate
- [ ] Auto-consume triggers at 20%
- [ ] Starvation penalty applies
- [ ] Regeneration rates correct

---

## Performance Considerations

### Optimization Strategies
1. **Memoize expensive calculations** (HP, AC, skill caps)
2. **Use useCallback** for game loop functions
3. **Limit combat log** to last 100 messages
4. **Debounce save operations** (save max once per second)
5. **Avoid unnecessary re-renders** (React.memo for static components)

### Memory Management
- Clear old combat log entries
- Remove expired quest timers
- Limit localStorage size (compress save data if needed)

---

## Future Enhancements (Post-MVP)

### Potential Features
- [ ] More zones (10+ zones spanning levels 1-50)
- [ ] Additional classes (Wizard, Enchanter, Necromancer, etc.)
- [ ] Spell system for casters
- [ ] Player housing
- [ ] Auction house (player-driven economy)
- [ ] Factions and reputation
- [ ] Achievements
- [ ] Prestige system (rebirth/ascension)
- [ ] Guilds
- [ ] PvP arena
- [ ] Raid bosses
- [ ] Seasonal events
- [ ] Mobile app wrapper (Capacitor/React Native)

### Technical Debt
- Migrate to TypeScript (type safety)
- Add unit tests (Jest + React Testing Library)
- Implement Redux or Zustand for complex state
- Add error boundaries
- Implement analytics
- Add accessibility features (ARIA labels)

---

## Development Timeline Estimate

| Phase | Duration | Focus |
|-------|----------|-------|
| 1 | Week 1-2 | Foundation & Game Loop |
| 1.5 | Week 1.5-2 | Google Sheets Data Integration |
| 2 | Week 2-3 | Character System |
| 3 | Week 3-4 | Inventory & Items |
| 4 | Week 4 | Zones |
| 5 | Week 5-6 | Combat System |
| 6 | Week 6-7 | Skills |
| 7 | Week 7 | Survival |
| 8 | Week 8 | Quests |
| 9 | Week 9 | Economy & Loot |
| 10 | Week 10 | Tradeskills |
| 11 | Week 11 | NPCs |
| 12 | Week 12 | Polish & Testing |

**Total Estimated Time:** 12 weeks for MVP (Phase 1.5 runs in parallel with Phase 1)

---

## Success Metrics

### MVP Completion Criteria
- [ ] Can create a character (all race/class combos)
- [ ] Can travel between zones
- [ ] Can engage in combat and gain XP
- [ ] Can level up to at least level 20
- [ ] Can manage inventory (loot, equip, sell)
- [ ] Can complete quests
- [ ] Can craft basic items
- [ ] Can buy/sell from merchants
- [ ] Game saves and loads correctly
- [ ] Mobile-friendly interface
- [ ] No game-breaking bugs

### Gameplay Balance Goals
- Average time to level 10: ~2-3 hours of active play
- Combat feels challenging but not frustrating
- Economy feels scarce but not impossible
- Skills level at a satisfying pace
- Food/water management is meaningful but not annoying

---

## Resources & References

### EverQuest Wikis
- [EQ Resource](https://www.eqresource.com/)
- [Allakhazam](https://everquest.allakhazam.com/)

### Game Development
- [Incremental Games Reddit](https://www.reddit.com/r/incremental_games/)
- [Idle Game Maker resources](https://orteil.dashnet.org/igm/)

### React Patterns
- [React Hooks Documentation](https://react.dev/reference/react)
- [Game Loop in React](https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258)

### Google Sheets API
- [Google Sheets API v4 Documentation](https://developers.google.com/sheets/api/guides/concepts)
- [Quick Start Guide](https://developers.google.com/sheets/api/quickstart/js)
- [API Reference](https://developers.google.com/sheets/api/reference/rest)
- [Using API Keys](https://cloud.google.com/docs/authentication/api-keys)

---

## Notes

- **Scope Management:** Start with Phase 1-5 for a playable prototype
- **Balancing:** Numbers will need tuning based on playtesting—use Google Sheets for quick iterations
- **Save Versioning:** Include version number in save key for future migrations
- **Mobile Testing:** Test on real devices early and often
- **Code Organization:** Keep data separate from logic for easy balancing
- **Google Sheets:** Set up the spreadsheet early (Phase 1.5) to enable content work parallel to code development
- **Data Fallbacks:** Always maintain static fallback data for offline/development use

---

**Document Version:** 1.1
**Last Updated:** 2026-01-01
**Status:** Ready for Development
