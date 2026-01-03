/**
 * Loot System
 * Handles loot generation from flexible, reusable loot tables
 */

const CURRENCY_VALUES = {
  copper: 1,
  silver: 10,
  gold: 100,
  platinum: 1000
};

/**
 * Generate loot from a loot table
 * @param {string} lootTableId - ID of the loot table to roll
 * @param {Object} lootTables - All loot table data from gameData
 * @param {Object} items - Item definitions from gameData
 * @param {number} depth - Recursion depth (prevents infinite loops)
 * @returns {Object} - Generated loot { currency, items: [{item, quantity}] }
 */
export function generateLoot(lootTableId, lootTables, items, depth = 0) {
  const loot = {
    currency: 0,
    items: []
  };

  // Prevent infinite recursion
  if (depth > 10) {
    console.warn(`Loot table recursion depth exceeded for: ${lootTableId}`);
    return loot;
  }

  // Get loot table definition
  const lootTable = lootTables?.[lootTableId];
  if (!lootTable) {
    // Debug logging
    console.warn(`No loot table found for: ${lootTableId}`);
    console.log('Available loot tables:', Object.keys(lootTables || {}));
    console.log('All lootTables data:', lootTables);
    // No loot table defined, return empty loot
    return loot;
  }

  console.log(`Rolling loot for ${lootTableId}, ${lootTable.length} entries`);

  // Group entries by group number
  const groups = {};
  lootTable.forEach(entry => {
    const groupNum = entry.group || 1;
    if (!groups[groupNum]) {
      groups[groupNum] = [];
    }
    groups[groupNum].push(entry);
  });

  console.log(`${Object.keys(groups).length} groups found`);

  // Process each group (one selection per group)
  Object.keys(groups).forEach(groupNum => {
    const groupEntries = groups[groupNum];
    const selectedEntry = selectFromGroup(groupEntries);

    console.log(`Group ${groupNum}: selected`, selectedEntry);

    if (selectedEntry && selectedEntry.item && selectedEntry.item !== 'nothing') {
      // Determine quantity
      const quantity = calculateQuantity(
        selectedEntry.min || 1,
        selectedEntry.max || 1,
        selectedEntry.step || 1
      );

      console.log(`  -> ${selectedEntry.item} x${quantity}`);

      // Check if this is a currency type
      if (CURRENCY_VALUES[selectedEntry.item]) {
        const copperValue = CURRENCY_VALUES[selectedEntry.item] * quantity;
        loot.currency += copperValue;
      }
      // Check if this is another loot table (recursive)
      else if (lootTables[selectedEntry.item]) {
        // Roll the referenced loot table multiple times (quantity = number of rolls)
        for (let i = 0; i < quantity; i++) {
          const recursiveLoot = generateLoot(selectedEntry.item, lootTables, items, depth + 1);
          loot.currency += recursiveLoot.currency;
          loot.items.push(...recursiveLoot.items);
        }
      }
      // This is an item
      else {
        const itemDef = items[selectedEntry.item];
        if (itemDef) {
          loot.items.push({
            item: itemDef,
            quantity
          });
        } else {
          console.warn(`Item not found in loot table: ${selectedEntry.item}`);
          console.log('Available items:', Object.keys(items || {}));
        }
      }
    }
  });

  console.log('Final loot:', loot);

  return loot;
}

/**
 * Select one entry from a group using weighted random selection
 * @param {Array} groupEntries - Array of loot table entries in this group
 * @returns {Object} - Selected entry, or null if nothing selected
 */
function selectFromGroup(groupEntries) {
  if (!groupEntries || groupEntries.length === 0) {
    return null;
  }

  // Calculate total weight
  const totalWeight = groupEntries.reduce((sum, entry) => sum + (entry.weight || 0), 0);

  if (totalWeight === 0) {
    return null;
  }

  // Random weighted selection
  let random = Math.random() * totalWeight;

  for (const entry of groupEntries) {
    random -= (entry.weight || 0);
    if (random <= 0) {
      return entry;
    }
  }

  // Fallback to last entry (should not happen)
  return groupEntries[groupEntries.length - 1];
}

/**
 * Calculate quantity with min/max/step constraints
 * @param {number} min - Minimum quantity
 * @param {number} max - Maximum quantity
 * @param {number} step - Step/rounding multiple
 * @returns {number} - Calculated quantity
 */
function calculateQuantity(min, max, step) {
  if (min === max) {
    return min;
  }

  // Calculate number of possible steps
  const range = max - min;
  const numSteps = Math.floor(range / step);

  // Random step selection
  const randomStep = Math.floor(Math.random() * (numSteps + 1));

  return min + (randomStep * step);
}

/**
 * Add loot to player inventory
 * @param {Array} inventory - Player's current inventory
 * @param {Array} lootItems - Array of {item, quantity} to add
 * @returns {Object} - Result { added: [{item, quantity}], overflow: [{item, quantity}] }
 */
export function addLootToInventory(inventory, lootItems) {
  const MAX_INVENTORY_SLOTS = 10;
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

    // Add new stacks to inventory if there's still quantity remaining
    while (remainingQty > 0) {
      // Check if inventory has room (variable-length array)
      if (inventory.length < MAX_INVENTORY_SLOTS) {
        const maxStack = item.stackable ? (item.maxStack || 20) : 1;
        const amountToAdd = Math.min(maxStack, remainingQty);

        inventory.push({
          ...item,
          quantity: amountToAdd
        });

        remainingQty -= amountToAdd;
      } else {
        // Inventory full - overflow
        result.overflow.push({ item, quantity: remainingQty });
        remainingQty = 0;
      }
    }

    // Record what was successfully added
    if (quantity > remainingQty) {
      result.added.push({ item, quantity: quantity - remainingQty });
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
