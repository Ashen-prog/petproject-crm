import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  addFinanceLocal,
  updateFinanceLocal,
  deleteFinanceLocal,
  setSearchQuery,
  setFilterType,
  setFilterCategory,
  setFilterPaymentMethod,
  setSortBy,
  setViewMode
} from '../store/financesSlice';
import styles from './FinancePage.module.css';

const FinancePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const {
    items: finances,
    searchQuery,
    filterType,
    filterCategory,
    filterPaymentMethod,
    sortBy,
    viewMode
  } = useSelector(state => state.finances);

  const [showModal, setShowModal] = useState(false);
  const [editingFinance, setEditingFinance] = useState(null);
  const [formData, setFormData] = useState({
    type: 'income',
    category: '',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    clientName: '',
    paymentMethod: 'Наличные'
  });

  // Фильтрация и сортировка данных
  const filteredAndSortedFinances = useMemo(() => {
    let filtered = finances.filter(finance => {
      const matchesSearch = finance.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          finance.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          finance.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = filterType === 'all' || finance.type === filterType;
      const matchesCategory = filterCategory === 'all' || finance.category === filterCategory;
      const matchesPaymentMethod = filterPaymentMethod === 'all' || finance.paymentMethod === filterPaymentMethod;
      
      return matchesSearch && matchesType && matchesCategory && matchesPaymentMethod;
    });

    // Сортировка
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date) - new Date(a.date);
        case 'amount':
          return b.amount - a.amount;
        case 'category':
          return a.category.localeCompare(b.category);
        case 'type':
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

    return filtered;
  }, [finances, searchQuery, filterType, filterCategory, filterPaymentMethod, sortBy]);

  // Статистика
  const stats = useMemo(() => {
    const totalIncome = finances
      .filter(f => f.type === 'income')
      .reduce((sum, f) => sum + f.amount, 0);
    
    const totalExpense = finances
      .filter(f => f.type === 'expense')
      .reduce((sum, f) => sum + f.amount, 0);
    
    const profit = totalIncome - totalExpense;
    
    return { totalIncome, totalExpense, profit };
  }, [finances]);

  // Уникальные категории и методы оплаты
  const categories = [...new Set(finances.map(f => f.category))].filter(Boolean);
  const paymentMethods = [...new Set(finances.map(f => f.paymentMethod))].filter(Boolean);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const handleAddFinance = () => {
    setEditingFinance(null);
    setFormData({
      type: 'income',
      category: '',
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      clientName: '',
      paymentMethod: 'Наличные'
    });
    setShowModal(true);
  };

  const handleEditFinance = (finance) => {
    setEditingFinance(finance);
    setFormData({ ...finance });
    setShowModal(true);
  };

  const handleDeleteFinance = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту операцию?')) {
      dispatch(deleteFinanceLocal(id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.category) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    const financeData = {
      ...formData,
      amount: parseFloat(formData.amount)
    };

    if (editingFinance) {
      dispatch(updateFinanceLocal({ ...financeData, id: editingFinance.id }));
    } else {
      dispatch(addFinanceLocal(financeData));
    }

    setShowModal(false);
    setEditingFinance(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className={styles.notebookPage}>
      {/* Заголовок страницы */}
      <div className={styles.pageHeader}>
        <button 
          onClick={() => navigate('/')}
          className={styles.backButton}
        >
          ← Назад
        </button>
        <h2 className={styles.pageTitle}>Финансы</h2>
      </div>

      {/* Статистика */}
      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <div className={`${styles.statValue} ${styles.income}`}>
            {formatCurrency(stats.totalIncome)}
          </div>
          <div className={styles.statLabel}>Доходы</div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statValue} ${styles.expense}`}>
            {formatCurrency(stats.totalExpense)}
          </div>
          <div className={styles.statLabel}>Расходы</div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statValue} ${styles.profit}`}>
            {formatCurrency(stats.profit)}
          </div>
          <div className={styles.statLabel}>Прибыль</div>
        </div>
      </div>

      {/* Панель управления */}
      <div className={styles.controlsPanel}>
        <div className={styles.controlsRow}>
          <input
            type="text"
            placeholder="Поиск операций..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className={styles.searchInput}
          />
          
          <select
            value={filterType}
            onChange={(e) => dispatch(setFilterType(e.target.value))}
            className={styles.filterSelect}
          >
            <option value="all">Все типы</option>
            <option value="income">Доходы</option>
            <option value="expense">Расходы</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => dispatch(setFilterCategory(e.target.value))}
            className={styles.filterSelect}
          >
            <option value="all">Все категории</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={filterPaymentMethod}
            onChange={(e) => dispatch(setFilterPaymentMethod(e.target.value))}
            className={styles.filterSelect}
          >
            <option value="all">Все способы оплаты</option>
            {paymentMethods.map(method => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>

          <button 
            onClick={handleAddFinance}
            className={styles.addButton}
          >
            + Добавить операцию
          </button>
        </div>

        <div className={styles.controlsRow}>
          <select
            value={sortBy}
            onChange={(e) => dispatch(setSortBy(e.target.value))}
            className={styles.filterSelect}
          >
            <option value="date">Сортировка по дате</option>
            <option value="amount">Сортировка по сумме</option>
            <option value="category">Сортировка по категории</option>
            <option value="type">Сортировка по типу</option>
          </select>

          <div className={styles.viewToggle}>
            <button
              onClick={() => dispatch(setViewMode('cards'))}
              className={`${styles.viewButton} ${viewMode === 'cards' ? styles.active : ''}`}
            >
              Карточки
            </button>
            <button
              onClick={() => dispatch(setViewMode('table'))}
              className={`${styles.viewButton} ${viewMode === 'table' ? styles.active : ''}`}
            >
              Таблица
            </button>
          </div>
        </div>
      </div>

      {/* Отображение данных */}
      {filteredAndSortedFinances.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>💰</div>
          <h3 className={styles.emptyTitle}>
            {finances.length === 0 ? 'Операций пока нет' : 'Операции не найдены'}
          </h3>
          <p className={styles.emptyDescription}>
            {finances.length === 0 
              ? 'Добавьте первую финансовую операцию' 
              : 'Попробуйте изменить фильтры поиска'}
          </p>
        </div>
      ) : viewMode === 'cards' ? (
        <div className={styles.cardsContainer}>
          {filteredAndSortedFinances.map(finance => (
            <div key={finance.id} className={`${styles.financeCard} ${styles[finance.type]}`}>
              <div className={styles.cardHeader}>
                <span className={`${styles.cardType} ${styles[finance.type]}`}>
                  {finance.type === 'income' ? 'Доход' : 'Расход'}
                </span>
                <div className={styles.cardActions}>
                  <button 
                    onClick={() => handleEditFinance(finance)}
                    className={`${styles.actionButton} ${styles.editButton}`}
                    title="Редактировать"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => handleDeleteFinance(finance.id)}
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    title="Удалить"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              <div className={`${styles.cardAmount} ${styles[finance.type]}`}>
                {finance.type === 'income' ? '+' : '-'}{formatCurrency(finance.amount)}
              </div>
              
              <div className={styles.cardDescription}>
                {finance.description}
              </div>
              
              <div className={styles.cardDetails}>
                <div className={styles.cardDetail}>
                  <span className={styles.detailLabel}>Категория:</span>
                  <span className={styles.detailValue}>{finance.category}</span>
                </div>
                <div className={styles.cardDetail}>
                  <span className={styles.detailLabel}>Дата:</span>
                  <span className={styles.detailValue}>{formatDate(finance.date)}</span>
                </div>
                {finance.clientName && (
                  <div className={styles.cardDetail}>
                    <span className={styles.detailLabel}>Клиент:</span>
                    <span className={styles.detailValue}>{finance.clientName}</span>
                  </div>
                )}
                <div className={styles.cardDetail}>
                  <span className={styles.detailLabel}>Способ оплаты:</span>
                  <span className={styles.detailValue}>{finance.paymentMethod}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.financeTable}>
            <thead>
              <tr>
                <th>Тип</th>
                <th>Категория</th>
                <th>Описание</th>
                <th>Сумма</th>
                <th>Дата</th>
                <th>Клиент</th>
                <th>Способ оплаты</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedFinances.map(finance => (
                <tr key={finance.id}>
                  <td>
                    <span className={`${styles.cardType} ${styles[finance.type]}`}>
                      {finance.type === 'income' ? 'Доход' : 'Расход'}
                    </span>
                  </td>
                  <td>{finance.category}</td>
                  <td>{finance.description}</td>
                  <td className={`${styles.cardAmount} ${styles[finance.type]}`}>
                    {finance.type === 'income' ? '+' : '-'}{formatCurrency(finance.amount)}
                  </td>
                  <td>{formatDate(finance.date)}</td>
                  <td>{finance.clientName || '—'}</td>
                  <td>{finance.paymentMethod}</td>
                  <td>
                    <div className={styles.tableActions}>
                      <button 
                        onClick={() => handleEditFinance(finance)}
                        className={`${styles.actionButton} ${styles.editButton}`}
                        title="Редактировать"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleDeleteFinance(finance.id)}
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                        title="Удалить"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Модальное окно добавления/редактирования */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>
              {editingFinance ? 'Редактировать операцию' : 'Добавить операцию'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Тип операции*</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className={styles.formSelect}
                  required
                >
                  <option value="income">Доход</option>
                  <option value="expense">Расход</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Категория*</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  placeholder="Например: Услуги, Материалы, Аренда..."
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Описание*</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={styles.formTextarea}
                  placeholder="Подробное описание операции..."
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Сумма (₽)*</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Дата*</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Клиент</label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  placeholder="Имя клиента (необязательно)"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Способ оплаты*</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className={styles.formSelect}
                  required
                >
                  <option value="Наличные">Наличные</option>
                  <option value="Карта">Карта</option>
                  <option value="Перевод">Перевод</option>
                  <option value="Онлайн">Онлайн</option>
                </select>
              </div>

              <div className={styles.modalActions}>
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className={styles.cancelButton}
                >
                  Отмена
                </button>
                <button 
                  type="submit"
                  className={styles.saveButton}
                >
                  {editingFinance ? 'Обновить' : 'Добавить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancePage;
