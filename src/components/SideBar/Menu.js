import React, { useState } from 'react';
import styles from "./Menu.module.css";

const Menu = () => {
  const [activeItem, setActiveItem] = useState(null);

  const menuItems = [
    { id: 1, title: 'Сотрудники' },
    { id: 2, title: 'Клиенты' },
    { id: 3, title: 'Аналитика' },
    { id: 4, title: 'Финансы' },
    { id: 5, title: 'Услуги и цены' },
    { id: 6, title: 'Расходные материалы' },
    { id: 7, title: 'Маркетинг' },
    { id: 8, title: 'Отчеты' },
    { id: 9, title: 'Настройки' }
  ];

  return (
    <nav className={styles.menu}>
      <ul className={styles.menuList}>
        {menuItems.map(item => (
          <li 
            key={item.id}
            className={`${styles.menuItem} ${activeItem === item.id ? styles.active : ''}`}
            onClick={() => setActiveItem(item.id)}
          >
            {item.title}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Menu;
