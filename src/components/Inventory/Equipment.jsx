/**
 * Equipment Component
 * Displays equipped items
 */

import ItemCard from './ItemCard';
import './Equipment.css';

export default function Equipment({ equipped = {}, onUnequip }) {
  const slots = {
    primary: 'Weapon',
    chest: 'Chest',
    // Future slots can be added here
    // head: 'Head',
    // legs: 'Legs',
    // hands: 'Hands',
    // feet: 'Feet',
  };

  return (
    <div className="equipment-container">
      <h3 className="equipment-header">Equipment</h3>
      <div className="equipment-slots">
        {Object.entries(slots).map(([slotId, slotName]) => (
          <div key={slotId} className="equipment-slot">
            <div className="slot-label">{slotName}</div>
            <ItemCard
              item={equipped[slotId] || null}
              onDrop={onUnequip}
              showActions={!!equipped[slotId]}
              equipped={true}
              slot={slotId}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
