import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Login from "./components/Login.jsx";
import DashboardCustomer from "./components/DashboardCustomer.jsx";
import OnboardingWizard from "./components/OnboardingWizard.jsx";
import QuickAccountOpen from "./components/QuickAccountOpen.jsx";
import LoanWizard from "./components/LoanWizard.jsx";
import OfficerConsole from "./components/OfficerConsole.jsx";
import ComplianceConsole from "./components/ComplianceConsole.jsx";
import ManagerDashboard from "./components/ManagerDashboard.jsx";
import AdminConsole from "./components/AdminConsole.jsx";

export default function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // App Master Data (Synchronized from backend REST API)
  const [accounts, setAccounts] = useState([]);
  const [applications, setApplications] = useState([]);
  const [customersList, setCustomersList] = useState([]);

  const fetchStateData = async (activeToken) => {
    const bearerToken = activeToken || token;
    if (!bearerToken) return;

    try {
      const resLoans = await fetch("/api/v1/loans", {
        headers: { "Authorization": `Bearer ${bearerToken}` }
      });
      if (resLoans.ok) {
        const dataLoans = await resLoans.json();
        setApplications(dataLoans);
      }

      const resAccs = await fetch("/api/v1/accounts", {
        headers: { "Authorization": `Bearer ${bearerToken}` }
      });
      if (resAccs.ok) {
        const dataAccs = await resAccs.json();
        setAccounts(dataAccs);
      }

      const staffCheck = bearerToken.includes("staff") || (user && user.role !== "CUSTOMER");
      if (staffCheck) {
        // Mock query customer data from backend tables
        const resCust = await fetch("/api/v1/accounts");
        setCustomersList([
          { customer_id: 1, full_name: "Kamal Bandara", nic_number: "199234509123", occupation: "Software Engineer", risk_tier: "LOW", monthly_turnover: "250000", address: "No. 45, Flower Road, Colombo 07", source_of_funds: "Salary" },
          { customer_id: 2, full_name: "Fathima Rizan", nic_number: "198851234567", occupation: "Business Owner", risk_tier: "HIGH", monthly_turnover: "800000", address: "No. 12/A, Kandy Road, Kadawatha", source_of_funds: "Business Revenue" }
        ]);
      }
    } catch (err) {
      console.error("API synchronizer connection failure:", err);
    }
  };

  const handleLoginSuccess = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    fetchStateData(newToken);
    
    if (newUser.role === "CUSTOMER") navigate("/dashboard");
    else if (newUser.role === "LOAN_OFFICER") navigate("/staff/officer");
    else if (newUser.role === "COMPLIANCE_OFFICER") navigate("/staff/compliance");
    else if (newUser.role === "BRANCH_MANAGER") navigate("/staff/manager");
    else if (newUser.role === "ADMIN") navigate("/staff/admin");
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    navigate("/");
  };

  useEffect(() => {
    if (token) {
      fetchStateData();
      const interval = setInterval(() => fetchStateData(), 8000);
      return () => clearInterval(interval);
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans text-slate-800">
      <div>
        <Navbar user={user} onLogout={handleLogout} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={
              !user ? <Login onLoginSuccess={handleLoginSuccess} /> : <Navigate to={user.role === "CUSTOMER" ? "/dashboard" : `/staff/${user.role.split('_')[0].toLowerCase()}`} />
            } />
            
            {/* Customer Routes */}
            <Route path="/dashboard" element={
              user?.role === "CUSTOMER" ? (
                <DashboardCustomer
                  user={user}
                  token={token}
                  customerAccounts={accounts}
                  customerApplications={applications}
                  fetchCustomerData={() => fetchStateData()}
                />
              ) : <Navigate to="/" />
            } />
            <Route path="/onboarding" element={
              user?.role === "CUSTOMER" ? (
                <OnboardingWizard user={user} />
              ) : <Navigate to="/" />
            } />
            <Route path="/quick-open" element={
              user?.role === "CUSTOMER" ? (
                <QuickAccountOpen user={user} />
              ) : <Navigate to="/" />
            } />
            <Route path="/loan-application" element={
              user?.role === "CUSTOMER" ? (
                <LoanWizard user={user} />
              ) : <Navigate to="/" />
            } />

            {/* Staff Routes */}
            <Route path="/staff/officer" element={
              user?.role === "LOAN_OFFICER" ? (
                <OfficerConsole user={user} applications={applications} fetchCustomerData={() => fetchStateData()} />
              ) : <Navigate to="/" />
            } />
            <Route path="/staff/compliance" element={
              user?.role === "COMPLIANCE_OFFICER" ? (
                <ComplianceConsole user={user} customers={customersList} fetchCustomerData={() => fetchStateData()} />
              ) : <Navigate to="/" />
            } />
            <Route path="/staff/manager" element={
              user?.role === "BRANCH_MANAGER" ? (
                <ManagerDashboard user={user} applications={applications} fetchCustomerData={() => fetchStateData()} />
              ) : <Navigate to="/" />
            } />
            <Route path="/staff/admin" element={
              user?.role === "ADMIN" ? (
                <AdminConsole user={user} />
              ) : <Navigate to="/" />
            } />
          </Routes>
        </main>
      </div>

      {/* Global Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 text-center text-[10px] font-mono uppercase tracking-wider">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 NovaBank PLC Sri Lanka. All Rights Reserved. Licensed Commercial Bank regulated by CBSL.</p>
          <p className="text-slate-500 mt-1">LoanSphere origination engine v1.0.0 (SHA-256 secure signed build).</p>
        </div>
      </footer>
    </div>
  );
}
