# Quest Templates Metadata

This document describes the structure of the **QuestTemplates** sheet in Google Sheets.

## Purpose

Quest Templates define the types of quests that can be generated in the game. The system randomly generates quests based on these templates, selecting random targets and requirements within the defined ranges.

## Google Sheets Structure

### Sheet Name: `QuestTemplates`

| Column | Type | Required | Description | Example |
|--------|------|----------|-------------|---------|
| id | string | Yes | Unique identifier for the quest template | `quest_kill_rats` |
| type | string | Yes | Quest type: `kill` or `collect` | `kill` |
| targetType | string | Yes | What kind of target: `monster` or `item` | `monster` |
| targetIds | string | Yes | Comma-separated list of valid target IDs, or `any` for all | `rat,snake,bat` or `any` |
| minRequired | number | Yes | Minimum number of kills/items required | `3` |
| maxRequired | number | Yes | Maximum number of kills/items required | `10` |
| minLevel | number | Yes | Minimum player level to receive this quest | `1` |
| maxLevel | number | Yes | Maximum player level to receive this quest | `5` |
| xpReward | number | Yes | Base XP reward for completing quest | `50` |
| copperReward | number | Yes | Copper reward for completing quest | `25` |
| lootTableId | string | No | Optional loot table ID for item rewards | `loot_quest_rat` |
| title | string | Yes | Quest title with {target} and {count} placeholders | `Slay {count} {target}` |
| description | string | Yes | Quest description with placeholders | `The town needs your help! Kill {count} {target} and return for your reward.` |

## Quest Types

### Kill Quests
- **type:** `kill`
- **targetType:** `monster`
- **targetIds:** List of monster IDs or `any`
- Tracks kills of specific monster types

### Collect Quests
- **type:** `collect`
- **targetType:** `item`
- **targetIds:** List of item IDs or `any`
- Tracks items looted (not just in inventory, total looted during quest)

## Rewards

### Currency Reward
- **copperReward:** Fixed copper amount given on turn-in

### XP Reward
- **xpReward:** Fixed XP amount given on turn-in

### Loot Table Reward
- **lootTableId:** References a loot table from the `LootTables` sheet
- When turned in, rolls on the loot table and gives items
- Optional - leave empty for no item rewards

## Example Templates

### Kill Quest - Low Level Rats
```
id: quest_kill_rats
type: kill
targetType: monster
targetIds: rat
minRequired: 5
maxRequired: 10
minLevel: 1
maxLevel: 5
xpReward: 50
copperReward: 25
lootTableId: loot_quest_newbie
title: Slay {count} {target}
description: The town is overrun with {target}. Kill {count} of them and return for a reward.
```

### Collect Quest - Rat Ears
```
id: quest_collect_ears
type: collect
targetType: item
targetIds: rat_ear
minRequired: 5
maxRequired: 10
minLevel: 1
maxLevel: 5
xpReward: 75
copperReward: 30
lootTableId: loot_quest_newbie
title: Collect {count} {target}
description: I need {count} {target} for my research. Bring them to me and I'll reward you.
```

### Kill Quest - Any Low Level Monster
```
id: quest_kill_any_low
type: kill
targetType: monster
targetIds: any
minRequired: 10
maxRequired: 20
minLevel: 1
maxLevel: 10
xpReward: 100
copperReward: 50
lootTableId:
title: Slay {count} creatures
description: Prove your worth by slaying {count} creatures in the wild.
```

## Quest Generation System

1. **Available Quests:** Player can have up to 3 available quests at once
2. **Active Quests:** Player can have up to 3 active quests at once
3. **Quest Generation:** New quest generated every 5 minutes if slots available
4. **Daily Limit:** Players can complete 5 quests per day
5. **Level Filtering:** Only quests within player's level range are generated
6. **Target Selection:** If targetIds is specific, randomly selects one; if `any`, selects from all valid targets

## Quest State

Each generated quest instance has:
```javascript
{
  id: string,              // Unique instance ID (UUID)
  templateId: string,      // Reference to template
  type: 'kill' | 'collect',
  target: string,          // Specific monster/item ID selected
  targetName: string,      // Display name of target
  required: number,        // Randomly selected from min/max range
  progress: number,        // Current progress (kills or items collected)
  status: 'available' | 'active' | 'ready' | 'completed',
  rewards: {
    xp: number,
    copper: number,
    lootTableId: string | null
  },
  title: string,           // Title with placeholders replaced
  description: string      // Description with placeholders replaced
}
```

## Implementation Notes

- Quest templates are fetched from Google Sheets on game load
- Templates are cached along with other game data
- Quest generation happens client-side using templates
- Progress tracking integrated with combat and loot systems
- Turn-in only available in safe zones (town)
- Daily quest counter resets at midnight (client-side timer)

## Future Enhancements

- **Chain Quests:** questChainId and nextQuestId fields
- **Faction Requirements:** requiredFaction and minFactionLevel
- **Item Turn-In:** requireItemTurnIn flag for collect quests that consume items
- **Zone Requirements:** requiredZone for zone-specific quests
- **Time Limits:** questDuration for timed quests
- **Repeatable Quests:** isRepeatable flag

---

**Created:** 2026-01-04
**Status:** Active - Quest system in development
