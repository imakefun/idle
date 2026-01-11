# Admin Dashboard - Design Document

## Overview

A visual content management system for the Norrath Idle game that allows rapid content creation, editing, and asset generation through AI assistance.

## Goals

1. **Visual Data Management** - Browse, search, and edit all game content in a user-friendly interface
2. **Rapid Content Creation** - Use LLM prompts to generate balanced game content
3. **Asset Generation** - Generate icons and images beyond emoji using AI models
4. **Google Sheets Sync** - Bidirectional sync with Google Sheets data
5. **Validation & Preview** - Validate data and preview how it appears in-game
6. **Bulk Operations** - Create, edit, and delete content in bulk

## Architecture

### Deployment Strategy

**Option 1: Separate Repository (Recommended)**
- New repo: `norrath-idle-admin`
- Shares Google Sheets API configuration
- Independent deployment (admin.imakefun.github.io/norrath-idle-admin)
- Benefits: Clean separation, different deployment schedule, admin-only access

**Option 2: Subdirectory in Main Repo**
- `/admin` folder in main repo
- Deployed to `/idle/admin` path
- Benefits: Single repo, shared code/types

**Recommendation: Start with Option 2, migrate to Option 1 later**

### Tech Stack

**Frontend Framework:**
- React (already used in main game)
- React Router for navigation
- Tailwind CSS for rapid UI development

**State Management:**
- React Context for app state
- TanStack Query (React Query) for data fetching/caching

**UI Components:**
- Shadcn/ui or similar component library
- Data tables with sorting/filtering
- Modal dialogs for editing
- Form validation with Zod or similar

**AI Integration:**
- Anthropic Claude API for content generation
- Google Imagen/Gemini for asset generation
- Prompt templates library

**Data Layer:**
- Google Sheets API v4 (read/write)
- Local draft system (localStorage/IndexedDB)
- Conflict resolution for concurrent edits

## Features

### 1. Data Browser

**Dashboard Home:**
- Statistics: Total items, monsters, quests, etc.
- Recent changes feed
- Quick actions (Add Monster, Add Item, etc.)
- Data health checks (missing icons, broken references)

**Data Tables:**
- Paginated, sortable, filterable tables for each data type
- Inline editing for simple fields
- Bulk select and operations
- Export to CSV/JSON
- Import from CSV/JSON

**Data Types:**
- Races
- Classes
- Monsters
- Items
- Zones
- Camps
- Skills
- Spawns
- Loot Tables
- Merchants
- Quests
- Recipes
- Tradeskills

### 2. Visual Editors

**Monster Editor:**
- Form-based editing
- Field validation (level ranges, stat ranges)
- Loot table selector with preview
- Preview card showing how monster appears in-game
- Balance calculator (compare to other monsters of same level)

**Item Editor:**
- Item type selector (weapon, armor, food, etc.)
- Conditional fields based on type
- Stat calculator (DPS for weapons, AC for armor)
- Equipment slot previewer
- Icon picker (emoji + AI generation)

**Quest Editor:**
- Quest type selector (kill, collect, etc.)
- Target selector with autocomplete
- Reward calculator
- Quest flow preview
- Difficulty balance checker

**Recipe Editor:**
- Component builder (drag-and-drop ingredients)
- Result preview
- Success rate calculator
- Skill-up curve visualization

### 3. AI Content Generation

**Prompt Library:**

**Monster Generator:**
```
Generate a [level] [type] monster for [zone]:
- Name: Fantasy-appropriate name
- Stats: HP, damage, AC balanced for level
- Loot: Appropriate drops for level/type
- Description: Flavorful 1-2 sentence description
```

**Item Generator:**
```
Generate a [type] [slot] for level [level]:
- Name: Fantasy-appropriate
- Stats: Balanced for level
- Value: Market-appropriate
- Description: Brief lore/functionality
```

**Quest Generator:**
```
Generate [count] quests for level [level]:
- Mix of kill and collect quests
- Use existing monsters/items from [zone]
- Balanced rewards
- Engaging quest text
```

**Batch Generation:**
- "Generate 10 level 5 monsters"
- "Generate complete armor set for level 10"
- "Generate 20 recipes for Blacksmithing skill 1-100"

### 4. Data Visualization & Analytics

**Analytics Dashboard:**
- Game economy overview
- Content distribution charts
- Balance metrics
- Player progression modeling
- Content gaps analysis

**Visualization Library:**
- Chart.js or Recharts for interactive charts
- D3.js for advanced visualizations
- Data tables with export capabilities
- Comparison tools

**Charts & Graphs:**

**XP Progression Curve:**
- Visualize XP required per level (1-50)
- Compare XP from monsters vs quests
- Calculate leveling time estimates
- Identify XP gaps or spikes
- Interactive curve editor to adjust formula

**Monster Balance Charts:**
- HP by level (scatter plot)
- Damage by level (line chart)
- XP rewards by level (bar chart)
- Compare monsters across levels
- Identify outliers (too weak/strong)

**Item Progression Charts:**
- Weapon damage by level (line chart)
- Armor AC by level (line chart)
- Item value by level (scatter plot)
- Equipment slot distribution (pie chart)
- Compare item power curves

**Zone Distribution:**
- Monster levels per zone (histogram)
- Monster count per camp (bar chart)
- Loot quality by zone (heatmap)
- Zone difficulty progression (line chart)

**Economy Analytics:**
- Item vendor prices (scatter plot)
- Loot table drop rates (stacked bar)
- Currency sources (pie chart: monsters, quests, vendors)
- Currency sinks (pie chart: merchants, skills, repairs)
- Inflation calculator

**Quest Analytics:**
- Quest rewards by level (multi-line: XP, copper, items)
- Quest types distribution (pie chart)
- Quest difficulty spread (histogram)
- Reward efficiency (XP per minute, copper per minute)

**Loot Table Analysis:**
- Drop rate visualization (tree map)
- Item rarity distribution (pie chart)
- Expected loot value per kill
- Compare loot tables across monster levels

**Recipe Economics:**
- Component cost vs result value (scatter plot)
- Tradeskill leveling curve (line chart)
- Recipe difficulty distribution (histogram)
- Crafting profitability analysis

**Comparison Tools:**

**Monster Comparison:**
- Side-by-side stat comparison
- Radar chart for multi-stat comparison
- Select 2-10 monsters to compare
- Highlight differences
- Generate comparison report

**Item Comparison:**
- Compare weapons: DPS, delay, damage range
- Compare armor: AC, stats, weight
- Side-by-side equipment sets
- Upgrade path visualization (item A → item B)

**Zone Comparison:**
- Monster density and levels
- Loot quality and quantity
- XP efficiency (XP per hour estimate)
- Safety level (monster difficulty)

**Quest Comparison:**
- Reward efficiency
- Time to complete estimates
- Difficulty ratings
- Prerequisites and chains

**Modeling Tools:**

**XP Progression Modeler:**
```
Inputs:
- XP curve formula (editable)
- Monster XP by level
- Quest XP by level
- Daily play time

Outputs:
- Levels per hour chart
- Time to max level
- XP sources breakdown
- Recommended content by level
```

**Economy Simulator:**
```
Inputs:
- Starting currency
- Income sources (monsters, quests, vendors)
- Expense sinks (gear, skills, consumables)
- Play pattern (hours per day)

Outputs:
- Currency over time projection
- Break-even analysis
- Savings rate
- Equipment affordability timeline
```

**Drop Rate Calculator:**
```
Inputs:
- Loot table weights
- Monster kill rate
- Play time

Outputs:
- Expected items per hour
- Time to acquire specific item
- Rare item probability
- Farming efficiency rankings
```

**Character Progression Planner:**
```
Track progression through content:
- Recommended zones by level
- Equipment upgrade path
- Skill training priority
- Quest availability timeline
- Tradeskill leveling plan
```

**Balance Analyzer:**
```
Automated checks:
- Monster HP/damage outliers
- Under/overpowered items
- XP curve smoothness
- Quest reward fairness
- Economy inflation risks
- Content gaps (missing level ranges)
```

**Data Export:**
- Export charts as PNG/SVG
- Export data as CSV/JSON
- Generate PDF reports
- Share comparison links

### 5. Asset Generation

**Icon Generator (Google Imagen/Gemini):**
- Text prompt: "Simple pixel art icon of a bronze sword"
- Style presets: pixel art, flat design, hand-drawn
- Size options: 32x32, 64x64, 128x128
- Generation queue for batch processing
- Icon library/gallery

**Asset Types:**
- Item icons
- Monster portraits
- Zone background images
- UI elements
- Skill icons

### 5. Data Validation

**Validation Rules:**
- Required fields check
- Reference validation (item IDs, monster IDs, etc.)
- Numeric range validation
- Duplicate ID detection
- Balance warnings (overpowered items, trivial quests)

**Validation Dashboard:**
- List all validation errors/warnings
- Quick fix actions
- Bulk validation for entire dataset

### 6. Google Sheets Sync

**Sync Features:**
- Pull from Sheets: Fetch latest data
- Push to Sheets: Write local changes
- Conflict detection: Show changes since last pull
- Dry-run mode: Preview changes before writing
- Rollback capability: Undo last sync

**Sync UI:**
- Status indicator (synced, pending changes, conflicts)
- Change log viewer
- Sheet selector (which tabs to sync)
- Manual vs auto-sync toggle

## UI Layout

```
┌─────────────────────────────────────────────────────────┐
│ 🎮 Norrath Idle Admin   [Sync Status] [User] [Settings]│
├──────────┬──────────────────────────────────────────────┤
│          │                                              │
│ 📊 Home  │  Dashboard / Content Area                    │
│          │                                              │
│ 👤 Races │  - Data tables                               │
│ ⚔️  Classes│  - Edit forms                                │
│ 👹 Monsters│ - AI generation                              │
│ 🎒 Items │  - Asset preview                              │
│ 🗺️  Zones  │                                              │
│ 🏕️  Camps  │                                              │
│ ⚡ Skills │                                              │
│ 📍 Spawns│                                              │
│ 💰 Loot  │                                              │
│ 🏪 Merchants│                                             │
│ 📜 Quests│                                              │
│ 🔨 Recipes│                                              │
│          │                                              │
│ 🤖 AI    │                                              │
│ 🎨 Assets│                                              │
│ ✅ Validate│                                             │
│ ⚙️  Settings│                                             │
│          │                                              │
└──────────┴──────────────────────────────────────────────┘
```

## Data Flow

```
┌─────────────────┐      ┌──────────────┐      ┌─────────────┐
│  Google Sheets  │◄────►│ Admin Dashboard│◄───►│ Local Draft │
│  (Source)       │      │  (Editor)      │      │ (IndexedDB) │
└─────────────────┘      └──────────────┘      └─────────────┘
                                │
                                ▼
                         ┌──────────────┐
                         │ AI Services  │
                         │ - Claude API │
                         │ - Imagen API │
                         └──────────────┘
```

## Implementation Phases

### Phase 1: Foundation (Week 1) - ✅ COMPLETED
- ✅ Create branch and design doc
- ✅ Set up React app in `/admin` folder
- ✅ Configure Vite build for admin app
- ✅ Basic routing structure
- ✅ Sidebar navigation
- ✅ Dashboard home page

### Phase 2: Data Browser & Editor (Week 2-3) - ✅ COMPLETED
- ✅ Google Sheets API integration (read & write)
- ✅ Data service with CRUD operations
- ✅ Data context provider for React
- ✅ Editable data table components
- ✅ Pagination, sorting, filtering
- ✅ Search functionality
- ✅ Modal editors for complex content
- ✅ Auto-sync to Google Sheets on save
- ✅ Conflict detection and error handling
- ✅ Implement all 13 content type pages:
  - ✅ Monsters - creatures and NPCs
  - ✅ Items - equipment, weapons, consumables
  - ✅ Quests - kill and collect objectives
  - ✅ Races - playable races with base stats
  - ✅ Classes - playable classes with stat modifiers
  - ✅ Zones - game zones with level ranges
  - ✅ Camps - spawn areas within zones
  - ✅ Spawns - monster spawn configurations
  - ✅ Skills - class abilities and spells
  - ✅ Loot Tables - item drop configurations
  - ✅ Merchants - NPCs that sell items
  - ✅ Recipes - crafting recipes
  - ✅ Tradeskills - crafting professions

### Phase 3: Data Visualization & Analytics (Week 4) - NEXT
- [ ] Analytics Dashboard with economy overview
- [ ] XP Progression Curve visualization
- [ ] Monster Balance Charts
- [ ] Item Progression Charts
- [ ] Zone Distribution analysis
- [ ] Economy Analytics (currency sources/sinks)
- [ ] Quest Analytics (rewards, efficiency)
- [ ] Loot Table Analysis
- [ ] Comparison tools for monsters, items, zones, quests
- [ ] Modeling tools (XP progression, economy simulator, drop rate calculator)
- [ ] Rollback system

### Phase 5: AI Generation (Week 5)
- [ ] Claude API integration
- [ ] Prompt template system
- [ ] Content generators (monsters, items, quests)
- [ ] Batch generation
- [ ] Generation history

### Phase 6: Asset Generation (Week 6)
- [ ] Google Imagen integration
- [ ] Icon generator UI
- [ ] Asset library
- [ ] Generation queue
- [ ] Asset export system

### Phase 7: Polish & Advanced Features (Week 7)
- [ ] Validation dashboard
- [ ] Bulk operations
- [ ] Import/export
- [ ] User preferences
- [ ] Documentation

## Security Considerations

**API Keys:**
- Store API keys in environment variables
- Admin app should NOT be deployed publicly
- Implement authentication (GitHub OAuth, etc.)

**Data Access:**
- Read/write permissions check
- Audit log for all changes
- Undo/redo functionality

## Configuration

**Environment Variables:**
```env
VITE_GOOGLE_SHEETS_API_KEY=...
VITE_SPREADSHEET_ID=...
VITE_ANTHROPIC_API_KEY=...
VITE_GOOGLE_IMAGEN_API_KEY=...
```

**Admin Config:**
```javascript
{
  "autoSync": false,
  "syncInterval": 300000, // 5 minutes
  "validationLevel": "strict",
  "aiModel": "claude-3-sonnet",
  "imageModel": "imagen-3"
}
```

## Next Steps

1. **Set up admin app structure**
   - Create `/admin` folder
   - Set up Vite + React
   - Configure routing

2. **Build data browser**
   - Google Sheets read integration
   - Data tables for all content types

3. **Create first editor**
   - Start with Monster editor (good test case)
   - Implement validation

4. **Add AI generation**
   - Claude API integration
   - Monster generation prompt

---

**Status:** Design Phase
**Branch:** `claude/admin-dashboard-iYpFt`
**Target:** Separate repository after MVP
