# Zone and Camp Metadata for Google Sheets

## Instructions
1. Update your **Zones** sheet with the data below
2. Create a new **Camps** sheet and add the camp data
3. Click "Clear Cache & Refresh" in the game to load the new data

---

## Zones Sheet

Copy this data into your Google Sheets **Zones** tab:

| id | name | isSafe | minLevel | maxLevel | description |
|----|------|--------|----------|----------|-------------|
| qeynos | Town of Qeynos | TRUE | 1 | 50 | A safe haven where merchants, trainers, and quest givers await. No monsters roam these protected streets. |
| newbie_yard | Newbie Yard | FALSE | 1 | 3 | Rolling hills and training grounds outside the city walls. Perfect for new adventurers to test their skills. |
| dark_forest | Dark Forest | FALSE | 3 | 6 | Dense woodland shrouded in perpetual twilight. Strange sounds echo from the depths. |
| blackburrow | Blackburrow | FALSE | 5 | 10 | A network of gnoll tunnels dug into the hillside. The stench of wet fur and decay fills the air. |
| high_keep | High Keep | FALSE | 8 | 15 | Once a proud fortress, now overrun by bandits and fell creatures. Danger lurks in every shadow. |

---

## Camps Sheet (NEW SHEET)

Create a new sheet called **Camps** and add these columns and data:

### Column Headers:
`id | name | zoneId | minLevel | maxLevel | description`

### Data:

**Newbie Yard Camps:**
| id | name | zoneId | minLevel | maxLevel | description |
|----|------|--------|----------|----------|-------------|
| newbie_training_grounds | Training Grounds | newbie_yard | 1 | 2 | A fenced area where guards watch over new fighters practicing on training dummies and weak creatures. |
| newbie_practice_yard | Practice Yard | newbie_yard | 1 | 2 | An open field dotted with scarecrows and inhabited by harmless rats and beetles. |
| newbie_southern_fields | Southern Fields | newbie_yard | 2 | 3 | Rolling grasslands south of the training area. Slightly tougher creatures wander here. |
| newbie_northern_path | Northern Path | newbie_yard | 2 | 3 | A dirt road leading toward the dark forest, where braver rats and snakes can be found. |

**Dark Forest Camps:**
| id | name | zoneId | minLevel | maxLevel | description |
|----|------|--------|----------|----------|-------------|
| forest_edge | Forest Edge | dark_forest | 3 | 4 | The tree line where sunlight still penetrates. Snakes and spiders lurk in the underbrush. |
| forest_grove | Shadowed Grove | dark_forest | 4 | 5 | A clearing surrounded by ancient oaks. Wolves prowl between the trees. |
| forest_depths | Forest Depths | dark_forest | 5 | 6 | The heart of the forest where light barely reaches. Dangerous predators make their dens here. |
| forest_ruins | Forgotten Ruins | dark_forest | 5 | 6 | Crumbling stone structures overgrown with vines. Undead creatures sometimes rise from the earth. |
| forest_stream | Dark Stream | dark_forest | 4 | 5 | A murky creek winding through the woods. Water-dwelling creatures and their prey gather here. |

**Blackburrow Camps:**
| id | name | zoneId | minLevel | maxLevel | description |
|----|------|--------|----------|----------|-------------|
| burrow_entrance | Burrow Entrance | blackburrow | 5 | 6 | The mouth of the gnoll warren. Young gnolls guard the entryway. |
| burrow_tunnels | Winding Tunnels | blackburrow | 6 | 7 | Narrow passages carved through earth and stone. Gnoll scouts patrol these halls. |
| burrow_den | Central Den | blackburrow | 7 | 9 | A large cavern where gnoll families make their home. Warriors train here. |
| burrow_depths | Deep Chambers | blackburrow | 8 | 10 | The lowest levels where the strongest gnolls dwell. Treasure is rumored to be hidden here. |

**High Keep Camps:**
| id | name | zoneId | minLevel | maxLevel | description |
|----|------|--------|----------|----------|-------------|
| keep_courtyard | Outer Courtyard | high_keep | 8 | 10 | The fortress entrance, now controlled by bandits and their guard dogs. |
| keep_barracks | Ruined Barracks | high_keep | 9 | 11 | Former soldier quarters now occupied by organized bandit gangs. |
| keep_armory | Old Armory | high_keep | 10 | 12 | Where weapons were once stored. Bandit leaders hoard stolen goods here. |
| keep_towers | Guard Towers | high_keep | 11 | 13 | Tall watchtowers offering strategic positions. Elite bandits and archers nest here. |
| keep_throne | Throne Room | high_keep | 12 | 15 | The heart of the fortress where a bandit lord has claimed the ancient throne. |

---

## How Camps Work

**Micro-Progression:**
- Each zone contains multiple camps with overlapping but progressive level ranges
- Players can move between camps within a zone as they gain levels
- Camps provide more granular difficulty progression than full zones
- Each camp will eventually have its own monster spawns and loot tables

**Example Progression Path:**
1. Start in **Qeynos** (safe, level 1)
2. Travel to **Newbie Yard → Training Grounds** (level 1-2)
3. Progress to **Newbie Yard → Southern Fields** (level 2-3)
4. Move to **Dark Forest → Forest Edge** (level 3-4)
5. Continue deeper: **Dark Forest → Shadowed Grove** (level 4-5)
6. And so on...

---

## Next Steps

After adding this data to Google Sheets:
1. The code will be updated to load and display camps
2. Zone UI will show camps as sub-locations within each zone
3. Players will be able to select specific camps to hunt in
4. Future phases will tie monsters and loot to specific camps
