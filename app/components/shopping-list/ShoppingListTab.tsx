'use client';

import { useState } from 'react';
import { Button } from 'primereact/button';
import { SelectionItem, STORES } from '../../types';
import { useSelectionStore } from '../../lib/store';
import ShoppingListModal from './ShoppingListModal';

type Store = 'M' | 'BJ' | 'FT' | 'P';

const STORE_NAMES: Record<Store, string> = {
  M: 'Meijer',
  BJ: "BJ's",
  FT: 'Fresh Thyme',
  P: 'Papaya',
};

interface ShoppingListTabProps {
  items: SelectionItem[];
}

export default function ShoppingListTab({ items }: ShoppingListTabProps) {
  const [showShoppingListModal, setShowShoppingListModal] = useState(false);
  const [finalShoppingList, setFinalShoppingList] = useState('');

  const removeItem = useSelectionStore((state) => state.removeItem);
  const setStore = useSelectionStore((state) => state.setStore);
  const clearAll = useSelectionStore((state) => state.clearAll);

  const stores: Store[] = ['M', 'BJ', 'FT', 'P'];

  const selectStore = (item: SelectionItem, store: Store) => {
    setStore(item.name, store);
  };

  const generateShoppingList = () => {
    // Group items by store
    const itemsByStore: Record<string, string[]> = {};
    const noStoreItems: string[] = [];

    items.forEach((item) => {
      if (item.store) {
        const storeName = STORE_NAMES[item.store as Store];
        if (!itemsByStore[storeName]) {
          itemsByStore[storeName] = [];
        }
        itemsByStore[storeName].push(item.name);
      } else {
        noStoreItems.push(item.name);
      }
    });

    // Build the formatted shopping list
    let formattedList = '';

    // Add items grouped by store
    Object.keys(itemsByStore).forEach((storeName) => {
      formattedList += `* ${storeName} *\n`;
      itemsByStore[storeName].forEach((item) => {
        formattedList += `${item}\n`;
      });
      formattedList += '\n';
    });

    // Add items without a store (no header)
    if (noStoreItems.length > 0) {
      noStoreItems.forEach((item) => {
        formattedList += `${item}\n`;
      });
    }

    setFinalShoppingList(formattedList.trim());
    setShowShoppingListModal(true);
  };

  return (
    <div className="tab-content list-tab-content">
      <div className="shopping-list-container">
        <div className="selected-items">
          <div
            className="header-row"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <h2 style={{ margin: 0, color: 'white' }}>Shopping List ({items.length})</h2>
            {items.length > 0 && (
              <Button
                label="Clear All"
                icon="pi pi-trash"
                onClick={clearAll}
                severity="danger"
                size="small"
              />
            )}
          </div>

          {items.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
              Add recipes or groceries to build your list
            </p>
          ) : (
            <>
              <div className="items-list" style={{ marginBottom: '1rem' }}>
                {items.map((item) => (
                  <div
                    key={item.name}
                    className="item-row"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '1rem',
                      marginBottom: '0.5rem',
                      background: '#111827',
                      borderRadius: '8px',
                      border: '1px solid #374151',
                    }}
                  >
                    <div className="item-info">
                      <span className="item-name" style={{ color: 'white', fontWeight: 500 }}>
                        {item.name}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      {stores.map((store) => (
                        <Button
                          key={store}
                          label={store}
                          onClick={() => selectStore(item, store)}
                          size="small"
                          outlined={item.store !== store}
                          severity={item.store === store ? 'info' : 'secondary'}
                          style={{
                            minWidth: '60px',
                            background: item.store === store ? '#f78d60' : undefined,
                            borderColor: item.store === store ? '#f78d60' : undefined,
                          }}
                        />
                      ))}
                      <Button
                        icon="pi pi-times"
                        onClick={() => removeItem(item.name)}
                        severity="danger"
                        size="small"
                        text
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Button
                label="Shop!"
                icon="pi pi-shopping-cart"
                onClick={generateShoppingList}
                severity="success"
                style={{
                  width: '100%',
                  padding: '1rem',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                }}
              />
            </>
          )}
        </div>

        {showShoppingListModal && (
          <ShoppingListModal
            visible={showShoppingListModal}
            shoppingList={finalShoppingList}
            onHide={() => setShowShoppingListModal(false)}
          />
        )}
      </div>
    </div>
  );
}
