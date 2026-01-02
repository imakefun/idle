import React, { useState } from 'react';
import './Zones.css';

export default function Zones({ gameData, currentZone, currentCamp, characterLevel, onZoneChange, onCampChange }) {
  const [expandedZone, setExpandedZone] = useState(currentZone);

  if (!gameData || !gameData.zones) {
    return <div className="zones-container">Loading zones...</div>;
  }

  const zones = Object.values(gameData.zones);
  const camps = gameData.camps || {};
  const current = gameData.zones[currentZone];

  // Get camps for a specific zone
  const getCampsForZone = (zoneId) => {
    return Object.values(camps).filter(camp => camp.zoneId === zoneId);
  };

  const currentCampData = currentCamp ? camps[currentCamp] : null;

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

          {currentCampData && (
            <div className="current-camp-display">
              <p className="camp-label">📍 Current Camp:</p>
              <p className="camp-name">{currentCampData.name}</p>
              <p className="camp-description">{currentCampData.description}</p>
              <p className="camp-level">Level {currentCampData.minLevel}-{currentCampData.maxLevel}</p>
            </div>
          )}
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
            const isExpanded = expandedZone === zone.id;
            const zoneCamps = getCampsForZone(zone.id);

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

                {zoneCamps.length > 0 && (
                  <div className="camps-section">
                    <button
                      className="camps-toggle"
                      onClick={() => setExpandedZone(isExpanded ? null : zone.id)}
                    >
                      {isExpanded ? '▼' : '▶'} {zoneCamps.length} Camp{zoneCamps.length !== 1 ? 's' : ''}
                    </button>

                    {isExpanded && (
                      <div className="camps-list">
                        {zoneCamps.map(camp => {
                          const isCampCurrent = isCurrent && currentCamp === camp.id;
                          const isCampRecommended = characterLevel >= camp.minLevel && characterLevel <= camp.maxLevel;
                          const isCampTooHigh = characterLevel < camp.minLevel;
                          const isCampTooLow = characterLevel > camp.maxLevel + 2;

                          return (
                            <div
                              key={camp.id}
                              className={`camp-card ${isCampCurrent ? 'current' : ''} ${isCampRecommended ? 'recommended' : ''}`}
                            >
                              <div className="camp-header">
                                <h4>{camp.name}</h4>
                                <span className="camp-level-badge">
                                  {camp.minLevel}-{camp.maxLevel}
                                  {isCampTooHigh && ' ⚠️'}
                                  {isCampRecommended && ' ✓'}
                                </span>
                              </div>
                              <p className="camp-description">{camp.description}</p>

                              {!isCampCurrent ? (
                                <button
                                  className="camp-travel-button"
                                  onClick={() => onCampChange(zone.id, camp.id)}
                                >
                                  Travel Here
                                </button>
                              ) : (
                                <div className="current-location-indicator small">
                                  📍 You are here
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {!isCurrent && zoneCamps.length === 0 && (
                  <button
                    className="travel-button"
                    onClick={() => onZoneChange(zone.id)}
                  >
                    Travel Here
                  </button>
                )}
                {isCurrent && zoneCamps.length === 0 && (
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
