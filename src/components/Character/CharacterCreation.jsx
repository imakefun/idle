/**
 * Character Creation Component
 * Race and class selection screen
 */

import { useState } from 'react';
import './CharacterCreation.css';

export default function CharacterCreation({ gameData, onCreateCharacter }) {
  const [selectedRace, setSelectedRace] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [characterName, setCharacterName] = useState('');

  const races = Object.values(gameData.races || {});
  const classes = Object.values(gameData.classes || {});

  const handleCreate = () => {
    if (!characterName.trim()) {
      alert('Please enter a character name');
      return;
    }
    if (!selectedRace) {
      alert('Please select a race');
      return;
    }
    if (!selectedClass) {
      alert('Please select a class');
      return;
    }

    onCreateCharacter({
      name: characterName.trim(),
      race: selectedRace,
      class: selectedClass
    });
  };

  return (
    <div className="character-creation">
      <h2>Create Your Character</h2>
      <p className="subtitle">Choose your path in Norrath</p>

      {/* Character Name */}
      <div className="creation-section">
        <label htmlFor="char-name">Character Name:</label>
        <input
          id="char-name"
          type="text"
          value={characterName}
          onChange={(e) => setCharacterName(e.target.value)}
          placeholder="Enter name..."
          maxLength={20}
          className="name-input"
        />
      </div>

      {/* Race Selection */}
      <div className="creation-section">
        <h3>Select Race</h3>
        <div className="selection-grid">
          {races.map(race => (
            <div
              key={race.id}
              className={`selection-card ${selectedRace?.id === race.id ? 'selected' : ''}`}
              onClick={() => setSelectedRace(race)}
            >
              <h4>{race.name}</h4>
              <p className="description">{race.description}</p>
              <div className="stats-preview">
                <div className="stat-row">
                  <span>STR: {race.stats.STR}</span>
                  <span>STA: {race.stats.STA}</span>
                  <span>AGI: {race.stats.AGI}</span>
                </div>
                <div className="stat-row">
                  <span>DEX: {race.stats.DEX}</span>
                  <span>WIS: {race.stats.WIS}</span>
                  <span>INT: {race.stats.INT}</span>
                </div>
                <div className="stat-row">
                  <span>CHA: {race.stats.CHA}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Class Selection */}
      <div className="creation-section">
        <h3>Select Class</h3>
        <div className="selection-grid">
          {classes.map(cls => (
            <div
              key={cls.id}
              className={`selection-card ${selectedClass?.id === cls.id ? 'selected' : ''}`}
              onClick={() => setSelectedClass(cls)}
            >
              <h4>{cls.name}</h4>
              <p className="description">{cls.description}</p>
              <div className="class-info">
                <p><strong>Primary Stat:</strong> {cls.primaryStat}</p>
                <p><strong>HP Modifier:</strong> {cls.hpModifier}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview & Create Button */}
      {selectedRace && selectedClass && characterName && (
        <div className="creation-preview">
          <h3>Character Preview</h3>
          <p><strong>Name:</strong> {characterName}</p>
          <p><strong>Race:</strong> {selectedRace.name}</p>
          <p><strong>Class:</strong> {selectedClass.name}</p>
          <p><strong>Starting HP:</strong> ~{selectedClass.hpModifier + Math.floor(selectedRace.stats.STA * 0.1)}</p>
        </div>
      )}

      <button
        className="btn btn-primary create-btn"
        onClick={handleCreate}
        disabled={!characterName || !selectedRace || !selectedClass}
      >
        Create Character
      </button>
    </div>
  );
}
