'use client';

import { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { GROCERY_TYPES } from '../../types';

interface GroceryAddModalProps {
  visible: boolean;
  onHide: () => void;
  onSave: (item: { name: string; type: string }) => void;
}

export default function GroceryAddModal({ visible, onHide, onSave }: GroceryAddModalProps) {
  const [newItem, setNewItem] = useState({ name: '', type: '' });

  const typeOptions = GROCERY_TYPES.map((type) => ({
    label: type,
    value: type.toLowerCase(),
  }));

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

  const footer = (
    <div>
      <Button label="Cancel" onClick={handleCancel} severity="secondary" />
      <Button
        label="Add Item"
        onClick={handleSave}
        disabled={!isFormValid()}
        severity="success"
      />
    </div>
  );

  return (
    <Dialog
      header="Add Grocery Item"
      visible={visible}
      style={{ width: '500px' }}
      onHide={handleCancel}
      footer={footer}
      modal
      draggable={false}
      resizable={false}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label htmlFor="itemName" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Name
          </label>
          <InputText
            id="itemName"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            placeholder="Enter item name"
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label htmlFor="itemType" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Type
          </label>
          <Dropdown
            id="itemType"
            value={newItem.type}
            options={typeOptions}
            onChange={(e) => setNewItem({ ...newItem, type: e.value })}
            placeholder="Select type"
            style={{ width: '100%' }}
          />
        </div>
      </div>
    </Dialog>
  );
}
