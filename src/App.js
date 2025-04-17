import "./App.css";
import Header from "./components/Header";
import React, { Fragment, useState } from "react";
import WorkSpace from "./components/WorkSpace/WorkSpace";
import { useSelector, useDispatch } from "react-redux";
import DemoModal from "./components/UI/DemoModal";
import Registration from "./components/Registration/Registration";
import { login } from "./store/AuthSlice";

function App() {
  const isAuth = useSelector((state) => state.auth.isAuth);
  const showRegistration = useSelector((state) => state.auth.showRegistration);
  const dispatch = useDispatch();

  const [loginError, setLoginError] = useState(false);
  const [formData, setFormData] = useState({
    login: '',
    password: ''
  });

  const handleDemoClick = () => {
    dispatch(login());
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError(true);
    setTimeout(() => setLoginError(false), 3000); // Скрываем ошибку через 3 секунды
  };

  return (
    <Fragment>
      {!isAuth && (
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
                onChange={(e) => setFormData({...formData, login: e.target.value})}
              />
              <input
                type="password"
                placeholder="Пароль"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              {loginError && <div className="errorMessage">Неверный логин или пароль</div>}
              <div className="authButtons">
                <button type="button" className="demoButton" onClick={handleDemoClick}>
                  Демо-режим
                </button>
                <button type="submit" className="loginButton">
                  Вход
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isAuth && (
        <div className="App">
          <WorkSpace />
        </div>
      )}
      <DemoModal />
      {showRegistration && (
        <Registration onClose={() => dispatch({ type: 'auth/hideRegistration' })} />
      )}
    </Fragment>
  );
}

export default App;
