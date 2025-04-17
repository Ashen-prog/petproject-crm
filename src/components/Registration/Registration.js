import React, { useState } from "react";
import styles from "./Registration.module.css";
import { useSelector } from "react-redux";

const Registration = ({ onClose }) => {
  const [formData, setFormData] = useState({
    companyName: "",
    name: "",
    phone: "",
    email: "",
    employees: "1-5",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // В демо-версии просто закрываем форму
    onClose();
  };

  const isAuth = useSelector((state) => state.auth.isAuth);

  return (
    <div className={styles.registrationPage}>
      <div className={styles.formWrapper}>
        <h2>Оставить заявку на подключение</h2>
        <p className={styles.subtitle}>
          Заполните форму, и наш менеджер свяжется с вами для настройки CRM под
          ваш бизнес
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Название компании</label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) =>
                setFormData({ ...formData, companyName: e.target.value })
              }
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Контактное лицо</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Телефон</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Количество сотрудников</label>
            <select
              value={formData.employees}
              onChange={(e) =>
                setFormData({ ...formData, employees: e.target.value })
              }
            >
              <option value="1-5">1-5</option>
              <option value="6-15">6-15</option>
              <option value="16-30">16-30</option>
              <option value="31+">31 и более</option>
            </select>
          </div>

          <div className={styles.buttons}>
            <button type="submit" className={styles.submitButton}>
              Оставить заявку
            </button>
            <button
              type="button"
              className={styles.closeButton}
              onClick={onClose}
            >
              {`${isAuth ? "Вернуться в демо-режим" : "Закрыть"}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;
