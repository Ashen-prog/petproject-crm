import React from "react";
import styles from "./Auth.module.css";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";

const Auth = () => {
  const dispatch = useDispatch();
  const loginHandler = (e) => {
    e.preventDefault();
    dispatch(login());
  };
  return (
    <div className={styles.auth}>
      <form htmlFor="auth-form" onSubmit={loginHandler}>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" />
        <label htmlFor="password">Пароль</label>
        <input type="password" id="password" />
        <button type="submit">Войти</button>
      </form>
    </div>
  );
};

export default Auth;
