import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchRecords,
  createRecord,
  updateRecordAsync,
  addRecordLocal,
  updateRecordLocal,
} from "../../store/recordsSlice";
import styles from "./Journal.module.css";
import RecordForm from "./RecordForm";

const Journal = () => {
  const [selectedTime, setSelectedTime] = useState(null);
  const currentDateTimestamp = useSelector((state) => state.date.currentDate);
  const [showForm, setShowForm] = useState(false);
  const [formPosition, setFormPosition] = useState({ x: 0, y: 0 });
  const [editingRecord, setEditingRecord] = useState(null); // для редактирования существующей записи

  // Добавляем проверку валидности даты
  const currentDate = new Date(currentDateTimestamp);
  const isValidDate = !isNaN(currentDate.getTime());
  /////////////////////////// ЗАПИСИ
  const records = useSelector((state) => state.records.items);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  useEffect(() => {
    // Загружаем записи только если есть токен (не демо-режим)
    if (token) {
      dispatch(fetchRecords());
    }
  }, [dispatch, token]);

  // Функция для определения высоты записи на основе длительности
  const getRecordHeight = (duration) => {
    return (duration / 15) * 30; // 30px на каждые 15 минут
  };

  // Функция для форматирования времени
  const formatTimeRange = (startTime, duration) => {
    const [hours, minutes] = startTime.split(':');
    const start = new Date();
    start.setHours(parseInt(hours), parseInt(minutes));
    
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + duration);
    
    const formatTime = (date) => {
      return date.toLocaleTimeString('ru-RU', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    };
    
    return `${formatTime(start)} - ${formatTime(end)}`;
  };

  // В компоненте Journal добавим функцию для расчета позиции формы
  const calculateFormPosition = (clickY) => {
    const windowHeight = window.innerHeight;
    const formHeight = 400; // Примерная высота формы
    const padding = 20;
    
    let y = clickY;
    
    // Если форма выходит за нижнюю границу экрана
    if (y + formHeight > windowHeight) {
      y = windowHeight - formHeight - padding;
    }
    
    // Если форма выходит за верхнюю границу экрана
    if (y < padding) {
      y = padding;
    }
    
    return y;
  };

  const handleTimeSlotClick = (time, e) => {
    const [hours] = time.split(':').map(Number);
    if (hours < 8 || hours >= 22) {
      return; // Игнорируем клики вне рабочего времени
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const y = calculateFormPosition(e.clientY);
    
    setFormPosition({
      x: rect.left + 60, // Отступ от левого края
      y: y
    });
    setSelectedTime(time);
    setEditingRecord(null);
    setShowForm(true);
  };
  const handleFormSubmit = (formData) => {
    const recordData = {
      ...formData,
      startTime: formData.startTime,
      clientName: formData.clientName,
      date: currentDate.toISOString(),
    };

    if (editingRecord) {
      // Если редактируем существующую запись
      if (token) {
        // Если есть токен - отправляем на сервер
        dispatch(updateRecordAsync({ ...editingRecord, ...recordData }));
      } else {
        // Демо-режим - обновляем локально
        dispatch(updateRecordLocal({ ...editingRecord, ...recordData }));
      }
    } else {
      // Создаем новую запись
      if (token) {
        // Если есть токен - отправляем на сервер
        dispatch(createRecord(recordData));
      } else {
        // Демо-режим - создаем локально
        dispatch(addRecordLocal(recordData));
      }
    }

    // Сбрасываем состояние формы
    setShowForm(false);
    setEditingRecord(null);
    setSelectedTime(null);
  };

  const handleRecordClick = (record, event) => {
    event.stopPropagation();
    
    const windowWidth = window.innerWidth;
    const formWidth = 300; // Ширина формы
    const padding = 20;
    const extraOffset = 350; // Дополнительное смещение влево
    
    let x = event.clientX - extraOffset; // Смещаем форму левее
    
    // Проверяем, выходит ли форма за правый край экрана
    if (x + formWidth > windowWidth) {
      x = windowWidth - formWidth - padding;
    }
    
    // Проверяем, не выходит ли форма за левый край
    if (x < padding) {
      x = padding;
    }

    setEditingRecord(record);
    setSelectedTime(record.startTime);
    setFormPosition({
      x: x,
      y: event.clientY
    });
    setShowForm(true);
  };

  // Фильтрация записей для текущего дня
  const currentDateRecords =
    records?.filter((record) => {
      const recordDate = new Date(record.date);
      return recordDate.toDateString() === currentDate.toDateString();
    }) || [];

  // Создаем временную шкалу с интервалом 15 минут (с 8:00 до 22:00)
  const timeSlots = Array.from({ length: 57 }, (_, index) => { // 57 слотов по 15 минут = 14 часов
    const hour = Math.floor(index * 15 / 60) + 8; // Начинаем с 8 часов
    const minutes = (index * 15) % 60;
    return `${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  });

  return (
    <div className={styles.notebookPage}>
      <div className={styles.pageHeader}>
        <h2>Журнал активностей</h2>
        <span className={styles.date}>
          {isValidDate
            ? currentDate.toLocaleDateString("ru-RU", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })
            : "Неверная дата"}
        </span>
      </div>
      <div className={styles.notebookContent}>
        {timeSlots.map((time, index) => (
          <div
            key={index}
            className={styles.timeSlot}
            onClick={(e) => handleTimeSlotClick(time, e)}
          >
            <span className={styles.timeLabel}>{time}</span>
            <div className={styles.eventSpace}>
              {currentDateRecords
                .filter((record) => record.startTime === time)
                .map((record) => (
                  <div
                    key={record.id}
                    className={styles.record}
                    onClick={(e) => {
                      e.stopPropagation(); // Предотвращаем всплытие события
                      handleRecordClick(record, e);
                    }}
                    style={{
                      height: `${getRecordHeight(record.duration)}px`,
                      cursor: "pointer", // Добавляем курсор-указатель
                    }}
                  >
                    <div className={styles.recordHeader}>
                      <span className={styles.recordTime}>
                        {formatTimeRange(record.startTime, record.duration)}
                      </span>
                    </div>
                    <div className={styles.recordContent}>
                      <div className={styles.recordTitle}>{record.title}</div>
                      <div className={styles.recordClient}>
                        <div>{record.clientName}</div>
                        {record.phoneNumber && <div>{record.phoneNumber}</div>}
                      </div>
                      <div className={styles.recordDuration}>
                        {record.duration} мин
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
      {showForm && (
        <>
          <div className={styles.overlay} onClick={() => setShowForm(false)} />
          <div 
            className={styles.formPopup}
            style={{
              left: formPosition.x,
              top: formPosition.y
            }}
          >
            <RecordForm 
              initialData={editingRecord}
              selectedTime={selectedTime}
              onSubmit={handleFormSubmit}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Journal;
