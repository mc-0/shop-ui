'use client';

import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { GroceryItem } from '../../types';

interface GroceryDeleteModalProps {
  grocery: GroceryItem;
  visible: boolean;
  onHide: () => void;
  onConfirm: (grocery: GroceryItem) => void;
}

export default function GroceryDeleteModal({
  grocery,
  visible,
  onHide,
  onConfirm,
}: GroceryDeleteModalProps) {
  const handleConfirm = () => {
    onConfirm(grocery);
    onHide();
  };

  const footer = (
    <div>
      <Button label="Cancel" onClick={onHide} severity="secondary" />
      <Button label="Delete" onClick={handleConfirm} severity="danger" />
    </div>
  );

  return (
    <Dialog
      header="Confirm Delete"
      visible={visible}
      style={{ width: '400px' }}
      onHide={onHide}
      footer={footer}
      modal
      draggable={false}
      resizable={false}
    >
      <div>
        <p>
          Are you sure you want to delete <strong>{grocery?.name}</strong>?
        </p>
        <p style={{ color: '#ef4444' }}>This action cannot be undone.</p>
      </div>
    </Dialog>
  );
}
