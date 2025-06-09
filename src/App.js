import React from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import RequireAuth from "./routes/RequireAuth";
import LoginPage from "./components/LoginPage/LoginPage";
import Registration from "./components/Registration/Registration";
import WorkSpace from "./components/WorkSpace/WorkSpace";
import Journal from "./components/WorkSpace/Journal";
import DemoModal from "./components/UI/DemoModal";
import EmployeesPage from "./pages/EmployeesPage";
import ClientsPage from "./pages/ClientsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import FinancePage from "./pages/FinancePage";
import ServicesPage from "./pages/ServicesPage";
import MaterialsPage from "./pages/MaterialsPage";
import MarketingPage from "./pages/MarketingPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registration" element={<Registration />} />
        <Route
          path="/workspace/*"
          element={
            <RequireAuth>
              <WorkSpace />
            </RequireAuth>
          }
        >
          <Route index element={<Journal />} />
          <Route path="journal" element={<Journal />} />
          <Route path="employees" element={<EmployeesPage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="finance" element={<FinancePage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="materials" element={<MaterialsPage />} />
          <Route path="marketing" element={<MarketingPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <DemoModal />
    </>
  );
}

export default App;
