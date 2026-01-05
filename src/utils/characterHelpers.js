/**
 * Character Helper Functions
 * Character creation, starter gear, inventory management
 */

import { calculateMaxHP, calculateMaxStamina, calculateAC } from './calculations';
import { initializeSkills } from '../systems/SkillSystem';
import { CLASS_STARTING_SKILLS } from '../data/skills';

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

  // Initialize skills based on class
  const startingSkills = CLASS_STARTING_SKILLS[characterClass.id] || [];
  const skills = initializeSkills(characterClass.id, startingSkills, gameData.settings);

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
    currentZone: 'qeynos',
    currentCamp: null, // No camp selected initially
    bindPoint: 'qeynos',

    // Combat
    target: null,
    inCombat: false,
    isResting: false,

    // Inventory & Equipment
    inventory,
    equipped,

    // Quests
    quests: [], // All quests (available, active, ready, completed)
    questsCompletedToday: 0,
    lastQuestResetTime: Date.now() + (24 * 60 * 60 * 1000), // Next midnight
    lastQuestGenTime: 0, // Set to 0 so quests generate immediately on first tick

    // Skills
    skills,

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
 * Consolidate inventory stacks
 * Merges multiple stacks of the same item to optimize space
 * @param {Array} inventory - Player's inventory array
 */
export function consolidateInventory(inventory) {
  // Group items by ID
  const itemGroups = {};

  inventory.forEach((item, index) => {
    if (!item) return;

    if (!itemGroups[item.id]) {
      itemGroups[item.id] = [];
    }

    itemGroups[item.id].push({ item, index });
  });

  // For each item group with multiple stacks, consolidate
  Object.keys(itemGroups).forEach(itemId => {
    const group = itemGroups[itemId];

    if (group.length > 1 && group[0].item.stackable) {
      // Sort by quantity (smallest first)
      group.sort((a, b) => (a.item.quantity || 1) - (b.item.quantity || 1));

      const maxStack = group[0].item.maxStack || 20;

      // Try to merge stacks
      for (let i = 0; i < group.length; i++) {
        const current = group[i];
        if (!current || !current.item) continue;

        let currentQty = current.item.quantity || 1;

        if (currentQty < maxStack) {
          // Try to fill this stack from other stacks
          for (let j = i + 1; j < group.length; j++) {
            const other = group[j];
            if (!other || !other.item) continue;

            let otherQty = other.item.quantity || 1;
            const spaceInCurrent = maxStack - currentQty;

            if (spaceInCurrent > 0 && otherQty > 0) {
              const amountToMove = Math.min(spaceInCurrent, otherQty);
              currentQty += amountToMove;
              otherQty -= amountToMove;

              // Update quantities (prevent negative values)
              current.item.quantity = Math.max(1, currentQty);
              other.item.quantity = Math.max(0, otherQty);

              // Mark empty stacks for removal
              if (other.item.quantity <= 0) {
                inventory[other.index] = null;
              }
            }
          }
        }
      }
    }
  });

  // Remove null entries and return compacted array
  return inventory.filter(item => item !== null);
}

/**
 * Remove item from inventory
 * Prioritizes removing from smaller stacks to free up inventory space
 */
export function removeItemFromInventory(inventory, itemId, quantity = 1) {
  // Find all stacks of this item, sorted by quantity (smallest first)
  const stacks = [];
  inventory.forEach((item, index) => {
    if (item && item.id === itemId) {
      stacks.push({ item, index });
    }
  });

  stacks.sort((a, b) => (a.item.quantity || 1) - (b.item.quantity || 1));

  if (stacks.length === 0) {
    return { success: false, reason: 'Item not found' };
  }

  let remainingToRemove = quantity;
  const removedItems = [];
  const indicesToRemove = [];

  // Mark items for removal (don't splice yet to avoid index shifting)
  for (const { item, index } of stacks) {
    if (remainingToRemove <= 0) break;

    const itemQty = item.quantity || 1;
    const toRemove = Math.min(itemQty, remainingToRemove);

    if (toRemove >= itemQty) {
      // Mark entire stack for removal
      indicesToRemove.push(index);
      removedItems.push({ ...item });
      remainingToRemove -= itemQty;
    } else {
      // Reduce quantity (don't allow negative)
      item.quantity = Math.max(0, itemQty - toRemove);
      remainingToRemove -= toRemove;
      removedItems.push({ ...item, quantity: toRemove });
    }
  }

  // Remove marked indices in reverse order to avoid index shifting
  indicesToRemove.sort((a, b) => b - a);
  for (const index of indicesToRemove) {
    inventory.splice(index, 1);
  }

  // Consolidate inventory after removal
  const consolidated = consolidateInventory(inventory);
  inventory.length = 0;
  inventory.push(...consolidated);

  return { success: true, removed: removedItems };
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
