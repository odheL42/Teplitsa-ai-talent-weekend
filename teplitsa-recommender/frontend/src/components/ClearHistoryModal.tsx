import React from 'react';

type ClearHistoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  loading: boolean;
  error: string | null;
};

const ClearHistoryModal: React.FC<ClearHistoryModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  error,
}) => {
  if (!isOpen) return null;

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
          maxWidth: '24rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          position: 'relative',
        }}
        onClick={e => e.stopPropagation()}
      >
        <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#FFFFFF' }}>
          Подтверждение
        </h2>
        <p style={{ marginBottom: '1.5rem', color: '#FFFFFF' }}>
          Вы действительно хотите очистить историю чата?
        </p>
        {error && <p style={{ marginBottom: '1rem', color: '#ef4444', fontSize: '0.875rem' }}>{error}</p>}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              backgroundColor: '#4b5563',
              color: '#FFFFFF',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#6b7280')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#4b5563')}
          >
            Отмена
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              backgroundColor: '#ef4444',
              color: '#FFFFFF',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s',
              opacity: loading ? 0.5 : 1,
            }}
            onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = '#dc2626')}
            onMouseOut={(e) => !loading && (e.currentTarget.style.backgroundColor = '#ef4444')}
          >
            Очистить
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClearHistoryModal;
