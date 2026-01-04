/**
 * ItemCard Component
 * Displays an item with tooltip and actions
 */

import { useState } from 'react';
import './ItemCard.css';

export default function ItemCard({ item, onUse, onEquip, onDrop, showActions = true, equipped = false, slot = 'inventory', gameData = null }) {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!item) {
    // Empty slot
    return (
      <div className="item-card empty">
        <div className="item-icon">-</div>
      </div>
    );
  }

  // Get fresh item value from gameData if available
  let itemValue = item.value || 0;
  if (gameData && gameData.items && item.id) {
    const freshItem = gameData.items[item.id];
    if (freshItem && freshItem.value !== undefined) {
      itemValue = freshItem.value;
    }
  }

  const canUse = item.type === 'consumable';
  const canEquip = (item.type === 'weapon' || item.type === 'armor') && !equipped;

  return (
    <div
      className={`item-card ${equipped ? 'equipped' : ''} ${item.type}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="item-icon">
        {item.icon || getItemIcon(item.type)}
      </div>
      {item.stackable && item.quantity > 1 && (
        <div className="item-quantity">{item.quantity}</div>
      )}

      {/* Tooltip */}
      {showTooltip && (
        <div className="item-tooltip">
          <div className="tooltip-header">
            <span className={`item-name ${getRarityClass(item)}`}>{item.name}</span>
            <span className="item-type">{item.type}</span>
          </div>

          {/* Item Stats */}
          {item.stats && (
            <div className="tooltip-stats">
              {item.stats.damage > 0 && (
                <div className="stat-line">Damage: {item.stats.damage}</div>
              )}
              {item.stats.delay > 0 && (
                <div className="stat-line">Delay: {item.stats.delay}</div>
              )}
              {item.stats.ac > 0 && (
                <div className="stat-line">AC: {item.stats.ac}</div>
              )}
            </div>
          )}

          {/* Consumable Info */}
          {item.consumable && (item.consumable.foodValue > 0 || item.consumable.waterValue > 0) && (
            <div className="tooltip-consumable">
              {item.consumable.foodValue > 0 && (
                <div className="stat-line">Food: +{item.consumable.foodValue}%</div>
              )}
              {item.consumable.waterValue > 0 && (
                <div className="stat-line">Water: +{item.consumable.waterValue}%</div>
              )}
            </div>
          )}

          {/* Value */}
          {itemValue > 0 && (
            <div className="tooltip-value">Value: {itemValue} copper</div>
          )}

          {/* Slot */}
          {item.slot && item.slot !== 'none' && (
            <div className="tooltip-slot">Slot: {item.slot}</div>
          )}

          {/* Actions */}
          {showActions && (
            <div className="tooltip-actions">
              {canUse && onUse && (
                <button className="action-btn" onClick={() => onUse(item)}>Use</button>
              )}
              {canEquip && onEquip && (
                <button className="action-btn" onClick={() => onEquip(item)}>Equip</button>
              )}
              {onDrop && (
                <button className="action-btn danger" onClick={() => onDrop(item)}>Drop</button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function getItemIcon(type) {
  const icons = {
    weapon: '⚔️',
    armor: '🛡️',
    consumable: '🍖',
    junk: '📦',
    tradeskill: '🔧',
    container: '🎒'
  };
  return icons[type] || '❓';
}

function getRarityClass(item) {
  // Future: could add rarity to items
  return 'common';
}
