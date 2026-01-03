# Items Sheet Metadata

This file contains the structure and data for the **Items** sheet in Google Sheets.

## Sheet Structure

### Sheet Name: `Items`

| Column | Field Name | Type | Description |
|--------|------------|------|-------------|
| A | id | string | Item ID (e.g., "rusty_sword", "leather_helm") |
| B | name | string | Display name (e.g., "Rusty Sword", "Leather Helm") |
| C | type | string | Item type: "weapon", "armor", "shield", "consumable", "ammo", "container", "junk" |
| D | slot | string | Equipment slot: "primary", "secondary", "range", "ammo", "head", "face", "ear_left", "ear_right", "neck", "shoulders", "arms", "wrist_left", "wrist_right", "hands", "finger_left", "finger_right", "chest", "back", "waist", "legs", "feet" |
| E | icon | string | Icon emoji or character |
| F | stackable | boolean | TRUE if item can stack |
| G | maxStack | number | Maximum stack size (20 for consumables/ammo, 1 for gear) |
| H | value | number | Vendor value in copper |
| I | damage | number | Weapon base damage (for weapons only) |
| J | delay | number | Weapon attack speed (e.g., 20 = 2.0 seconds) |
| K | ac | number | Armor class value (for armor/shields) |
| L | weaponType | string | Weapon type for skill matching: "sword", "dagger", "axe", "greatsword", "greataxe", "rapier", "spear", "pike", "halberd", "mace", "club", "staff", "maul", "warhammer", "fists", "bow", "longbow", "crossbow" |
| M | handedness | string | Handedness: "MH" (main hand only), "OH" (offhand only), "1H" (any hand), "2H" (both hands) |
| N | shieldType | string | Shield type: "buckler", "small", "medium", "large", "tower" (for shields only) |
| O | armorType | string | Armor type: "cloth", "leather", "chain", "plate" |
| P | classes | string | Comma-separated allowed classes (empty = all): "warrior,monk,rogue,cleric" |
| Q | races | string | Comma-separated allowed races (empty = all): "human,barbarian,wood_elf,dark_elf,dwarf" |
| R | foodValue | number | Food restoration amount (for consumables) |
| S | waterValue | number | Water restoration amount (for consumables) |
| T | ammoType | string | Ammo type: "arrow", "bolt" (for ammo only) |
| U | requiredAmmo | string | Required ammo type for ranged weapons: "arrow", "bolt" |
| V | STR | number | Strength bonus (stat modifiers) |
| W | STA | number | Stamina bonus |
| X | AGI | number | Agility bonus |
| Y | DEX | number | Dexterity bonus |
| Z | WIS | number | Wisdom bonus |
| AA | INT | number | Intelligence bonus |
| AB | CHA | number | Charisma bonus |

## Example Data (Weapons)

```
id	name	type	slot	icon	stackable	maxStack	value	damage	delay	ac	weaponType	handedness	shieldType	armorType	classes	races	foodValue	waterValue	ammoType	requiredAmmo	STR	STA	AGI	DEX	WIS	INT	CHA
rusty_dagger	Rusty Dagger	weapon	primary	🗡️	FALSE	1	3	3	18	0	dagger	1H								0	0	1	0	0	0	0
bronze_dagger	Bronze Dagger	weapon	primary	🗡️	FALSE	1	8	4	18	0	dagger	1H								0	0	1	1	0	0	0
steel_dagger	Steel Dagger	weapon	primary	🗡️	FALSE	1	18	6	18	0	dagger	1H								0	0	2	2	0	0	0
enchanted_dagger	Enchanted Dagger	weapon	primary	✨	FALSE	1	75	10	18	0	dagger	1H								2	0	3	3	0	2	0
rusty_shortsword	Rusty Shortsword	weapon	primary	⚔️	FALSE	1	6	5	22	0	sword	1H								0	0	0	0	0	0	0
iron_shortsword	Iron Shortsword	weapon	primary	⚔️	FALSE	1	20	8	22	0	sword	1H								1	0	0	1	0	0	0
steel_longsword	Steel Longsword	weapon	primary	⚔️	FALSE	1	50	12	24	0	sword	1H								2	1	0	0	0	0	0
iron_longsword	Iron Longsword	weapon	primary	⚔️	FALSE	1	35	10	24	0	sword	1H								2	0	0	0	0	0	0
shortbow	Shortbow	weapon	range	🏹	FALSE	1	15	6	28	0	bow	2H						arrow	0	0	1	1	0	0	0
oak_bow	Oak Bow	weapon	range	🏹	FALSE	1	30	8	26	0	bow	2H						arrow	0	0	1	1	0	0	0
wooden_staff	Wooden Staff	weapon	primary	🪄	FALSE	1	15	6	22	0	staff	2H					cleric			0	0	0	0	2	2	0
monk_fist_wraps	Monk Fist Wraps	weapon	primary	✊	FALSE	1	20	7	18	0	fists	1H					monk			0	1	0	0	0	0	0
```

## Example Data (Armor & Shields)

```
id	name	type	slot	icon	stackable	maxStack	value	damage	delay	ac	weaponType	handedness	shieldType	armorType	classes	races	foodValue	waterValue	ammoType	requiredAmmo	STR	STA	AGI	DEX	WIS	INT	CHA
leather_tunic	Leather Tunic	armor	chest	🛡️	FALSE	1	12	0	0	5			cloth	leather					0	1	0	0	0	0	0
chainmail_tunic	Chainmail Tunic	armor	chest	🛡️	FALSE	1	40	0	0	10			cloth	chain	warrior,cleric				0	2	0	0	0	0	0
platemail_tunic	Platemail Tunic	armor	chest	🛡️	FALSE	1	100	0	0	18			cloth	plate	warrior				2	4	0	0	0	0	0
leather_helm	Leather Helm	armor	head	🪖	FALSE	1	10	0	0	3			cloth	leather					0	0	0	0	0	0	0
wooden_buckler	Wooden Buckler	shield	secondary	🛡️	FALSE	1	15	0	0	5		1H	buckler					0	0	1	0	0	0	0
iron_shield	Iron Shield	shield	secondary	🛡️	FALSE	1	40	0	0	10		1H	medium		warrior,cleric			0	2	0	0	0	0	0
```

## Example Data (Consumables & Ammo)

```
id	name	type	slot	icon	stackable	maxStack	value	damage	delay	ac	weaponType	handedness	shieldType	armorType	classes	races	foodValue	waterValue	ammoType	requiredAmmo	STR	STA	AGI	DEX	WIS	INT	CHA
health_potion	Health Potion	consumable		🧪	TRUE	20	5	0	0	0									50	0			0	0	0	0	0	0	0
stamina_potion	Stamina Potion	consumable		⚡	TRUE	20	4	0	0	0									0	0			0	0	0	0	0	0	0
mana_potion	Mana Potion	consumable		🔮	TRUE	20	6	0	0	0									0	0			0	0	0	0	0	0	0
rations	Rations	consumable		🍖	TRUE	20	3	0	0	0									25	0			0	0	0	0	0	0	0
water_flask	Water Flask	consumable		💧	TRUE	20	2	0	0	0									0	25			0	0	0	0	0	0	0
bread	Bread	consumable		🍞	TRUE	20	1	0	0	0									15	0			0	0	0	0	0	0	0
water	Water	consumable		💧	TRUE	20	1	0	0	0									0	15			0	0	0	0	0	0	0
ale	Ale	consumable		🍺	TRUE	20	2	0	0	0									5	10			0	0	0	0	0	0	0
bandages	Bandages	consumable		🩹	TRUE	20	3	0	0	0									25	0			0	0	0	0	0	0	0
arrows	Arrows	ammo	ammo	🏹	TRUE	100	0.2	0	0	0								arrow		0	0	0	0	0	0	0
wooden_arrow	Wooden Arrow	ammo	ammo	🏹	TRUE	100	0.1	0	0	0								arrow		0	0	0	0	0	0	0
iron_arrow	Iron Arrow	ammo	ammo	🏹	TRUE	100	0.5	0	0	0								arrow		0	0	0	0	0	0	0
```

## Example Data (Merchant Weapons)

```
id	name	type	slot	icon	stackable	maxStack	value	damage	delay	ac	weaponType	handedness	shieldType	armorType	classes	races	foodValue	waterValue	ammoType	requiredAmmo	STR	STA	AGI	DEX	WIS	INT	CHA
wooden_bow	Wooden Bow	weapon	range	🏹	FALSE	1	10	5	30	0	bow	2H						arrow	0	0	0	1	0	0	0
bronze_sword	Bronze Sword	weapon	primary	⚔️	FALSE	1	12	6	22	0	sword	1H								0	0	0	1	0	0	0
short_sword	Short Sword	weapon	primary	⚔️	FALSE	1	15	7	22	0	sword	1H								1	0	0	0	0	0	0
long_sword	Long Sword	weapon	primary	⚔️	FALSE	1	25	9	24	0	sword	1H								1	0	0	0	0	0	0
```

## Example Data (Merchant Armor)

```
id	name	type	slot	icon	stackable	maxStack	value	damage	delay	ac	weaponType	handedness	shieldType	armorType	classes	races	foodValue	waterValue	ammoType	requiredAmmo	STR	STA	AGI	DEX	WIS	INT	CHA
leather_gloves	Leather Gloves	armor	hands	🧤	FALSE	1	5	0	0	2			cloth	leather					0	0	0	1	0	0	0
leather_cap	Leather Cap	armor	head	🎩	FALSE	1	8	0	0	2			cloth	leather					0	0	0	0	0	0	0
studded_leather	Studded Leather	armor	chest	🛡️	FALSE	1	25	0	0	8			cloth	leather					0	1	0	0	0	0	0
small_shield	Small Shield	shield	secondary	🛡️	FALSE	1	20	0	0	6		1H	small					0	1	0	0	0	0	0
```

## Example Data (Accessories)

```
id	name	type	slot	icon	stackable	maxStack	value	damage	delay	ac	weaponType	handedness	shieldType	armorType	classes	races	foodValue	waterValue	ammoType	requiredAmmo	STR	STA	AGI	DEX	WIS	INT	CHA
magic_ring	Magic Ring	accessory	finger_left		FALSE	1	50	0	0	0											0	0	0	0	2	3	0
```

## Example Data (Junk/Crafting Materials)

```
id	name	type	slot	icon	stackable	maxStack	value	damage	delay	ac	weaponType	handedness	shieldType	armorType	classes	races	foodValue	waterValue	ammoType	requiredAmmo	STR	STA	AGI	DEX	WIS	INT	CHA
rat_ear	Rat Ear	junk		👂	TRUE	20	1	0	0	0											0	0	0	0	0	0	0
snake_scales	Snake Scales	junk		🐍	TRUE	20	2	0	0	0											0	0	0	0	0	0	0
venom_sac	Venom Sac	junk		💉	TRUE	20	5	0	0	0											0	0	0	0	0	0	0
gnoll_tooth	Gnoll Tooth	junk		🦷	TRUE	20	3	0	0	0											0	0	0	0	0	0	0
gnoll_fur	Gnoll Fur	junk		🧶	TRUE	20	4	0	0	0											0	0	0	0	0	0	0
tattered_pelt	Tattered Pelt	junk		🦌	TRUE	20	2	0	0	0											0	0	0	0	0	0	0
beetle_shell	Beetle Shell	junk		🐞	TRUE	20	3	0	0	0											0	0	0	0	0	0	0
spider_silk	Spider Silk	junk		🕸️	TRUE	20	4	0	0	0											0	0	0	0	0	0	0
bone_chips	Bone Chips	junk		🦴	TRUE	20	2	0	0	0											0	0	0	0	0	0	0
wolf_pelt	Wolf Pelt	junk		🐺	TRUE	20	6	0	0	0											0	0	0	0	0	0	0
wolf_tooth	Wolf Tooth	junk		🦷	TRUE	20	4	0	0	0											0	0	0	0	0	0	0
dog_pelt	Dog Pelt	junk		🦴	TRUE	20	3	0	0	0											0	0	0	0	0	0	0
spell_components	Spell Components	junk		✨	TRUE	20	8	0	0	0											0	0	0	0	0	0	0
```

## Notes

### Handedness Rules:
- **MH**: Main hand only (special weapons)
- **OH**: Offhand only (special offhand weapons, throwing weapons)
- **1H**: Can go in either main hand or offhand
- **2H**: Requires both hands, prevents using offhand

### Class/Race Restrictions:
- Empty = all classes/races can use
- Comma-separated list = only those classes/races can use
- Example: `classes="warrior,monk"` means only Warriors and Monks can equip

### Weapon Types:
- Maps to skill system for skill-ups
- "fists" for Hand to Hand skill
- Ranged weapons use "bow", "longbow", "crossbow" for Archery skill

### Ammo System:
- Ranged weapons have `requiredAmmo` field
- Ammo items have `ammoType` field
- Bow requires "arrow", crossbow requires "bolt"
- Ammo consumed on each ranged attack

### Shield Types:
- buckler, small, medium, large, tower
- Different AC values and class restrictions
- Occupies secondary slot

## Instructions

1. Open your Google Spreadsheet
2. Create or update the "Items" sheet
3. Copy the header row (all columns A-AB)
4. Paste into row 1
5. Copy example data rows
6. Paste starting from row 2
7. Adjust values as needed for game balance

## Balance Notes

- 1H weapons: Lower damage, faster speed (delay 18-22)
- 2H weapons: Higher damage, slower speed (delay 26-32)
- Bows: Medium damage, slow speed, requires ammo
- Daggers: Low damage, very fast (delay 16-18), high DEX bonus
- Staffs: Medium damage, caster-friendly (INT/WIS bonuses)
