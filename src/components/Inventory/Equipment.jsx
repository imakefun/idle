/**
 * Equipment Component
 * Displays all equipment slots (EverQuest style)
 */

import ItemCard from './ItemCard';
import './Equipment.css';

export default function Equipment({ equipped = {}, onUnequip }) {
  // Full EverQuest-style equipment slots
  const slots = {
    // Weapons
    primary: 'Primary',
    secondary: 'Secondary',
    range: 'Range',

    // Head gear
    head: 'Head',
    face: 'Face',
    ear_left: 'Ear (L)',
    ear_right: 'Ear (R)',

    // Upper body
    neck: 'Neck',
    shoulders: 'Shoulders',
    arms: 'Arms',
    wrist_left: 'Wrist (L)',
    wrist_right: 'Wrist (R)',
    hands: 'Hands',

    // Rings
    finger_left: 'Ring (L)',
    finger_right: 'Ring (R)',

    // Body
    chest: 'Chest',
    back: 'Back',
    waist: 'Waist',

    // Lower body
    legs: 'Legs',
    feet: 'Feet'
  };

  // Group slots for better layout
  const slotGroups = {
    weapons: ['primary', 'secondary', 'range'],
    head: ['head', 'face', 'ear_left', 'ear_right'],
    upper: ['neck', 'shoulders', 'arms', 'wrist_left', 'wrist_right', 'hands'],
    rings: ['finger_left', 'finger_right'],
    body: ['chest', 'back', 'waist'],
    lower: ['legs', 'feet']
  };

  return (
    <div className="equipment-container">
      <h3 className="equipment-header">Equipment</h3>
      <div className="equipment-groups">
        {Object.entries(slotGroups).map(([groupName, groupSlots]) => (
          <div key={groupName} className={`equipment-group ${groupName}`}>
            <div className="group-label">{groupName.charAt(0).toUpperCase() + groupName.slice(1)}</div>
            <div className="equipment-slots">
              {groupSlots.map(slotId => (
                <div key={slotId} className="equipment-slot">
                  <div className="slot-label">{slots[slotId]}</div>
                  {equipped[slotId] ? (
                    <ItemCard
                      item={equipped[slotId]}
                      onDrop={onUnequip}
                      showActions={true}
                      equipped={true}
                      slot={slotId}
                    />
                  ) : (
                    <div className="empty-slot">
                      <span className="empty-icon">⚫</span>
                      <span className="empty-text">Empty</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
