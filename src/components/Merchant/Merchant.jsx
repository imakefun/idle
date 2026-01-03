import React, { useState } from 'react';
import { getMerchantsInZone, sellItemToMerchant, calculateSellPrice, formatCurrency } from '../../systems/MerchantSystem';
import './Merchant.css';

export default function Merchant({ gameData, currentZone, playerCurrency, playerInventory, onSellItem }) {
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [message, setMessage] = useState('');

  const merchants = getMerchantsInZone(currentZone, gameData?.merchants || {});

  if (merchants.length === 0) {
    return null; // No merchants in this zone
  }

  // Default to first merchant if none selected
  const merchant = selectedMerchant || merchants[0];

  const handleSellItem = (slotIndex) => {
    const item = playerInventory[slotIndex];
    if (!item) {
      setMessage('No item in that slot.');
      return;
    }

    // Sell 1 item at a time for now (could be extended to quantity selector)
    const result = onSellItem(slotIndex, 1, merchant);

    setMessage(result.message);

    // Clear message after 3 seconds
    setTimeout(() => setMessage(''), 3000);
  };

  const currencyDisplay = formatCurrency(playerCurrency);

  return (
    <div className="merchant-container">
      <h3>🛒 Merchants</h3>

      {/* Merchant Selection */}
      {merchants.length > 1 && (
        <div className="merchant-selector">
          <label>Select Merchant: </label>
          <select
            value={merchant.id}
            onChange={(e) => setSelectedMerchant(merchants.find(m => m.id === e.target.value))}
          >
            {merchants.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Merchant Info */}
      <div className="merchant-info">
        <h4>{merchant.name}</h4>
        <p className="merchant-description">{merchant.description}</p>
        <p className="merchant-rates">
          Buys at {merchant.buyRate}% | Sells at {merchant.sellRate}%
        </p>
      </div>

      {/* Player Currency */}
      <div className="merchant-currency">
        <strong>Your Money:</strong> {currencyDisplay.display}
      </div>

      {/* Message Display */}
      {message && (
        <div className="merchant-message">
          {message}
        </div>
      )}

      {/* Sell Interface */}
      <div className="merchant-sell-section">
        <h4>Sell Items</h4>
        <div className="merchant-sell-grid">
          {playerInventory.map((item, index) => {
            if (!item) return null;

            const sellPrice = calculateSellPrice(item, merchant);
            const quantity = item.quantity || 1;

            return (
              <div key={index} className="merchant-sell-item">
                <div className="item-info">
                  <span className="item-icon">{item.icon || '📦'}</span>
                  <div className="item-details">
                    <div className="item-name">{item.name}</div>
                    {quantity > 1 && <div className="item-quantity">x{quantity}</div>}
                    <div className="item-sell-price">
                      Sells for: {sellPrice}cp each
                    </div>
                  </div>
                </div>
                <button
                  className="sell-button"
                  onClick={() => handleSellItem(index)}
                  disabled={sellPrice === 0}
                >
                  Sell 1
                </button>
              </div>
            );
          })}
        </div>
        {playerInventory.every(item => !item) && (
          <p className="no-items">Your inventory is empty.</p>
        )}
      </div>
    </div>
  );
}
