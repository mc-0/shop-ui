'use client';

import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';

interface ShoppingListModalProps {
  visible: boolean;
  shoppingList: string;
  onHide: () => void;
}

export default function ShoppingListModal({
  visible,
  shoppingList,
  onHide,
}: ShoppingListModalProps) {
  const toast = useRef<Toast>(null);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shoppingList);
      toast.current?.show({
        severity: 'success',
        summary: 'Copied!',
        detail: 'Shopping list copied to clipboard',
        life: 3000,
      });
    } catch (err) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to copy to clipboard',
        life: 3000,
      });
    }
  };

  const footer = (
    <div>
      <Button label="Close" icon="pi pi-times" onClick={onHide} severity="secondary" />
    </div>
  );

  return (
    <>
      <Dialog
        header="Shopping List"
        visible={visible}
        style={{ width: '600px' }}
        onHide={onHide}
        footer={footer}
        modal
        draggable={false}
        resizable={false}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem',
              padding: '0.75rem',
              background: '#eff6ff',
              borderRadius: '6px',
              color: '#1e40af',
            }}
          >
            <i className="pi pi-info-circle" />
            <span>Click the text area or the copy button below to copy your shopping list</span>
          </div>

          <InputTextarea
            value={shoppingList}
            rows={15}
            readOnly
            onClick={copyToClipboard}
            placeholder="Your shopping list will appear here..."
            style={{ width: '100%', fontFamily: 'monospace' }}
          />

          <div style={{ marginTop: '1rem' }}>
            <Button
              label="Copy to Clipboard"
              icon="pi pi-copy"
              onClick={copyToClipboard}
              severity="info"
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </Dialog>

      <Toast ref={toast} position="top-right" />
    </>
  );
}
