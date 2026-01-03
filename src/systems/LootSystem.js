/**
 * Loot System
 * Handles loot generation and distribution from defeated monsters
 */

/**
 * Generate loot from a defeated monster
 * @param {string} monsterId - ID of the defeated monster
 * @param {Object} lootTables - Loot table data from gameData
 * @param {Object} items - Item definitions from gameData
 * @returns {Object} - Generated loot { currency, items: [{item, quantity}] }
 */
export function generateLoot(monsterId, lootTables, items) {
  const loot = {
    currency: 0,
    items: []
  };

  // Get loot table for this monster
  const lootTable = lootTables?.[monsterId];
  if (!lootTable) {
    // No loot table defined, return empty loot
    return loot;
  }

  // Roll for currency
  if (lootTable.currency) {
    const min = lootTable.currency.min || 0;
    const max = lootTable.currency.max || 0;
    if (max > 0) {
      loot.currency = Math.floor(Math.random() * (max - min + 1)) + min;
    }
  }

  // Roll for each item in the loot table
  if (lootTable.items && Array.isArray(lootTable.items)) {
    lootTable.items.forEach(lootEntry => {
      // Roll for drop chance
      const roll = Math.random() * 100;
      if (roll < lootEntry.chance) {
        // Item dropped! Determine quantity
        const minQty = lootEntry.quantity.min || 1;
        const maxQty = lootEntry.quantity.max || 1;
        const quantity = Math.floor(Math.random() * (maxQty - minQty + 1)) + minQty;

        // Get item definition
        const itemDef = items[lootEntry.itemId];
        if (itemDef) {
          loot.items.push({
            item: itemDef,
            quantity
          });
        }
      }
    });
  }

  return loot;
}

/**
 * Add loot to player inventory
 * @param {Array} inventory - Player's current inventory
 * @param {Array} lootItems - Array of {item, quantity} to add
 * @returns {Object} - Result { added: [{item, quantity}], overflow: [{item, quantity}] }
 */
export function addLootToInventory(inventory, lootItems) {
  const result = {
    added: [],
    overflow: []
  };

  lootItems.forEach(({ item, quantity }) => {
    let remainingQty = quantity;

    // Try to add to existing stacks first (if stackable)
    if (item.stackable) {
      for (const invSlot of inventory) {
        if (invSlot && invSlot.id === item.id && remainingQty > 0) {
          const currentQty = invSlot.quantity || 1;
          const maxStack = item.maxStack || 20;
          const spaceInStack = maxStack - currentQty;

          if (spaceInStack > 0) {
            const amountToAdd = Math.min(spaceInStack, remainingQty);
            invSlot.quantity = currentQty + amountToAdd;
            remainingQty -= amountToAdd;
          }
        }
      }
    }

    // Add to empty slots if there's still quantity remaining
    while (remainingQty > 0) {
      const emptySlotIndex = inventory.findIndex(slot => slot === null || slot === undefined);

      if (emptySlotIndex !== -1) {
        // Found an empty slot
        const maxStack = item.stackable ? (item.maxStack || 20) : 1;
        const amountToAdd = Math.min(maxStack, remainingQty);

        inventory[emptySlotIndex] = {
          ...item,
          quantity: amountToAdd
        };

        remainingQty -= amountToAdd;
        result.added.push({ item, quantity: amountToAdd });
      } else {
        // No more empty slots - overflow
        result.overflow.push({ item, quantity: remainingQty });
        remainingQty = 0;
      }
    }

    // If we added some (not all overflow), record what was added
    if (remainingQty === 0 && quantity > 0) {
      result.added.push({ item, quantity });
    }
  });

  return result;
}

/**
 * Format loot message for combat log
 * @param {Object} loot - Generated loot object
 * @param {Object} result - Add to inventory result
 * @returns {Array} - Array of log messages
 */
export function formatLootMessages(loot, result) {
  const messages = [];

  // Currency message
  if (loot.currency > 0) {
    messages.push({
      type: 'loot',
      color: '#ffff44',
      message: `You loot ${loot.currency} copper.`
    });
  }

  // Item messages
  result.added.forEach(({ item, quantity }) => {
    const qtyText = quantity > 1 ? ` (x${quantity})` : '';
    messages.push({
      type: 'loot',
      color: '#ffff44',
      message: `You loot ${item.name}${qtyText}.`
    });
  });

  // Overflow warning
  if (result.overflow.length > 0) {
    result.overflow.forEach(({ item, quantity }) => {
      messages.push({
        type: 'warning',
        color: '#ff8844',
        message: `Your inventory is full! ${quantity}x ${item.name} dropped on the ground.`
      });
    });
  }

  // No loot message
  if (loot.currency === 0 && loot.items.length === 0) {
    messages.push({
      type: 'loot',
      color: '#888888',
      message: `No loot.`
    });
  }

  return messages;
}
