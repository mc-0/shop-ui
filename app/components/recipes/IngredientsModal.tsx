'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import { Recipe } from '../../types';

interface IngredientsModalProps {
  recipe: Recipe;
  visible: boolean;
  onHide: () => void;
}

export default function IngredientsModal({ recipe, visible, onHide }: IngredientsModalProps) {
  return (
    <Dialog open={visible} onClose={onHide} maxWidth="sm" fullWidth>
      <DialogTitle>Ingredients - {recipe?.name || 'Recipe'}</DialogTitle>
      <DialogContent>
        {recipe && recipe.ingredients && recipe.ingredients.length > 0 ? (
          <List sx={{ py: 0 }}>
            {recipe.ingredients.map((ingredient, index) => (
              <ListItem key={index} sx={{ px: 0 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText primary={ingredient} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Box
            sx={{
              textAlign: 'center',
              py: 4,
              color: 'text.secondary',
            }}
          >
            <InfoIcon sx={{ fontSize: '3rem', mb: 2 }} />
            <Typography>No ingredients listed for this recipe</Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onHide} color="secondary" startIcon={<CloseIcon />}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
