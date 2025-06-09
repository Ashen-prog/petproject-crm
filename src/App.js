import React from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoginPage from "./components/LoginPage/LoginPage";
import Registration from "./components/Registration/Registration";
import WorkSpace from "./components/WorkSpace/WorkSpace";
import DemoModal from "./components/UI/DemoModal";

function App() {
  const isAuth = useSelector((state) => state.auth.isAuth);

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="/login"
          element={isAuth ? <Navigate to="/workspace" replace /> : <LoginPage />}
        />
        <Route path="/registration" element={<Registration />} />
        <Route
          path="/workspace"
          element={isAuth ? <WorkSpace /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <DemoModal />
    </>
  );
}

export default App;
