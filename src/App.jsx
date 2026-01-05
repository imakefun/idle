import { useState, useCallback, useEffect } from 'react'
import './App.css'
import useGameLoop from './hooks/useGameLoop'
import useSaveGame from './hooks/useSaveGame'
import useGameData from './hooks/useGameData'
import CharacterCreation from './components/Character/CharacterCreation'
import Inventory from './components/Inventory/Inventory'
import Equipment from './components/Inventory/Equipment'
import Zones from './components/Zones/Zones'
import Combat from './components/Combat/Combat'
import Skills from './components/Skills/Skills'
import GuildMaster from './components/Skills/GuildMaster'
import Merchant from './components/Merchant/Merchant'
import CaptainTillin from './components/Quests/CaptainTillin'
import { createCharacter, consumeItem, equipItem, removeItemFromInventory, addItemToInventory, consolidateInventory } from './utils/characterHelpers'
import { sellItemToMerchant, buyItemFromMerchant } from './systems/MerchantSystem'
import { calculateXPForLevel, calculateDrainRate, formatCurrency, calculateAC, calculateHPRegen, calculateStaminaRegen, calculateMaxHP, calculateMaxStamina } from './utils/calculations'
import { clearCache } from './systems/DataSync'
import { selectRandomMonster, selectMonsterFromSpawnTable, processCombatRound } from './systems/CombatEngine'
import { updateSkillCaps } from './systems/SkillSystem'
import { generateQuest, canAcceptQuest, updateKillQuestProgress, updateCollectQuestProgress, acceptQuest, abandonQuest, hasReachedDailyLimit, shouldResetDaily, getNextDayResetTime } from './utils/questHelpers'
import { generateLoot } from './systems/LootSystem'

function App() {
  // Load game data from Google Sheets
  const { data: gameData, loading: dataLoading, error: dataError, refresh: refreshData } = useGameData();

  // Initialize game state
  const [gameState, setGameState] = useState(() => {
    // Try to load saved game on mount
    const savedState = localStorage.getItem('norrathIdleSave_v21');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        return parsed.state || getInitialGameState();
      } catch (e) {
        return getInitialGameState();
      }
    }
    return getInitialGameState();
  });

  // Combat log state (not saved, resets on page load)
  const [combatLog, setCombatLog] = useState([]);

  // Tab navigation state
  const [activeTab, setActiveTab] = useState('game');

  // Add log entry
  const addCombatLog = useCallback((logEntry) => {
    setCombatLog(prev => [...prev.slice(-99), logEntry]); // Keep last 100 entries
  }, []);

  // Save/load hooks
  const { saveGame, loadGame, hasSave, deleteSave } = useSaveGame(gameState, setGameState, true, 1000);

  // Game loop callback
  const onGameTick = useCallback(({ deltaTime, tickCount }) => {
    if (!gameState.gameStarted || !gameState.characterCreated) return;

    setGameState(prev => {
      const updates = {
        tickCount,
        playTime: prev.playTime + deltaTime
      };

      // Drain food and water over time
      if (prev.level) {
        const drainRate = calculateDrainRate(prev.level);
        updates.food = Math.max(0, prev.food - drainRate);
        updates.water = Math.max(0, prev.water - drainRate);
      }

      // Auto-consume food if needed
      const currentFood = updates.food !== undefined ? updates.food : prev.food;
      const foodThreshold = gameData?.settings?.autoConsumeFoodThreshold || 50;
      if (currentFood < foodThreshold && prev.inventory && prev.inventory.length > 0) {
        // Find all food items, sorted by quantity (smallest first)
        const foodItems = prev.inventory
          .filter(item => item && item.type === 'consumable' && (item.foodValue || item.consumable?.foodValue || 0) > 0)
          .sort((a, b) => (a.quantity || 1) - (b.quantity || 1));

        if (foodItems.length > 0) {
          const foodItem = foodItems[0]; // Use smallest stack first
          const foodValue = foodItem.foodValue || foodItem.consumable?.foodValue || 0;
          const newFoodLevel = Math.min(100, currentFood + foodValue);
          updates.food = newFoodLevel;

          // Remove item from inventory and consolidate
          const newInventory = updates.inventory || [...prev.inventory];
          const result = removeItemFromInventory(newInventory, foodItem.id, 1);

          if (result.success) {
            updates.inventory = newInventory;

            addCombatLog({
              type: 'system',
              color: '#88ff88',
              message: `Auto-consumed ${foodItem.name}.`
            });
          }
        }
      }

      // Auto-consume water if needed
      const currentWater = updates.water !== undefined ? updates.water : prev.water;
      const waterThreshold = gameData?.settings?.autoConsumeWaterThreshold || 50;
      if (currentWater < waterThreshold && prev.inventory && prev.inventory.length > 0) {
        // Find all water items, sorted by quantity (smallest first)
        const inventoryToCheck = updates.inventory || prev.inventory;
        const waterItems = inventoryToCheck
          .filter(item => item && item.type === 'consumable' && (item.waterValue || item.consumable?.waterValue || 0) > 0)
          .sort((a, b) => (a.quantity || 1) - (b.quantity || 1));

        if (waterItems.length > 0) {
          const waterItem = waterItems[0]; // Use smallest stack first
          const waterValue = waterItem.waterValue || waterItem.consumable?.waterValue || 0;
          const newWaterLevel = Math.min(100, currentWater + waterValue);
          updates.water = newWaterLevel;

          // Remove item from inventory and consolidate
          const inventoryToUpdate = updates.inventory || [...prev.inventory];
          const result = removeItemFromInventory(inventoryToUpdate, waterItem.id, 1);

          if (result.success) {
            updates.inventory = inventoryToUpdate;

            addCombatLog({
              type: 'system',
              color: '#88ffff',
              message: `Auto-consumed ${waterItem.name}.`
            });
          }
        }
      }

      // HP Regeneration
      if (prev.hp < prev.maxHp) {
        const hpRegen = calculateHPRegen(
          prev.maxHp,
          prev.stats.STA,
          prev.inCombat || false,
          prev.isResting || false,
          prev.food,
          prev.water,
          gameData?.settings || {}
        );
        updates.hp = Math.min(prev.maxHp, prev.hp + hpRegen);
      }

      // Stamina Regeneration
      if (prev.stamina < prev.maxStamina) {
        const staminaRegen = calculateStaminaRegen(
          prev.maxStamina,
          prev.level,
          prev.inCombat || false,
          prev.isResting || false,
          prev.food,
          prev.water,
          gameData?.settings || {}
        );
        updates.stamina = Math.min(prev.maxStamina, prev.stamina + staminaRegen);
      }

      // Quest system
      if (gameData?.questTemplates) {
        const now = Date.now();
        const quests = prev.quests || [];

        // Check for daily reset
        if (shouldResetDaily(prev.lastQuestResetTime || 0)) {
          updates.questsCompletedToday = 0;
          updates.lastQuestResetTime = getNextDayResetTime();
        }

        // Quest generation (every 5 minutes, max 3 available quests)
        const timeSinceLastGen = now - (prev.lastQuestGenTime || 0);
        const QUEST_GEN_INTERVAL = 5 * 60 * 1000; // 5 minutes
        const MAX_AVAILABLE_QUESTS = 3;

        const availableQuests = quests.filter(q => q.status === 'available');
        const activeQuests = quests.filter(q => q.status === 'active');

        if (timeSinceLastGen >= QUEST_GEN_INTERVAL && availableQuests.length < MAX_AVAILABLE_QUESTS) {
          const newQuest = generateQuest(
            gameData.questTemplates,
            prev.level,
            quests,
            gameData
          );

          if (newQuest) {
            updates.quests = [...quests, newQuest];
            updates.lastQuestGenTime = now;

            addCombatLog({
              type: 'quest',
              color: '#ffaa00',
              message: `New quest available: ${newQuest.title}`
            });
          }
        }
      }

      // Combat processing
      if (prev.target && prev.inCombat) {
        // Check weapon delay (attack every 2 seconds for now)
        const timeSinceLastAttack = tickCount - (prev.lastAttackTick || 0);
        const attackSpeed = prev.equipped?.primary?.delay ? parseInt(prev.equipped.primary.delay) / 10 : 2; // Delay / 10 = seconds

        if (timeSinceLastAttack >= attackSpeed * 10) { // * 10 because tick is every 100ms
          // Process combat round
          const combatResult = processCombatRound(prev, prev.target, gameData);

          // Add logs
          combatResult.logs.forEach(log => addCombatLog(log));

          // Apply updates
          Object.assign(updates, combatResult.updates);

          // Apply skill-ups
          if (combatResult.skillUps && combatResult.skillUps.length > 0) {
            const updatedSkills = { ...prev.skills };
            combatResult.skillUps.forEach(skillUp => {
              if (updatedSkills[skillUp.skillId]) {
                updatedSkills[skillUp.skillId] = {
                  ...updatedSkills[skillUp.skillId],
                  current: skillUp.newValue
                };
              }
            });
            updates.skills = updatedSkills;
          }

          // Update target if still alive
          if (!combatResult.monsterDied && combatResult.monster) {
            updates.target = combatResult.monster;
          }

          // Update kill and collect quests when monster dies
          if (combatResult.monsterDied && prev.target) {
            let questsToUpdate = prev.quests || [];

            // Track kill quests
            questsToUpdate = updateKillQuestProgress(questsToUpdate, prev.target.id);

            // Track collect quests for looted items
            if (combatResult.lootedItems && combatResult.lootedItems.length > 0) {
              combatResult.lootedItems.forEach(lootedItem => {
                questsToUpdate = updateCollectQuestProgress(questsToUpdate, lootedItem.id, lootedItem.quantity);
              });
            }

            // Update quests if changed
            if (JSON.stringify(questsToUpdate) !== JSON.stringify(prev.quests)) {
              updates.quests = questsToUpdate;

              // Check if any quest became ready
              const readyQuest = questsToUpdate.find((q, i) =>
                q.status === 'ready' && (prev.quests[i]?.status !== 'ready')
              );
              if (readyQuest) {
                addCombatLog({
                  type: 'quest',
                  color: '#00ff00',
                  message: `Quest progress: ${readyQuest.title} is ready to turn in!`
                });
              }
            }
          }

          // Handle player death
          if (combatResult.updates.playerDied) {
            // Respawn at bind point
            updates.currentZone = prev.bindPoint;
            updates.currentCamp = null;
            updates.target = null;
            updates.inCombat = false;
            updates.hp = Math.floor(prev.maxHp * 0.5);
            updates.stamina = Math.floor(prev.maxStamina * 0.5);

            addCombatLog({
              type: 'system',
              color: '#ffff44',
              message: `You wake up at your bind point...`
            });
          }

          updates.lastAttackTick = tickCount;
        }
      }

      // Check for level-up
      if (updates.xp !== undefined && prev.xpForNextLevel) {
        const newXP = updates.xp;
        if (newXP >= prev.xpForNextLevel) {
          const newLevel = prev.level + 1;
          const newXPForNextLevel = calculateXPForLevel(newLevel + 1);

          updates.level = newLevel;
          updates.xpForNextLevel = newXPForNextLevel;

          // Update skill caps
          if (prev.skills) {
            updates.skills = updateSkillCaps(updates.skills || prev.skills, newLevel, gameData?.settings);
          }

          // Recalculate max HP and stamina
          const classData = gameData?.classes?.[prev.class];
          if (classData) {
            const newMaxHP = calculateMaxHP(newLevel, classData, prev.stats.STA);
            const newMaxStamina = calculateMaxStamina(newLevel);
            updates.maxHp = newMaxHP;
            updates.maxStamina = newMaxStamina;
            updates.hp = newMaxHP; // Full heal on level up
            updates.stamina = newMaxStamina;
          }

          addCombatLog({
            type: 'level-up',
            color: '#ffff00',
            message: `⭐ Congratulations! You have reached level ${newLevel}!`
          });
        }
      }

      return {
        ...prev,
        ...updates
      };
    });
  }, [gameState.gameStarted, gameState.characterCreated, gameState.target, gameState.inCombat, gameData, addCombatLog]);

  // Start the game loop
  const { tickCount } = useGameLoop(onGameTick, gameState.gameStarted);

  const startNewGame = () => {
    setGameState(prev => ({
      ...prev,
      gameStarted: true,
      characterCreated: false,
    }));
  };

  const handleCreateCharacter = (characterInfo) => {
    const newCharacter = createCharacter(characterInfo, gameData);
    setGameState(newCharacter);
  };

  const handleLoadGame = () => {
    const loaded = loadGame();
    if (!loaded) {
      alert('No save game found!');
    }
  };

  const handleDeleteSave = () => {
    if (window.confirm('Are you sure you want to delete your save?')) {
      deleteSave();
      setGameState(getInitialGameState());
    }
  };

  // Item handlers
  const handleUseItem = (item) => {
    setGameState(prev => {
      const result = consumeItem(prev.inventory, item.id, prev);
      if (result.success) {
        return { ...prev };
      }
      return prev;
    });
  };

  const handleEquipItem = (item) => {
    setGameState(prev => {
      const result = equipItem(prev.inventory, prev.equipped, item.id);
      if (result.success) {
        // Recalculate AC after equipping
        const newAC = calculateAC(prev.equipped, prev.stats.AGI);
        return { ...prev, ac: newAC };
      }
      return prev;
    });
  };

  const handleDropItem = (item) => {
    if (window.confirm(`Drop ${item.name}?`)) {
      setGameState(prev => {
        removeItemFromInventory(prev.inventory, item.id, 1);
        return { ...prev };
      });
    }
  };

  const handleUnequipItem = (item) => {
    setGameState(prev => {
      // Find the slot the item is in
      const slot = Object.keys(prev.equipped).find(s => prev.equipped[s]?.id === item.id);
      if (slot) {
        // Add to inventory
        const result = addItemToInventory(prev.inventory, item, 1);
        if (result.success) {
          // Remove from equipped
          delete prev.equipped[slot];
          // Recalculate AC
          const newAC = calculateAC(prev.equipped, prev.stats.AGI);
          return { ...prev, ac: newAC };
        }
      }
      return prev;
    });
  };

  // Clear cache and refresh data
  const handleClearCacheAndRefresh = () => {
    clearCache();
    refreshData();
  };

  // Handle zone travel
  const handleZoneChange = (newZoneId) => {
    setGameState(prev => ({
      ...prev,
      currentZone: newZoneId,
      currentCamp: null, // Clear camp when changing zones
      target: null // Clear target when changing zones
    }));
  };

  // Handle camp travel
  const handleCampChange = (zoneId, campId) => {
    setGameState(prev => ({
      ...prev,
      currentZone: zoneId,
      currentCamp: campId,
      target: null // Clear target when changing camps
    }));
  };

  // Combat handlers
  const handleAttack = () => {
    if (!gameData || !gameData.monsters) return;

    let newTarget = null;

    // If in a camp, use spawn table selection
    if (gameState.currentCamp && gameData.spawns) {
      newTarget = selectMonsterFromSpawnTable(
        gameState.currentCamp,
        gameData.spawns,
        gameData.monsters
      );
    }

    // Fallback to random selection if no camp or no spawn table match
    if (!newTarget) {
      const monsters = Object.values(gameData.monsters);
      if (monsters.length === 0) return;
      newTarget = selectRandomMonster(monsters);
    }

    if (!newTarget) return;

    setGameState(prev => ({
      ...prev,
      target: newTarget,
      inCombat: true,
      isResting: false, // Stop resting when combat starts
      lastAttackTick: tickCount // Start combat immediately
    }));

    addCombatLog({
      type: 'system',
      color: '#ffff44',
      message: `You engage ${newTarget.name}!`
    });
  };

  const handleClearTarget = () => {
    setGameState(prev => ({
      ...prev,
      target: null,
      inCombat: false
    }));

    addCombatLog({
      type: 'system',
      color: '#888888',
      message: `Combat ended.`
    });
  };

  const handleToggleRest = () => {
    setGameState(prev => ({
      ...prev,
      isResting: !prev.isResting
    }));
  };

  // Skill training handler
  const handleSellItem = useCallback((inventorySlotIndex, quantity, merchant) => {
    const player = {
      inventory: gameState.inventory,
      currency: gameState.currency
    };

    const result = sellItemToMerchant(player, inventorySlotIndex, quantity, merchant, gameData);

    if (result.success) {
      setGameState(prev => ({
        ...prev,
        ...result.updates
      }));

      addCombatLog({
        type: 'loot',
        color: '#90EE90',
        message: result.message
      });
    }

    return result;
  }, [gameState.inventory, gameState.currency, gameData]);

  const handleBuyItem = useCallback((item, quantity, merchant) => {
    const player = {
      inventory: gameState.inventory,
      currency: gameState.currency
    };

    const result = buyItemFromMerchant(player, item, quantity, merchant, gameData);

    if (result.success) {
      setGameState(prev => ({
        ...prev,
        ...result.updates
      }));

      addCombatLog({
        type: 'loot',
        color: '#90EE90',
        message: result.message
      });
    }

    return result;
  }, [gameState.inventory, gameState.currency, gameData]);

  const handleTrainSkill = (skill) => {
    setGameState(prev => {
      // Deduct currency
      const newCurrency = prev.currency - skill.cost;

      // Add skill to character
      const updatedSkills = {
        ...prev.skills,
        [skill.skillId]: {
          current: 1,
          max: (prev.level + 1) * 5
        }
      };

      addCombatLog({
        type: 'skill-up',
        color: '#44ff44',
        message: `You have learned ${skill.skillId}!`
      });

      return {
        ...prev,
        currency: newCurrency,
        skills: updatedSkills
      };
    });
  };

  // Quest handlers
  const handleAcceptQuest = (questId) => {
    setGameState(prev => ({
      ...prev,
      quests: acceptQuest(prev.quests, questId)
    }));

    addCombatLog({
      type: 'quest',
      color: '#ffaa00',
      message: 'Quest accepted!'
    });
  };

  const handleAbandonQuest = (questId) => {
    if (window.confirm('Are you sure you want to abandon this quest?')) {
      setGameState(prev => ({
        ...prev,
        quests: abandonQuest(prev.quests, questId)
      }));

      addCombatLog({
        type: 'quest',
        color: '#888888',
        message: 'Quest abandoned.'
      });
    }
  };

  const handleTurnInQuest = (questId) => {
    setGameState(prev => {
      const quest = prev.quests.find(q => q.id === questId);
      if (!quest || quest.status !== 'ready') {
        return prev;
      }

      const updates = {
        quests: prev.quests.filter(q => q.id !== questId),
        questsCompletedToday: prev.questsCompletedToday + 1
      };

      // Award XP
      if (quest.rewards.xp > 0) {
        updates.xp = prev.xp + quest.rewards.xp;

        addCombatLog({
          type: 'xp',
          color: '#00aaff',
          message: `You gain ${quest.rewards.xp} experience!`
        });

        // Check for level up
        while (updates.xp >= prev.xpForNextLevel) {
          const newLevel = prev.level + 1;
          const xpOverflow = updates.xp - prev.xpForNextLevel;
          const newXPRequired = calculateXPForLevel(newLevel);
          const newMaxHP = calculateMaxHP(newLevel, gameData.classes[prev.class], prev.stats.STA);
          const newMaxStamina = calculateMaxStamina(newLevel);

          updates.level = newLevel;
          updates.xp = xpOverflow;
          updates.xpForNextLevel = newXPRequired;
          updates.maxHp = newMaxHP;
          updates.hp = newMaxHP; // Heal to full on level up
          updates.maxStamina = newMaxStamina;
          updates.stamina = newMaxStamina;

          // Update skill caps
          updates.skills = updateSkillCaps(prev.skills, newLevel, gameData.settings);

          addCombatLog({
            type: 'level-up',
            color: '#ffff00',
            message: `You have reached level ${newLevel}!`
          });
        }
      }

      // Award copper
      if (quest.rewards.copper > 0) {
        updates.currency = prev.currency + quest.rewards.copper;

        addCombatLog({
          type: 'loot',
          color: '#ffaa00',
          message: `You receive ${quest.rewards.copper} copper!`
        });
      }

      // Award loot table items
      if (quest.rewards.lootTableId && gameData?.lootTables) {
        const loot = generateLoot(quest.rewards.lootTableId, gameData.lootTables, gameData.items);

        if (loot && loot.items && loot.items.length > 0) {
          const newInventory = [...(updates.inventory || prev.inventory)];

          loot.items.forEach(item => {
            const result = addItemToInventory(newInventory, item.item, item.quantity);
            if (result.success) {
              addCombatLog({
                type: 'loot',
                color: '#90EE90',
                message: `You receive ${item.quantity}x ${item.item.name}!`
              });
            }
          });

          updates.inventory = newInventory;
        }
      }

      addCombatLog({
        type: 'quest',
        color: '#00ff00',
        message: `Quest complete: ${quest.title}`
      });

      return { ...prev, ...updates };
    });
  };

  // Format time display
  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  };

  // Show loading screen while data is loading
  if (dataLoading) {
    return (
      <div className="app">
        <header className="header">
          <h1>Norrath Idle</h1>
          <p className="subtitle">A Text-Based Idle RPG</p>
        </header>
        <main className="main-content">
          <div className="welcome-screen">
            <h2>Loading Game Data...</h2>
            <p style={{ marginTop: '1rem' }}>🌐 Fetching data from Google Sheets...</p>
            <div style={{
              marginTop: '2rem',
              width: '100%',
              maxWidth: '300px',
              height: '4px',
              background: 'var(--bg-secondary)',
              borderRadius: '2px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                background: 'var(--accent)',
                animation: 'loading 1.5s ease-in-out infinite'
              }} />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Norrath Idle</h1>
        <p className="subtitle">A Text-Based Idle RPG</p>
      </header>

      <main className="main-content">
        {!gameState.gameStarted ? (
          <div className="welcome-screen">
            <h2>Welcome to Norrath</h2>
            <p>Embark on an epic idle adventure inspired by classic MMORPGs.</p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                className="btn btn-primary"
                onClick={startNewGame}
              >
                New Game
              </button>

              {hasSave() && (
                <button
                  className="btn btn-primary"
                  onClick={handleLoadGame}
                >
                  Load Game
                </button>
              )}
            </div>

            <div style={{ marginTop: '2rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <p>✅ Phase 1.1: Project Setup Complete</p>
              <p>✅ Phase 1.2: Game Loop Active</p>
              <p>✅ Phase 1.3: Save/Load System Working</p>
              <p>✅ Phase 1.5: Google Sheets Integration Active</p>
            </div>

            {/* Data status indicator */}
            {gameData && (
              <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                background: 'var(--bg-secondary)',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}>
                <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>📊 Game Data Loaded:</p>
                <p>• {Object.keys(gameData.races || {}).length} Races</p>
                <p>• {Object.keys(gameData.classes || {}).length} Classes</p>
                <p>• {Object.keys(gameData.monsters || {}).length} Monsters</p>
                <p>• {Object.keys(gameData.items || {}).length} Items</p>
                <p>• {Object.keys(gameData.zones || {}).length} Zones</p>
                <p>• {Object.keys(gameData.camps || {}).length} Camps</p>
                <p>• {Object.keys(gameData.skills || {}).length} Skills</p>
                <p>• {(gameData.spawns || []).length} Spawns</p>
                <p>• {Object.keys(gameData.merchants || {}).length} Merchants</p>
                <p>• {Object.keys(gameData.lootTables || {}).length} Loot Tables</p>
                <p>• {Object.keys(gameData.questTemplates || {}).length} Quests</p>
                {gameData.items && (
                  <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border)', paddingTop: '0.5rem' }}>
                    <p style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>🔍 Debug - Item Icons:</p>
                    <p>• Rations: {gameData.items.rations?.icon || '(no icon)'}</p>
                    <p>• Water Flask: {gameData.items.water_flask?.icon || '(no icon)'}</p>
                    <p>• Rusty Sword: {gameData.items.rusty_sword?.icon || '(no icon)'}</p>
                  </div>
                )}
                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={refreshData}
                    style={{
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.75rem',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border)',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      color: 'var(--text-primary)'
                    }}
                  >
                    🔄 Refresh Data
                  </button>
                  <button
                    onClick={handleClearCacheAndRefresh}
                    style={{
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.75rem',
                      background: 'var(--accent)',
                      border: '1px solid var(--accent)',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      color: 'white'
                    }}
                    title="Clear cached data and refresh from Google Sheets"
                  >
                    🗑️ Clear Cache & Refresh
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : !gameState.characterCreated ? (
          <CharacterCreation
            gameData={gameData}
            onCreateCharacter={handleCreateCharacter}
          />
        ) : (
          <div className="game-content">
            {/* Tab Navigation */}
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              marginBottom: '1rem',
              borderBottom: '2px solid var(--border)',
              paddingBottom: '0.5rem'
            }}>
              <button
                onClick={() => setActiveTab('game')}
                style={{
                  padding: '0.5rem 1rem',
                  background: activeTab === 'game' ? 'var(--accent)' : 'var(--bg-secondary)',
                  color: activeTab === 'game' ? 'white' : 'var(--text-primary)',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: activeTab === 'game' ? 'bold' : 'normal'
                }}
              >
                🎮 Game
              </button>
              <button
                onClick={() => setActiveTab('player')}
                style={{
                  padding: '0.5rem 1rem',
                  background: activeTab === 'player' ? 'var(--accent)' : 'var(--bg-secondary)',
                  color: activeTab === 'player' ? 'white' : 'var(--text-primary)',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: activeTab === 'player' ? 'bold' : 'normal'
                }}
              >
                👤 Player
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                style={{
                  padding: '0.5rem 1rem',
                  background: activeTab === 'settings' ? 'var(--accent)' : 'var(--bg-secondary)',
                  color: activeTab === 'settings' ? 'white' : 'var(--text-primary)',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: activeTab === 'settings' ? 'bold' : 'normal'
                }}
              >
                ⚙️ Settings
              </button>
            </div>

            {/* Game Tab */}
            {activeTab === 'game' && (
              <>
                {/* Character Info Header */}
                <div className="game-stats" style={{
                  background: 'var(--bg-secondary)',
                  padding: '1rem',
                  borderRadius: '8px',
                  marginBottom: '1rem'
                }}>
                  <h3 style={{ marginBottom: '0.5rem' }}>{gameState.name} - Level {gameState.level}</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    {gameState.raceName} {gameState.className} | {gameData?.zones[gameState.currentZone]?.name || gameState.currentZone}
                  </p>

              {/* HP and Stamina */}
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>HP:</strong> {Math.floor(gameState.hp)}/{Math.floor(gameState.maxHp)}
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginTop: '0.25rem'
                }}>
                  <div style={{
                    width: `${(Math.floor(gameState.hp) / Math.floor(gameState.maxHp)) * 100}%`,
                    height: '100%',
                    background: '#ff0000',
                    transition: 'width 0.3s'
                  }} />
                </div>
              </div>

              <div style={{ marginBottom: '0.5rem' }}>
                <strong>Stamina:</strong> {Math.floor(gameState.stamina)}/{Math.floor(gameState.maxStamina)}
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginTop: '0.25rem'
                }}>
                  <div style={{
                    width: `${(Math.floor(gameState.stamina) / Math.floor(gameState.maxStamina)) * 100}%`,
                    height: '100%',
                    background: '#ffff00',
                    transition: 'width 0.3s'
                  }} />
                </div>
              </div>

              {/* Food and Water */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.5rem' }}>
                <div>
                  <strong>Food:</strong> {Math.floor(gameState.food)}%
                  <div style={{
                    width: '100%',
                    height: '6px',
                    background: 'var(--bg-tertiary)',
                    borderRadius: '3px',
                    overflow: 'hidden',
                    marginTop: '0.25rem'
                  }}>
                    <div style={{
                      width: `${gameState.food}%`,
                      height: '100%',
                      background: gameState.food < 20 ? '#ff0000' : '#00ff00',
                      transition: 'width 0.3s'
                    }} />
                  </div>
                </div>
                <div>
                  <strong>Water:</strong> {Math.floor(gameState.water)}%
                  <div style={{
                    width: '100%',
                    height: '6px',
                    background: 'var(--bg-tertiary)',
                    borderRadius: '3px',
                    overflow: 'hidden',
                    marginTop: '0.25rem'
                  }}>
                    <div style={{
                      width: `${gameState.water}%`,
                      height: '100%',
                      background: gameState.water < 20 ? '#ff0000' : '#00ccff',
                      transition: 'width 0.3s'
                    }} />
                  </div>
                </div>
              </div>

              {/* XP Progress */}
              <div style={{ marginTop: '0.5rem' }}>
                <strong>XP:</strong> {gameState.xp}/{gameState.xpForNextLevel}
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginTop: '0.25rem'
                }}>
                  <div style={{
                    width: `${(gameState.xp / gameState.xpForNextLevel) * 100}%`,
                    height: '100%',
                    background: 'var(--accent)',
                    transition: 'width 0.3s'
                  }} />
                </div>
              </div>

              {/* Stats and Other Info */}
                  <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <p>⚔️ AC: {gameState.ac} | 💰 {formatCurrency(gameState.currency)}</p>
                    <p>⏱️ Play Time: {formatTime(gameState.playTime)}</p>
                  </div>
                </div>

                {/* Combat (only show when NOT in safe zone) */}
                {!gameData?.zones?.[gameState.currentZone]?.isSafe && (
                  <Combat
                    gameData={gameData}
                    currentZone={gameState.currentZone}
                    currentCamp={gameState.currentCamp}
                    characterLevel={gameState.level}
                    target={gameState.target}
                    isResting={gameState.isResting}
                    food={gameState.food}
                    water={gameState.water}
                    onAttack={handleAttack}
                    onClearTarget={handleClearTarget}
                    onToggleRest={handleToggleRest}
                    combatLog={combatLog}
                  />
                )}

                {/* Guild Master (only show in safe zones) */}
                {gameData?.zones?.[gameState.currentZone]?.isSafe && (
                  <GuildMaster
                    playerClass={gameState.class}
                    playerLevel={gameState.level}
                    playerCurrency={gameState.currency}
                    playerSkills={gameState.skills}
                    onTrainSkill={handleTrainSkill}
                  />
                )}

                {/* Merchants (only show in safe zones) */}
                {gameData?.zones?.[gameState.currentZone]?.isSafe && (
                  <Merchant
                    gameData={gameData}
                    currentZone={gameState.currentZone}
                    playerCurrency={gameState.currency}
                    playerInventory={gameState.inventory}
                    onSellItem={handleSellItem}
                    onBuyItem={handleBuyItem}
                  />
                )}

                {/* Captain Tillin - Quest Giver (only show in safe zones) */}
                {gameData?.zones?.[gameState.currentZone]?.isSafe && (
                  <CaptainTillin
                    quests={gameState.quests}
                    questsCompletedToday={gameState.questsCompletedToday}
                    playerLevel={gameState.level}
                    onAcceptQuest={handleAcceptQuest}
                    onAbandonQuest={handleAbandonQuest}
                    onTurnInQuest={handleTurnInQuest}
                  />
                )}

                {/* Zone Travel */}
                <div style={{ marginBottom: '1rem' }}>
                  <Zones
                    gameData={gameData}
                    currentZone={gameState.currentZone}
                    currentCamp={gameState.currentCamp}
                    characterLevel={gameState.level}
                    onZoneChange={handleZoneChange}
                    onCampChange={handleCampChange}
                  />
                </div>
              </>
            )}

            {/* Player Tab */}
            {activeTab === 'player' && (
              <>
                {/* Equipment and Inventory */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <Equipment
                    equipped={gameState.equipped}
                    onUnequip={handleUnequipItem}
                    gameData={gameData}
                  />
                  <Inventory
                    inventory={gameState.inventory}
                    onUseItem={handleUseItem}
                    onEquipItem={handleEquipItem}
                    onDropItem={handleDropItem}
                    gameData={gameData}
                  />
                </div>

                {/* Skills */}
                <Skills skills={gameState.skills} skillDefinitions={gameData?.skills} />
              </>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div style={{
                background: 'var(--bg-secondary)',
                padding: '1.5rem',
                borderRadius: '8px'
              }}>
                <h3 style={{ marginBottom: '1rem' }}>⚙️ Settings</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
                  <div>
                    <h4 style={{ marginBottom: '0.5rem' }}>💾 Save Game</h4>
                    <button
                      className="btn btn-primary"
                      onClick={() => saveGame()}
                      style={{ width: '100%' }}
                    >
                      💾 Manual Save
                    </button>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                      Auto-saves every minute
                    </p>
                  </div>

                  <div>
                    <h4 style={{ marginBottom: '0.5rem', color: '#ff6b6b' }}>🗑️ Reset Character</h4>
                    <button
                      className="btn btn-danger"
                      onClick={handleDeleteSave}
                      style={{
                        width: '100%',
                        background: '#ff6b6b',
                        color: 'white'
                      }}
                    >
                      🗑️ Delete Character
                    </button>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                      This will permanently delete your character
                    </p>
                  </div>

                  <div>
                    <h4 style={{ marginBottom: '0.5rem' }}>🔄 Data Management</h4>
                    <button
                      onClick={async () => {
                        clearCache();
                        await refreshData();
                      }}
                      style={{
                        width: '100%',
                        padding: '0.5rem 1rem',
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--accent)',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        color: 'white'
                      }}
                      title="Clear cached data and refresh from Google Sheets"
                    >
                      🗑️ Clear Cache & Refresh
                    </button>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                      Reload game data from Google Sheets
                    </p>
                  </div>

                  {/* Game Data Summary */}
                  <div style={{
                    padding: '1rem',
                    background: 'var(--bg-tertiary)',
                    borderRadius: '8px',
                    fontSize: '0.875rem'
                  }}>
                    <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>📊 Game Data Loaded:</p>
                    <p>• {Object.keys(gameData?.races || {}).length} Races</p>
                    <p>• {Object.keys(gameData?.classes || {}).length} Classes</p>
                    <p>• {Object.keys(gameData?.monsters || {}).length} Monsters</p>
                    <p>• {Object.keys(gameData?.items || {}).length} Items</p>
                    <p>• {Object.keys(gameData?.zones || {}).length} Zones</p>
                    <p>• {Object.keys(gameData?.camps || {}).length} Camps</p>
                    <p>• {Object.keys(gameData?.skills || {}).length} Skills</p>
                    <p>• {(gameData?.spawns || []).length} Spawns</p>
                    <p>• {Object.keys(gameData?.merchants || {}).length} Merchants</p>
                    <p>• {Object.keys(gameData?.lootTables || {}).length} Loot Tables</p>
                    <p>• {Object.keys(gameData?.questTemplates || {}).length} Quests</p>
                  </div>
                </div>
              </div>
            )}

            <p style={{
              marginTop: '1rem',
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              padding: '1rem',
              background: 'var(--bg-tertiary)',
              borderRadius: '8px'
            }}>
              💡 The game auto-saves every second and when you close the page.
              Try closing the tab and reopening - your progress will be saved!
            </p>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Norrath Idle v0.3.0 | Phase 3: Inventory & Items ✅</p>
      </footer>
    </div>
  )
}

// Initial game state factory
function getInitialGameState() {
  return {
    gameStarted: false,
    characterCreated: false,
    tickCount: 0,
    playTime: 0,
  };
}

export default App
