import React from 'react';
import { useNavigate } from 'react-router-dom';

const FinancePage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '20px', 
        marginBottom: '30px',
        paddingBottom: '15px',
        borderBottom: '2px solid #e1e8ed'
      }}>
        <button 
          onClick={() => navigate('/')}
          style={{
            background: '#95a5a6',
            color: 'white',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '8px',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          ← Назад
        </button>
        <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '2.5rem' }}>Финансы</h2>
      </div>
      <p style={{ fontSize: '1.2rem', color: '#7f8c8d' }}>Функционал в разработке.</p>
    </div>
  );
};

export default FinancePage;
