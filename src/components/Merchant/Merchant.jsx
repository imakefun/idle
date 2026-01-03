import React, { useState } from 'react';
import { getMerchantsInZone, calculateSellPrice, calculateBuyPrice, formatCurrency } from '../../systems/MerchantSystem';
import './Merchant.css';

export default function Merchant({ gameData, currentZone, playerCurrency, playerInventory, onSellItem, onBuyItem }) {
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [activeTab, setActiveTab] = useState('buy'); // 'buy' or 'sell'
  const [message, setMessage] = useState('');

  const merchants = getMerchantsInZone(currentZone, gameData?.merchants || {});

  if (merchants.length === 0) {
    return null; // No merchants in this zone
  }

  // Default to first merchant if none selected
  const merchant = selectedMerchant || merchants[0];

  // Get merchant inventory
  const merchantInventory = gameData?.merchantInventory?.[merchant.id] || [];

  const handleSellItem = (slotIndex) => {
    const item = playerInventory[slotIndex];
    if (!item) {
      setMessage('No item in that slot.');
      return;
    }

    const result = onSellItem(slotIndex, 1, merchant);
    setMessage(result.message);

    // Clear message after 3 seconds
    setTimeout(() => setMessage(''), 3000);
  };

  const handleBuyItem = (inventoryItem, quantity = 1) => {
    const result = onBuyItem(inventoryItem.item, quantity, merchant);
    setMessage(result.message);

    // Clear message after 3 seconds
    setTimeout(() => setMessage(''), 3000);
  };

  const handleSellAll = (slotIndex) => {
    const item = playerInventory[slotIndex];
    if (!item) {
      setMessage('No item in that slot.');
      return;
    }

    const quantity = item.quantity || 1;
    const result = onSellItem(slotIndex, quantity, merchant);
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

      {/* Tab Selection */}
      <div className="merchant-tabs">
        <button
          className={`merchant-tab ${activeTab === 'buy' ? 'active' : ''}`}
          onClick={() => setActiveTab('buy')}
        >
          Buy from Merchant
        </button>
        <button
          className={`merchant-tab ${activeTab === 'sell' ? 'active' : ''}`}
          onClick={() => setActiveTab('sell')}
        >
          Sell to Merchant
        </button>
      </div>

      {/* Buy Interface */}
      {activeTab === 'buy' && (
        <div className="merchant-buy-section">
          <h4>Merchant Inventory</h4>
          <div className="merchant-buy-grid">
            {merchantInventory.map((inventoryItem, index) => {
              const buyPrice = calculateBuyPrice(inventoryItem.item, merchant);
              const canAfford = playerCurrency >= buyPrice;
              const inStock = inventoryItem.stock === -1 || inventoryItem.stock > 0;

              const isStackable = inventoryItem.item.stackable;
              const maxStack = inventoryItem.item.maxStack || 20;
              const buyPrice5 = buyPrice * 5;
              const buyPrice20 = buyPrice * 20;
              const canAfford5 = playerCurrency >= buyPrice5;
              const canAfford20 = playerCurrency >= buyPrice20;
              const hasStock5 = inventoryItem.stock === -1 || inventoryItem.stock >= 5;
              const hasStock20 = inventoryItem.stock === -1 || inventoryItem.stock >= 20;

              return (
                <div key={index} className="merchant-buy-item">
                  <div className="item-info">
                    <span className="item-icon">{inventoryItem.item.icon || '📦'}</span>
                    <div className="item-details">
                      <div className="item-name">{inventoryItem.item.name}</div>
                      <div className="item-buy-price">
                        Price: {buyPrice}cp
                      </div>
                      {inventoryItem.stock !== -1 && (
                        <div className="item-stock">
                          Stock: {inventoryItem.stock}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="buy-buttons">
                    <button
                      className="buy-button"
                      onClick={() => handleBuyItem(inventoryItem, 1)}
                      disabled={!canAfford || !inStock}
                    >
                      Buy 1
                    </button>
                    {isStackable && maxStack >= 5 && (
                      <button
                        className="buy-button"
                        onClick={() => handleBuyItem(inventoryItem, 5)}
                        disabled={!canAfford5 || !hasStock5}
                      >
                        Buy 5
                      </button>
                    )}
                    {isStackable && maxStack >= 20 && (
                      <button
                        className="buy-button"
                        onClick={() => handleBuyItem(inventoryItem, 20)}
                        disabled={!canAfford20 || !hasStock20}
                      >
                        Buy 20
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {merchantInventory.length === 0 && (
            <p className="no-items">This merchant has no items for sale.</p>
          )}
        </div>
      )}

      {/* Sell Interface */}
      {activeTab === 'sell' && (
        <div className="merchant-sell-section">
          <h4>Your Inventory</h4>
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
                  <div className="sell-buttons">
                    <button
                      className="sell-button"
                      onClick={() => handleSellItem(index)}
                      disabled={sellPrice === 0}
                    >
                      Sell 1
                    </button>
                    {quantity > 1 && (
                      <button
                        className="sell-button sell-all-button"
                        onClick={() => handleSellAll(index)}
                        disabled={sellPrice === 0}
                      >
                        Sell All ({quantity})
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {playerInventory.every(item => !item) && (
            <p className="no-items">Your inventory is empty.</p>
          )}
        </div>
      )}
    </div>
  );
}
