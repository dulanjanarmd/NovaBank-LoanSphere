import React from "react";
import { Landmark, LogOut, UserCircle2, ShieldCheck, HelpCircle } from "lucide-react";
import novabankLogo from "../assets/images/novabank_logo_1784551514973.jpg";
import ThemeToggle from "./ThemeToggle.jsx";
import { motion } from "framer-motion";

export default function Navbar({ user, onLogout }) {
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "LOAN_OFFICER": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "COMPLIANCE_OFFICER": return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "BRANCH_MANAGER": return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "ADMIN": return "bg-red-500/20 text-red-300 border-red-500/30";
      default: return "bg-neutral-500/20 text-neutral-300 border-neutral-500/30";
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
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="w-full glass-panel rounded-full shadow-2xl text-neutral-50 px-2"
    >
      <div className="mx-auto px-2 sm:px-4 lg:px-6 h-16 flex items-center justify-between">

        {/* Branding & Logo */}
        <div className="flex items-center space-x-3">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="h-10 w-10 rounded-full overflow-hidden shadow-lg shadow-primary-500/20 border border-neutral-700/50"
          >
            <img
              src={novabankLogo}
              alt="NovaBank Logo"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
          </motion.div>
          <div>
            <h1 className="text-lg font-bold font-sans tracking-tight flex items-center gap-2">
              <span className="text-neutral-50 text-gradient">NovaBank</span>
              <span className="text-primary-300 font-normal text-[10px] bg-primary-900/50 px-2 py-0.5 rounded-full border border-primary-700/50 backdrop-blur-md">LoanSphere</span>
            </h1>
            <p className="text-[9px] text-neutral-400 tracking-wider uppercase font-mono">Digital Onboarding & Credit Suite</p>
          </div>
        </div>

        {/* User context & profile actions & Theme Toggle */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />

          {user ? (
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex flex-col items-end text-right">
                <span className="text-sm font-semibold text-neutral-50">{user.fullName}</span>
                <span className={`text-[9px] font-mono font-medium px-2 py-0.5 mt-0.5 rounded-full border ${getRoleBadgeColor(user.role)}`}>
                  {getRoleLabel(user.role)}
                </span>
              </div>

              <div className="h-9 w-px bg-neutral-700/50 hidden sm:block"></div>

              <div className="flex items-center space-x-2">
                <span className="p-1.5 rounded-full bg-neutral-800/50 text-neutral-300 md:hidden flex items-center justify-center">
                  <UserCircle2 className="h-5 w-5" />
                </span>

                <motion.button
                  id="btn-logout"
                  onClick={onLogout}
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(244, 63, 94, 0.15)" }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-1.5 px-3 py-2 text-xs font-bold text-error-400 rounded-full transition-colors"
                  title="Logout from active session"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3 text-xs text-neutral-400 font-medium">
              <span className="flex items-center gap-1 text-primary-400 bg-primary-900/20 px-3 py-1 rounded-full border border-primary-500/20">
                <ShieldCheck className="h-4 w-4" /> SECURE SSL (AES-256)
              </span>
            </div>
          )}
        </div>

      </div>
    </motion.header>
  );
}
