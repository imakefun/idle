/**
 * Inventory Component
 * Displays 10 inventory slots
 */

import ItemCard from './ItemCard';
import './Inventory.css';

export default function Inventory({ inventory = [], onUseItem, onEquipItem, onDropItem, gameData = null }) {
  const MAX_SLOTS = 10;

  // Pad inventory to always show 10 slots
  const inventorySlots = [...inventory];
  while (inventorySlots.length < MAX_SLOTS) {
    inventorySlots.push(null);
  }

  return (
    <div className="inventory-container">
      <h3 className="inventory-header">
        Inventory ({inventory.length}/{MAX_SLOTS})
      </h3>
      <div className="inventory-grid">
        {inventorySlots.map((item, index) => (
          <ItemCard
            key={index}
            item={item}
            onUse={onUseItem}
            onEquip={onEquipItem}
            onDrop={onDropItem}
            slot="inventory"
            gameData={gameData}
          />
        ))}
      </div>
    </div>
  );
}
