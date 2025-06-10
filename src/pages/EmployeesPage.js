import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  fetchEmployees, 
  addEmployee, 
  deleteEmployee, 
  addEmployeeLocal, 
  updateEmployeeLocal,
  deleteEmployeeLocal,
  setSearchQuery,
  setSortBy
} from "../store/employeesSlice";
import styles from "./EmployeesPage.module.css";

const EmployeesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: employees, loading, searchQuery, sortBy } = useSelector((state) => state.employees);
  const token = useSelector((state) => state.auth.token);
  
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    // Загружаем сотрудников только если есть токен (не демо-режим)
    if (token) {
      dispatch(fetchEmployees());
    }
  }, [dispatch, token]);

  // Фильтрация и сортировка сотрудников
  const filteredEmployees = employees
    .filter(employee => 
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'position') {
        return a.position.localeCompare(b.position);
      }
      return 0;
    });

  const handleAdd = () => {
    if (formData.name.trim()) {
      if (token) {
        dispatch(addEmployee(formData));
      } else {
        dispatch(addEmployeeLocal(formData));
      }
      resetForm();
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      position: employee.position,
      phone: employee.phone,
      email: employee.email
    });
    setShowModal(true);
  };

  const handleUpdate = () => {
    if (formData.name.trim()) {
      const updatedEmployee = { ...editingEmployee, ...formData };
      if (token) {
        // Для API запроса (когда будет реализован)
        // dispatch(updateEmployee(updatedEmployee));
      } else {
        dispatch(updateEmployeeLocal(updatedEmployee));
      }
      resetForm();
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этого сотрудника?')) {
      if (token) {
        dispatch(deleteEmployee(id));
      } else {
        dispatch(deleteEmployeeLocal(id));
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', position: '', phone: '', email: '' });
    setEditingEmployee(null);
    setShowModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingEmployee) {
      handleUpdate();
    } else {
      handleAdd();
    }
  };
  return (
    <div className={styles.employeesPage}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button 
            className={styles.backButton}
            onClick={() => navigate('/')}
            title="Вернуться к рабочему пространству"
          >
            ← Назад
          </button>
          <h1>Сотрудники</h1>
        </div>
        <button 
          className={styles.addButton}
          onClick={() => setShowModal(true)}
        >
          + Добавить сотрудника
        </button>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Поиск сотрудников..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.sortContainer}>
          <select 
            value={sortBy} 
            onChange={(e) => dispatch(setSortBy(e.target.value))}
            className={styles.sortSelect}
          >
            <option value="name">Сортировка по имени</option>
            <option value="position">Сортировка по должности</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Загрузка...</div>
      ) : (
        <div className={styles.employeesGrid}>
          {filteredEmployees.map((employee) => (
            <div key={employee.id} className={styles.employeeCard}>
              <div className={styles.employeeAvatar}>
                {employee.avatar ? (
                  <img src={employee.avatar} alt={employee.name} />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    {employee.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              
              <div className={styles.employeeInfo}>
                <h3 className={styles.employeeName}>{employee.name}</h3>
                <p className={styles.employeePosition}>{employee.position}</p>
                <p className={styles.employeeContact}>{employee.phone}</p>
                <p className={styles.employeeContact}>{employee.email}</p>
              </div>
              
              <div className={styles.employeeActions}>
                <button 
                  className={styles.editButton}
                  onClick={() => handleEdit(employee)}
                >
                  Редактировать
                </button>
                <button 
                  className={styles.deleteButton}
                  onClick={() => handleDelete(employee.id)}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredEmployees.length === 0 && !loading && (
        <div className={styles.emptyState}>
          <p>Сотрудники не найдены</p>
        </div>
      )}

      {/* Модальное окно для добавления/редактирования */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => resetForm()}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>{editingEmployee ? 'Редактировать сотрудника' : 'Добавить сотрудника'}</h2>
            
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Имя *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Должность</label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                />
              </div>
              
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
                  {editingEmployee ? 'Сохранить' : 'Добавить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeesPage;
