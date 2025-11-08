'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
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

  return (
    <Dialog open={visible} onClose={onHide} maxWidth="xs" fullWidth>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete <strong>{grocery?.name}</strong>?
        </Typography>
        <Typography sx={{ color: 'error.main', mt: 1 }}>This action cannot be undone.</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onHide} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
