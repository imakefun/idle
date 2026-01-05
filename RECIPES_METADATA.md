# Recipes Metadata

This document describes the structure of the **Recipes** sheet in Google Sheets.

## Purpose

Recipes define what items can be crafted, what components are required, and the difficulty/results of crafting attempts.

## Google Sheets Structure

### Sheet Name: `Recipes`

| Column | Type | Required | Description | Example |
|--------|------|----------|-------------|---------|
| id | string | Yes | Unique identifier for the recipe | `recipe_bronze_sword` |
| name | string | Yes | Display name of the recipe | `Bronze Sword` |
| tradeskill | string | Yes | Which tradeskill this recipe belongs to | `blacksmithing` |
| difficulty | number | Yes | Skill level required for optimal crafting | `25` |
| components | string | Yes | Comma-separated list of "itemId:quantity" | `bronze_bar:2,leather_strips:1` |
| result | string | Yes | Item ID that is created | `bronze_sword` |
| resultQty | number | Yes | How many of the item are created | `1` |
| failComponents | string | No | Components returned on failure (itemId:quantity) | `bronze_bar:1` |
| containerType | string | Yes | Required container to craft | `forge` |
| craftTime | number | No | Time in seconds to craft (0 = instant) | `5` |
| discovered | boolean | Yes | Whether recipe starts discovered | `TRUE` |
| minLevel | number | No | Minimum character level required | `5` |

## Component Format

Components are specified as `itemId:quantity` pairs separated by commas.

**Examples:**
- Single component: `bronze_bar:2`
- Multiple components: `bronze_bar:2,leather_strips:1,iron_rivets:4`
- Complex recipe: `iron_bar:3,steel_bar:1,leather:2,thread:5`

## Fail Components

When a craft fails, some components may be returned to the player:
- Leave empty (``) = All components consumed on failure
- Specify partial return: `bronze_bar:1` = Returns 1 bronze bar on failure
- Full return: `bronze_bar:2,leather_strips:1` = Returns all components

## Recipe Difficulty Tiers

### Trivial Recipes (Gray)
- Player skill > difficulty + 15
- 95% success rate
- No skill-up possible
- Good for mass production

### Easy Recipes (Green)
- Player skill = difficulty + 5 to +15
- 85% success rate
- Low skill-up chance (5%)
- Safe crafting for materials

### Optimal Recipes (Yellow)
- Player skill = difficulty - 5 to +5
- 75% success rate
- Good skill-up chance (25%)
- Best for leveling

### Difficult Recipes (Orange)
- Player skill = difficulty - 15 to -5
- 50% success rate
- High skill-up chance (50%)
- Risky but rewarding

### Very Difficult (Red)
- Player skill < difficulty - 15
- 25% success rate
- Very high skill-up chance (75%)
- High risk of failure

## Tradeskill Categories

### Blacksmithing Recipes
Create metal weapons and heavy armor:
- Swords, axes, maces (1H and 2H)
- Plate armor (chest, legs, arms, head)
- Metal shields

### Tailoring Recipes
Create cloth and leather armor:
- Cloth robes, tunics, pants
- Leather armor sets
- Bags and containers

### Baking Recipes
Create food items:
- Bread, cakes, pies
- Cooked meats
- Food buffs

### Brewing Recipes
Create drinks:
- Water, juice, ale
- Stat buff drinks
- Stamina restoration

### Fletching Recipes
Create ranged weapons and ammo:
- Bows and crossbows
- Arrows and bolts
- Throwing weapons

### Jewelcrafting Recipes
Create jewelry:
- Rings and necklaces
- Earrings and bracelets
- Stat-boosting accessories

### Alchemy Recipes
Create potions and elixirs:
- Health and stamina potions
- Buff potions
- Utility potions

## Example Recipes

### Bronze Sword (Blacksmithing)
```
id: recipe_bronze_sword
name: Bronze Sword
tradeskill: blacksmithing
difficulty: 25
components: bronze_bar:2,leather_strips:1
result: bronze_sword
resultQty: 1
failComponents: bronze_bar:1
containerType: forge
craftTime: 5
discovered: TRUE
minLevel: 1
```

### Leather Tunic (Tailoring)
```
id: recipe_leather_tunic
name: Leather Tunic
tradeskill: tailoring
difficulty: 15
components: cured_leather:3,thread:2
result: leather_tunic
resultQty: 1
failComponents: cured_leather:1
containerType: sewing_kit
craftTime: 10
discovered: TRUE
minLevel: 1
```

### Bread Loaf (Baking)
```
id: recipe_bread_loaf
name: Bread Loaf
tradeskill: baking
difficulty: 10
components: flour:2,water_flask:1,yeast:1
result: bread_loaf
resultQty: 2
failComponents: flour:1
containerType: oven
craftTime: 15
discovered: TRUE
minLevel: 1
```

## Sample Recipes Data (Tab-Separated for Google Sheets)

Copy the table below and paste directly into Google Sheets:

```
id	name	tradeskill	difficulty	components	result	resultQty	failComponents	containerType	craftTime	discovered	minLevel
recipe_bronze_dagger	Bronze Dagger	blacksmithing	10	bronze_bar:1,leather_strips:1	bronze_dagger	1	bronze_bar:1	forge	3	TRUE	1
recipe_bronze_sword	Bronze Sword	blacksmithing	25	bronze_bar:2,leather_strips:1	bronze_sword	1	bronze_bar:1	forge	5	TRUE	1
recipe_iron_sword	Iron Sword	blacksmithing	50	iron_bar:2,leather_strips:1,iron_rivets:2	iron_sword	1	iron_bar:1	forge	8	TRUE	5
recipe_steel_sword	Steel Sword	blacksmithing	100	steel_bar:3,leather:1,steel_rivets:4	steel_sword	1	steel_bar:1	forge	12	TRUE	10
recipe_cloth_robe	Cloth Robe	tailoring	15	silk_cloth:4,thread:3	cloth_robe	1	silk_cloth:2	sewing_kit	10	TRUE	1
recipe_leather_tunic	Leather Tunic	tailoring	30	cured_leather:3,thread:2	leather_tunic	1	cured_leather:1	sewing_kit	10	TRUE	1
recipe_leather_pants	Leather Pants	tailoring	35	cured_leather:4,thread:3	leather_pants	1	cured_leather:2	sewing_kit	12	TRUE	1
recipe_bread_loaf	Bread Loaf	baking	10	flour:2,water_flask:1,yeast:1	bread_loaf	2	flour:1	oven	15	TRUE	1
recipe_meat_pie	Meat Pie	baking	40	flour:1,raw_meat:2,vegetables:1	meat_pie	1	flour:1	oven	20	TRUE	5
recipe_fruit_cake	Fruit Cake	baking	75	flour:3,sugar:2,fruit:4,eggs:2	fruit_cake	1	flour:1,sugar:1	oven	30	TRUE	10
recipe_water	Water	brewing	1	water_flask:1	water	1		brew_barrel	5	TRUE	1
recipe_apple_juice	Apple Juice	brewing	20	fruit:3,sugar:1,water_flask:1	apple_juice	2	fruit:1	brew_barrel	10	TRUE	1
recipe_ale	Ale	brewing	50	barley:4,hops:2,water_flask:2,yeast:1	ale	4	barley:2	brew_barrel	20	TRUE	5
recipe_shortbow	Short Bow	fletching	30	wood_shaft:2,bow_string:1,wood_glue:1	shortbow	1	wood_shaft:1	fletching_kit	15	TRUE	1
recipe_arrows	Arrows	fletching	15	wood_shaft:1,feathers:3,arrowheads:5	arrows	20	arrowheads:2	fletching_kit	5	TRUE	1
recipe_copper_ring	Copper Ring	jewelcrafting	25	copper_bar:1,gem_small:1	copper_ring	1	copper_bar:1	jewelers_kit	8	TRUE	1
recipe_silver_necklace	Silver Necklace	jewelcrafting	60	silver_bar:2,gem_medium:1,chain:1	silver_necklace	1	silver_bar:1	jewelers_kit	12	TRUE	5
recipe_health_potion	Health Potion	alchemy	35	herb_healing:2,water_flask:1,catalyst:1	health_potion	2	herb_healing:1	alchemy_station	10	TRUE	1
recipe_stamina_potion	Stamina Potion	alchemy	40	herb_energy:2,water_flask:1,catalyst:1	stamina_potion	2	herb_energy:1	alchemy_station	10	TRUE	1
recipe_strength_elixir	Strength Elixir	alchemy	80	herb_strength:3,gem_small:1,catalyst:2	strength_elixir	1	herb_strength:1	alchemy_station	20	TRUE	10
```

## Recipe Discovery

### Auto-Discovered Recipes
Recipes with `discovered: TRUE` are automatically known by all players when they train the tradeskill.

### Discoverable Recipes (Future)
Recipes with `discovered: FALSE` must be discovered through:
- World drops (recipe scrolls)
- Quest rewards
- Vendor purchases
- Experimentation (combining components)

## Crafting Mechanics

### Success Calculation
```javascript
function calculateCraftSuccess(playerSkill, recipeDifficulty) {
  const skillDifference = playerSkill - recipeDifficulty;
  let baseChance = 0.75; // 75% base

  // Adjust based on skill difference
  if (skillDifference >= 15) baseChance = 0.95; // Trivial
  else if (skillDifference >= 5) baseChance = 0.85; // Easy
  else if (skillDifference >= -5) baseChance = 0.75; // Optimal
  else if (skillDifference >= -15) baseChance = 0.50; // Difficult
  else baseChance = 0.25; // Very difficult

  return Math.random() < baseChance;
}
```

### Skill-up Calculation
```javascript
function calculateSkillUp(playerSkill, recipeDifficulty) {
  const skillDifference = recipeDifficulty - playerSkill;

  // No skill-up if recipe is trivial
  if (skillDifference < -15) return false;

  // Higher chance when recipe is difficult
  let skillUpChance = (skillDifference + 15) / 30;
  skillUpChance = Math.max(0.05, Math.min(0.75, skillUpChance));

  return Math.random() < skillUpChance;
}
```

## Implementation Notes

### Crafting Flow
1. Player opens container (forge, oven, etc.)
2. Select recipe from available recipes for that tradeskill
3. Verify player has all required components
4. Consume components from inventory
5. Calculate success/failure
6. On success: Give result item(s), check for skill-up
7. On failure: Return failComponents (if any), higher skill-up chance

### UI Flow
1. **Tradeskill Tab** - List all tradeskills with current level
2. **Container Selection** - Click container in world/town
3. **Recipe Browser** - Filter by tradeskill, show difficulty colors
4. **Component View** - Show required components (red if missing)
5. **Craft Button** - Initiates crafting attempt
6. **Result Notification** - Success/failure message with skill-up

---

**Created:** 2026-01-05
**Status:** Active - Recipe system in development
