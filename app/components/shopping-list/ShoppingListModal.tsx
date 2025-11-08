'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  Box,
  Snackbar,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';

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
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shoppingList);
      setSnackbar({
        open: true,
        message: 'Shopping list copied to clipboard',
        severity: 'success',
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to copy to clipboard',
        severity: 'error',
      });
    }
  };

  return (
    <>
      <Dialog open={visible} onClose={onHide} maxWidth="sm" fullWidth>
        <DialogTitle>Shopping List</DialogTitle>
        <DialogContent>
          <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 2 }}>
            Click the text area or the copy button below to copy your shopping list
          </Alert>

          <TextField
            value={shoppingList}
            multiline
            rows={15}
            fullWidth
            onClick={copyToClipboard}
            placeholder="Your shopping list will appear here..."
            InputProps={{
              readOnly: true,
              sx: { fontFamily: 'monospace' },
            }}
          />

          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="info"
              startIcon={<ContentCopyIcon />}
              onClick={copyToClipboard}
              fullWidth
            >
              Copy to Clipboard
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onHide} color="secondary" startIcon={<CloseIcon />}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
