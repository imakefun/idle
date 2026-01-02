/**
 * Skills Component
 * Displays all character skills with progress bars
 */

import './Skills.css';
import { SKILL_DEFINITIONS } from '../../data/skills';

export default function Skills({ skills = {}, skillDefinitions = SKILL_DEFINITIONS }) {
  // Group skills by category
  const groupedSkills = {
    combat: [],
    weapon: [],
    ability: []
  };

  Object.entries(skills).forEach(([skillId, skillData]) => {
    const definition = skillDefinitions[skillId];
    if (definition) {
      groupedSkills[definition.category].push({
        id: skillId,
        name: definition.name,
        description: definition.description,
        current: skillData.current,
        max: skillData.max,
        type: definition.type
      });
    }
  });

  // Sort skills by name within each category
  Object.keys(groupedSkills).forEach(category => {
    groupedSkills[category].sort((a, b) => a.name.localeCompare(b.name));
  });

  const renderSkill = (skill) => {
    const percentage = (skill.current / skill.max) * 100;
    const isActive = skill.type === 'active';

    return (
      <div key={skill.id} className="skill-item">
        <div className="skill-header">
          <span className="skill-name">
            {skill.name}
            {isActive && <span className="active-badge">Active</span>}
          </span>
          <span className="skill-value">{skill.current}/{skill.max}</span>
        </div>
        <div className="skill-bar-container">
          <div
            className="skill-bar-fill"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="skill-description">{skill.description}</div>
      </div>
    );
  };

  return (
    <div className="skills-container">
      <h3 className="skills-header">Skills</h3>

      {groupedSkills.combat.length > 0 && (
        <div className="skill-category">
          <h4 className="category-header">Combat Skills</h4>
          <div className="skills-list">
            {groupedSkills.combat.map(renderSkill)}
          </div>
        </div>
      )}

      {groupedSkills.weapon.length > 0 && (
        <div className="skill-category">
          <h4 className="category-header">Weapon Skills</h4>
          <div className="skills-list">
            {groupedSkills.weapon.map(renderSkill)}
          </div>
        </div>
      )}

      {groupedSkills.ability.length > 0 && (
        <div className="skill-category">
          <h4 className="category-header">Active Abilities</h4>
          <div className="skills-list">
            {groupedSkills.ability.map(renderSkill)}
          </div>
        </div>
      )}

      {Object.keys(skills).length === 0 && (
        <p className="no-skills">No skills learned yet.</p>
      )}
    </div>
  );
}
