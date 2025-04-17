import React, { useState } from "react";
import styles from "./RecordForm.module.css";
const RecordForm = ({ initialData, selectedTime, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    duration: initialData?.duration || 30,
    startTime: selectedTime || "00:00",
    clientName: initialData?.clientName || "",
    phoneNumber: initialData?.phoneNumber || "",
  });

  const [errors, setErrors] = useState({});

  // Функции валидации
  const validateTitle = (title) => {
    if (!title.trim()) return "Название услуги обязательно";
    if (title.length < 2) return "Название должно содержать минимум 2 символа";
    return "";
  };

  const validatePhoneNumber = (phone) => {
    if (!phone) return ""; // Телефон не обязательный
    const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
    if (!phoneRegex.test(phone)) return "Неверный формат телефона";
    return "";
  };

  const validateDuration = (duration, startTime) => {
    if (!duration) return "Длительность обязательна";
    if (duration < 15) return "Минимальная длительность 15 минут";
    if (duration > 240) return "Максимальная длительность 4 часа";
    if (duration % 15 !== 0) return "Длительность должна быть кратна 15 минутам";

    // Проверка выхода за пределы рабочего времени
    const [hours, minutes] = startTime.split(":").map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + duration;

    // 22:00 в минутах = 22 * 60 = 1320
    if (endMinutes > 1320) {
      return `Максимальная длительность для ${startTime} - ${Math.floor((1320 - startMinutes) / 15) * 15} минут`;
    }

    return "";
  };

  const validateClientName = (name) => {
    if (!name.trim()) return "Имя клиента обязательно";
    if (name.length < 2) return "Имя должно содержать минимум 2 символа";
    return "";
  };

  const validateTime = (time) => {
    const [hours] = time.split(":").map(Number);
    return hours >= 8 && hours < 22;
  };

  // Обработчик изменения полей
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Валидация при изменении
    let error = "";
    switch (field) {
      case "title":
        error = validateTitle(value);
        break;
      case "phoneNumber":
        error = validatePhoneNumber(value);
        break;
      case "duration":
        error = validateDuration(value, formData.startTime);
        break;
      case "clientName":
        error = validateClientName(value);
        break;
      case "startTime":
        // При изменении времени перепроверяем длительность
        error = validateDuration(formData.duration, value);
        setErrors(prev => ({ ...prev, duration: error }));
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  // Валидация формы перед отправкой
  const handleSubmit = (e) => {
    e.preventDefault();

    // Проверяем время и длительность
    if (!validateTime(formData.startTime)) {
      alert("Выберите время в диапазоне 8:00 - 22:00");
      return;
    }

    const durationError = validateDuration(formData.duration, formData.startTime);
    if (durationError) {
      setErrors(prev => ({ ...prev, duration: durationError }));
      return;
    }

    // Проверяем все поля
    const newErrors = {
      title: validateTitle(formData.title),
      phoneNumber: validatePhoneNumber(formData.phoneNumber),
      duration: validateDuration(formData.duration, formData.startTime),
      clientName: validateClientName(formData.clientName),
    };

    setErrors(newErrors);

    // Если есть ошибки, прерываем отправку
    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    onSubmit(formData);
  };

  // Создаем массив доступных временных слотов
  const timeOptions = Array.from({ length: 57 }, (_, index) => {
    const hour = Math.floor((index * 15) / 60) + 8; // Начинаем с 8 часов
    const minutes = (index * 15) % 60;
    return `${String(hour).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  });

  return (
    <form className={styles.recordForm} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Услуга"
          className={errors.title ? styles.inputError : ""}
        />
        {errors.title && <span className={styles.errorText}>{errors.title}</span>}
      </div>

      <div className={styles.formGroup}>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Описание"
        />
      </div>

      <div className={styles.formGroup}>
        <input
          type="text"
          value={formData.clientName}
          onChange={(e) => handleChange("clientName", e.target.value)}
          placeholder="Имя клиента"
          className={errors.clientName ? styles.inputError : ""}
        />
        {errors.clientName && <span className={styles.errorText}>{errors.clientName}</span>}
      </div>

      <div className={styles.formGroup}>
        <input
          type="tel"
          value={formData.phoneNumber}
          onChange={(e) => handleChange("phoneNumber", e.target.value)}
          placeholder="Телефон клиента"
          className={errors.phoneNumber ? styles.inputError : ""}
        />
        {errors.phoneNumber && <span className={styles.errorText}>{errors.phoneNumber}</span>}
      </div>

      <div className={`${styles.formGroup} ${styles.formRow}`}>
        <select
          value={formData.startTime}
          onChange={(e) => handleChange("startTime", e.target.value)}
          className={styles.timeSelect}
        >
          {timeOptions.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>

        <div className={styles.durationWrapper}>
          <input
            type="number"
            value={formData.duration}
            onChange={(e) => handleChange("duration", parseInt(e.target.value))}
            min="15"
            step="15"
            placeholder="Длительность (мин)"
            className={`${styles.durationInput} ${errors.duration ? styles.inputError : ""}`}
          />
          {errors.duration && <span className={styles.errorText}>{errors.duration}</span>}
        </div>
      </div>

      <div className={styles.buttons}>
        <button type="submit">Сохранить</button>
        <button type="button" onClick={onCancel}>
          Отмена
        </button>
      </div>
    </form>
  );
};

export default RecordForm;
