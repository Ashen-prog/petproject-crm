import React from 'react';
import { useDispatch } from 'react-redux';
import { showDemoModal } from '../../store/modalSlice';
import styles from "./Menu.module.css";

const Menu = () => {
  const dispatch = useDispatch();

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

  const handleItemClick = () => {
    dispatch(showDemoModal());
  };

  return (
    <nav className={styles.menu}>
      <ul className={styles.menuList}>
        {menuItems.map(item => (
          <li 
            key={item.id}
            className={styles.menuItem}
            onClick={handleItemClick}
          >
            {item.title}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Menu;
