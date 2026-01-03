# Merchant Inventory Metadata

This document describes the structure of the **MerchantInventory** Google Sheet.

## Sheet Name: `MerchantInventory`

## Purpose
Defines what items each merchant has available to sell to players. Supports stock limits and automatic restocking.

## Columns

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| `merchantId` | string | ID of the merchant selling this item | `merchant_general` |
| `itemId` | string | ID of the item being sold | `bread` |
| `stock` | number | Current stock amount (-1 = unlimited) | `10` |
| `restockTime` | number | Minutes until restock (0 = never restocks) | `60` |
| `restockAmount` | number | How many to add on restock | `5` |

## Stock System

### Unlimited Stock
Use `stock = -1` for items that never run out (consumables, basic supplies).

### Limited Stock
Items with a specific stock number will decrease when purchased. When stock reaches 0, the item is unavailable until it restocks.

### Restocking
- **restockTime = 0**: Item never restocks (one-time purchases like unique items)
- **restockTime > 0**: Item restocks every X minutes with restockAmount added to current stock
- Restocking happens automatically based on game time
- Stock cannot exceed the initial stock value after restocking

## Example Data

### General Merchant (Basic Supplies)

```
merchantId,itemId,stock,restockTime,restockAmount
merchant_general,bread,-1,0,0
merchant_general,water,-1,0,0
merchant_general,rations,-1,0,0
merchant_general,bandages,20,30,10
merchant_general,rusty_dagger,5,60,2
merchant_general,rusty_shortsword,3,60,1
```

**Explanation:**
- Food/water: Unlimited stock, always available
- Bandages: Limited to 20, restocks 10 every 30 minutes
- Weapons: Limited stock, slow restock

### Armor Merchant (Equipment)

```
merchantId,itemId,stock,restockTime,restockAmount
merchant_armor,bronze_dagger,5,120,2
merchant_armor,bronze_sword,3,120,1
merchant_armor,short_sword,2,180,1
merchant_armor,leather_tunic,8,90,3
merchant_armor,leather_gloves,10,60,4
merchant_armor,studded_leather,4,120,2
merchant_armor,chainmail_tunic,2,240,1
```

**Explanation:**
- Higher tier items have less stock and slower restock times
- Basic armor (leather) restocks faster
- Advanced armor (chainmail) restocks slowly

### Food Merchant (Consumables)

```
merchantId,itemId,stock,restockTime,restockAmount
merchant_food,bread,-1,0,0
merchant_food,water,-1,0,0
merchant_food,rations,-1,0,0
merchant_food,ale,-1,0,0
merchant_food,health_potion,15,45,8
merchant_food,stamina_potion,15,45,8
```

**Explanation:**
- Basic food/drink: Unlimited
- Potions: Limited stock with moderate restock rate

## Pricing

Items are sold at the merchant's `sellRate` percentage:
- General Merchant: 150% of base value
- Armor Merchant: 175% of base value
- Food Merchant: 125% of base value

Price = (item.value × merchant.sellRate) / 100

## Integration

### In Game Code

```javascript
// Merchant inventory loaded as:
{
  merchant_general: [
    {
      item: { ...itemDefinition },
      stock: 20,
      restockTime: 30,
      restockAmount: 10,
      lastRestock: timestamp
    },
    // ...
  ]
}
```

### Stock Management

- When player buys an item, decrease stock by quantity purchased
- Track lastRestock timestamp per merchant per item
- On game tick, check if restockTime minutes have passed
- If restocked, add restockAmount to current stock (up to initial max)

## Notes

- Stock of -1 means unlimited (never decreases)
- restockTime of 0 means never restocks (one-time items)
- Items not in MerchantInventory are not sold by that merchant
- Players can only buy if they have enough currency AND merchant has stock

## Future Enhancements

- Dynamic pricing based on supply/demand
- Merchant faction/reputation affecting prices
- Seasonal items with limited availability
- Special merchant events with rare items

---

**Created**: 2026-01-03
**Phase**: 9 (Economy & Loot)
