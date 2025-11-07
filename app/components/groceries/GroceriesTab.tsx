'use client';

import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
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

  const typeOptions = GROCERY_TYPES.map((type) => ({
    label: type,
    value: type.toLowerCase(),
  }));

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

  const actionsBodyTemplate = (grocery: GroceryItem) => {
    const isSelected = isGrocerySelected(grocery);
    return (
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button
          label="Add"
          icon="pi pi-plus"
          onClick={() => onGrocerySelected(grocery)}
          severity="success"
          size="small"
          disabled={isSelected}
        />
        <Button
          label="Delete"
          icon="pi pi-trash"
          onClick={() => setDeletingGrocery(grocery)}
          severity="danger"
          size="small"
          disabled={isSelected}
        />
      </div>
    );
  };

  const rowClassName = (grocery: GroceryItem) => {
    return isGrocerySelected(grocery) ? 'selected-grocery' : '';
  };

  return (
    <div className="tab-content">
      <div className="tab-header">
        <Button
          label="Add Item"
          icon="pi pi-plus"
          onClick={() => setShowAddModal(true)}
          className="btn-success"
        />
        <Button label="Refresh" icon="pi pi-refresh" onClick={onRefresh} severity="info" />
      </div>

      <div className="grocery-table-container">
        {/* Filter Controls */}
        <div className="filter-controls" style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div className="search-control" style={{ position: 'relative', flex: '1 1 300px' }}>
              <InputText
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search groceries..."
                style={{ width: '100%' }}
              />
              <i
                className="pi pi-search"
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6b7280',
                }}
              />
            </div>

            <Dropdown
              value={selectedType}
              options={typeOptions}
              onChange={(e) => setSelectedType(e.value)}
              placeholder="All Types"
              showClear
              style={{ flex: '0 1 200px' }}
            />

            <Button
              label="Clear Filters"
              icon="pi pi-filter-slash"
              onClick={clearAllFilters}
              severity="secondary"
              size="small"
            />
          </div>
        </div>

        {/* Table */}
        <DataTable
          value={filteredGroceries}
          scrollable
          scrollHeight="400px"
          loading={loading}
          rowClassName={rowClassName}
        >
          <Column field="name" header="Name" style={{ minWidth: '200px' }} />
          <Column field="type" header="Type" style={{ minWidth: '150px' }} />
          <Column
            header="Actions"
            body={actionsBodyTemplate}
            style={{ minWidth: '200px' }}
          />
        </DataTable>
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
