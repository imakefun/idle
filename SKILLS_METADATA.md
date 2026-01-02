# Skills Sheet Metadata

This file contains the structure and data for the **Skills** sheet in Google Sheets.

## Sheet Structure

### Sheet Name: `Skills`

| Column | Field Name | Type | Description |
|--------|------------|------|-------------|
| A | id | string | Skill ID (e.g., "offense", "kick") |
| B | name | string | Display name (e.g., "Offense", "Kick") |
| C | type | string | "passive" or "active" |
| D | category | string | "combat", "weapon", or "ability" |
| E | description | string | Skill description |
| F | staminaCost | number | Stamina cost for active abilities (0 for passive) |
| G | baseProcChance | number | Base proc chance for active abilities (0-1, e.g., 0.25 = 25%) |
| H | damageBonus | number | Flat damage bonus (for Kick, Bash) |
| I | damageMultiplier | number | Damage multiplier (for Backstab, e.g., 2.5) |
| J | requiresShield | boolean | TRUE if requires shield (Bash only) |
| K | requiresPiercing | boolean | TRUE if requires piercing weapon (Backstab only) |
| L | weaponTypes | string | Comma-separated weapon types for weapon skills |

## Data to Copy-Paste

```
id	name	type	category	description	staminaCost	baseProcChance	damageBonus	damageMultiplier	requiresShield	requiresPiercing	weaponTypes
offense	Offense	passive	combat	Improves your chance to hit enemies	0	0	0	0	FALSE	FALSE
defense	Defense	passive	combat	Improves your chance to avoid being hit	0	0	0	0	FALSE	FALSE
dodge	Dodge	passive	combat	Chance to completely avoid an attack	0	0	0	0	FALSE	FALSE
slashing1H	1H Slashing	passive	weapon	Skill with one-handed slashing weapons	0	0	0	0	FALSE	FALSE	sword,dagger,axe
slashing2H	2H Slashing	passive	weapon	Skill with two-handed slashing weapons	0	0	0	0	FALSE	FALSE	greatsword,greataxe
piercing1H	1H Piercing	passive	weapon	Skill with one-handed piercing weapons	0	0	0	0	FALSE	FALSE	dagger,rapier
piercing2H	2H Piercing	passive	weapon	Skill with two-handed piercing weapons (polearms)	0	0	0	0	FALSE	FALSE	spear,pike,halberd
blunt1H	1H Blunt	passive	weapon	Skill with one-handed blunt weapons	0	0	0	0	FALSE	FALSE	mace,club
blunt2H	2H Blunt	passive	weapon	Skill with two-handed blunt weapons (staffs)	0	0	0	0	FALSE	FALSE	staff,maul,warhammer
handToHand	Hand to Hand	passive	weapon	Skill with unarmed combat (Monk specialty)	0	0	0	0	FALSE	FALSE	fists
archery	Archery	passive	weapon	Skill with bows and ranged weapons	0	0	0	0	FALSE	FALSE	bow,longbow,crossbow
throwing	Throwing	passive	weapon	Skill with thrown weapons	0	0	0	0	FALSE	FALSE	throwingdagger,throwingaxe
kick	Kick	active	ability	Powerful kick attack with bonus damage	10	0.25	5	0	FALSE	FALSE
bash	Bash	active	ability	Shield bash with bonus damage (requires shield)	15	0.20	8	0	TRUE	FALSE
backstab	Backstab	active	ability	Devastating attack from behind (Rogue only)	20	0.15	0	2.5	FALSE	TRUE
doubleAttack	Double Attack	active	ability	Chance to attack twice in one round	0	0.10	0	0	FALSE	FALSE
```

## Instructions

1. Open your Google Spreadsheet
2. Create a new sheet called "Skills"
3. Copy the header row (first row of the table above)
4. Paste into row 1 of the Skills sheet
5. Copy all the data rows (offense through doubleAttack)
6. Paste into row 2 of the Skills sheet
7. Format as table (optional but recommended)

## Notes

- **baseProcChance** is a decimal from 0-1 (0.25 = 25% chance)
- **damageBonus** is added to damage for Kick (5) and Bash (8)
- **damageMultiplier** multiplies weapon damage for Backstab (2.5x)
- **weaponTypes** is comma-separated (no spaces)
- Boolean fields use TRUE/FALSE
- Empty numeric fields should be 0
- You can adjust these values to balance gameplay without touching code
