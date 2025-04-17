import React from "react";
import styles from "./Header.module.css";
import { useDispatch } from "react-redux";
import { showRegistration } from "../store/AuthSlice";

const Header = () => {
  const dispatch = useDispatch();

  const handleRegistrationClick = () => {
    dispatch(showRegistration());
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerButtons}>
        <button 
          className={styles.registrationButton} 
          onClick={handleRegistrationClick}
        >
          Регистрация
        </button>
      </div>
    </header>
  );
};

export default Header;
