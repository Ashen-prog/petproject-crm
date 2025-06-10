import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from "./Menu.module.css";

const Menu = () => {
  const menuItems = [
    { id: 1, title: 'Сотрудники', path: '/employees' },
    { id: 2, title: 'Клиенты', path: '/clients' },
    { id: 3, title: 'Финансы', path: '/finance' }
  ];

  return (
    <nav className={styles.menu}>
      <ul className={styles.menuList}>        {menuItems.map(item => (
          <li key={item.id} className={styles.menuItem}>
            <NavLink 
              to={item.path}
              className={({ isActive }) => isActive ? styles.active : ''}
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
