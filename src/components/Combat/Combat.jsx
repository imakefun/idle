import React, { useRef, useEffect } from 'react';
import './Combat.css';

export default function Combat({
  gameData,
  currentZone,
  currentCamp,
  characterLevel,
  target,
  isResting,
  food,
  water,
  onAttack,
  onClearTarget,
  onToggleRest,
  combatLog
}) {
  const combatLogRef = useRef(null);

  // Auto-scroll to bottom when new log entries are added
  useEffect(() => {
    if (combatLogRef.current) {
      combatLogRef.current.scrollTop = combatLogRef.current.scrollHeight;
    }
  }, [combatLog]);

  if (!gameData || !gameData.zones) {
    return null;
  }

  const zone = gameData.zones[currentZone];
  const isSafeZone = zone?.isSafe;

  // Get available monsters for current location
  const getAvailableMonsters = () => {
    if (!gameData.monsters) return [];

    // For now, return all monsters
    // TODO: Filter by zone/camp when monster spawns are implemented
    return Object.values(gameData.monsters);
  };

  const availableMonsters = getAvailableMonsters();
  const canAttack = !isSafeZone && availableMonsters.length > 0;

  // Calculate con color based on level difference
  const getConColor = (monsterLevel) => {
    const diff = characterLevel - monsterLevel;
    if (diff >= 5) return 'green'; // Trivial
    if (diff >= 3) return 'lightblue'; // Easy
    if (diff >= -2) return 'white'; // Fair match
    if (diff >= -4) return 'yellow'; // Tough
    return 'red'; // Very dangerous
  };

  return (
    <div className="combat-container">
      <div className="combat-header">
        <h2>⚔️ Combat</h2>
        {isSafeZone && (
          <span className="safe-zone-indicator">🛡️ Safe Zone - No Combat</span>
        )}
      </div>

      {/* Current Target */}
      {target && (
        <div className="current-target">
          <div className="target-header">
            <h3>Current Target</h3>
            <button className="clear-target-btn" onClick={onClearTarget}>
              ✕ Clear
            </button>
          </div>
          <div className="target-info">
            <p className="target-name" style={{ color: getConColor(target.level) }}>
              {target.name}
            </p>
            <p className="target-stats">Level {target.level}</p>
            <div className="target-health">
              <span>HP: {Math.floor(target.currentHp)}/{Math.floor(target.maxHp)}</span>
              <div className="hp-bar">
                <div
                  className="hp-bar-fill"
                  style={{ width: `${(Math.floor(target.currentHp) / Math.floor(target.maxHp)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Attack and Rest Buttons */}
      <div className="combat-actions">
        <div className="action-buttons">
          <button
            className="attack-button"
            onClick={onAttack}
            disabled={!canAttack}
            title={
              isSafeZone
                ? 'Cannot attack in safe zones'
                : !availableMonsters.length
                  ? 'No monsters available'
                  : 'Attack a random monster'
            }
          >
            {target ? '⚔️ Continue Attack' : '⚔️ Attack'}
          </button>
          <button
            className={`rest-button ${isResting ? 'active' : ''}`}
            onClick={onToggleRest}
            disabled={target !== null}
            title={
              target
                ? 'Cannot rest while in combat'
                : food > 30 && water > 30
                  ? 'Rest for faster HP regeneration (3x)'
                  : 'Need food and water > 30% to rest effectively'
            }
          >
            {isResting ? '😴 Resting...' : '🛌 Rest'}
          </button>
        </div>
        {!canAttack && !isSafeZone && (
          <p className="combat-hint">Travel to a hostile zone to engage in combat</p>
        )}
        {isResting && (food <= 30 || water <= 30) && (
          <p className="combat-hint rest-warning">⚠️ Low food/water reduces rest effectiveness</p>
        )}
      </div>

      {/* Combat Log */}
      <div className="combat-log-container">
        <h3>Combat Log</h3>
        <div className="combat-log" ref={combatLogRef}>
          {combatLog.length === 0 ? (
            <p className="log-empty">No recent combat activity</p>
          ) : (
            combatLog.map((log, index) => (
              <div
                key={index}
                className={`log-entry ${log.type}`}
                style={{ color: log.color }}
              >
                {log.message}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
