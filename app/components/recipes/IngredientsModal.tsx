'use client';

import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Recipe } from '../../types';

interface IngredientsModalProps {
  recipe: Recipe;
  visible: boolean;
  onHide: () => void;
}

export default function IngredientsModal({ recipe, visible, onHide }: IngredientsModalProps) {
  const footer = (
    <div>
      <Button label="Close" icon="pi pi-times" onClick={onHide} severity="secondary" />
    </div>
  );

  return (
    <Dialog
      header={`Ingredients - ${recipe?.name || 'Recipe'}`}
      visible={visible}
      style={{ width: '500px' }}
      onHide={onHide}
      footer={footer}
      modal
      draggable={false}
      resizable={false}
    >
      <div className="ingredients-content">
        {recipe && recipe.ingredients && recipe.ingredients.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {recipe.ingredients.map((ingredient, index) => (
              <li
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0',
                }}
              >
                <i className="pi pi-check-circle" style={{ color: '#10b981' }} />
                <span>{ingredient}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
            <i className="pi pi-info-circle" style={{ fontSize: '2rem', marginBottom: '1rem' }} />
            <p>No ingredients listed for this recipe</p>
          </div>
        )}
      </div>
    </Dialog>
  );
}
