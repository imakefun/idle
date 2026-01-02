# Spawns Sheet Metadata

This document defines the structure of the **Spawns** Google Sheet, which controls monster spawn distributions in camps.

## Sheet Name
`Spawns`

## Purpose
Defines which monsters appear in specific camps and their spawn probability weights. Multiple spawn entries can exist for the same camp to create diverse spawn tables.

## Columns

| Column | Field Name | Type | Description | Example |
|--------|-----------|------|-------------|---------|
| A | id | String | Unique spawn entry ID | `newbie_yard_rat_spawn` |
| B | campId | String | Camp ID where this monster spawns | `newbie_yard_rats` |
| C | monsterId | String | Monster ID that spawns | `giant_rat` |
| D | weight | Integer | Spawn weight (higher = more common) | `100` |
| E | minLevel | Integer | Minimum camp level for this spawn | `1` |
| F | maxLevel | Integer | Maximum camp level for this spawn | `3` |

## Data Structure

### Spawn Weights
The `weight` field determines spawn probability using weighted random selection:
- Higher weight = more common spawns
- A monster with weight 100 is twice as likely to spawn as one with weight 50
- Total spawn probability = weight / sum of all weights for that camp

### Level Ranges
The `minLevel` and `maxLevel` fields allow spawns to only appear when the camp's level range matches:
- Useful for progressive difficulty in camps
- Leave blank or use camp's min/max to always spawn
- Allows same camp to have different spawn tables at different levels

## Example Data

Each camp should have multiple spawn entries for monster variety. The same `campId` appears in multiple rows with different `monsterId` values:

```
id	campId	monsterId	weight	minLevel	maxLevel
spawn_training_rat	newbie_training_grounds	giant_rat	100	1	2
spawn_training_beetle	newbie_training_grounds	fire_beetle	60	1	2
spawn_training_snake	newbie_training_grounds	snake	30	1	2
spawn_practice_rat	newbie_practice_yard	giant_rat	80	1	2
spawn_practice_beetle	newbie_practice_yard	fire_beetle	80	1	2
spawn_practice_snake	newbie_practice_yard	snake	40	1	2
spawn_edge_snake	forest_edge	snake	100	3	4
spawn_edge_gnoll	forest_edge	gnoll_pup	80	3	4
spawn_edge_beetle	forest_edge	fire_beetle	40	3	4
```

In this example:
- `newbie_training_grounds` has 3 different monsters (rat most common, beetle medium, snake rare)
- `newbie_practice_yard` has 3 different monsters with more balanced weights
- `forest_edge` has 3 different monsters (snake most common, gnoll medium, beetle rare)

## Usage in Game

The spawn system works as follows:

1. **Camp Selection**: Player selects a camp in a zone
2. **Spawn Table Lookup**: System finds all spawn entries matching the camp ID and current camp level
3. **Weighted Selection**: Monster is randomly selected based on spawn weights
4. **Combat Start**: Selected monster is created with stats from Monsters sheet

## Implementation Notes

- Each camp should have at least one spawn entry
- Spawn weights are relative, not percentages (100 + 50 = 67% and 33% respectively)
- Multiple entries for the same camp create variety
- Empty campId entries are skipped
- Level filtering happens before weight calculation

## Copy-Paste Template for Google Sheets

```
id	campId	monsterId	weight	minLevel	maxLevel
spawn_training_rat	newbie_training_grounds	giant_rat	100	1	2
spawn_training_beetle	newbie_training_grounds	fire_beetle	60	1	2
spawn_training_snake	newbie_training_grounds	snake	30	1	2
spawn_practice_rat	newbie_practice_yard	giant_rat	80	1	2
spawn_practice_beetle	newbie_practice_yard	fire_beetle	80	1	2
spawn_practice_snake	newbie_practice_yard	snake	40	1	2
spawn_southern_rat	newbie_southern_fields	giant_rat	50	2	3
spawn_southern_beetle	newbie_southern_fields	fire_beetle	70	2	3
spawn_southern_snake	newbie_southern_fields	snake	100	2	3
spawn_edge_snake	forest_edge	snake	100	3	4
spawn_edge_gnoll	forest_edge	gnoll_pup	80	3	4
spawn_edge_beetle	forest_edge	fire_beetle	40	3	4
spawn_grove_gnoll	forest_grove	gnoll_pup	100	4	5
spawn_grove_snake	forest_grove	snake	70	4	5
spawn_grove_skeleton	forest_grove	decaying_skeleton	30	4	5
```

## Benefits of Spawn System

1. **Flexible Spawn Tables**: Each camp can have multiple monsters with different rarities
2. **Level Progression**: Spawns can change based on camp level ranges
3. **Easy Balancing**: Adjust spawn weights in spreadsheet without code changes
4. **Loot Variety**: Different monsters drop different loot
5. **Replayability**: Varied spawns make camping more interesting
