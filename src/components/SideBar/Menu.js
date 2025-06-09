import React from 'react';
import { useDispatch } from 'react-redux';
import { showDemoModal } from '../../store/modalSlice';
import { NavLink } from 'react-router-dom';
import styles from "./Menu.module.css";

const Menu = () => {
  const dispatch = useDispatch();

  const menuItems = [
    { id: 1, title: 'Сотрудники', path: 'employees' },
    { id: 2, title: 'Клиенты', path: 'clients' },
    { id: 3, title: 'Аналитика', path: 'analytics' },
    { id: 4, title: 'Финансы', path: 'finance' },
    { id: 5, title: 'Услуги и цены', path: 'services' },
    { id: 6, title: 'Расходные материалы', path: 'materials' },
    { id: 7, title: 'Маркетинг', path: 'marketing' },
    { id: 8, title: 'Отчеты', path: 'reports' },
    { id: 9, title: 'Настройки', path: 'settings' }
  ];

  const handleItemClick = () => {
    dispatch(showDemoModal());
  };

  return (
    <nav className={styles.menu}>
      <ul className={styles.menuList}>
        {menuItems.map(item => (
          <li key={item.id} className={styles.menuItem}>
            <NavLink
              to={`/workspace/${item.path}`}
              onClick={handleItemClick}
            >
              {item.title}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Menu;
