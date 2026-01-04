/**
 * Merchant System
 * Handles buying and selling items with NPCs
 */

import { consolidateInventory } from '../utils/characterHelpers';

/**
 * Calculate the sell price for an item (what merchant pays player)
 * @param {Object} item - Item being sold
 * @param {Object} merchant - Merchant buying the item
 * @returns {number} - Amount of copper merchant will pay
 */
export function calculateSellPrice(item, merchant) {
  const baseValue = parseInt(item.value) || 0;
  const buyRate = parseFloat(merchant.buyRate) || 50;

  // Merchant pays buyRate% of item's base value
  return Math.floor(baseValue * (buyRate / 100));
}

/**
 * Calculate the buy price for an item (what merchant charges player)
 * @param {Object} item - Item being bought
 * @param {Object} merchant - Merchant selling the item
 * @returns {number} - Amount of copper player must pay
 */
export function calculateBuyPrice(item, merchant) {
  const baseValue = parseInt(item.value) || 0;
  const sellRate = parseFloat(merchant.sellRate) || 150;

  // Merchant charges sellRate% of item's base value
  return Math.floor(baseValue * (sellRate / 100));
}

/**
 * Sell an item to a merchant
 * @param {Object} player - Player state
 * @param {number} inventorySlotIndex - Index of item in inventory
 * @param {number} quantity - Number to sell
 * @param {Object} merchant - Merchant buying the item
 * @returns {Object} - Result { success, message, updates }
 */
export function sellItemToMerchant(player, inventorySlotIndex, quantity, merchant) {
  const inventory = [...player.inventory];
  const item = inventory[inventorySlotIndex];

  if (!item) {
    return {
      success: false,
      message: 'No item in that slot'
    };
  }

  // Determine how many to sell
  const itemQuantity = item.quantity || 1;
  const quantityToSell = Math.min(quantity, itemQuantity);

  if (quantityToSell <= 0) {
    return {
      success: false,
      message: 'Invalid quantity'
    };
  }

  // Calculate payment
  const pricePerItem = calculateSellPrice(item, merchant);
  const totalPayment = pricePerItem * quantityToSell;

  // Remove items from inventory
  if (quantityToSell >= itemQuantity) {
    // Selling entire stack - remove from array
    inventory.splice(inventorySlotIndex, 1);
  } else {
    // Selling partial stack
    inventory[inventorySlotIndex] = {
      ...item,
      quantity: itemQuantity - quantityToSell
    };
  }

  // Consolidate inventory to merge stacks and free up space
  const consolidatedInventory = consolidateInventory(inventory);

  // Add currency to player
  const newCurrency = player.currency + totalPayment;

  return {
    success: true,
    message: `You sell ${quantityToSell}x ${item.name} for ${totalPayment} copper.`,
    updates: {
      inventory: consolidatedInventory,
      currency: newCurrency
    }
  };
}

/**
 * Buy an item from a merchant
 * @param {Object} player - Player state
 * @param {Object} item - Item being purchased
 * @param {number} quantity - Number to buy
 * @param {Object} merchant - Merchant selling the item
 * @returns {Object} - Result { success, message, updates }
 */
export function buyItemFromMerchant(player, item, quantity, merchant) {
  const MAX_INVENTORY_SLOTS = 10;
  const inventory = [...player.inventory];

  if (quantity <= 0) {
    return {
      success: false,
      message: 'Invalid quantity'
    };
  }

  // Calculate cost
  const pricePerItem = calculateBuyPrice(item, merchant);
  const totalCost = pricePerItem * quantity;

  // Check if player can afford it
  if (player.currency < totalCost) {
    return {
      success: false,
      message: `You need ${totalCost} copper (you have ${player.currency}).`
    };
  }

  // Try to add items to inventory
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
      // Inventory full
      return {
        success: false,
        message: `Your inventory is full. You can only buy ${quantity - remainingQty} items.`
      };
    }
  }

  // Deduct currency from player
  const newCurrency = player.currency - totalCost;

  return {
    success: true,
    message: `You buy ${quantity}x ${item.name} for ${totalCost} copper.`,
    updates: {
      inventory,
      currency: newCurrency
    }
  };
}

/**
 * Get merchants available in a specific zone
 * @param {string} zoneId - Zone ID to get merchants for
 * @param {Object} merchants - Merchant definitions object
 * @returns {Array} - Array of merchants in this zone
 */
export function getMerchantsInZone(zoneId, merchants) {
  if (!zoneId || !merchants) return [];

  return Object.values(merchants).filter(merchant => merchant.zoneId === zoneId);
}

/**
 * Format currency into PP/GP/SP/CP display
 * @param {number} copper - Total copper
 * @returns {Object} - { pp, gp, sp, cp, display }
 */
export function formatCurrency(copper) {
  const pp = Math.floor(copper / 1000);
  const gp = Math.floor((copper % 1000) / 100);
  const sp = Math.floor((copper % 100) / 10);
  const cp = copper % 10;

  const parts = [];
  if (pp > 0) parts.push(`${pp}pp`);
  if (gp > 0) parts.push(`${gp}gp`);
  if (sp > 0) parts.push(`${sp}sp`);
  if (cp > 0 || parts.length === 0) parts.push(`${cp}cp`);

  return {
    pp,
    gp,
    sp,
    cp,
    display: parts.join(' ')
  };
}
