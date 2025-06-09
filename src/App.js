import React from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import RequireAuth from "./routes/RequireAuth";
import LoginPage from "./components/LoginPage/LoginPage";
import Registration from "./components/Registration/Registration";
import WorkSpace from "./components/WorkSpace/WorkSpace";
import DemoModal from "./components/UI/DemoModal";

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registration" element={<Registration />} />
        <Route
          path="/workspace"
          element={
            <RequireAuth>
              <WorkSpace />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <DemoModal />
    </>
  );
}

export default App;
