import React from "react";
import { Landmark, LogOut, UserCircle2, ShieldCheck, HelpCircle } from "lucide-react";
import novabankLogo from "../assets/images/novabank_logo_1784551514973.jpg";
import ThemeToggle from "./ThemeToggle.jsx";

export default function Navbar({ user, onLogout }) {
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "LOAN_OFFICER": return "bg-blue-100 text-blue-800 border-blue-200";
      case "COMPLIANCE_OFFICER": return "bg-purple-100 text-purple-800 border-purple-200";
      case "BRANCH_MANAGER": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "ADMIN": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case "LOAN_OFFICER": return "Loan Officer";
      case "COMPLIANCE_OFFICER": return "Compliance & AML";
      case "BRANCH_MANAGER": return "Branch Manager (Approver)";
      case "ADMIN": return "System Administrator";
      default: return "Customer Portal";
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-neutral-dark border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Branding & Logo */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl overflow-hidden shadow-lg shadow-teal-500/10 border border-slate-800">
            <img
              src={novabankLogo}
              alt="NovaBank Logo"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-lg font-bold font-sans tracking-tight flex items-center gap-1.5">
              <span>NovaBank</span>
              <span className="text-teal-400 font-normal text-xs bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">LoanSphere</span>
            </h1>
            <p className="text-[10px] text-slate-400 tracking-wider uppercase font-mono">Digital Onboarding & Credit Suite</p>
          </div>
        </div>

        {/* User context & profile actions & Theme Toggle */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex flex-col items-end text-right">
                <span className="text-sm font-semibold text-slate-200">{user.fullName}</span>
                <span className={`text-[10px] font-mono font-medium px-2 py-0.5 mt-0.5 rounded-full border ${getRoleBadgeColor(user.role)}`}>
                  {getRoleLabel(user.role)}
                </span>
              </div>
              
              <div className="h-9 w-px bg-slate-800 hidden sm:block"></div>
  
              <div className="flex items-center space-x-2">
                <span className="p-1.5 rounded-lg bg-slate-800 text-slate-300 md:hidden flex items-center justify-center">
                  <UserCircle2 className="h-5 w-5" />
                </span>
                
                <button
                  id="btn-logout"
                  onClick={onLogout}
                  className="flex items-center space-x-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all duration-200"
                  title="Logout from active session"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1 text-teal-400">
                <ShieldCheck className="h-4 w-4" /> SECURE SSL (AES-256)
              </span>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
