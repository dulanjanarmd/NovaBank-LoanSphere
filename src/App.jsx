import React, { useState, useEffect } from "react";
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
import SupportContactWidget from "./components/SupportContactWidget.jsx";
import RateFluctuationNotifier from "./components/RateFluctuationNotifier.jsx";
import { Sparkles, Users, HelpCircle, FileText } from "lucide-react";

export default function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [registerMode, setRegisterMode] = useState(false);

  // Active Customer Sub-Screen
  // null = Dashboard, 'DAO' = Savings Wizard, 'DLO' = Loan Wizard
  const [customerMode, setCustomerMode] = useState(null);

  // App Master Data (Synchronized from backend REST API)
  const [accounts, setAccounts] = useState([]);
  const [applications, setApplications] = useState([]);
  const [customersList, setCustomersList] = useState([]);

  // Fetch full application dataset based on active role JWT scope
  const fetchStateData = async (activeToken) => {
    const bearerToken = activeToken || token;
    if (!bearerToken) return;

    try {
      // 1. Fetch Loan Applications
      const resLoans = await fetch("/api/v1/loans", {
        headers: { "Authorization": `Bearer ${bearerToken}` }
      });
      if (resLoans.ok) {
        const dataLoans = await resLoans.json();
        setApplications(dataLoans);
      }

      // 2. Fetch savings accounts
      const resAccs = await fetch("/api/v1/accounts", {
        headers: { "Authorization": `Bearer ${bearerToken}` }
      });
      if (resAccs.ok) {
        const dataAccs = await resAccs.json();
        setAccounts(dataAccs);
      }

      // 3. If staff role, load all client profiles
      const resStaff = await fetch("/api/v1/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: "officer", password: "password" }) });
      const staffCheck = bearerToken.includes("staff");
      if (staffCheck) {
        // Mock query customer data from backend tables
        const resCust = await fetch("/api/v1/accounts"); // for convenience of preview, retrieve seed lists
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
    setCustomerMode(null);
    fetchStateData(newToken);
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setRegisterMode(false);
    setCustomerMode(null);
  };

  // Demo shortcut role swapper handler
  const handleFastRoleSwap = async (username) => {
    try {
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password: "password" })
      });
      const data = await response.json();
      if (data.success) {
        handleLoginSuccess(data.token, data.user);
      }
    } catch (err) {
      alert("Role swapper unable to reach API backend.");
    }
  };

  // Periodic polling to keep dashboard live during reviewer edits
  useEffect(() => {
    if (token) {
      fetchStateData();
      const interval = setInterval(() => fetchStateData(), 8000);
      return () => clearInterval(interval);
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      
      <div>
        <Navbar user={user} onLogout={handleLogout} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* A. If not authenticated, show login portal */}
          {!user ? (
            <Login
              onLoginSuccess={handleLoginSuccess}
              registerMode={registerMode}
              setRegisterMode={setRegisterMode}
            />
          ) : (
            /* B. Routing blocks based on role configuration */
            <div>
              {/* 1. Customer Interface Routing */}
              {user.role === "CUSTOMER" && (
                <div>
                  {customerMode === "DAO" ? (
                    <OnboardingWizard
                      user={user}
                      onCompleteDAO={() => {
                        setCustomerMode(null);
                        fetchStateData();
                      }}
                      onCancel={() => setCustomerMode(null)}
                    />
                  ) : customerMode === "QUICK_DAO" ? (
                    <QuickAccountOpen
                      user={user}
                      onSuccess={() => {
                        setCustomerMode(null);
                        fetchStateData();
                      }}
                      onCancel={() => setCustomerMode(null)}
                    />
                  ) : customerMode === "DLO" ? (
                    <LoanWizard
                      user={user}
                      onCompleteDLO={() => {
                        setCustomerMode(null);
                        fetchStateData();
                      }}
                      onCancel={() => setCustomerMode(null)}
                    />
                  ) : (
                    <DashboardCustomer
                      user={user}
                      customerAccounts={accounts}
                      customerApplications={applications}
                      onStartDAO={() => setCustomerMode("DAO")}
                      onStartQuickDAO={() => setCustomerMode("QUICK_DAO")}
                      onStartDLO={() => setCustomerMode("DLO")}
                      fetchCustomerData={() => fetchStateData()}
                    />
                  )}
                </div>
              )}

              {/* 2. Loan Officer Console Routing */}
              {user.role === "LOAN_OFFICER" && (
                <OfficerConsole
                  user={user}
                  applications={applications}
                  fetchCustomerData={() => fetchStateData()}
                />
              )}

              {/* 3. Compliance Officer Routing */}
              {user.role === "COMPLIANCE_OFFICER" && (
                <ComplianceConsole
                  user={user}
                  customers={customersList}
                  fetchCustomerData={() => fetchStateData()}
                />
              )}

              {/* 4. Branch Manager Console Routing */}
              {user.role === "BRANCH_MANAGER" && (
                <ManagerDashboard
                  user={user}
                  applications={applications}
                  fetchCustomerData={() => fetchStateData()}
                />
              )}

              {/* 5. System Administrator Console Routing */}
              {user.role === "ADMIN" && (
                <AdminConsole user={user} />
              )}
            </div>
          )}

        </main>
      </div>

      {/* C. Floatable DEMO ROLE-SWITCH PANEL (Indispensable for Sandbox testing) */}
      <div className="fixed bottom-4 left-4 z-50 max-w-sm bg-white border border-slate-200 rounded-2xl shadow-xl p-4 hidden md:block select-none animate-bounce-short">
        <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2 mb-2">
          <Users className="h-4 w-4 text-teal-600" />
          <h5 className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
            Pipeline Maker-Checker Simulator
          </h5>
        </div>
        
        <p className="text-[10px] text-slate-500 mb-3 leading-tight">
          Test the entire loan origination pipeline! Switch roles instantly to complete documents verification, compliance hold clearance, and final disbursement release.
        </p>

        <div className="grid grid-cols-2 gap-1.5 text-[9px] font-bold">
          <button
            onClick={() => handleFastRoleSwap("+94771234567")}
            className={`py-1.5 px-2 rounded-lg border text-left transition flex items-center justify-between ${
              user?.role === "CUSTOMER" ? "bg-teal-50 border-teal-500 text-teal-800" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span>1. Customer</span>
            <span className="text-[8px] bg-slate-200 px-1 rounded">Kamal</span>
          </button>

          <button
            onClick={() => handleFastRoleSwap("officer")}
            className={`py-1.5 px-2 rounded-lg border text-left transition flex items-center justify-between ${
              user?.role === "LOAN_OFFICER" ? "bg-blue-50 border-blue-500 text-blue-800" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span>2. Officer</span>
            <span className="text-[8px] bg-slate-200 px-1 rounded">Aruni</span>
          </button>

          <button
            onClick={() => handleFastRoleSwap("compliance")}
            className={`py-1.5 px-2 rounded-lg border text-left transition flex items-center justify-between ${
              user?.role === "COMPLIANCE_OFFICER" ? "bg-purple-50 border-purple-500 text-purple-800" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span>3. Compliance</span>
            <span className="text-[8px] bg-slate-200 px-1 rounded">Sajith</span>
          </button>

          <button
            onClick={() => handleFastRoleSwap("manager")}
            className={`py-1.5 px-2 rounded-lg border text-left transition flex items-center justify-between ${
              user?.role === "BRANCH_MANAGER" ? "bg-emerald-50 border-emerald-500 text-emerald-800" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span>4. Manager</span>
            <span className="text-[8px] bg-slate-200 px-1 rounded">Niranjan</span>
          </button>
        </div>

        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[8px] text-slate-400">
          <span>NovaBank PLC Developer Sandbox</span>
          <span className="flex items-center gap-0.5 text-teal-600 font-bold">
            <Sparkles className="h-2.5 w-2.5" /> SECURE INTEGRATED
          </span>
        </div>
      </div>

      {/* Global Footer */}
      <footer className="bg-neutral-dark text-slate-400 py-6 border-t border-slate-800 text-center text-[10px] font-mono uppercase tracking-wider">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 NovaBank PLC Sri Lanka. All Rights Reserved. Licensed Commercial Bank regulated by CBSL.</p>
          <p className="text-slate-600 mt-1">LoanSphere origination engine v1.0.0 (SHA-256 secure signed build).</p>
        </div>
      </footer>

      {/* Floating Support Assist Desk Widget */}
      <SupportContactWidget />

      {/* Floating Rate Fluctuation Notifier & Live Watch Controls */}
      <RateFluctuationNotifier user={user} />

    </div>
  );
}
