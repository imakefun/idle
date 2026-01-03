# Loot Tables Metadata

This document describes the structure of the **LootTables** Google Sheet.

## Sheet Name: `LootTables`

## Purpose
Defines reusable loot tables that can be attached to any system (monsters, quests, chests, etc.). Loot tables support grouped selections, weighted randomization, and recursive loot table references.

## Columns

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| `id` | string | Unique identifier for this loot table | `loot_rat` |
| `group` | number | Selection group number. One item is selected from each group. | `1` |
| `item` | string | Item ID, currency type, or another loot table ID | `rat_ear` |
| `min` | number | Minimum quantity to award (or number of loot table rolls) | `1` |
| `max` | number | Maximum quantity to award (or number of loot table rolls) | `3` |
| `step` | number | Quantity rounding multiple (e.g., step=5 means 5, 10, 15, etc.) | `1` |
| `weight` | number | Selection weight within this group (higher = more likely) | `30` |

## Loot Table System Explained

### Groups
- Each loot table can have multiple **groups** (1, 2, 3, etc.)
- The system makes **one selection per group**
- Groups allow multiple independent rolls (e.g., Group 1 = currency, Group 2 = items)

### Weights
- Within each group, items have **weights** that determine selection probability
- Higher weight = higher chance of selection
- Example: Group 1 has items with weights 70, 20, 10 → total weight = 100
  - Item A (70 weight) = 70% chance
  - Item B (20 weight) = 20% chance
  - Item C (10 weight) = 10% chance

### Min/Max/Step
- **Min**: Minimum quantity awarded
- **Max**: Maximum quantity awarded
- **Step**: Rounding multiple for quantity
- Example: Min=5, Max=15, Step=5 → possible outcomes are 5, 10, 15
- Example: Min=1, Max=10, Step=1 → possible outcomes are 1, 2, 3, 4, 5, 6, 7, 8, 9, 10

### Currency Types
- `copper` - Copper pieces
- `silver` - Silver pieces (worth 10 copper)
- `gold` - Gold pieces (worth 100 copper)
- `platinum` - Platinum pieces (worth 1000 copper)

### Recursive Loot Tables
- The `item` field can reference another loot table by ID
- When a loot table is selected, it's rolled `min` to `max` times
- Example: `item=loot_common`, `min=2`, `max=3` → rolls loot_common 2-3 times

### "Nothing" Entry
- Use item ID `nothing` or `null` to represent no reward
- Useful for creating % drop chances
- Example: Group with `rat_ear` (weight 30) and `nothing` (weight 70) = 30% drop chance

## Example Data

Copy and paste these tables directly into your Google Sheet.

### Complete Monster Loot Tables

Copy and paste all of these into your LootTables sheet for a complete end-to-end example.

```
id	group	item	min	max	step	weight
loot_rat	1	copper	0	3	1	100
loot_rat	2	rat_ear	1	1	1	30
loot_rat	2	nothing	0	0	1	70
loot_snake	1	copper	1	5	1	100
loot_snake	2	snake_scales	1	2	1	40
loot_snake	2	nothing	0	0	1	60
loot_snake	3	venom_sac	1	1	1	10
loot_snake	3	nothing	0	0	1	90
loot_gnoll_pup	1	copper	2	8	1	100
loot_gnoll_pup	2	gnoll_tooth	1	1	1	50
loot_gnoll_pup	2	nothing	0	0	1	50
loot_gnoll_pup	3	tattered_pelt	1	1	1	20
loot_gnoll_pup	3	nothing	0	0	1	80
loot_beetle	1	copper	1	4	1	100
loot_beetle	2	beetle_shell	1	1	1	35
loot_beetle	2	nothing	0	0	1	65
loot_spider	1	copper	2	6	1	100
loot_spider	2	spider_silk	1	2	1	45
loot_spider	2	nothing	0	0	1	55
loot_spider	3	venom_sac	1	1	1	15
loot_spider	3	nothing	0	0	1	85
loot_skeleton	1	copper	5	12	1	100
loot_skeleton	2	bone_chips	1	3	1	60
loot_skeleton	2	nothing	0	0	1	40
loot_skeleton	3	rusty_dagger	1	1	1	10
loot_skeleton	3	nothing	0	0	1	90
loot_gnoll_scout	1	copper	8	15	1	100
loot_gnoll_scout	2	gnoll_fur	1	2	1	50
loot_gnoll_scout	2	nothing	0	0	1	50
loot_gnoll_scout	3	rusty_dagger	1	1	1	15
loot_gnoll_scout	3	rusty_shortsword	1	1	1	10
loot_gnoll_scout	3	nothing	0	0	1	75
loot_wolf	1	copper	8	14	1	100
loot_wolf	2	wolf_pelt	1	1	1	60
loot_wolf	2	nothing	0	0	1	40
loot_wolf	3	wolf_tooth	1	2	1	40
loot_wolf	3	nothing	0	0	1	60
loot_gnoll_guard	1	copper	10	20	1	100
loot_gnoll_guard	2	gnoll_fur	1	2	1	60
loot_gnoll_guard	2	nothing	0	0	1	40
loot_gnoll_guard	3	bronze_dagger	1	1	1	15
loot_gnoll_guard	3	rusty_shortsword	1	1	1	10
loot_gnoll_guard	3	nothing	0	0	1	75
loot_skeleton_warrior	1	copper	12	25	1	100
loot_skeleton_warrior	2	bone_chips	2	4	1	70
loot_skeleton_warrior	2	nothing	0	0	1	30
loot_skeleton_warrior	3	bronze_dagger	1	1	1	20
loot_skeleton_warrior	3	rusty_shortsword	1	1	1	15
loot_skeleton_warrior	3	nothing	0	0	1	65
loot_gnoll_warrior	1	copper	15	30	1	100
loot_gnoll_warrior	2	gnoll_fur	2	3	1	70
loot_gnoll_warrior	2	nothing	0	0	1	30
loot_gnoll_warrior	3	bronze_dagger	1	1	1	20
loot_gnoll_warrior	3	iron_shortsword	1	1	1	10
loot_gnoll_warrior	3	leather_tunic	1	1	1	15
loot_gnoll_warrior	3	nothing	0	0	1	55
loot_gnoll_shaman	1	copper	18	35	1	100
loot_gnoll_shaman	2	gnoll_fur	2	3	1	60
loot_gnoll_shaman	2	spell_components	1	2	1	40
loot_gnoll_shaman	3	health_potion	1	2	1	30
loot_gnoll_shaman	3	stamina_potion	1	2	1	20
loot_gnoll_shaman	3	nothing	0	0	1	50
loot_bandit_thug	1	copper	15	30	1	100
loot_bandit_thug	2	bronze_dagger	1	1	1	25
loot_bandit_thug	2	rusty_shortsword	1	1	1	15
loot_bandit_thug	2	nothing	0	0	1	60
loot_bandit_thug	3	health_potion	1	1	1	20
loot_bandit_thug	3	nothing	0	0	1	80
loot_guard_dog	1	copper	10	20	1	100
loot_guard_dog	2	dog_pelt	1	1	1	50
loot_guard_dog	2	nothing	0	0	1	50
loot_guard_dog	3	wolf_tooth	1	2	1	30
loot_guard_dog	3	nothing	0	0	1	70
loot_bandit_guard	1	copper	20	40	5	100
loot_bandit_guard	2	iron_shortsword	1	1	1	20
loot_bandit_guard	2	bronze_dagger	1	1	1	25
loot_bandit_guard	2	leather_tunic	1	1	1	20
loot_bandit_guard	2	nothing	0	0	1	35
loot_bandit_guard	3	health_potion	1	2	1	35
loot_bandit_guard	3	stamina_potion	1	1	1	25
loot_bandit_guard	3	nothing	0	0	1	40
loot_bandit_archer	1	copper	22	45	1	100
loot_bandit_archer	2	arrows	5	15	5	60
loot_bandit_archer	2	nothing	0	0	1	40
loot_bandit_archer	3	shortbow	1	1	1	15
loot_bandit_archer	3	leather_tunic	1	1	1	20
loot_bandit_archer	3	nothing	0	0	1	65
loot_bandit_archer	4	health_potion	1	2	1	30
loot_bandit_archer	4	nothing	0	0	1	70
loot_bandit_veteran	1	copper	30	60	5	100
loot_bandit_veteran	2	iron_shortsword	1	1	1	25
loot_bandit_veteran	2	steel_dagger	1	1	1	15
loot_bandit_veteran	2	chainmail_tunic	1	1	1	20
loot_bandit_veteran	2	nothing	0	0	1	40
loot_bandit_veteran	3	health_potion	1	3	1	50
loot_bandit_veteran	3	stamina_potion	1	2	1	40
loot_bandit_veteran	3	nothing	0	0	1	10
loot_bandit_mage	1	copper	35	65	5	100
loot_bandit_mage	2	spell_components	2	4	1	70
loot_bandit_mage	2	nothing	0	0	1	30
loot_bandit_mage	3	mana_potion	1	3	1	50
loot_bandit_mage	3	health_potion	1	2	1	40
loot_bandit_mage	3	nothing	0	0	1	10
loot_bandit_mage	4	magic_ring	1	1	1	10
loot_bandit_mage	4	nothing	0	0	1	90
loot_bandit_captain	1	copper	40	80	5	100
loot_bandit_captain	2	steel_dagger	1	1	1	25
loot_bandit_captain	2	iron_longsword	1	1	1	20
loot_bandit_captain	2	chainmail_tunic	1	1	1	25
loot_bandit_captain	2	nothing	0	0	1	30
loot_bandit_captain	3	health_potion	2	3	1	60
loot_bandit_captain	3	stamina_potion	1	3	1	50
loot_bandit_captain	3	nothing	0	0	1	10
loot_elite_bandit	1	copper	50	100	10	100
loot_elite_bandit	2	steel_dagger	1	1	1	30
loot_elite_bandit	2	iron_longsword	1	1	1	25
loot_elite_bandit	2	chainmail_tunic	1	1	1	30
loot_elite_bandit	2	nothing	0	0	1	15
loot_elite_bandit	3	health_potion	2	4	1	70
loot_elite_bandit	3	stamina_potion	2	3	1	60
loot_elite_bandit	3	mana_potion	1	2	1	30
loot_bandit_champion	1	copper	60	120	10	100
loot_bandit_champion	2	steel_longsword	1	1	1	20
loot_bandit_champion	2	iron_longsword	1	1	1	30
loot_bandit_champion	2	platemail_tunic	1	1	1	15
loot_bandit_champion	2	chainmail_tunic	1	1	1	25
loot_bandit_champion	2	nothing	0	0	1	10
loot_bandit_champion	3	health_potion	3	5	1	80
loot_bandit_champion	3	stamina_potion	2	4	1	70
loot_bandit_champion	3	mana_potion	1	3	1	50
loot_bandit_lord	1	copper	100	200	10	100
loot_bandit_lord	2	steel_longsword	1	1	1	40
loot_bandit_lord	2	enchanted_dagger	1	1	1	20
loot_bandit_lord	2	platemail_tunic	1	1	1	30
loot_bandit_lord	2	magic_ring	1	1	1	10
loot_bandit_lord	3	health_potion	5	8	1	100
loot_bandit_lord	4	stamina_potion	3	5	1	100
loot_bandit_lord	5	mana_potion	2	4	1	100
```

**Explanation:**
- **Level 1-3 Monsters**: Basic loot with small copper, common crafting materials, rare drops
- **Level 4-6 Monsters**: More copper, better crafting materials, low weapon/armor drop chance
- **Level 7-10 Monsters**: Good copper, multiple groups for equipment and potions
- **Level 11-15 Monsters**: Excellent copper, high equipment drop rates, guaranteed potions
- **Boss (Bandit Lord)**: Guaranteed exceptional loot across 5 groups

### Recursive Loot Table Example

```
id	group	item	min	max	step	weight
loot_common_junk	1	rat_ear	1	2	1	25
loot_common_junk	1	bone_chips	1	3	1	25
loot_common_junk	1	tattered_pelt	1	1	1	25
loot_common_junk	1	nothing	0	0	1	25
loot_chest_wooden	1	copper	5	20	5	100
loot_chest_wooden	2	loot_common_junk	2	4	1	100
loot_chest_wooden	3	health_potion	1	1	1	50
loot_chest_wooden	3	nothing	0	0	1	50
```

**Explanation:**
- `loot_common_junk`: A reusable loot table for common items
- `loot_chest_wooden`: References the common junk table
  - Group 1: 5-20 copper in steps of 5
  - Group 2: Rolls `loot_common_junk` 2-4 times (guaranteed)
  - Group 3: 50% chance for health potion

### Quest Reward Example

```
id	group	item	min	max	step	weight
quest_reward_rat_exterminator	1	copper	25	25	1	100
quest_reward_rat_exterminator	2	rusty_shortsword	1	1	1	100
quest_reward_rat_exterminator	3	health_potion	2	2	1	100
```

**Explanation:**
- Fixed rewards for a quest:
  - 25 copper (guaranteed)
  - 1 rusty shortsword (guaranteed)
  - 2 health potions (guaranteed)

## Integration

### Monsters
Monsters reference loot tables via a `lootTableId` field in the Monsters sheet.

Example in Monsters sheet:
```
id	name	level	hp	ac	minDmg	maxDmg	xpReward	lootTableId
giant_rat	a giant rat	1	30	5	1	3	10	loot_rat
```

### Quests
Quests can reference loot tables for rewards.

### Chests/Containers
Future implementation can use loot tables for container contents.

### Other Systems
Any system can reference loot tables by ID and roll for rewards.

## Notes

- Loot tables are rolled independently each time
- Recursive loot tables can create complex, varied reward pools
- Use groups strategically to ensure certain reward types (currency + item + consumable)
- Weights don't need to add up to 100 - they're relative
- Currency awarded is automatically converted to copper and added to player

---

**Created**: 2026-01-03
**Phase**: 9 (Economy & Loot)
**Updated**: Redesigned for flexible, reusable loot system
