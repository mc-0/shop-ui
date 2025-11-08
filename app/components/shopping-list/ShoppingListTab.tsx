'use client';

import { useState } from 'react';
import { Button, Typography, Box, Paper, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';
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
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h5" component="h2" sx={{ color: 'white', m: 0 }}>
              Shopping List ({items.length})
            </Typography>
            {items.length > 0 && (
              <Button
                variant="contained"
                color="error"
                size="small"
                startIcon={<DeleteIcon />}
                onClick={clearAll}
              >
                Clear All
              </Button>
            )}
          </Box>

          {items.length === 0 ? (
            <Typography
              sx={{ textAlign: 'center', color: 'text.secondary', py: 4 }}
            >
              Add recipes or groceries to build your list
            </Typography>
          ) : (
            <>
              <Box sx={{ mb: 2 }}>
                {items.map((item) => (
                  <Paper
                    key={item.name}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 2,
                      mb: 1,
                      background: '#111827',
                      border: '1px solid #374151',
                    }}
                  >
                    <Typography sx={{ color: 'white', fontWeight: 500 }}>
                      {item.name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      {stores.map((store) => (
                        <Button
                          key={store}
                          onClick={() => selectStore(item, store)}
                          size="small"
                          variant={item.store === store ? 'contained' : 'outlined'}
                          color={item.store === store ? 'info' : 'secondary'}
                          sx={{
                            minWidth: '60px',
                            ...(item.store === store && {
                              bgcolor: '#f78d60',
                              borderColor: '#f78d60',
                              '&:hover': {
                                bgcolor: '#e67850',
                              },
                            }),
                          }}
                        >
                          {store}
                        </Button>
                      ))}
                      <IconButton
                        onClick={() => removeItem(item.name)}
                        color="error"
                        size="small"
                      >
                        <CloseIcon />
                      </IconButton>
                    </Box>
                  </Paper>
                ))}
              </Box>
              <Button
                variant="contained"
                color="success"
                startIcon={<ShoppingCartIcon />}
                onClick={generateShoppingList}
                fullWidth
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                }}
              >
                Shop!
              </Button>
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
