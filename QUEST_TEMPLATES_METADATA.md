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

## Sample Quest Data (Tab-Separated for Google Sheets)

Copy the table below and paste directly into Google Sheets:

```
id	type	targetType	targetIds	minRequired	maxRequired	minLevel	maxLevel	xpReward	copperReward	lootTableId	title	description
quest_exterminate_rats	kill	monster	giant_rat	5	10	1	3	50	25	loot_quest_low	Exterminate {count} {target}	The town cellars are infested! Kill {count} {target} and return for your reward.
quest_snake_hunt	kill	monster	snake	4	8	2	4	75	35	loot_quest_low	Hunt {count} {target}	Snakes have been spotted near the roads. Slay {count} {target} to keep travelers safe.
quest_beetle_problem	kill	monster	fire_beetle	5	12	2	4	70	30	loot_quest_low	Beetle Extermination	Fire beetles are damaging crops. Kill {count} {target} to protect the fields.
quest_spider_menace	kill	monster	young_spider	4	10	3	5	100	50	loot_quest_low	Spider Threat	Spiders have been seen in the southern fields. Eliminate {count} {target}.
quest_gnoll_threat	kill	monster	gnoll_pup	3	7	3	6	125	60	loot_quest_low	Gnoll Threat	Gnoll pups have been spotted near the forest. Kill {count} {target} before they grow stronger.
quest_skeleton_patrol	kill	monster	decaying_skeleton	3	6	4	7	150	75		Clear the Undead	Skeletons haunt the old ruins. Destroy {count} {target} and bring peace to the area.
quest_wolf_pack	kill	monster	dark_wolf	3	7	5	8	200	100	loot_quest_low	Wolf Pack	A pack of dark wolves threatens the forest paths. Hunt down {count} {target}.
quest_gnoll_scouts	kill	monster	gnoll_scout	3	6	5	8	225	110	loot_quest_low	Scout Patrol	Gnoll scouts are scouting our defenses. Eliminate {count} {target}.
quest_guard_duty	kill	monster	gnoll_guard	2	5	6	9	275	130		Guard Elimination	Gnoll guards protect their territory. Defeat {count} {target} to weaken their forces.
quest_warrior_challenge	kill	monster	gnoll_warrior	2	4	7	10	350	175	loot_quest_low	Warrior Challenge	Face the gnoll warriors in battle. Slay {count} {target} to prove your strength.
quest_collect_rat_ears	collect	item	rat_ear	5	10	1	4	60	20	loot_quest_low	Collect {count} {target}	I need {target} for my alchemy. Bring me {count} of them.
quest_collect_snake_scales	collect	item	snake_scales	4	8	2	5	90	40		Snake Scale Collection	Snake scales are valuable for armor crafting. Collect {count} {target}.
quest_collect_beetle_eyes	collect	item	beetle_eye	5	12	2	5	85	35	loot_quest_low	Beetle Eye Harvest	Beetle eyes have alchemical properties. Gather {count} {target} for me.
quest_collect_bone_chips	collect	item	bone_chips	6	15	4	7	120	55		Bone Gathering	I need bone chips for my studies. Collect {count} {target} from the undead.
quest_collect_spider_silk	collect	item	spider_silk	4	10	3	6	110	50	loot_quest_low	Spider Silk Collection	Spider silk is prized by tailors. Gather {count} {target}.
quest_collect_wolf_pelts	collect	item	wolf_pelt	3	7	5	9	180	90	loot_quest_low	Wolf Pelt Hunt	Wolf pelts are needed for winter gear. Bring me {count} {target}.
quest_collect_gnoll_fangs	collect	item	gnoll_fang	4	8	3	7	140	65	loot_quest_low	Gnoll Fang Collection	Gnoll fangs make excellent trophies. Collect {count} {target}.
quest_scavenge_materials	collect	item	beetle_carapace	3	8	4	8	160	70		Material Scavenging	Beetle carapaces are useful for armor. Gather {count} {target}.
quest_prove_worth	kill	monster	any	8	15	1	3	80	40	loot_quest_low	Prove Your Worth	Slay {count} creatures to prove you're ready for adventure.
quest_hunt_beasts	kill	monster	any	10	20	5	10	250	120		Beast Hunter	Hunt down {count} dangerous beasts in the wilds.
quest_undead_cleansing	kill	monster	decaying_skeleton,skeletal_warrior	4	8	4	8	180	85	loot_quest_low	Undead Cleansing	The undead plague our lands. Destroy {count} {target}.
quest_gnoll_campaign	kill	monster	gnoll_pup,gnoll_scout,gnoll_guard	5	10	3	8	200	95	loot_quest_low	Gnoll Campaign	The gnolls grow bolder. Kill {count} {target} to push them back.
quest_canine_control	kill	monster	dark_wolf,guard_dog	4	8	5	9	220	105		Canine Control	Wild canines threaten the settlements. Hunt {count} {target}.
quest_arachnid_elimination	kill	monster	young_spider	6	12	3	6	130	60	loot_quest_low	Arachnid Problem	Spiders are multiplying too quickly. Eliminate {count} {target}.
quest_bandit_patrol	kill	monster	bandit_thug,bandit_guard	3	6	8	12	400	200	loot_quest_low	Bandit Patrol	Bandits harass travelers on the roads. Defeat {count} {target}.
```

---

**Created:** 2026-01-04
**Status:** Active - Quest system in development
