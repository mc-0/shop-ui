'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from '@mui/material';
import { GROCERY_TYPES } from '../../types';

interface GroceryAddModalProps {
  visible: boolean;
  onHide: () => void;
  onSave: (item: { name: string; type: string }) => void;
}

export default function GroceryAddModal({ visible, onHide, onSave }: GroceryAddModalProps) {
  const [newItem, setNewItem] = useState({ name: '', type: '' });

  const handleSave = () => {
    if (newItem.name.trim() && newItem.type) {
      onSave({
        name: newItem.name.trim(),
        type: newItem.type,
      });
      resetForm();
      onHide();
    }
  };

  const handleCancel = () => {
    resetForm();
    onHide();
  };

  const resetForm = () => {
    setNewItem({ name: '', type: '' });
  };

  const isFormValid = () => {
    return newItem.name.trim().length > 0 && newItem.type.length > 0;
  };

  return (
    <Dialog open={visible} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle>Add Grocery Item</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            placeholder="Enter item name"
            fullWidth
            autoFocus
          />

          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={newItem.type}
              onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
              label="Type"
            >
              {GROCERY_TYPES.map((type) => (
                <MenuItem key={type} value={type.toLowerCase()}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!isFormValid()} color="success" variant="contained">
          Add Item
        </Button>
      </DialogActions>
    </Dialog>
  );
}
