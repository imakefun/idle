# Merchants Metadata

This document describes the structure of the **Merchants** Google Sheet.

## Sheet Name: `Merchants`

## Purpose
Defines merchant NPCs that buy and sell items in safe zones. Merchants have inventory that can be purchased and will buy items from players.

## Columns

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| `id` | string | Unique merchant identifier | `merchant_general` |
| `name` | string | Display name | `General Merchant` |
| `zoneId` | string | Zone where merchant is located | `qeynos` |
| `description` | string | Merchant description | `A general goods merchant` |
| `buyRate` | number | Percentage of item value merchant pays (0-100) | `50` |
| `sellRate` | number | Percentage markup merchant charges (100+) | `150` |

## Notes

- **buyRate**: Percentage of item's base value the merchant will pay. 50 = pays 50% of value
- **sellRate**: Percentage of item's base value merchant charges. 150 = charges 150% of value (50% markup)
- **zoneId**: Must match a zone ID from Zones sheet. Only visible in that zone.
- **Merchant Types**: General (all items), Armor (armor/weapons), Food (consumables), etc.

## Example Data

### Starting Merchants

```
id	name	zoneId	description	buyRate	sellRate
merchant_general	General Merchant	qeynos	A general goods merchant who buys and sells various items	50	150
merchant_armor	Armor Merchant	qeynos	A merchant specializing in weapons and armor	40	175
merchant_food	Food Merchant	qeynos	A merchant selling food and drink	60	125
```

## Integration

Merchants are:
1. Loaded via `DataSync.js` from Google Sheets
2. Transformed into merchant objects with buy/sell rates
3. Displayed in safe zones via NPC tab
4. Used by MerchantSystem for transactions

## Merchant Inventory

Merchants can sell specific items defined in the **MerchantInventory** sheet (see MERCHANT_INVENTORY_METADATA.md).

Merchants:
- **Buy**: Any item the player has in inventory
- **Sell**: Items defined in the MerchantInventory sheet with stock management and restocking

---

**Created**: 2026-01-03
**Phase**: 9 (Economy & Loot)
