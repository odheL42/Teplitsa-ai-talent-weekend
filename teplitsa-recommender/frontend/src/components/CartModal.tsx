import React from 'react';
import { useCart } from '../context/CartContext';
import { useMenu } from '../context/MenuContext';

interface Props {
  onClose: () => void;
}

const CartModal: React.FC<Props> = ({ onClose }) => {
  const { items, removeItem, clearCart } = useCart();
  const { dishById } = useMenu();
  const cartEntries = Object.entries(items);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#2f2f2f', 
          padding: '1.5rem',
          borderRadius: '0.5rem',
          width: '100%',
          maxWidth: '30rem',
          maxHeight: '80vh',
          overflowY: 'auto',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          position: 'relative',
        }}
        onClick={e => e.stopPropagation()}
      >

        <button
          style={{
            position: 'absolute',
            top: '0.75rem',
            right: '1rem',
            color: '#FFFFFF',
            fontSize: '1.25rem',
            cursor: 'pointer',
          }}
          onClick={onClose}
        >
          ×
        </button>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#FFFFFF' }}>
          Корзина
        </h2>
        {cartEntries.length === 0 ? (
          <p style={{ color: '#FFFFFF' }}>Пусто</p>
        ) : (
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {cartEntries.map(([id, amount]) => {
              const dish = dishById?.[id];
              if (!dish) return null;
              return (
                <li key={id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ color: '#FFFFFF' }}>
                    {dish.title} — {amount} × {dish.price}₽
                  </div>
                  <button
                    onClick={() => removeItem(id)}
                    style={{ color: '#ef4444', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Удалить
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        {cartEntries.length > 0 && (
          <button
            onClick={clearCart}
            style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#FFFFFF', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Очистить корзину
          </button>
        )}
      </div>
    </div>
  );
};

export default CartModal;
