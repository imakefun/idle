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
- **Build Tool:** Vite (recommended for fast builds and GitHub Pages deployment)
- **Data Management:** Google Sheets API for game config/metadata synchronization
- **Hosting:** GitHub Pages (static site, no server required)
- **UI Framework:** Mobile-first responsive CSS (or optional: Tailwind CSS for rapid development)

### Key Technical Requirements
1. **Delta-time calculation** for frame-independent timing
2. **Auto-save** on every tick or state change
3. **Mobile-first responsive** design optimized for phones, works on desktop
4. **Performance optimization** for continuous game loop
5. **State serialization** for localStorage persistence
6. **Google Sheets integration** for centralized game data management and balancing
7. **Static deployment** compatible with GitHub Pages (no backend server needed)

---

## Implementation Phases

### Phase 1: Core Foundation (Week 1-2)

#### 1.1 Project Setup
- [ ] Initialize React project with Vite: `npm create vite@latest norrath-idle -- --template react`
- [ ] Set up project structure and folder organization
- [ ] Configure TypeScript (optional but recommended)
- [ ] Install UI dependencies (optional: `npm install -D tailwindcss` for mobile-first styling)
- [ ] Set up Git repository and initial commit
- [ ] Configure for GitHub Pages deployment (see section 1.4 below)

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

#### 1.4 GitHub Pages Deployment Setup

> **Purpose:** Configure the project for automatic deployment to GitHub Pages, enabling you to play and test directly in your browser without any server setup.

**Why This Works Without a Server:**
- React builds to static HTML/CSS/JS files
- Google Sheets API works client-side with API keys (no backend needed)
- localStorage handles all game saves locally in the browser
- GitHub Pages serves static files for free

**Setup Steps:**

- [ ] **Configure Vite for GitHub Pages**

  Edit `vite.config.js`:
  ```javascript
  import { defineConfig } from 'vite'
  import react from '@vitejs/plugin-react'

  export default defineConfig({
    plugins: [react()],
    base: '/idle/', // Replace 'idle' with your repo name
  })
  ```

- [ ] **Add deployment scripts to `package.json`:**
  ```json
  {
    "scripts": {
      "dev": "vite",
      "build": "vite build",
      "preview": "vite preview",
      "deploy": "npm run build && gh-pages -d dist"
    }
  }
  ```

- [ ] **Install gh-pages package:** `npm install -D gh-pages`

- [ ] **Enable GitHub Pages in repo settings:**
  - Go to repository Settings → Pages
  - Source: Deploy from branch
  - Branch: `gh-pages` (will be created automatically)
  - Folder: `/ (root)`

- [ ] **Create `.env` file for API key (DO NOT commit this):**
  ```
  VITE_GOOGLE_SHEETS_API_KEY=your_api_key_here
  VITE_SPREADSHEET_ID=your_spreadsheet_id_here
  ```

- [ ] **Add `.env` to `.gitignore`:**
  ```
  .env
  .env.local
  ```

- [ ] **Use environment variables in code:**
  ```javascript
  const API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
  const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID;
  ```

- [ ] **For production, add secrets to GitHub:**
  - Settings → Secrets and variables → Actions
  - Add `VITE_GOOGLE_SHEETS_API_KEY`
  - Add `VITE_SPREADSHEET_ID`

- [ ] **Create GitHub Actions workflow** (`.github/workflows/deploy.yml`):
  ```yaml
  name: Deploy to GitHub Pages

  on:
    push:
      branches: [ main ]
    workflow_dispatch:

  jobs:
    build-and-deploy:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v3

        - name: Setup Node
          uses: actions/setup-node@v3
          with:
            node-version: '18'

        - name: Install dependencies
          run: npm ci

        - name: Build
          env:
            VITE_GOOGLE_SHEETS_API_KEY: ${{ secrets.VITE_GOOGLE_SHEETS_API_KEY }}
            VITE_SPREADSHEET_ID: ${{ secrets.VITE_SPREADSHEET_ID }}
          run: npm run build

        - name: Deploy
          uses: peaceiris/actions-gh-pages@v3
          with:
            github_token: ${{ secrets.GITHUB_TOKEN }}
            publish_dir: ./dist
  ```

**Deployment Workflow:**
1. Push code to `main` branch
2. GitHub Actions automatically builds and deploys
3. Game is live at `https://yourusername.github.io/idle/`
4. Any changes pushed to `main` auto-deploy

**Manual Deploy (Alternative):**
```bash
npm run deploy
```

**Testing Locally Before Deploy:**
```bash
npm run dev
# Opens at http://localhost:5173
```

**Benefits:**
- ✅ No server costs
- ✅ No server maintenance
- ✅ Instant deploys via Git push
- ✅ Free SSL certificate
- ✅ Global CDN for fast loading
- ✅ Version control through Git

---

### Phase 1.5: Google Sheets Data Integration (Week 1.5-2)

> **Purpose:** Centralize all game configuration and metadata in Google Sheets for easy balancing, content scaling, and collaboration without code changes.

> **Static Hosting Compatible:** This works perfectly with GitHub Pages! The Google Sheets API v4 supports client-side API keys for public sheets—no backend server required.

#### 1.5.1 Google Sheets Setup
- [ ] Create Google Cloud Project at [console.cloud.google.com](https://console.cloud.google.com)
- [ ] Enable Google Sheets API
- [ ] Create API Key credentials (NOT OAuth - we want simple read-only access)
  - **Restrict the API key** to Google Sheets API only
  - **Add HTTP referrer restrictions** (e.g., `https://yourusername.github.io/*`)
- [ ] Create your Google Spreadsheet
- [ ] **Make spreadsheet publicly readable:**
  - Click "Share" → "Anyone with the link" → Viewer
  - This allows the API to read it without authentication
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

### Phase 12: Mobile-First UI/UX (Week 12)

> **Design Philosophy:** Optimize for mobile phones first, then scale up to tablets and desktops. Text-based, clean, and performant.

#### 12.1 Mobile-First Layout Design

**HTML Meta Tags (Required for Mobile):**
```html
<!-- index.html -->
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<meta name="theme-color" content="#1a1a1a">
<meta name="mobile-web-app-capable" content="yes">
```

**Layout Structure:**
- [ ] **Single-column layout** on mobile (< 768px)
- [ ] **Responsive grid** on tablet/desktop (>= 768px)
- [ ] **Fixed header** with game title, level, HP/Stamina bars
- [ ] **Tabbed navigation** at bottom (mobile) or sidebar (desktop)
- [ ] **Sticky footer** with primary actions (Attack, Rest, etc.)
- [ ] Text-based interface (minimal graphics/icons)
- [ ] Clear visual hierarchy with whitespace

**Tab Navigation:**
- [ ] Character (stats, equipment)
- [ ] Combat (current target, attack button, log)
- [ ] Inventory (items, equipped gear)
- [ ] Quests (active, available, completed)
- [ ] Town (NPCs, merchants, trainers)
- [ ] Crafting (tradeskills, recipes)

**CSS Framework Options:**
- **Option A:** Vanilla CSS with CSS Grid and Flexbox (full control)
- **Option B:** Tailwind CSS (rapid development, utility-first)
  ```bash
  npm install -D tailwindcss postcss autoprefixer
  npx tailwindcss init
  ```

#### 12.2 Responsive Breakpoints
```css
/* Mobile-first approach */
/* Base styles: Mobile (< 640px) */
.container { padding: 1rem; }

/* Tablet (>= 640px) */
@media (min-width: 640px) {
  .container { padding: 1.5rem; }
  .grid { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop (>= 1024px) */
@media (min-width: 1024px) {
  .container { max-width: 1200px; margin: 0 auto; }
  .sidebar { display: block; }
  .grid { grid-template-columns: repeat(3, 1fr); }
}
```

#### 12.3 Touch-Friendly Interactive Elements

**Button Specifications:**
- [ ] **Minimum touch target:** 44x44px (Apple HIG) or 48x48px (Material Design)
- [ ] **Button spacing:** 8px minimum between interactive elements
- [ ] **Active states:** Visual feedback on tap (`:active` pseudo-class)
- [ ] **Disabled states:** Clear visual distinction for unavailable actions

**Example Button CSS:**
```css
.btn {
  min-height: 48px;
  min-width: 100px;
  padding: 12px 24px;
  font-size: 16px; /* Prevents zoom on iOS */
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn:active {
  transform: scale(0.98);
  opacity: 0.8;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

#### 12.4 Typography for Mobile

**Font Sizes:**
- [ ] Base font: 16px minimum (prevents iOS zoom)
- [ ] Headings: 1.5rem - 2rem
- [ ] Body text: 1rem (16px)
- [ ] Small text: 0.875rem (14px minimum)
- [ ] Input fields: 16px minimum (prevents zoom on focus)

**Font Stack:**
```css
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
               'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
  font-size: 16px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}
```

#### 12.5 Combat Log

**Mobile Optimizations:**
- [ ] **Fixed height container** with `overflow-y: auto`
- [ ] **Auto-scroll to bottom** on new messages
- [ ] **Color-coded messages:**
  - Damage dealt: Red (#ff4444)
  - Damage taken: Orange (#ff8844)
  - Healing: Green (#44ff44)
  - XP gain: Blue (#4444ff)
  - Loot: Yellow (#ffff44)
  - Skill-ups: Purple (#ff44ff)
- [ ] **Timestamp** (optional, toggle in settings)
- [ ] **Max 100 messages** (clear old ones for performance)
- [ ] **Compact formatting** to save vertical space

**Example:**
```jsx
<div className="combat-log" style={{
  height: '200px',
  overflowY: 'auto',
  fontSize: '14px',
  lineHeight: '1.4'
}}>
  {messages.map((msg, i) => (
    <div key={i} style={{ color: msg.color }}>
      {msg.text}
    </div>
  ))}
</div>
```

#### 12.6 Status Bars & Meters

**HP/Stamina/Food/Water Bars:**
- [ ] **Visual progress bars** (not just numbers)
- [ ] **Color-coded:**
  - HP: Red (#ff0000) → gradient to dark red
  - Stamina: Blue (#0066ff)
  - Food: Orange (#ff9900)
  - Water: Cyan (#00ccff)
- [ ] **Percentage text overlay** on bars
- [ ] **Smooth transitions** with CSS

**Example:**
```jsx
<div className="stat-bar">
  <div className="stat-bar-label">HP</div>
  <div className="stat-bar-container">
    <div
      className="stat-bar-fill"
      style={{
        width: `${(hp / maxHp) * 100}%`,
        backgroundColor: '#ff0000',
        transition: 'width 0.3s ease'
      }}
    />
    <span className="stat-bar-text">{hp}/{maxHp}</span>
  </div>
</div>
```

#### 12.7 Notifications & Toast Messages

- [ ] **Toast notifications** for important events
- [ ] **Non-blocking** (appear at top, auto-dismiss)
- [ ] **Priority levels:**
  - Critical: Death, level up (red, persist until dismissed)
  - Important: Skill up, quest complete (yellow, 5s)
  - Info: Loot drops (white, 3s)
- [ ] **Stack multiple toasts** vertically
- [ ] **Tap to dismiss** on mobile

**Libraries (Optional):**
- React Hot Toast: `npm install react-hot-toast`
- React Toastify: `npm install react-toastify`

#### 12.8 Mobile Performance Optimizations

- [ ] **Lazy load components** not in current tab
- [ ] **Virtualize long lists** (e.g., inventory with 100+ items)
- [ ] **Debounce expensive operations** (combat calculations, auto-save)
- [ ] **Use CSS transforms** instead of position changes (better for animations)
- [ ] **Minimize re-renders** with React.memo, useMemo, useCallback
- [ ] **Service worker** for offline capability (optional)

**Virtualization for Inventory:**
```bash
npm install react-window
```

#### 12.9 Dark Mode (Default) with Light Mode Option

**Color Palette:**
```css
:root {
  /* Dark mode (default) */
  --bg-primary: #1a1a1a;
  --bg-secondary: #2a2a2a;
  --bg-tertiary: #3a3a3a;
  --text-primary: #ffffff;
  --text-secondary: #cccccc;
  --border: #444444;
  --accent: #00aaff;
}

[data-theme="light"] {
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --bg-tertiary: #e5e5e5;
  --text-primary: #1a1a1a;
  --text-secondary: #666666;
  --border: #cccccc;
  --accent: #0088cc;
}
```

- [ ] **Toggle button** in settings
- [ ] **Save preference** to localStorage
- [ ] **Respect system preference** (optional): `prefers-color-scheme`

#### 12.10 Testing Checklist

**Mobile Devices (Test on Real Devices):**
- [ ] iPhone SE (small screen, 375px width)
- [ ] iPhone 14 Pro (standard, 393px width)
- [ ] iPhone 14 Pro Max (large, 430px width)
- [ ] Android (Samsung Galaxy S23, 360px width)
- [ ] Tablet (iPad, 768px width)

**Browsers:**
- [ ] Safari iOS (primary mobile browser)
- [ ] Chrome Android
- [ ] Chrome Desktop
- [ ] Firefox Desktop
- [ ] Safari macOS

**Orientation:**
- [ ] Portrait (primary)
- [ ] Landscape (ensure playability)

**Interactions:**
- [ ] Touch gestures work (tap, scroll)
- [ ] No zoom on input focus
- [ ] No horizontal scrolling
- [ ] Buttons are easily tappable
- [ ] Swipe gestures don't conflict (if implemented)

**Performance:**
- [ ] 60 FPS on game loop
- [ ] No lag when switching tabs
- [ ] Fast initial load (<3 seconds)
- [ ] Combat log scrolling is smooth

#### 12.11 Accessibility (A11y)

- [ ] **Semantic HTML** (use `<button>`, `<nav>`, `<main>`, etc.)
- [ ] **ARIA labels** for screen readers
- [ ] **Keyboard navigation** (Tab, Enter, Space)
- [ ] **Focus indicators** (visible outline on focused elements)
- [ ] **Alt text** for any images/icons
- [ ] **Color contrast** meets WCAG AA standard (4.5:1 ratio)

**Example:**
```jsx
<button
  aria-label="Attack current target"
  disabled={!target}
>
  Attack
</button>
```

#### 12.12 Desktop Enhancements

**When screen width >= 1024px:**
- [ ] **Two-column layout:** Stats/Combat on left, Inventory/Quests on right
- [ ] **Persistent sidebar navigation** instead of tabs
- [ ] **Larger font sizes** (scale up by 10-20%)
- [ ] **Keyboard shortcuts:**
  - `A` - Attack
  - `I` - Inventory tab
  - `Q` - Quests tab
  - `T` - Town tab
  - `C` - Character tab
- [ ] **Hover states** on buttons (not just `:active`)
- [ ] **Wider max-width** (1200px container)

#### 12.13 Loading & Error States

- [ ] **Initial loading screen** while fetching Google Sheets data
- [ ] **Skeleton loaders** for async content
- [ ] **Error boundaries** for React errors
- [ ] **Fallback UI** when Google Sheets fails (show banner, use cached data)
- [ ] **"No internet" detection** and message

**Example Loading Screen:**
```jsx
{loading ? (
  <div className="loading-screen">
    <div className="spinner" />
    <p>Loading Norrath Idle...</p>
    <p className="text-sm">Fetching game data...</p>
  </div>
) : (
  <GameUI />
)}
```

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
| 1.4 | Week 1-2 | GitHub Pages Deployment Setup |
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
| 12 | Week 12 | Mobile-First UI/UX & Testing |

**Total Estimated Time:** 12 weeks for MVP
- Phases 1.4 and 1.5 run in parallel with Phase 1
- Deploy to GitHub Pages early for continuous testing

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

**Document Version:** 1.2
**Last Updated:** 2026-01-01
**Status:** Ready for Development

---

## Quick Start Summary

**To get started immediately:**

1. **Initialize Vite + React:** `npm create vite@latest norrath-idle -- --template react`
2. **Set up GitHub Pages:** Follow Phase 1.4 instructions
3. **Create Google Sheet:** Follow Phase 1.5.1 for game data
4. **Start building:** Begin with game loop (Phase 1.2) and save system (Phase 1.3)
5. **Deploy early:** Push to GitHub Pages after Phase 1 to enable testing on mobile devices
6. **Iterate:** Update Google Sheet for balancing, refresh game to see changes

**Game will run at:** `https://yourusername.github.io/idle/`
