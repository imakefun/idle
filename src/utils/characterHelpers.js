/**
 * Character Helper Functions
 * Character creation, starter gear, inventory management
 */

import { calculateMaxHP, calculateMaxStamina, calculateAC } from './calculations';

/**
 * Generate starting inventory based on class
 * All classes get rations and water
 * Non-Monk classes get a weapon
 */
export function generateStarterGear(classData, gameData) {
  const inventory = [];
  const equipped = {};

  // Get items from game data
  const items = gameData.items || {};

  // Add rations (20 count)
  const rations = items.rations;
  if (rations) {
    inventory.push({
      ...rations,
      quantity: 20
    });
  }

  // Add water flask (20 count)
  const waterFlask = items.water_flask;
  if (waterFlask) {
    inventory.push({
      ...waterFlask,
      quantity: 20
    });
  }

  // Add class-specific starting weapon (configured in class data)
  if (classData.starterWeapon && classData.starterWeapon !== '') {
    const starterWeapon = items[classData.starterWeapon];
    if (starterWeapon) {
      equipped.primary = { ...starterWeapon, quantity: 1 };
    }
  }

  return { inventory, equipped };
}

/**
 * Create initial character state
 */
export function createCharacter(characterInfo, gameData) {
  const { name, race, class: characterClass } = characterInfo;

  const raceData = gameData.races[race.id];
  const classData = gameData.classes[characterClass.id];

  // Calculate starting stats
  const stats = { ...raceData.stats };
  const level = 1;
  const maxHP = calculateMaxHP(level, classData, stats.STA);
  const maxStamina = calculateMaxStamina(level);

  // Generate starter gear
  const { inventory, equipped } = generateStarterGear(classData, gameData);

  // Calculate AC
  const ac = calculateAC(equipped, stats.AGI);

  // Create full character state
  return {
    name,
    race: race.id,
    raceName: race.name,
    class: characterClass.id,
    className: characterClass.name,
    level,
    xp: 0,
    xpForNextLevel: 100, // Level 2 requires 100 XP

    // Health & Resources
    hp: maxHP,
    maxHp: maxHP,
    stamina: maxStamina,
    maxStamina,
    food: 100,
    water: 100,

    // Stats
    stats,
    ac,

    // Currency
    currency: 0, // Start with 0 copper

    // Location
    currentZone: 'newbie_yard',
    bindPoint: 'newbie_yard',

    // Combat
    target: null,
    inCombat: false,

    // Inventory & Equipment
    inventory,
    equipped,

    // Quests
    activeQuests: [],
    completedQuestsToday: 0,

    // Skills
    skills: {},

    // Game meta
    gameStarted: true,
    characterCreated: true,
    tickCount: 0,
    playTime: 0
  };
}

/**
 * Add item to inventory
 * Handles stacking and inventory slots
 */
export function addItemToInventory(inventory, item, quantity = 1) {
  const MAX_INVENTORY_SLOTS = 10;

  // Check if item is stackable
  if (item.stackable) {
    // Find existing stack
    const existingStack = inventory.find(invItem => invItem.id === item.id);

    if (existingStack) {
      // Add to existing stack (respect max stack size)
      const spaceInStack = item.maxStack - existingStack.quantity;
      const toAdd = Math.min(quantity, spaceInStack);
      existingStack.quantity += toAdd;

      const remaining = quantity - toAdd;
      if (remaining > 0) {
        // Create new stack for remaining items
        if (inventory.length < MAX_INVENTORY_SLOTS) {
          inventory.push({
            ...item,
            quantity: Math.min(remaining, item.maxStack)
          });
          return { success: true, remaining: Math.max(0, remaining - item.maxStack) };
        } else {
          return { success: false, reason: 'Inventory full', remaining };
        }
      }

      return { success: true, remaining: 0 };
    } else {
      // Create new stack
      if (inventory.length < MAX_INVENTORY_SLOTS) {
        inventory.push({
          ...item,
          quantity: Math.min(quantity, item.maxStack)
        });
        const remaining = Math.max(0, quantity - item.maxStack);
        return { success: true, remaining };
      } else {
        return { success: false, reason: 'Inventory full', remaining: quantity };
      }
    }
  } else {
    // Non-stackable item
    if (inventory.length < MAX_INVENTORY_SLOTS) {
      inventory.push({
        ...item,
        quantity: 1
      });
      return { success: true, remaining: 0 };
    } else {
      return { success: false, reason: 'Inventory full', remaining: 1 };
    }
  }
}

/**
 * Remove item from inventory
 */
export function removeItemFromInventory(inventory, itemId, quantity = 1) {
  const itemIndex = inventory.findIndex(item => item.id === itemId);

  if (itemIndex === -1) {
    return { success: false, reason: 'Item not found' };
  }

  const item = inventory[itemIndex];

  if (item.quantity > quantity) {
    // Reduce quantity
    item.quantity -= quantity;
    return { success: true, item };
  } else {
    // Remove entire stack
    const removed = inventory.splice(itemIndex, 1)[0];
    return { success: true, item: removed };
  }
}

/**
 * Equip an item from inventory
 */
export function equipItem(inventory, equipped, itemId) {
  const item = inventory.find(i => i.id === itemId);

  if (!item) {
    return { success: false, reason: 'Item not found in inventory' };
  }

  if (item.type !== 'weapon' && item.type !== 'armor') {
    return { success: false, reason: 'Item cannot be equipped' };
  }

  const slot = item.slot;

  // Unequip current item in that slot
  if (equipped[slot]) {
    addItemToInventory(inventory, equipped[slot], 1);
  }

  // Remove item from inventory
  removeItemFromInventory(inventory, itemId, 1);

  // Equip the item
  equipped[slot] = { ...item, quantity: 1 };

  return { success: true };
}

/**
 * Consume a food or water item
 */
export function consumeItem(inventory, itemId, character) {
  const item = inventory.find(i => i.id === itemId);

  if (!item) {
    return { success: false, reason: 'Item not found' };
  }

  if (item.type !== 'consumable') {
    return { success: false, reason: 'Item is not consumable' };
  }

  // Apply food/water value
  if (item.consumable.foodValue > 0) {
    character.food = Math.min(100, character.food + item.consumable.foodValue);
  }

  if (item.consumable.waterValue > 0) {
    character.water = Math.min(100, character.water + item.consumable.waterValue);
  }

  // Remove one from inventory
  removeItemFromInventory(inventory, itemId, 1);

  return { success: true };
}
