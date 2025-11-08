'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Box,
  InputAdornment,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import { GroceryItem, GROCERY_TYPES } from '../../types';
import GroceryAddModal from './GroceryAddModal';
import GroceryDeleteModal from './GroceryDeleteModal';

interface GroceriesTabProps {
  groceries: GroceryItem[];
  selectedGroceries: GroceryItem[];
  onGrocerySelected: (grocery: GroceryItem) => void;
  onGroceryDeleted: (grocery: GroceryItem) => void;
  onGroceryAdded: (item: { name: string; type: string }) => void;
  onRefresh: () => void;
  loading: boolean;
}

export default function GroceriesTab({
  groceries,
  selectedGroceries,
  onGrocerySelected,
  onGroceryDeleted,
  onGroceryAdded,
  onRefresh,
  loading,
}: GroceriesTabProps) {
  const [filteredGroceries, setFilteredGroceries] = useState<GroceryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [deletingGrocery, setDeletingGrocery] = useState<GroceryItem | null>(null);

  useEffect(() => {
    applyFilters();
  }, [groceries, searchTerm, selectedType]);

  const applyFilters = () => {
    let filtered = [...groceries];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (grocery) =>
          grocery.name.toLowerCase().includes(search) ||
          grocery.type.toLowerCase().includes(search)
      );
    }

    if (selectedType) {
      filtered = filtered.filter((grocery) => grocery.type === selectedType);
    }

    setFilteredGroceries(filtered);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedType('');
  };

  const isGrocerySelected = (grocery: GroceryItem): boolean => {
    return selectedGroceries.some((selected) => selected.id === grocery.id);
  };

  return (
    <div className="tab-content">
      <div className="tab-header">
        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          onClick={() => setShowAddModal(true)}
        >
          Add Item
        </Button>
        <Button variant="contained" color="info" startIcon={<RefreshIcon />} onClick={onRefresh}>
          Refresh
        </Button>
      </div>

      <div className="grocery-table-container">
        {/* Filter Controls */}
        <Box sx={{ mb: 2, display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <TextField
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search groceries..."
            size="small"
            sx={{ flex: '1 1 300px' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <FormControl size="small" sx={{ flex: '0 1 200px' }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              label="Type"
            >
              <MenuItem value="">All Types</MenuItem>
              {GROCERY_TYPES.map((type) => (
                <MenuItem key={type} value={type.toLowerCase()}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            color="secondary"
            size="small"
            startIcon={<FilterAltOffIcon />}
            onClick={clearAllFilters}
          >
            Clear Filters
          </Button>
        </Box>

        {/* Table */}
        <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 200 }}>Name</TableCell>
                <TableCell sx={{ minWidth: 150 }}>Type</TableCell>
                <TableCell sx={{ minWidth: 200 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : filteredGroceries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No groceries found
                  </TableCell>
                </TableRow>
              ) : (
                filteredGroceries.map((grocery) => {
                  const isSelected = isGrocerySelected(grocery);
                  return (
                    <TableRow
                      key={grocery.id}
                      sx={{
                        backgroundColor: isSelected ? 'rgba(139, 92, 246, 0.1)' : 'inherit',
                        '&:hover': {
                          backgroundColor: isSelected
                            ? 'rgba(139, 92, 246, 0.15)'
                            : 'rgba(255, 255, 255, 0.05)',
                        },
                      }}
                    >
                      <TableCell>{grocery.name}</TableCell>
                      <TableCell>{grocery.type}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            startIcon={<AddIcon />}
                            onClick={() => onGrocerySelected(grocery)}
                            disabled={isSelected}
                          >
                            Add
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            startIcon={<DeleteIcon />}
                            onClick={() => setDeletingGrocery(grocery)}
                            disabled={isSelected}
                          >
                            Delete
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Modals */}
      {showAddModal && (
        <GroceryAddModal
          visible={showAddModal}
          onHide={() => setShowAddModal(false)}
          onSave={onGroceryAdded}
        />
      )}

      {deletingGrocery && (
        <GroceryDeleteModal
          grocery={deletingGrocery}
          visible={!!deletingGrocery}
          onHide={() => setDeletingGrocery(null)}
          onConfirm={onGroceryDeleted}
        />
      )}
    </div>
  );
}
