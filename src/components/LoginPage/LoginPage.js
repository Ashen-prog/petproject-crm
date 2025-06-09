import React, { useState } from "react";
import Header from "../Header";
import { useDispatch } from "react-redux";
import { login } from "../../store/AuthSlice";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState(false);
  const [formData, setFormData] = useState({ login: "", password: "" });

  const handleDemoClick = () => {
    dispatch(login());
    navigate("/workspace");
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // Имитация ошибки входа в демо-версии
    setLoginError(true);
    setTimeout(() => setLoginError(false), 3000);
  };

  return (
    <div className="Auth">
      <Header />
      <div className="welcomeContainer">
        <h1>Добро пожаловать в CRM систему</h1>
        <p>Управляйте вашим бизнесом эффективно</p>
        <form className="loginForm" onSubmit={handleLoginSubmit}>
          <input
            type="text"
            placeholder="Логин"
            value={formData.login}
            onChange={(e) =>
              setFormData({ ...formData, login: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Пароль"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          {loginError && (
            <div className="errorMessage">Неверный логин или пароль</div>
          )}
          <div className="authButtons">
            <button
              type="button"
              className="demoButton"
              onClick={handleDemoClick}
            >
              Демо-режим
            </button>
            <button type="submit" className="loginButton">
              Вход
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
