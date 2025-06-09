import React from "react";
import styles from "./Header.module.css";
import { Link } from "react-router-dom";

const Header = () => {

  return (
    <header className={styles.header}>
      <div className={styles.headerButtons}>
        <Link to="/registration" className={styles.registrationButton}>
          Регистрация
        </Link>
      </div>
    </header>
  );
};

export default Header;
