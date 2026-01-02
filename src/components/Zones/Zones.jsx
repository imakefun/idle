import React from 'react';
import './Zones.css';

export default function Zones({ gameData, currentZone, characterLevel, onZoneChange }) {
  if (!gameData || !gameData.zones) {
    return <div className="zones-container">Loading zones...</div>;
  }

  const zones = Object.values(gameData.zones);
  const current = gameData.zones[currentZone];

  return (
    <div className="zones-container">
      <div className="current-zone-info">
        <h2>Current Location</h2>
        <div className="zone-card current">
          <div className="zone-header">
            <h3>{current?.name || 'Unknown'}</h3>
            <span className={`zone-badge ${current?.isSafe ? 'safe' : 'hostile'}`}>
              {current?.isSafe ? '🛡️ Safe' : '⚔️ Hostile'}
            </span>
          </div>
          <p className="zone-description">{current?.description}</p>
          <p className="zone-level">
            Level Range: {current?.minLevel} - {current?.maxLevel}
          </p>
        </div>
      </div>

      <div className="available-zones">
        <h2>Travel To</h2>
        <div className="zones-grid">
          {zones.map(zone => {
            const isCurrent = zone.id === currentZone;
            const isRecommended = characterLevel >= zone.minLevel && characterLevel <= zone.maxLevel;
            const isTooHigh = characterLevel < zone.minLevel;
            const isTooLow = characterLevel > zone.maxLevel + 3;

            return (
              <div
                key={zone.id}
                className={`zone-card ${isCurrent ? 'current' : ''} ${isRecommended ? 'recommended' : ''}`}
              >
                <div className="zone-header">
                  <h3>{zone.name}</h3>
                  <span className={`zone-badge ${zone.isSafe ? 'safe' : 'hostile'}`}>
                    {zone.isSafe ? '🛡️ Safe' : '⚔️ Hostile'}
                  </span>
                </div>

                <p className="zone-description">{zone.description}</p>

                <div className="zone-info">
                  <p className="zone-level">
                    Level {zone.minLevel}-{zone.maxLevel}
                    {isTooHigh && <span className="level-warning"> (Too Dangerous)</span>}
                    {isTooLow && <span className="level-warning"> (Trivial)</span>}
                    {isRecommended && <span className="level-recommended"> (Recommended)</span>}
                  </p>
                </div>

                {!isCurrent && (
                  <button
                    className="travel-button"
                    onClick={() => onZoneChange(zone.id)}
                  >
                    Travel Here
                  </button>
                )}
                {isCurrent && (
                  <div className="current-location-indicator">
                    📍 You are here
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
