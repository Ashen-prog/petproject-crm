import React from "react";
import styles from "./Header.module.css";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleRegistrationClick = () => {
    navigate("/registration");
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
