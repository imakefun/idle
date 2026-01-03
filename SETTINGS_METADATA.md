# Settings Metadata for Google Sheets

This file contains the game settings configuration that controls combat mechanics, skill progression, and other gameplay values.

## Sheet Name: `Settings`

Copy the table below into a new Google Sheet tab named "Settings":

```
category	settingId	value	description
combat	hitBaseChance	50	Base chance to hit before modifiers (%)
combat	hitSkillBonusMultiplier	2	Multiplier for skill bonus in hit calculation
combat	hitLevelPenaltyMultiplier	5	Multiplier for level difference penalty
combat	hitDefenderSkillMultiplier	5	Multiplier for defender level vs skill
combat	hitMinChance	5	Minimum hit chance (%)
combat	hitMaxChance	95	Maximum hit chance (%)
combat	damageStrengthDivisor	10	Divisor for strength bonus to damage
combat	damageRandomBonusMin	1	Minimum random bonus damage
combat	damageRandomBonusMax	4	Maximum random bonus damage
combat	acBaseConstant	50	Base constant in AC mitigation formula
combat	acLevelMultiplier	2	Level multiplier in AC mitigation formula
combat	xpGreenConThreshold	5	Level difference for green con (trivial)
combat	xpReducedThreshold	3	Level difference for reduced XP
combat	xpReducedMultiplier	0.25	XP multiplier for reduced rewards
combat	conGreenThreshold	5	Level difference for green con color
combat	conLightBlueThreshold	3	Level difference for light blue con
combat	conWhiteThreshold	-2	Level difference for white con
combat	conYellowThreshold	-4	Level difference for yellow con
skill	skillCapLevelMultiplier	5	Multiplier for skill cap = (level+1) * value
skill	skillCapLevelBonus	1	Bonus added to level in skill cap formula
skill	skillUp95PctChance	0.01	Skill up chance at 95%+ of cap (1%)
skill	skillUp80PctChance	0.05	Skill up chance at 80-95% of cap (5%)
skill	skillUp60PctChance	0.15	Skill up chance at 60-80% of cap (15%)
skill	skillUp40PctChance	0.30	Skill up chance at 40-60% of cap (30%)
skill	skillUpBasicChance	0.50	Skill up chance below 40% of cap (50%)
skill	skillUp95PctThreshold	0.95	Threshold for 95% of cap
skill	skillUp80PctThreshold	0.80	Threshold for 80% of cap
skill	skillUp60PctThreshold	0.60	Threshold for 60% of cap
skill	skillUp40PctThreshold	0.40	Threshold for 40% of cap
skill	abilitySkillBonusDivisor	100	Divisor for ability proc skill bonus
skill	abilityMaxSkillBonus	0.20	Maximum skill bonus to ability proc (20%)
skill	abilityDamageSkillDivisor	10	Divisor for ability damage skill bonus
skill	dodgeBaseChance	0.05	Base dodge chance (5%)
skill	dodgeSkillDivisor	500	Divisor for dodge skill bonus
skill	dodgeMaxSkillBonus	0.20	Maximum skill bonus to dodge (20%)
regen	hpRegenBaseHP	0.001	HP regen base multiplier for max HP
regen	hpRegenBaseSTA	0.01	HP regen base multiplier for stamina stat
regen	hpRegenCombatMultiplier	0.1	HP regen multiplier during combat (10%)
regen	hpRegenRestMultiplier	3.0	HP regen multiplier when resting (3x)
regen	hpRegenRestThreshold	30	Minimum food/water % needed for rest bonus
regen	hpRegenStarvePenalty	0.1	HP regen multiplier when starving (10%)
regen	staminaRegenBase	0.5	Stamina base regeneration per tick
regen	staminaRegenLevelBonus	0.05	Stamina regen bonus per level
regen	staminaRegenCombatMultiplier	0.3	Stamina regen multiplier during combat (30%)
regen	staminaRegenRestMultiplier	2.0	Stamina regen multiplier when resting (2x)
regen	staminaRegenRestThreshold	30	Minimum food/water % needed for rest bonus
regen	staminaRegenStarvePenalty	0.2	Stamina regen multiplier when starving (20%)
consume	autoConsumeFoodThreshold	50	Food level % threshold for auto-consumption
consume	autoConsumeWaterThreshold	50	Water level % threshold for auto-consumption
```

## Data Structure

The Settings sheet has 4 columns:
- **category**: The category this setting belongs to (combat, skill, etc.)
- **settingId**: Unique identifier for the setting
- **value**: The numeric value for this setting
- **description**: Human-readable description of what this setting controls

## Usage in Code

Settings are loaded into `gameData.settings` as a key-value object:
```javascript
{
  hitBaseChance: 50,
  hitSkillBonusMultiplier: 2,
  damageStrengthDivisor: 10,
  // etc...
}
```

## How to Update

1. Copy the table above to your Google Sheet in a new tab named "Settings"
2. Adjust the values in the `value` column to tune gameplay
3. The game will automatically load these settings when fetching data from Google Sheets
4. If Google Sheets is unavailable, fallback values are used from `src/data/fallback/index.js`
