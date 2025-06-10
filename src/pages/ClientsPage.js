import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchClients,
  addClient,
  updateClient,
  deleteClient,
  addClientLocal,
  updateClientLocal,
  deleteClientLocal,
  setSearchQuery,
  setFilterStatus,
  setFilterCategory,
  setSortBy,
  setViewMode
} from '../store/clientsSlice';
import styles from './ClientsPage.module.css';

const ClientsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
    const { 
    items: clients, 
    loading, 
    searchQuery, 
    filterStatus, 
    filterCategory, 
    sortBy, 
    viewMode 
  } = useSelector(state => state.clients);
  const token = useSelector(state => state.auth.token);

  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    category: 'Обычный',
    status: 'potential',
    totalSpent: '',
    notes: '',
    priority: 'medium',
    source: ''
  });

  useEffect(() => {
    if (token) {
      dispatch(fetchClients());
    }
  }, [dispatch, token]);
  // Получение уникальных категорий для фильтра
  const categories = [...new Set(clients.map(client => client.category))];

  // Фильтрация и сортировка
  const filteredClients = clients
    .filter(client => {      const matchesSearch = 
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || client.status === filterStatus;
      const matchesCategory = filterCategory === 'all' || client.category === filterCategory;
      
      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);        case 'totalSpent':
          return b.totalSpent - a.totalSpent;
        case 'lastVisit':
          return new Date(b.lastVisit) - new Date(a.lastVisit);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        default:
          return 0;
      }
    });

  const handleAdd = () => {
    if (formData.name.trim()) {      const clientData = {
        ...formData,
        totalSpent: parseInt(formData.totalSpent) || 0
      };
      
      if (token) {
        dispatch(addClient(clientData));
      } else {
        dispatch(addClientLocal(clientData));
      }
      resetForm();
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      contactPerson: client.contactPerson,      phone: client.phone,
      email: client.email,
      address: client.address,
      category: client.category,
      status: client.status,
      totalSpent: client.totalSpent.toString(),
      notes: client.notes,
      priority: client.priority,
      source: client.source
    });
    setShowModal(true);
  };

  const handleUpdate = () => {
    if (formData.name.trim()) {      const updatedClient = { 
        ...editingClient, 
        ...formData,
        totalSpent: parseInt(formData.totalSpent) || 0
      };
      
      if (token) {
        dispatch(updateClient(updatedClient));
      } else {
        dispatch(updateClientLocal(updatedClient));
      }
      resetForm();
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этого клиента?')) {
      if (token) {
        dispatch(deleteClient(id));
      } else {
        dispatch(deleteClientLocal(id));
      }
    }
  };
  const resetForm = () => {
    setFormData({
      name: '', contactPerson: '', phone: '', email: '', address: '',
      category: 'Обычный', status: 'potential', totalSpent: '', notes: '', priority: 'medium', source: ''
    });
    setEditingClient(null);
    setShowModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingClient) {
      handleUpdate();
    } else {
      handleAdd();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#27ae60';
      case 'potential': return '#f39c12';
      case 'inactive': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#e74c3c';
      case 'medium': return '#f39c12';
      case 'low': return '#95a5a6';
      default: return '#95a5a6';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(amount);
  };
  const getClientStats = () => {
    const total = clients.length;
    const active = clients.filter(c => c.status === 'active').length;
    const potential = clients.filter(c => c.status === 'potential').length;
    const totalSpent = clients.reduce((sum, c) => sum + c.totalSpent, 0);
    
    return { total, active, potential, totalSpent };
  };

  const stats = getClientStats();

  return (
    <div className={styles.clientsPage}>
      <div className={styles.notebookPage}>
      {/* Шапка страницы */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button 
            className={styles.backButton}
            onClick={() => navigate('/')}
            title="Вернуться к рабочему пространству"
          >
            ← Назад
          </button>          <div className={styles.titleSection}>
            <h1>База клиентов</h1>
            <p className={styles.subtitle}>Управление частными клиентами</p>
          </div>
        </div>
        <button 
          className={styles.addButton}
          onClick={() => setShowModal(true)}
        >
          + Новый клиент
        </button>
      </div>

      {/* Статистика */}
      <div className={styles.statsSection}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{stats.total}</div>
          <div className={styles.statLabel}>Всего клиентов</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{stats.active}</div>
          <div className={styles.statLabel}>Активные</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{stats.potential}</div>
          <div className={styles.statLabel}>Потенциальные</div>        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{formatCurrency(stats.totalSpent)}</div>
          <div className={styles.statLabel}>Общая сумма</div>
        </div>
      </div>

      {/* Фильтры и поиск */}
      <div className={styles.controlsSection}>
        <div className={styles.searchAndFilters}>
          <input
            type="text"
            placeholder="Поиск клиентов..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className={styles.searchInput}
          />
          
          <select 
            value={filterStatus} 
            onChange={(e) => dispatch(setFilterStatus(e.target.value))}
            className={styles.filterSelect}
          >
            <option value="all">Все статусы</option>
            <option value="active">Активные</option>
            <option value="potential">Потенциальные</option>
            <option value="inactive">Неактивные</option>
          </select>          <select 
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
            value={sortBy} 
            onChange={(e) => dispatch(setSortBy(e.target.value))}
            className={styles.sortSelect}
          >            <option value="name">По имени</option>
            <option value="totalSpent">По сумме трат</option>
            <option value="lastVisit">По дате посещения</option>
            <option value="priority">По приоритету</option>
          </select>
        </div>

        <div className={styles.viewControls}>
          <button 
            className={`${styles.viewButton} ${viewMode === 'cards' ? styles.active : ''}`}
            onClick={() => dispatch(setViewMode('cards'))}
          >
            📋 Карточки
          </button>
          <button 
            className={`${styles.viewButton} ${viewMode === 'table' ? styles.active : ''}`}
            onClick={() => dispatch(setViewMode('table'))}
          >
            📊 Таблица
          </button>
        </div>
      </div>

      {/* Контент */}
      {loading ? (
        <div className={styles.loading}>Загрузка...</div>
      ) : viewMode === 'cards' ? (
        <div className={styles.clientsGrid}>
          {filteredClients.map(client => (
            <div key={client.id} className={styles.clientCard}>
              <div className={styles.cardHeader}>
                <div className={styles.clientTitle}>
                  <h3>{client.name}</h3>
                  <span 
                    className={styles.statusBadge}
                    style={{ backgroundColor: getStatusColor(client.status) }}
                  >
                    {client.status === 'active' ? 'Активный' : 
                     client.status === 'potential' ? 'Потенциальный' : 'Неактивный'}
                  </span>
                </div>
                <div 
                  className={styles.priorityIndicator}
                  style={{ backgroundColor: getPriorityColor(client.priority) }}
                  title={`Приоритет: ${client.priority}`}
                >
                  {client.priority === 'high' ? '🔥' : 
                   client.priority === 'medium' ? '⚡' : '📝'}
                </div>
              </div>
              
              <div className={styles.cardContent}>                <div className={styles.contactInfo}>
                  <p><strong>Телефон:</strong> {client.phone}</p>
                  <p><strong>Email:</strong> {client.email}</p>
                  <p><strong>Адрес:</strong> {client.address}</p>
                  <p><strong>Категория:</strong> {client.category}</p>
                </div>
                
                <div className={styles.businessInfo}>
                  <p><strong>Потрачено:</strong> {formatCurrency(client.totalSpent)}</p>
                  <p><strong>Последний визит:</strong> {new Date(client.lastVisit).toLocaleDateString('ru-RU')}</p>
                  <p><strong>Источник:</strong> {client.source}</p>
                </div>
                
                {client.notes && (
                  <div className={styles.notes}>
                    <strong>Заметки:</strong> {client.notes}
                  </div>
                )}
              </div>
              
              <div className={styles.cardActions}>
                <button 
                  className={styles.editButton}
                  onClick={() => handleEdit(client)}
                >
                  ✏️ Редактировать
                </button>
                <button 
                  className={styles.deleteButton}
                  onClick={() => handleDelete(client.id)}
                >
                  🗑️ Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.clientsTable}>            <thead>
              <tr>
                <th>Имя</th>
                <th>Телефон</th>
                <th>Категория</th>
                <th>Статус</th>
                <th>Потрачено</th>
                <th>Приоритет</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map(client => (
                <tr key={client.id}>
                  <td>{client.name}</td>
                  <td>{client.phone}</td>
                  <td>{client.category}</td>
                  <td>
                    <span 
                      className={styles.statusBadge}
                      style={{ backgroundColor: getStatusColor(client.status) }}
                    >
                      {client.status === 'active' ? 'Активный' : 
                       client.status === 'potential' ? 'Потенциальный' : 'Неактивный'}
                    </span>                  </td>
                  <td>{formatCurrency(client.totalSpent)}</td>
                  <td>
                    <span 
                      className={styles.priorityBadge}
                      style={{ backgroundColor: getPriorityColor(client.priority) }}
                    >
                      {client.priority === 'high' ? '🔥 Высокий' : 
                       client.priority === 'medium' ? '⚡ Средний' : '📝 Низкий'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.tableActions}>
                      <button 
                        className={styles.editButton}
                        onClick={() => handleEdit(client)}
                      >
                        ✏️
                      </button>
                      <button 
                        className={styles.deleteButton}
                        onClick={() => handleDelete(client.id)}
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

      {filteredClients.length === 0 && !loading && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📋</div>
          <h3>Клиенты не найдены</h3>
          <p>Попробуйте изменить параметры поиска или добавьте нового клиента</p>
        </div>
      )}

      {/* Модальное окно */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => resetForm()}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>{editingClient ? 'Редактировать клиента' : 'Добавить клиента'}</h2>
              <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Имя клиента *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Контактное лицо</label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Телефон</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Адрес</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Категория</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="VIP">VIP</option>
                    <option value="Постоянный">Постоянный</option>
                    <option value="Обычный">Обычный</option>
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label>Источник</label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({...formData, source: e.target.value})}
                  >
                    <option value="">Выберите источник</option>
                    <option value="Сайт">Сайт</option>
                    <option value="Рекомендация">Рекомендация</option>
                    <option value="Соцсети">Соцсети</option>
                    <option value="Реклама">Реклама</option>
                    <option value="Другое">Другое</option>
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Статус</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="potential">Потенциальный</option>
                    <option value="active">Активный</option>
                    <option value="inactive">Неактивный</option>
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label>Приоритет</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  >
                    <option value="low">Низкий</option>
                    <option value="medium">Средний</option>
                    <option value="high">Высокий</option>
                  </select>
                </div>
              </div>              <div className={styles.formGroup}>
                <label>Потрачено (руб.)</label>
                <input
                  type="number"
                  value={formData.totalSpent}
                  onChange={(e) => setFormData({...formData, totalSpent: e.target.value})}
                  min="0"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Заметки</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows="3"
                />
              </div>
              
              <div className={styles.formActions}>
                <button 
                  type="button" 
                  onClick={resetForm}
                  className={styles.cancelButton}
                >
                  Отмена
                </button>
                <button 
                  type="submit"
                  className={styles.submitButton}
                >
                  {editingClient ? 'Сохранить' : 'Добавить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default ClientsPage;
