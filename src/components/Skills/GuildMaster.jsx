/**
 * Guild Master Component
 * NPC for training new skills
 */

import './GuildMaster.css';
import { TRAINABLE_SKILLS } from '../../data/skills';
import { formatCurrency } from '../../utils/calculations';

export default function GuildMaster({
  playerClass,
  playerLevel,
  playerCurrency,
  playerSkills = {},
  onTrainSkill
}) {
  const availableSkills = TRAINABLE_SKILLS[playerClass] || [];

  // Filter skills that can be trained
  const trainableSkills = availableSkills.filter(skill => {
    // Check if already known
    if (playerSkills[skill.skillId]) {
      return false;
    }
    // Check level requirement
    if (playerLevel < skill.level) {
      return false;
    }
    return true;
  });

  const cannotTrainYet = availableSkills.filter(skill => {
    return !playerSkills[skill.skillId] && playerLevel < skill.level;
  });

  const handleTrain = (skill) => {
    if (playerCurrency < skill.cost) {
      alert(`You need ${formatCurrency(skill.cost)} to train this skill. You have ${formatCurrency(playerCurrency)}.`);
      return;
    }

    if (window.confirm(`Train ${skill.skillId} for ${formatCurrency(skill.cost)}?`)) {
      onTrainSkill(skill);
    }
  };

  return (
    <div className="guild-master-container">
      <h3 className="guild-master-header">Guild Master</h3>
      <p className="guild-master-intro">
        "Greetings, {playerClass}. I can teach you new skills for a price."
      </p>

      {trainableSkills.length > 0 && (
        <div className="trainable-section">
          <h4 className="section-header">Available Skills</h4>
          <div className="skills-grid">
            {trainableSkills.map(skill => (
              <div key={skill.skillId} className="train-skill-card">
                <div className="train-skill-header">
                  <span className="train-skill-name">{skill.skillId}</span>
                  <span className="train-skill-cost">{formatCurrency(skill.cost)}</span>
                </div>
                <div className="train-skill-info">
                  <span className="train-skill-level">Required Level: {skill.level}</span>
                </div>
                <button
                  className="train-button"
                  onClick={() => handleTrain(skill)}
                  disabled={playerCurrency < skill.cost}
                >
                  {playerCurrency >= skill.cost ? 'Train' : 'Insufficient Funds'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {cannotTrainYet.length > 0 && (
        <div className="locked-section">
          <h4 className="section-header">Locked Skills</h4>
          <div className="skills-grid">
            {cannotTrainYet.map(skill => (
              <div key={skill.skillId} className="train-skill-card locked">
                <div className="train-skill-header">
                  <span className="train-skill-name">{skill.skillId}</span>
                  <span className="train-skill-cost">{formatCurrency(skill.cost)}</span>
                </div>
                <div className="train-skill-info">
                  <span className="train-skill-level">Required Level: {skill.level}</span>
                </div>
                <button className="train-button" disabled>
                  Requires Level {skill.level}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {trainableSkills.length === 0 && cannotTrainYet.length === 0 && (
        <p className="no-skills">
          "You have learned all the skills I can teach you."
        </p>
      )}

      <div className="guild-master-footer">
        <p>Your Coin: {formatCurrency(playerCurrency)}</p>
      </div>
    </div>
  );
}
