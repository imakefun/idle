/**
 * Captain Tillin - Quest Giver NPC
 * Displays available, active, and completed quests
 */

import './CaptainTillin.css';

export default function CaptainTillin({
  quests = [],
  questsCompletedToday = 0,
  playerLevel,
  onAcceptQuest,
  onAbandonQuest,
  onTurnInQuest
}) {
  const availableQuests = quests.filter(q => q.status === 'available');
  const activeQuests = quests.filter(q => q.status === 'active');
  const readyQuests = quests.filter(q => q.status === 'ready');

  const dailyLimit = 5;
  const canTurnInMore = questsCompletedToday < dailyLimit;

  return (
    <div className="captain-tillin-container">
      <h3>🎖️ Captain Tillin - Quest Master</h3>
      <p className="quest-npc-description">
        "Greetings, adventurer! I have tasks that need doing. Complete them well and you shall be rewarded."
      </p>

      {/* Daily Progress */}
      <div className="quest-daily-progress">
        <strong>Quests Completed Today:</strong> {questsCompletedToday} / {dailyLimit}
        {!canTurnInMore && (
          <span className="quest-limit-reached"> (Daily limit reached - returns tomorrow)</span>
        )}
      </div>

      {/* Ready to Turn In Quests */}
      {readyQuests.length > 0 && (
        <div className="quest-section quest-ready-section">
          <h4>✅ Ready to Turn In</h4>
          <div className="quest-list">
            {readyQuests.map(quest => (
              <div key={quest.id} className="quest-item quest-ready">
                <div className="quest-header">
                  <span className="quest-title">{quest.title}</span>
                  <span className="quest-progress complete">Complete!</span>
                </div>
                <div className="quest-description">{quest.description}</div>
                <div className="quest-rewards">
                  <strong>Rewards:</strong>
                  {quest.rewards.xp > 0 && <span className="reward-xp">+{quest.rewards.xp} XP</span>}
                  {quest.rewards.copper > 0 && <span className="reward-copper">+{quest.rewards.copper} copper</span>}
                  {quest.rewards.lootTableId && <span className="reward-items">+ Items</span>}
                </div>
                <div className="quest-actions">
                  <button
                    className="quest-button turn-in-button"
                    onClick={() => onTurnInQuest(quest.id)}
                    disabled={!canTurnInMore}
                  >
                    {canTurnInMore ? 'Turn In Quest' : 'Daily Limit Reached'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Quests */}
      {activeQuests.length > 0 && (
        <div className="quest-section quest-active-section">
          <h4>📋 Active Quests</h4>
          <div className="quest-list">
            {activeQuests.map(quest => (
              <div key={quest.id} className="quest-item quest-active">
                <div className="quest-header">
                  <span className="quest-title">{quest.title}</span>
                  <span className="quest-progress">
                    {quest.progress} / {quest.required}
                  </span>
                </div>
                <div className="quest-description">{quest.description}</div>
                <div className="quest-objective">
                  <strong>{quest.type === 'kill' ? 'Kill' : 'Collect'}:</strong> {quest.targetName}
                </div>
                <div className="quest-rewards">
                  <strong>Rewards:</strong>
                  {quest.rewards.xp > 0 && <span className="reward-xp">+{quest.rewards.xp} XP</span>}
                  {quest.rewards.copper > 0 && <span className="reward-copper">+{quest.rewards.copper} copper</span>}
                  {quest.rewards.lootTableId && <span className="reward-items">+ Items</span>}
                </div>
                <div className="quest-actions">
                  <button
                    className="quest-button abandon-button"
                    onClick={() => onAbandonQuest(quest.id)}
                  >
                    Abandon Quest
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Quests */}
      {availableQuests.length > 0 && (
        <div className="quest-section quest-available-section">
          <h4>📜 Available Quests</h4>
          <div className="quest-list">
            {availableQuests.map(quest => (
              <div key={quest.id} className="quest-item quest-available">
                <div className="quest-header">
                  <span className="quest-title">{quest.title}</span>
                </div>
                <div className="quest-description">{quest.description}</div>
                <div className="quest-objective">
                  <strong>{quest.type === 'kill' ? 'Kill' : 'Collect'}:</strong> {quest.targetName} (0 / {quest.required})
                </div>
                <div className="quest-rewards">
                  <strong>Rewards:</strong>
                  {quest.rewards.xp > 0 && <span className="reward-xp">+{quest.rewards.xp} XP</span>}
                  {quest.rewards.copper > 0 && <span className="reward-copper">+{quest.rewards.copper} copper</span>}
                  {quest.rewards.lootTableId && <span className="reward-items">+ Items</span>}
                </div>
                <div className="quest-actions">
                  <button
                    className="quest-button accept-button"
                    onClick={() => onAcceptQuest(quest.id)}
                    disabled={activeQuests.length >= 3}
                  >
                    {activeQuests.length >= 3 ? 'Max Active Quests' : 'Accept Quest'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Quests Available */}
      {quests.length === 0 && (
        <div className="quest-none">
          <p>No quests available at the moment. New quests appear every 5 minutes.</p>
          <p className="quest-hint">Return later for more adventures!</p>
        </div>
      )}
    </div>
  );
}
