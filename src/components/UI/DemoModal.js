import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideModal } from "../../store/modalSlice";
import { Link } from "react-router-dom";
import styles from "./DemoModal.module.css";

const DemoModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modal.isOpen);

  const handleClose = () => {
    dispatch(hideModal());
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <p>
          Этот и многие другие полезные инструменты доступны в полной версии CRM. 
          Зарегистрируйтесь сейчас и получите доступ к расширенному функционалу:
        </p>
        <ul className={styles.featuresList}>
          <li>Управление базой клиентов</li>
          <li>Финансовая аналитика</li>
          <li>Складской учет</li>
          <li>Маркетинговые инструменты</li>
        </ul>
        <div className={styles.buttons}>
          <Link
            to="/registration"
            className={styles.registerButton}
            onClick={handleClose}
          >
            Регистрация
          </Link>
          <button className={styles.closeButton} onClick={handleClose}>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoModal;
