import React from 'react';
import styles from './Calendar.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentDate } from '../../store/dateSlice';

const Calendar = () => {
  const currentDate = new Date(useSelector(state => state.date.currentDate));
  const dispatch = useDispatch();

  // Обработчик клика по дню
  const handleDayClick = (day) => {
    const newDate = new Date(currentDate);
    newDate.setDate(day);
    dispatch(setCurrentDate(newDate.getTime()));
  };

  // Переключение месяцев
  const handleMonthChange = (delta) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + delta);
    dispatch(setCurrentDate(newDate.getTime()));
  };

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const days = [];
  const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  // Добавляем пустые ячейки в начале месяца
  for (let i = 0; i < firstDayOfMonth - 1; i++) {
    days.push(<div key={`empty-${i}`} className={styles.emptyDay}></div>);
  }

  // Добавляем дни месяца
  for (let i = 1; i <= daysInMonth; i++) {
    const isSelected = i === currentDate.getDate();
    days.push(
      <div
        key={i}
        className={`${styles.day} ${isSelected ? styles.selected : ''}`}
        onClick={() => handleDayClick(i)}
      >
        {i}
      </div>
    );
  }

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button 
          className={styles.monthButton} 
          onClick={() => handleMonthChange(-1)}
        >
          ←
        </button>
        <span>{currentDate.toLocaleString('ru', { month: 'long', year: 'numeric' })}</span>
        <button 
          className={styles.monthButton} 
          onClick={() => handleMonthChange(1)}
        >
          →
        </button>
      </div>
      <div className={styles.weekdays}>
        {weekdays.map(day => (
          <div key={day} className={styles.weekday}>
            {day}
          </div>
        ))}
      </div>
      <div className={styles.days}>{days}</div>
    </div>
  );
};

export default Calendar;