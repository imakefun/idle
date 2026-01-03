# Loot Tables Metadata for Google Sheets

This file contains the loot table configuration that determines what items and currency monsters drop when defeated.

## Sheet Name: `LootTables`

Copy the table below into a new Google Sheet tab named "LootTables":

```
monsterId	itemId	dropChance	minQty	maxQty	currencyMin	currencyMax
giant_rat	rat_ear	30	1	1	0	3
giant_rat	rusty_dagger	2	1	1	0	0
snake	snake_fang	25	1	1	0	4
snake	snake_skin	15	1	1	0	0
gnoll_pup	gnoll_fang	20	1	1	1	5
gnoll_pup	tattered_pelt	10	1	1	0	0
fire_beetle	beetle_carapace	20	1	1	0	4
fire_beetle	ember_shard	5	1	1	0	0
decaying_skeleton	bone_chips	40	1	2	1	6
decaying_skeleton	rusty_dagger	3	1	1	0	0
young_spider	spider_silk	30	1	1	1	5
young_spider	spider_venom	10	1	1	0	0
gnoll_scout	gnoll_fang	25	1	1	2	8
gnoll_scout	tattered_pelt	15	1	1	0	0
gnoll_scout	rusty_sword	2	1	1	0	0
dark_wolf	wolf_pelt	35	1	1	2	8
dark_wolf	wolf_fang	20	1	1	0	0
gnoll_guard	gnoll_fang	30	1	2	3	10
gnoll_guard	leather_tunic	5	1	1	0	0
skeletal_warrior	bone_chips	45	2	3	3	12
skeletal_warrior	short_sword	3	1	1	0	0
skeletal_warrior	rusty_chainmail	2	1	1	0	0
gnoll_warrior	gnoll_fang	35	1	2	4	15
gnoll_warrior	studded_leather	4	1	1	0	0
gnoll_shaman	gnoll_fang	25	1	1	5	18
gnoll_shaman	tribal_staff	3	1	1	0	0
gnoll_shaman	potion_minor_heal	8	1	1	0	0
bandit_thug	copper_ring	15	1	1	4	16
bandit_thug	rusty_mace	2	1	1	0	0
guard_dog	dog_collar	20	1	1	3	12
guard_dog	rawhide_strip	25	1	1	0	0
bandit_guard	bronze_dagger	5	1	1	6	20
bandit_guard	leather_gloves	3	1	1	0	0
bandit_guard	rations	30	1	2	0	0
bandit_archer	wooden_bow	4	1	1	7	25
bandit_archer	arrows	40	5	10	0	0
bandit_archer	leather_cap	3	1	1	0	0
bandit_veteran	steel_longsword	3	1	1	10	30
bandit_veteran	chainmail_tunic	2	1	1	0	0
bandit_veteran	silver_ring	6	1	1	0	0
bandit_mage	spell_scroll	8	1	1	10	35
bandit_mage	mage_robe	3	1	1	0	0
bandit_mage	potion_mana	10	1	1	0	0
bandit_captain	captain_sword	4	1	1	15	40
bandit_captain	captain_insignia	12	1	1	0	0
bandit_captain	quality_chainmail	2	1	1	0	0
elite_bandit	elite_blade	3	1	1	20	50
elite_bandit	elite_armor	2	1	1	0	0
elite_bandit	gold_ring	8	1	1	0	0
bandit_champion	champion_weapon	4	1	1	30	60
bandit_champion	champion_armor	3	1	1	0	0
bandit_champion	gem_ruby	5	1	1	0	0
bandit_lord	lords_greatsword	15	1	1	50	100
bandit_lord	lords_crown	10	1	1	0	0
bandit_lord	gem_diamond	20	1	1	0	0
bandit_lord	potion_greater_heal	25	1	2	0	0
```

## Data Structure

The LootTables sheet has 7 columns:
- **monsterId**: The ID of the monster this loot belongs to
- **itemId**: The ID of the item that can drop
- **dropChance**: Percentage chance (0-100) that this item drops
- **minQty**: Minimum quantity if the item drops
- **maxQty**: Maximum quantity if the item drops
- **currencyMin**: Minimum currency drop in copper (applies per row, usually only set on first row)
- **currencyMax**: Maximum currency drop in copper (applies per row, usually only set on first row)

## Usage Notes

1. **Multiple Items Per Monster**: Each monster can have multiple loot table entries (one per row)
2. **Drop Chance**: Each item is rolled independently. A monster with 3 items at 30% chance each could drop 0, 1, 2, or all 3 items
3. **Currency**: Set currencyMin/currencyMax on the first row for each monster. Leave 0/0 on subsequent rows to avoid duplicate currency drops
4. **Quantity**: For stackable items, you can drop multiple (e.g., arrows 5-10)
5. **Rare Drops**: Use low drop chances (1-5%) for valuable equipment
6. **Common Drops**: Use higher chances (20-40%) for junk/crafting materials

## Item Types

### Junk/Crafting Materials (High Drop Rate: 20-40%)
- rat_ear, snake_fang, gnoll_fang, bone_chips, spider_silk, wolf_pelt, etc.

### Equipment (Low Drop Rate: 2-5%)
- Weapons: rusty_dagger, short_sword, bronze_dagger, etc.
- Armor: leather_tunic, chainmail_tunic, studded_leather, etc.

### Consumables (Medium Drop Rate: 8-30%)
- Potions, food, arrows

### Currency Guidelines
- Level 1-2 monsters: 0-5 copper
- Level 3-5 monsters: 1-10 copper
- Level 6-8 monsters: 3-20 copper
- Level 9-12 monsters: 10-40 copper
- Level 13-15 monsters: 20-60 copper
- Rare/Named monsters: 50-100 copper

## Usage in Code

Loot tables are loaded into `gameData.lootTables` as an array grouped by monsterId:
```javascript
{
  giant_rat: {
    currency: { min: 0, max: 3 },
    items: [
      { itemId: 'rat_ear', chance: 30, quantity: { min: 1, max: 1 } },
      { itemId: 'rusty_dagger', chance: 2, quantity: { min: 1, max: 1 } }
    ]
  },
  // etc...
}
```

## How to Update

1. Copy the table above to your Google Sheet in a new tab named "LootTables"
2. Adjust drop chances and quantities to tune loot scarcity
3. Add new items for monsters as new content is created
4. The game will automatically load these tables when fetching data from Google Sheets
5. If Google Sheets is unavailable, fallback values are used from `src/data/fallback/index.js`
