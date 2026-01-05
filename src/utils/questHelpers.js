/**
 * Quest System Helpers
 * Functions for generating, tracking, and managing quests
 */

/**
 * Generate a random quest from templates
 * @param {Object} questTemplates - Quest templates from gameData
 * @param {number} playerLevel - Current player level
 * @param {Array} activeQuests - Currently active quests
 * @param {Object} gameData - Game data for validation
 * @returns {Object|null} Generated quest instance or null if no valid templates
 */
export function generateQuest(questTemplates, playerLevel, activeQuests, gameData) {
  if (!questTemplates || Object.keys(questTemplates).length === 0) {
    return null;
  }

  // Get list of template IDs already in use (available, active, or ready status)
  const existingTemplateIds = activeQuests
    .filter(q => q.status === 'available' || q.status === 'active' || q.status === 'ready')
    .map(q => q.templateId);

  // Filter templates by player level AND exclude already existing quests
  const validTemplates = Object.values(questTemplates).filter(template =>
    playerLevel >= template.minLevel &&
    playerLevel <= template.maxLevel &&
    !existingTemplateIds.includes(template.id)
  );

  if (validTemplates.length === 0) {
    return null;
  }

  // Select random template
  const template = validTemplates[Math.floor(Math.random() * validTemplates.length)];

  // Select random target
  let targetId;
  let targetName;

  if (template.targetIds === 'any') {
    // Select from all valid targets based on type
    if (template.targetType === 'monster') {
      const monsters = Object.values(gameData.monsters || {});
      if (monsters.length > 0) {
        const monster = monsters[Math.floor(Math.random() * monsters.length)];
        targetId = monster.id;
        targetName = monster.name;
      }
    } else if (template.targetType === 'item') {
      const items = Object.values(gameData.items || {}).filter(item => item.type === 'junk' || item.type === 'tradeskill');
      if (items.length > 0) {
        const item = items[Math.floor(Math.random() * items.length)];
        targetId = item.id;
        targetName = item.name;
      }
    }
  } else {
    // Select from specific list
    const targetList = Array.isArray(template.targetIds) ? template.targetIds : [template.targetIds];
    targetId = targetList[Math.floor(Math.random() * targetList.length)];

    // Look up name
    if (template.targetType === 'monster') {
      targetName = gameData.monsters?.[targetId]?.name || targetId;
    } else if (template.targetType === 'item') {
      targetName = gameData.items?.[targetId]?.name || targetId;
    }
  }

  if (!targetId || !targetName) {
    return null; // Failed to find valid target
  }

  // Random requirement between min and max
  const required = Math.floor(Math.random() * (template.maxRequired - template.minRequired + 1)) + template.minRequired;

  // Replace placeholders in title and description
  const title = template.title
    .replace('{count}', required)
    .replace('{target}', targetName);

  const description = template.description
    .replace('{count}', required)
    .replace('{target}', targetName);

  // Create quest instance
  const quest = {
    id: `quest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Unique instance ID
    templateId: template.id,
    type: template.type,
    targetType: template.targetType,
    target: targetId,
    targetName: targetName,
    required: required,
    progress: 0,
    status: 'available',
    rewards: {
      xp: template.xpReward,
      copper: template.copperReward,
      lootTableId: template.lootTableId
    },
    title: title,
    description: description
  };

  console.log(`🎯 Generated quest from template "${template.id}" with lootTableId:`, template.lootTableId || '(empty)');

  return quest;
}

/**
 * Check if player can accept more quests
 * @param {Array} activeQuests - Currently active quests
 * @param {number} maxActive - Maximum active quests allowed
 * @returns {boolean}
 */
export function canAcceptQuest(activeQuests, maxActive = 3) {
  const active = activeQuests.filter(q => q.status === 'active');
  return active.length < maxActive;
}

/**
 * Update quest progress for kill quests
 * @param {Array} quests - Player's quests
 * @param {string} monsterId - ID of killed monster
 * @returns {Array} Updated quests array with any updated progress
 */
export function updateKillQuestProgress(quests, monsterId) {
  return quests.map(quest => {
    if (quest.status === 'active' && quest.type === 'kill' && quest.target === monsterId) {
      const newProgress = Math.min(quest.progress + 1, quest.required);
      const newStatus = newProgress >= quest.required ? 'ready' : 'active';

      return {
        ...quest,
        progress: newProgress,
        status: newStatus
      };
    }
    return quest;
  });
}

/**
 * Update quest progress for collect quests
 * @param {Array} quests - Player's quests
 * @param {string} itemId - ID of collected item
 * @param {number} quantity - Quantity collected
 * @returns {Array} Updated quests array
 */
export function updateCollectQuestProgress(quests, itemId, quantity = 1) {
  return quests.map(quest => {
    if (quest.status === 'active' && quest.type === 'collect' && quest.target === itemId) {
      const newProgress = Math.min(quest.progress + quantity, quest.required);
      const newStatus = newProgress >= quest.required ? 'ready' : 'active';

      return {
        ...quest,
        progress: newProgress,
        status: newStatus
      };
    }
    return quest;
  });
}

/**
 * Accept a quest (move from available to active)
 * @param {Array} quests - Player's quests
 * @param {string} questId - Quest instance ID to accept
 * @returns {Array} Updated quests array
 */
export function acceptQuest(quests, questId) {
  return quests.map(quest => {
    if (quest.id === questId && quest.status === 'available') {
      return {
        ...quest,
        status: 'active'
      };
    }
    return quest;
  });
}

/**
 * Abandon a quest (remove from player's quest list)
 * @param {Array} quests - Player's quests
 * @param {string} questId - Quest instance ID to abandon
 * @returns {Array} Updated quests array
 */
export function abandonQuest(quests, questId) {
  return quests.filter(quest => quest.id !== questId);
}

/**
 * Check if player has completed daily quest limit
 * @param {number} completedToday - Number of quests completed today
 * @param {number} dailyLimit - Daily quest limit
 * @returns {boolean}
 */
export function hasReachedDailyLimit(completedToday, dailyLimit = 5) {
  return completedToday >= dailyLimit;
}

/**
 * Get new daily reset time (midnight)
 * @returns {number} Timestamp for next midnight
 */
export function getNextDayResetTime() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.getTime();
}

/**
 * Check if daily reset has occurred
 * @param {number} lastResetTime - Last reset timestamp
 * @returns {boolean}
 */
export function shouldResetDaily(lastResetTime) {
  return Date.now() >= lastResetTime;
}

/**
 * Check if player has required items in inventory for a collect quest
 * @param {Object} quest - Quest to check
 * @param {Array} inventory - Player's inventory
 * @returns {boolean} True if player has required items
 */
export function hasRequiredItems(quest, inventory) {
  if (quest.type !== 'collect') {
    return true; // Kill quests don't need items
  }

  // Count how many of the target item the player has
  const itemCount = inventory.reduce((count, invItem) => {
    if (invItem.item.id === quest.target) {
      return count + invItem.quantity;
    }
    return count;
  }, 0);

  return itemCount >= quest.required;
}

/**
 * Remove quest items from inventory
 * @param {Array} inventory - Player's inventory
 * @param {string} itemId - Item ID to remove
 * @param {number} quantity - Quantity to remove
 * @returns {Array} Updated inventory
 */
export function removeQuestItems(inventory, itemId, quantity) {
  let remainingToRemove = quantity;
  const newInventory = [];

  for (const invItem of inventory) {
    if (invItem.item.id === itemId && remainingToRemove > 0) {
      if (invItem.quantity <= remainingToRemove) {
        // Remove entire stack
        remainingToRemove -= invItem.quantity;
        // Don't add to newInventory (effectively removing it)
      } else {
        // Remove partial stack
        newInventory.push({
          ...invItem,
          quantity: invItem.quantity - remainingToRemove
        });
        remainingToRemove = 0;
      }
    } else {
      // Keep item as-is
      newInventory.push(invItem);
    }
  }

  return newInventory;
}
