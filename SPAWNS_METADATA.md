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

Complete spawn data for all 17 camps (72 total spawn entries):

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
spawn_southern_spider	newbie_southern_fields	young_spider	60	2	3
spawn_northern_rat	newbie_northern_path	giant_rat	60	2	3
spawn_northern_beetle	newbie_northern_path	fire_beetle	50	2	3
spawn_northern_snake	newbie_northern_path	snake	100	2	3
spawn_northern_spider	newbie_northern_path	young_spider	70	2	3
spawn_edge_snake	forest_edge	snake	100	3	4
spawn_edge_gnoll	forest_edge	gnoll_pup	80	3	4
spawn_edge_beetle	forest_edge	fire_beetle	40	3	4
spawn_edge_spider	forest_edge	young_spider	70	3	4
spawn_grove_gnoll	forest_grove	gnoll_pup	80	4	5
spawn_grove_snake	forest_grove	snake	50	4	5
spawn_grove_skeleton	forest_grove	decaying_skeleton	100	4	5
spawn_grove_wolf	forest_grove	dark_wolf	70	4	5
spawn_depths_scout	forest_depths	gnoll_scout	100	5	6
spawn_depths_wolf	forest_depths	dark_wolf	90	5	6
spawn_depths_skeleton	forest_depths	decaying_skeleton	70	5	6
spawn_ruins_skeleton	forest_ruins	decaying_skeleton	100	5	6
spawn_ruins_scout	forest_ruins	gnoll_scout	80	5	6
spawn_ruins_wolf	forest_ruins	dark_wolf	60	5	6
spawn_stream_snake	forest_stream	snake	100	4	5
spawn_stream_gnoll	forest_stream	gnoll_pup	70	4	5
spawn_stream_skeleton	forest_stream	decaying_skeleton	80	4	5
spawn_stream_wolf	forest_stream	dark_wolf	50	4	5
spawn_entrance_scout	burrow_entrance	gnoll_scout	100	5	6
spawn_entrance_pup	burrow_entrance	gnoll_pup	60	5	6
spawn_entrance_wolf	burrow_entrance	dark_wolf	70	5	6
spawn_tunnels_guard	burrow_tunnels	gnoll_guard	100	6	7
spawn_tunnels_scout	burrow_tunnels	gnoll_scout	70	6	7
spawn_tunnels_skeleton	burrow_tunnels	skeletal_warrior	80	6	7
spawn_den_warrior	burrow_den	gnoll_warrior	100	7	9
spawn_den_guard	burrow_den	gnoll_guard	70	7	9
spawn_den_skeleton	burrow_den	skeletal_warrior	90	7	9
spawn_chambers_shaman	burrow_depths	gnoll_shaman	100	8	10
spawn_chambers_warrior	burrow_depths	gnoll_warrior	80	8	10
spawn_chambers_skeleton	burrow_depths	skeletal_warrior	90	8	10
spawn_courtyard_thug	keep_courtyard	bandit_thug	100	8	10
spawn_courtyard_dog	keep_courtyard	guard_dog	80	8	10
spawn_courtyard_guard	keep_courtyard	bandit_guard	60	8	10
spawn_barracks_guard	keep_barracks	bandit_guard	100	9	11
spawn_barracks_thug	keep_barracks	bandit_thug	70	9	11
spawn_barracks_archer	keep_barracks	bandit_archer	80	9	11
spawn_armory_veteran	keep_armory	bandit_veteran	100	10	12
spawn_armory_archer	keep_armory	bandit_archer	80	10	12
spawn_armory_captain	keep_armory	bandit_captain	60	10	12
spawn_towers_elite	keep_towers	elite_bandit	100	11	13
spawn_towers_mage	keep_towers	bandit_mage	90	11	13
spawn_towers_veteran	keep_towers	bandit_veteran	70	11	13
spawn_throne_champion	keep_throne	bandit_champion	100	12	15
spawn_throne_elite	keep_throne	elite_bandit	80	12	15
spawn_throne_captain	keep_throne	bandit_captain	60	12	15
spawn_throne_lord	keep_throne	bandit_lord	30	12	15
```

## Benefits of Spawn System

1. **Flexible Spawn Tables**: Each camp can have multiple monsters with different rarities
2. **Level Progression**: Spawns can change based on camp level ranges
3. **Easy Balancing**: Adjust spawn weights in spreadsheet without code changes
4. **Loot Variety**: Different monsters drop different loot
5. **Replayability**: Varied spawns make camping more interesting
