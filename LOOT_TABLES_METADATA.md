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

### Simple Monster Loot (Giant Rat)

```
id,group,item,min,max,step,weight
loot_rat,1,copper,0,3,1,100
loot_rat,2,rat_ear,1,1,1,30
loot_rat,2,nothing,0,0,1,70
```

**Explanation:**
- Group 1: Always awards 0-3 copper (weight 100 = guaranteed)
- Group 2: 30% chance for 1 rat_ear, 70% chance for nothing

### Complex Loot with Multiple Groups

```
id,group,item,min,max,step,weight
loot_bandit_boss,1,copper,50,100,10,100
loot_bandit_boss,2,rusty_dagger,1,1,1,20
loot_bandit_boss,2,bronze_dagger,1,1,1,10
loot_bandit_boss,2,silver_dagger,1,1,1,5
loot_bandit_boss,2,nothing,0,0,1,65
loot_bandit_boss,3,health_potion,1,3,1,40
loot_bandit_boss,3,stamina_potion,1,3,1,40
loot_bandit_boss,3,nothing,0,0,1,20
```

**Explanation:**
- Group 1: 50-100 copper in multiples of 10 (guaranteed)
- Group 2: One weapon selection (35% total chance for weapon)
  - 20% rusty dagger
  - 10% bronze dagger
  - 5% silver dagger
  - 65% nothing
- Group 3: One potion selection (80% total chance for potion)
  - 40% chance for 1-3 health potions
  - 40% chance for 1-3 stamina potions
  - 20% nothing

### Recursive Loot Table Example

```
id,group,item,min,max,step,weight
loot_common_junk,1,rat_ear,1,2,1,25
loot_common_junk,1,bone_chips,1,3,1,25
loot_common_junk,1,tattered_pelt,1,1,1,25
loot_common_junk,1,nothing,0,0,1,25

loot_chest_wooden,1,copper,5,20,5,100
loot_chest_wooden,2,loot_common_junk,2,4,1,100
loot_chest_wooden,3,health_potion,1,1,1,50
loot_chest_wooden,3,nothing,0,0,1,50
```

**Explanation:**
- `loot_common_junk`: A reusable loot table for common items
- `loot_chest_wooden`: References the common junk table
  - Group 1: 5-20 copper in steps of 5
  - Group 2: Rolls `loot_common_junk` 2-4 times (guaranteed)
  - Group 3: 50% chance for health potion

### Quest Reward Example

```
id,group,item,min,max,step,weight
quest_reward_rat_exterminator,1,copper,25,25,1,100
quest_reward_rat_exterminator,2,rusty_shortsword,1,1,1,100
quest_reward_rat_exterminator,3,health_potion,2,2,1,100
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
id,name,level,hp,ac,minDmg,maxDmg,xpReward,icon,lootTableId
giant_rat,Giant Rat,1,30,5,1,3,10,🐀,loot_rat
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
