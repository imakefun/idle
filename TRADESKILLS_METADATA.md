# Tradeskills Metadata

This document describes the structure of the **Tradeskills** sheet in Google Sheets.

## Purpose

Tradeskills define the various crafting professions available in the game. Each tradeskill has its own progression system and creates different types of items.

## Google Sheets Structure

### Sheet Name: `Tradeskills`

| Column | Type | Required | Description | Example |
|--------|------|----------|-------------|---------|
| id | string | Yes | Unique identifier for the tradeskill | `blacksmithing` |
| name | string | Yes | Display name of the tradeskill | `Blacksmithing` |
| description | string | Yes | Description of what this tradeskill creates | `Forge weapons and armor from metal` |
| containerType | string | Yes | Type of container required for crafting | `forge` |
| icon | string | No | Emoji icon for the tradeskill | `🔨` |
| maxSkill | number | Yes | Maximum skill level | `300` |
| trainable | boolean | Yes | Whether skill can be trained by NPC | `TRUE` |
| trainCost | number | No | Base cost to train this skill | `100` |

## Tradeskill Types

### Production Tradeskills
Create items that can be used or sold:
- **Blacksmithing** - Weapons and heavy armor (forge)
- **Tailoring** - Cloth and leather armor (sewing kit)
- **Fletching** - Bows and arrows (fletching kit)
- **Jewelcrafting** - Jewelry and gems (jeweler's kit)
- **Alchemy** - Potions and elixirs (alchemy station)
- **Baking** - Food items (oven)
- **Brewing** - Drinks (brew barrel)

### Resource Gathering Tradeskills (Future)
- **Mining** - Ore and gems
- **Herbalism** - Plants and herbs
- **Fishing** - Fish and aquatic items

## Container Types

Containers are required locations/tools for crafting:
- `forge` - For blacksmithing (weapons, metal armor)
- `oven` - For baking (food, bread)
- `brew_barrel` - For brewing (drinks, alcohol)
- `sewing_kit` - For tailoring (cloth, leather)
- `fletching_kit` - For fletching (bows, arrows)
- `jewelers_kit` - For jewelcrafting (rings, necklaces)
- `alchemy_station` - For alchemy (potions, elixirs)

## Skill Progression

### Skill-up Mechanics
- Skill increases based on recipe difficulty relative to current skill
- Trivial recipes (gray) don't give skill-ups
- Optimal skill-up range: recipe difficulty ± 15 points
- Skill-up chance decreases as skill approaches recipe difficulty

### Difficulty Colors
- **Gray** - Trivial (no skill-up possible)
- **Green** - Easy (low skill-up chance)
- **Yellow** - Optimal (good skill-up chance)
- **Orange** - Difficult (high skill-up chance, may fail)
- **Red** - Very Difficult (very high skill-up chance, likely to fail)

## Example Tradeskills

### Blacksmithing
```
id: blacksmithing
name: Blacksmithing
description: Forge weapons and armor from metal bars and ore
containerType: forge
icon: 🔨
maxSkill: 300
trainable: TRUE
trainCost: 100
```

### Tailoring
```
id: tailoring
name: Tailoring
description: Craft cloth and leather armor from hides and fabric
containerType: sewing_kit
icon: 🧵
maxSkill: 300
trainable: TRUE
trainCost: 100
```

### Baking
```
id: baking
name: Baking
description: Prepare food and baked goods to restore hunger
containerType: oven
icon: 🍞
maxSkill: 300
trainable: TRUE
trainCost: 50
```

## Sample Tradeskills Data (Tab-Separated for Google Sheets)

Copy the table below and paste directly into Google Sheets:

```
id	name	description	containerType	icon	maxSkill	trainable	trainCost
blacksmithing	Blacksmithing	Forge weapons and armor from metal bars and ore	forge	🔨	300	TRUE	100
tailoring	Tailoring	Craft cloth and leather armor from hides and fabric	sewing_kit	🧵	300	TRUE	100
baking	Baking	Prepare food and baked goods to restore hunger	oven	🍞	300	TRUE	50
brewing	Brewing	Brew drinks and ales to restore thirst	brew_barrel	🍺	300	TRUE	50
fletching	Fletching	Craft bows, arrows, and ranged weapons	fletching_kit	🏹	300	TRUE	100
jewelcrafting	Jewelcrafting	Create jewelry and enchanted accessories	jewelers_kit	💎	300	TRUE	150
alchemy	Alchemy	Mix potions and elixirs with magical properties	alchemy_station	⚗️	300	TRUE	150
```

## Implementation Notes

### Character State
Each character tracks their tradeskill levels:
```javascript
{
  tradeskills: {
    blacksmithing: 0,
    tailoring: 0,
    baking: 0,
    brewing: 0,
    fletching: 0,
    jewelcrafting: 0,
    alchemy: 0
  }
}
```

### Crafting Success Formula
```javascript
successChance = baseChance + (playerSkill - recipeDifficulty) * skillBonus
// Minimum 5% success, maximum 95% success
// Failed crafts may consume some or all components
```

### Skill-up Formula
```javascript
if (recipeDifficulty > playerSkill - 15) {
  skillUpChance = (recipeDifficulty - playerSkill + 15) / 30
  // Higher chance when recipe is difficult
  // No skill-up when recipe is trivial (> 15 levels below)
}
```

## UI Components Needed

1. **Tradeskill List** - Shows all tradeskills with current level
2. **Container Interface** - Place ingredients and select recipe
3. **Recipe Book** - Browse known recipes by tradeskill
4. **Crafting Progress** - Shows crafting attempt and success/failure
5. **Tradeskill Trainer** - NPC to train/unlock tradeskills

## Future Enhancements

- **Masteries** - Specializations within tradeskills
- **Quality Levels** - Crafted items can have quality tiers
- **Rare Recipes** - Special recipes from world drops or quests
- **Crafting Orders** - NPC requests for specific crafted items
- **Resource Nodes** - Gatherable resources in zones

---

**Created:** 2026-01-05
**Status:** Active - Tradeskill system in development
