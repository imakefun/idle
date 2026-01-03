# Monsters Sheet Metadata

This document defines the structure of the **Monsters** Google Sheet, which contains all monster definitions for the game.

## Sheet Name
`Monsters`

## Purpose
Defines all monsters that can be encountered in the game, including their stats, level, and rewards.

## Columns

| Column | Field Name | Type | Description | Example |
|--------|-----------|------|-------------|---------|
| A | id | String | Unique monster ID | `giant_rat` |
| B | name | String | Display name (with article) | `a giant rat` |
| C | level | Integer | Monster level | `1` |
| D | hp | Integer | Hit points | `25` |
| E | minDmg | Integer | Minimum damage per hit | `1` |
| F | maxDmg | Integer | Maximum damage per hit | `3` |
| G | ac | Integer | Armor class (higher = harder to hit) | `5` |
| H | xpReward | Integer | Experience points awarded on kill | `10` |
| I | isRare | Boolean | TRUE if rare/boss monster | `FALSE` |
| J | lootTableId | String | ID of loot table to roll on death | `loot_rat` |

## Data Structure

### Monster Scaling
Monsters should scale appropriately for their level:
- **HP**: Roughly 20-25 HP per level (bosses can be higher)
- **Damage**: Min = level, Max = level * 2-3
- **AC**: Roughly level * 3-5
- **XP**: Roughly level * 10 (bosses give more)

### Rare Monsters
Set `isRare` to `TRUE` for boss monsters or special encounters. These typically have:
- Higher HP (1.5-2x normal)
- Higher damage
- Significantly more XP rewards
- Lower spawn weights in spawn tables

## Copy-Paste Template for Google Sheets

```
id	name	level	hp	minDmg	maxDmg	ac	xpReward	isRare
giant_rat	a giant rat	1	25	1	3	5	10	FALSE
snake	a snake	2	35	2	5	8	15	FALSE
gnoll_pup	a gnoll pup	3	50	3	7	12	25	FALSE
fire_beetle	a fire beetle	2	30	2	4	10	12	FALSE
decaying_skeleton	a decaying skeleton	4	65	4	9	15	35	FALSE
young_spider	a young spider	3	45	3	6	10	22	FALSE
gnoll_scout	a gnoll scout	5	80	5	11	18	50	FALSE
dark_wolf	a dark wolf	5	75	5	10	16	45	FALSE
gnoll_guard	a gnoll guard	6	95	6	13	20	60	FALSE
skeletal_warrior	a skeletal warrior	7	110	7	15	22	75	FALSE
gnoll_warrior	a gnoll warrior	7	115	7	16	24	80	FALSE
gnoll_shaman	a gnoll shaman	8	125	8	17	26	90	FALSE
bandit_thug	a bandit thug	8	120	8	16	25	85	FALSE
guard_dog	a guard dog	8	105	7	14	22	70	FALSE
bandit_guard	a bandit guard	9	135	9	18	28	100	FALSE
bandit_archer	a bandit archer	10	130	9	19	26	105	FALSE
bandit_veteran	a bandit veteran	11	150	10	21	30	120	FALSE
bandit_mage	a bandit mage	11	140	11	22	28	125	FALSE
bandit_captain	a bandit captain	12	165	11	23	32	140	FALSE
elite_bandit	an elite bandit	13	180	12	25	34	160	FALSE
bandit_champion	a bandit champion	14	200	13	27	36	180	FALSE
bandit_lord	the bandit lord	15	250	15	30	40	250	TRUE
```

## Monster Categories

### Level 1-3: Newbie Monsters
- giant_rat, snake, fire_beetle, gnoll_pup, young_spider
- Found in Newbie Yard and Forest Edge

### Level 4-6: Early Mid-Level
- decaying_skeleton, gnoll_scout, dark_wolf, gnoll_guard
- Found in Dark Forest and Blackburrow Entrance

### Level 7-10: Mid-Level
- skeletal_warrior, gnoll_warrior, gnoll_shaman
- bandit_thug, guard_dog, bandit_guard, bandit_archer
- Found in Blackburrow and High Keep lower levels

### Level 11-15: High-Level
- bandit_veteran, bandit_mage, bandit_captain
- elite_bandit, bandit_champion, bandit_lord (BOSS)
- Found in High Keep upper levels

## Notes

- Monster names should include articles (a, an, the)
- Use lowercase for regular monsters
- Use "the" prefix for unique/boss monsters
- Rare monsters should have unique names and higher stats
- Balance XP rewards to encourage appropriate level progression
