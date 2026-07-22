import React
import { motion } from "framer-motion";
, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoanEligibilityCalculator from "./LoanEligibilityCalculator.jsx";
import DebtPortfolioVisualizer from "./DebtPortfolioVisualizer.jsx";
import NotificationCenter from "./NotificationCenter.jsx";
import { Landmark, FileText, ArrowRight, Calculator, CheckCircle2, AlertCircle, Clock, CreditCard, ChevronRight, Download, Eye, ShieldCheck, TrendingUp, Sparkles, HelpCircle } from "lucide-react";
import { exportDisbursedSchedulePDF } from "../utils/pdfExport.js";

export default function DashboardCustomer({ user, token, customerAccounts, customerApplications, fetchCustomerData }) {
  const navigate = useNavigate();
  
  // EMI Calculator state
  const [calcAmount, setCalcAmount] = useState("500000");
  const [calcTenure, setCalcTenure] = useState("24");
  const [calcRate, setCalcRate] = useState("12.5");
  const [calcEmi, setCalcEmi] = useState(null);

  useEffect(() => {
    const handleRateUpdate = (e) => {
      const { interestRate } = e.detail;
      setCalcRate(String(interestRate));
    };
    window.addEventListener("nova-rate-updated", handleRateUpdate);
    return () => window.removeEventListener("nova-rate-updated", handleRateUpdate);
  }, []);

  // Auto re-estimate EMI when parameters or rates dynamically fluctuate
  useEffect(() => {
    const p = parseFloat(calcAmount);
    const r = (parseFloat(calcRate) / 100) / 12;
    const n = parseInt(calcTenure);
    if (p > 0 && r > 0 && n > 0) {
      const emiVal = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      setCalcEmi(Math.round(emiVal));
    }
  }, [calcAmount, calcTenure, calcRate]);

  // E-Sign modal state
  const [selectedAppToSign, setSelectedAppToSign] = useState(null);
  const [signOtp, setSignOtp] = useState("");
  const [signError, setSignError] = useState("");
  const [signSuccess, setSignSuccess] = useState(false);

  // Active Repayment schedule view
  const [selectedRepayApp, setSelectedRepayApp] = useState(null);

  const calculateEmiValue = (e) => {
    e?.preventDefault();
    const p = parseFloat(calcAmount);
    const r = (parseFloat(calcRate) / 100) / 12;
    const n = parseInt(calcTenure);
    if (p > 0 && r > 0 && n > 0) {
      const emiVal = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      setCalcEmi(Math.round(emiVal));
    }
  };

  const handleOpenSignModal = (app) => {
    setSelectedAppToSign(app);
    setSignOtp("");
    setSignError("");
    setSignSuccess(false);
  };

  const handleEsignSubmit = async (e) => {
    e.preventDefault();
    setSignError("");
    if (signOtp !== "123456" && signOtp !== "1234") {
      setSignError("Invalid OTP. For demo purposes, enter '123456' to sign.");
      return;
    }

    try {
      const res = await fetch("/api/v1/loans/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          application_id: selectedAppToSign.application_id,
          signature_method: "SMS_OTP_CLICK_SIGN",
          otp_code: signOtp
        })
      });
      const data = await res.json();
      if (data.success) {
        setSignSuccess(true);
        setTimeout(() => {
          setSelectedAppToSign(null);
          fetchCustomerData();
        }, 1500);
      } else {
        setSignError(data.message || "Signing failed.");
      }
    } catch (err) {
      setSignError("Network error during signing.");
    }
  };

  const handleExportDisbursedPDF = (app) => {
    if (!app) return;
    exportDisbursedSchedulePDF({
      user,
      token,
      application: app
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "DISBURSED": return "bg-success-900/20 text-success-700 border-success-200";
      case "APPROVED": return "bg-primary-900/20 text-primary-700 border-primary-200";
      case "APPROVED_CONDITIONAL": return "bg-warning-900/20 text-warning-700 border-warning-200";
      case "UNDER_REVIEW": return "bg-accent-violet-900/20 text-accent-violet-700 border-accent-violet-200";
      case "SUBMITTED": return "bg-sky-50 text-sky-700 border-sky-200";
      case "REJECTED": return "bg-error-900/20 text-error-700 border-error-200";
      default: return "bg-neutral-900/30 text-neutral-200 border-neutral-700/50";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "DISBURSED": return "Funds Disbursed";
      case "APPROVED": return "Approved (Pending Signature)";
      case "APPROVED_CONDITIONAL": return "Approved with Conditions";
      case "UNDER_REVIEW": return "Under Review";
      case "SUBMITTED": return "Pending Assessment";
      case "REJECTED": return "Application Declined";
      case "SIGNED": return "E-Signed (Pending Release)";
      default: return status;
    }
  };

  const getProgressWidth = (status) => {
    switch (status) {
      case "SUBMITTED": return 12.5;
      case "UNDER_REVIEW": return 37.5;
      case "APPROVED":
      case "APPROVED_CONDITIONAL": return 62.5;
      case "SIGNED": return 87.5;
      case "DISBURSED": return 100;
      case "REJECTED": return 0;
      default: return 0;
    }
  };

  const getWorkflowSteps = (status) => {
    const isRejected = status === "REJECTED";
    return [
      {
        title: "Submission",
        desc: "Document Filed",
        icon: FileText,
        state: isRejected ? "declined" : "completed"
      },
      {
        title: "Verification",
        desc: status === "SUBMITTED" ? "In Progress" : isRejected ? "Halted" : "Passed",
        icon: ShieldCheck,
        state: status === "SUBMITTED" ? "active" : isRejected ? "declined" : "completed"
      },
      {
        title: "Appraisal",
        desc: (status === "SUBMITTED") ? "Pending" : status === "UNDER_REVIEW" ? "In Progress" : isRejected ? "Halted" : "Passed",
        icon: TrendingUp,
        state: (status === "SUBMITTED") ? "pending" : status === "UNDER_REVIEW" ? "active" : isRejected ? "declined" : "completed"
      },
      {
        title: "Approval",
        desc: (status === "SUBMITTED" || status === "UNDER_REVIEW") ? "Pending" : (status === "APPROVED" || status === "APPROVED_CONDITIONAL") ? "User Action" : status === "SIGNED" ? "Offer E-Signed" : isRejected ? "Halted" : "Passed",
        icon: Clock,
        state: (status === "SUBMITTED" || status === "UNDER_REVIEW") ? "pending" : (status === "APPROVED" || status === "APPROVED_CONDITIONAL" || status === "SIGNED") ? "active" : isRejected ? "declined" : "completed"
      },
      {
        title: "Disbursement",
        desc: status === "DISBURSED" ? "Funds Released" : isRejected ? "Halted" : "Pending",
        icon: CheckCircle2,
        state: status === "DISBURSED" ? "completed" : isRejected ? "declined" : "pending"
      }
    ];
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="show" 
      className="space-y-8"
    >
      
      {/* Top Header Row with Portal Branding & Notification Center */}
      <motion.div variants={itemVariants} className="flex items-center justify-between glass-panel rounded-full px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-success-500 animate-pulse"></span>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500">
            NovaBank Secured Session Active
          </span>
        </div>
        <NotificationCenter 
          customerApplications={customerApplications} 
          customerAccounts={customerAccounts} 
        />
      </div>

      {/* 1. Welcome banner & profile summary */}
      <motion.div variants={itemVariants} className="bg-gradient-to-br from-primary-900/60 via-neutral-900 to-black rounded-3xl p-6 md:p-8 text-white shadow-[0_0_40px_rgba(79,70,229,0.15)] border border-neutral-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-3xl">
          <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-full">
            Customer Dashboard
          </span>
          <h2 className="text-xl md:text-2xl font-bold mt-2.5">Ayubowan, {user.fullName}!</h2>
          <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
            Manage your savings accounts, file digital loan applications, track real-time regulatory compliance scoring, and execute binding contracts safely.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10 text-xs">
          <div>
            <span className="text-neutral-400 block">Identified Client NIC:</span>
            <span className="font-mono font-bold text-teal-300">{user.customerDetails?.nic_number}</span>
          </div>
          <div>
            <span className="text-neutral-400 block">Mobile Link:</span>
            <span className="font-mono font-bold text-teal-300">{user.customerDetails?.mobile_number}</span>
          </div>
          <div>
            <span className="text-neutral-400 block">Assigned Risk Profile:</span>
            <span className="font-bold inline-flex items-center gap-1">
              <span className={`h-2 w-2 rounded-full ${user.customerDetails?.risk_tier === "HIGH" ? "bg-error-400" : "bg-success-400"}`}></span>
              {user.customerDetails?.risk_tier || "LOW"} Risk
            </span>
          </div>
        </div>
      </div>

      {/* 2. Action Hub (DAO Account Open & DLO Loans Wizard buttons) */}
      <div className="grid md:grid-cols-12 gap-6">
        
        <div className="md:col-span-8 space-y-6">
          <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-neutral-400">Available Operations</h3>
          <motion.div variants={itemVariants} className="grid sm:grid-cols-2 gap-4">
            
            {/* DAO Action Card */}
            <div className="glass-panel rounded-2xl p-5 rounded-2xl shadow-md shadow-primary/5 hover:shadow-md transition-all group flex flex-col justify-between">
              <div>
                <div className="bg-teal-50 text-teal-600 p-3 rounded-xl inline-block mb-3">
                  <Landmark className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold text-neutral-50">Digital Savings Account Opening</h4>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                  Open an instant savings account fully online using NIC OCR and biometric liveness checks. No branch visit required.
                </p>
              </div>
              <div className="pt-4 border-t border-neutral-700/30 mt-4">
                {customerAccounts && customerAccounts.length > 0 ? (
                  <div className="text-[11px] font-bold text-success-600 flex items-center gap-1.5 bg-success-900/20 py-1.5 px-3 rounded-xl border border-success-100">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Account Active: {customerAccounts[0].account_number}</span>
                  </div>
                ) : (
                  <div className="space-y-3 w-full">
                    <button
                      id="btn-start-dao"
                      onClick={() => navigate("/onboarding")}
                      className="w-full text-left text-[11px] font-bold text-teal-600 hover:text-teal-700 flex items-center justify-between group cursor-pointer bg-neutral-900/30 hover:bg-teal-50/50 p-2 rounded-xl transition-all border border-neutral-700/50 hover:border-teal-300"
                    >
                      <span className="flex items-center gap-1.5">
                        <Landmark className="h-3.5 w-3.5 text-teal-500" />
                        Standard 5-Step Onboarding
                      </span>
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform animate-pulse" />
                    </button>

                    <button
                      id="btn-start-quick-dao"
                      onClick={() => navigate("/quick-open")}
                      className="w-full text-left text-[11px] font-bold text-white bg-teal-600 hover:bg-teal-700 flex items-center justify-between group cursor-pointer p-2.5 rounded-xl transition-all shadow-md shadow-primary/5 shadow-teal-600/10 hover:shadow-md hover:scale-[1.01]"
                    >
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 animate-pulse text-teal-100" />
                        ⚡ Express Quick Open (Instant Setup)
                      </span>
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* DLO Action Card */}
            <div className="glass-panel rounded-2xl p-5 rounded-2xl shadow-md shadow-primary/5 hover:shadow-md transition-all group flex flex-col justify-between">
              <div>
                <div className="bg-primary-900/20 text-primary-600 p-3 rounded-xl inline-block mb-3">
                  <FileText className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold text-neutral-50">Digital Loan Application</h4>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                  Apply for a Personal, Home, Vehicle, or SME Loan. Upload supporting documents and trace live score band updates.
                </p>
              </div>
              <div className="pt-4 border-t border-neutral-700/30 mt-4">
                <button
                  id="btn-start-dlo"
                  onClick={() => navigate("/loan-application")}
                  className="text-[11px] font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 cursor-pointer transition-all duration-200"
                >
                  <span>Launch Loan Wizard</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

          </div>

          {/* Savings Account Details Section (If Opened) */}
          {customerAccounts && customerAccounts.length > 0 && (
            <div className="glass-panel rounded-2xl rounded-2xl p-5 shadow-md shadow-primary/5">
              <h4 className="text-xs font-bold text-neutral-200 mb-3 flex items-center gap-1.5">
                <CreditCard className="h-4 w-4 text-neutral-400" /> Linked Deposit Accounts
              </h4>
              <div className="flex items-center justify-between bg-neutral-900/30 p-3.5 rounded-xl border border-neutral-700/50/50">
                <div>
                  <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">Product Type</span>
                  <p className="text-xs font-bold text-neutral-50">{customerAccounts[0].product_name}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">Account Number</span>
                  <p className="text-xs font-bold font-mono text-teal-600">{customerAccounts[0].account_number}</p>
                </div>
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">Status</span>
                  <p className="text-[11px] px-2 py-0.5 rounded-full bg-success-900/20 border border-success-200 text-success-700 font-bold inline-block">Active</p>
                </div>
              </div>
            </div>
          )}

          {/* Application Pipeline Table */}
          <div className="glass-panel rounded-2xl rounded-2xl shadow-md shadow-primary/5 overflow-hidden">
            <div className="p-5 border-b border-neutral-700/30 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-neutral-50">Your Active Applications</h4>
                <p className="text-[11px] text-neutral-500">Track current workflow states, reviews, and outstanding actions.</p>
              </div>
            </div>

            {customerApplications && customerApplications.length > 0 ? (
              <div className="space-y-6 p-4 bg-neutral-900/30/50">
                {customerApplications.map((app) => (
                  <div 
                    key={app.application_id} 
                    className="glass-panel rounded-2xl/90 rounded-2xl p-5 shadow-md shadow-primary/5 space-y-5 hover:shadow-md transition-all duration-200"
                  >
                    {/* Card Header Info */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-700/30">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold font-mono text-neutral-50 tracking-tight bg-neutral-800/50 px-2.5 py-1 rounded-xl border border-neutral-700/50">
                            Ref: {app.application_ref}
                          </span>
                          <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-xl bg-primary-900/20 border border-primary-100/60 text-primary-700 uppercase tracking-wider">
                            {app.loan_type} LOAN
                          </span>
                        </div>
                        <p className="text-[10px] text-neutral-400 font-mono">
                          Submitted on {new Date(app.submitted_at || app.created_at).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2.5 self-start sm:self-center">
                        <span className={`text-[10px] font-bold font-mono px-3 py-1.5 rounded-full border ${getStatusStyle(app.status)}`}>
                          {getStatusLabel(app.status)}
                        </span>

                        {/* Signature Trigger Action */}
                        {app.status === "APPROVED" && (
                          <button
                            id={`btn-sign-${app.application_id}`}
                            onClick={() => handleOpenSignModal(app)}
                            className="px-3 py-1.5 bg-warning-500 hover:bg-warning-600 text-white rounded-xl text-xs font-bold shadow-md shadow-primary/5 flex items-center gap-1 transition animate-pulse cursor-pointer"
                          >
                            <FileText className="h-3 w-3" />
                            <span>E-Sign Offer</span>
                          </button>
                        )}

                        {/* Repayment Schedule view */}
                        {app.status === "DISBURSED" && (
                          <button
                            id={`btn-repay-${app.application_id}`}
                            onClick={() => setSelectedRepayApp(selectedRepayApp?.application_id === app.application_id ? null : app)}
                            className="px-2.5 py-1.5 border border-neutral-700/50 hover:bg-neutral-800/50 text-neutral-300 rounded-xl text-xs font-medium flex items-center gap-1 transition cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>Schedule</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Request stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-sans">
                      <div>
                        <span className="text-neutral-400 text-[10px] block font-mono uppercase font-bold">Requested Amount</span>
                        <span className="font-bold text-neutral-50 text-sm">LKR {app.requested_amount.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 text-[10px] block font-mono uppercase font-bold">Tenure Term</span>
                        <span className="font-bold text-neutral-50">{app.tenure_months || 36} Months</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 text-[10px] block font-mono uppercase font-bold">Indicative Rate</span>
                        <span className="font-bold text-neutral-50">12.5% p.a. Fixed</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 text-[10px] block font-mono uppercase font-bold">Underwriting Desk</span>
                        <span className="font-bold text-success-600 flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-success-500 inline-block animate-ping"></span>
                          Online
                        </span>
                      </div>
                    </div>

                    {/* Step-by-step progress timeline */}
                    <div className="pt-4 border-t border-neutral-700/30/80">
                      <div className="flex items-center justify-between mb-3.5">
                        <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider">
                          Application Workflow Progress
                        </span>
                        <span className="text-[9px] font-mono text-primary-600 bg-primary-900/20 px-2.5 py-0.5 rounded-full border border-primary-100/60 font-bold">
                          Step-by-Step Live Tracking
                        </span>
                      </div>

                      <div className="relative pt-2">
                        {/* Connecting Line Backing */}
                        <div className="absolute top-[18px] left-[10%] right-[10%] h-1 bg-neutral-800/50 z-0 rounded-full">
                          <div 
                            className="h-full bg-primary-600 rounded-full transition-all duration-500" 
                            style={{ width: `${getProgressWidth(app.status)}%` }}
                          ></div>
                        </div>

                        {/* Workflow Steps Grid */}
                        <div className="grid grid-cols-5 gap-1 text-center relative z-10">
                          {getWorkflowSteps(app.status).map((step, idx) => {
                            const StepIcon = step.icon;
                            const isCompleted = step.state === "completed";
                            const isActive = step.state === "active";
                            const isDeclined = step.state === "declined";

                            return (
                              <div key={idx} className="flex flex-col items-center">
                                {/* Icon container */}
                                <div className={`h-9 w-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                  isCompleted
                                    ? "bg-primary-600 border-primary-600 text-white shadow-md shadow-primary-500/25"
                                    : isActive
                                    ? "bg-neutral-900/50 border-primary-600 text-primary-600 ring-4 ring-primary-50 animate-pulse"
                                    : isDeclined
                                    ? "bg-error-600 border-error-600 text-white"
                                    : "bg-neutral-900/50 border-neutral-700/50 text-neutral-400"
                                }`}>
                                  <StepIcon className="h-4.5 w-4.5" />
                                </div>

                                {/* Step Title */}
                                <span className={`text-[10px] font-bold mt-2.5 truncate max-w-[80px] sm:max-w-none ${
                                  isActive ? "text-primary-600 font-extrabold" : "text-neutral-200"
                                }`}>
                                  {step.title}
                                </span>

                                {/* Step description */}
                                <span className="text-[9px] text-neutral-400 font-mono mt-0.5 whitespace-nowrap">
                                  {step.desc}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-neutral-500 text-xs">
                <FileText className="h-8 w-8 mx-auto text-neutral-300 mb-2" />
                <span>No loan applications submitted yet. Click "Launch Loan Wizard" to get started.</span>
              </div>
            )}
          </div>

          {/* Repayment Schedule Table Details (In-line expansion) */}
          {selectedRepayApp && (
            <div className="glass-panel rounded-2xl rounded-2xl p-5 shadow-md space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-neutral-700/30 pb-3">
                <div>
                  <h4 className="text-xs font-bold text-neutral-50">Repayment Schedule — {selectedRepayApp.application_ref}</h4>
                  <p className="text-[10px] text-neutral-500">First 12 installments generated by NovaBank CBS core ledger engine.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleExportDisbursedPDF(selectedRepayApp)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-error-200 bg-error-900/20 hover:bg-error-100 text-error-700 text-[10px] font-bold rounded-xl cursor-pointer transition shadow-md shadow-primary/5"
                    title="Download Official Amortization Statement PDF"
                    id={`btn-export-disbursed-pdf-${selectedRepayApp.application_id}`}
                  >
                    <FileText className="h-3 w-3 text-error-600" />
                    <span>Export PDF Statement</span>
                  </button>
                  <button
                    onClick={() => setSelectedRepayApp(null)}
                    className="text-xs text-error-500 hover:underline font-bold transition-all duration-200"
                  >
                    Close Schedule
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="border-b border-neutral-700/50 text-neutral-400 font-mono font-bold uppercase bg-neutral-900/30">
                      <th className="py-2 px-3">Ins #</th>
                      <th className="py-2 px-3">Due Date</th>
                      <th className="py-2 px-3">EMI LKR</th>
                      <th className="py-2 px-3">Principal Paid</th>
                      <th className="py-2 px-3">Interest Paid</th>
                      <th className="py-2 px-3">Remaining Bal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 font-mono">
                    {selectedRepayApp.repayment_schedule && selectedRepayApp.repayment_schedule.length > 0 ? (
                      selectedRepayApp.repayment_schedule.map((row) => (
                        <tr key={row.installment_no} className="hover:bg-neutral-900/30 transition-all duration-200">
                          <td className="py-2.5 px-3 font-bold">{row.installment_no}</td>
                          <td className="py-2.5 px-3">{row.dueDate}</td>
                          <td className="py-2.5 px-3 font-bold text-neutral-50">{row.emi.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-success-600">{row.principal.toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-error-500">{row.interest.toLocaleString()}</td>
                          <td className="py-2.5 px-3">{row.balance.toLocaleString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-4 text-center">Schedule calculations pending.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* 3. Interactive EMI Loan Calculator Side-Widget & Debt Portfolio Allocator */}
        <div className="md:col-span-4 space-y-6">
          <DebtPortfolioVisualizer customerApplications={customerApplications} />

          <div className="glass-panel rounded-2xl rounded-3xl p-5 shadow-md shadow-primary/5">
            <h3 className="text-sm font-bold text-neutral-50 mb-4 flex items-center gap-1.5 border-b border-neutral-700/30 pb-2.5">
              <Calculator className="h-4 w-4 text-primary-600" /> Indicative EMI Calculator
            </h3>

            <form onSubmit={calculateEmiValue} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-neutral-500 mb-1">LOAN AMOUNT (LKR)</label>
                <input
                  id="calc-amt"
                  type="number"
                  className="w-full px-3 py-2 border border-neutral-700/50 rounded-xl"
                  value={calcAmount}
                  onChange={(e) => setCalcAmount(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-500 mb-1">TENURE (MONTHS)</label>
                <select
                  id="calc-ten"
                  className="w-full px-3 py-2 border border-neutral-700/50 rounded-xl"
                  value={calcTenure}
                  onChange={(e) => setCalcTenure(e.target.value)}
                >
                  <option value="12">12 Months (1 Year)</option>
                  <option value="24">24 Months (2 Years)</option>
                  <option value="36">36 Months (3 Years)</option>
                  <option value="48">48 Months (4 Years)</option>
                  <option value="60">60 Months (5 Years)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-500 mb-1">ANNUAL INTEREST RATE (%)</label>
                <input
                  id="calc-rate"
                  type="number"
                  step="0.1"
                  className="w-full px-3 py-2 border border-neutral-700/50 rounded-xl"
                  value={calcRate}
                  onChange={(e) => setCalcRate(e.target.value)}
                />
              </div>

              <button
                id="btn-calc-submit"
                type="submit"
                className="w-full btn-premium font-semibold py-2 rounded-xl transition cursor-pointer"
              >
                Estimate Monthly Installment
              </button>

              {calcEmi !== null && (
                <div className="bg-primary-900/20 border border-primary-100 p-4 rounded-xl text-center mt-2.5">
                  <span className="text-[10px] text-neutral-400 uppercase font-mono font-bold">Estimated Monthly Installment</span>
                  <p className="text-lg font-bold text-brand-primary">LKR {calcEmi.toLocaleString()}</p>
                  <span className="text-[9px] text-neutral-400">Exact EMI may vary slightly depending on loan category.</span>
                </div>
              )}
            </form>
          </div>
        </div>

      </div>

      {/* 3. Preliminary Eligibility & Underwriting Calculator */}
      <div className="mt-8">
        <LoanEligibilityCalculator 
          user={user} 
          token={token}
          onStartDLO={() => navigate("/loan-application")} 
        />
      </div>

      {/* 4. PDF E-Signature Modal */}
      {selectedAppToSign && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900/50 w-full max-w-2xl rounded-3xl shadow-xl overflow-hidden animate-fade-in border border-neutral-700/50">
            <div className="bg-neutral-dark text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">NovaBank Digital Signature Portal</h3>
                <p className="text-[10px] text-teal-400 uppercase font-mono mt-0.5">Agreement Code: {selectedAppToSign.application_ref}</p>
              </div>
              <button
                onClick={() => setSelectedAppToSign(null)}
                className="text-neutral-400 hover:text-white font-bold text-xs transition-all duration-200"
              >
                X Close
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-neutral-900/30 border border-neutral-700/50 rounded-2xl p-4 text-xs space-y-2 max-h-60 overflow-y-auto font-sans leading-relaxed">
                <h4 className="font-bold text-center border-b border-neutral-700/50 pb-2 mb-2 uppercase tracking-wide">SECURE DIGITAL OFFER LETTER AGREEMENT</h4>
                <p>This legally binding digital document is issued by **NovaBank PLC**, registered under the Banking Act of Sri Lanka.</p>
                <p><strong>1. Loan Facility:</strong> LKR {selectedAppToSign.requested_amount.toLocaleString()} ({selectedAppToSign.loan_type} category).</p>
                <p><strong>2. Terms of Repayment:</strong> Total tenure of {selectedAppToSign.tenure_months} monthly installments with standard fixed interest rates applied as approved by the Credit Committee.</p>
                <p><strong>3. Binding Nature:</strong> Entering the OTP represents a consent-based signature under the Electronic Transactions Act No. 19 of 2006, equivalent to manual signature.</p>
              </div>

              {signSuccess ? (
                <div className="bg-success-900/20 text-success-800 p-5 rounded-2xl border border-success-100 text-center space-y-2">
                  <CheckCircle2 className="h-8 w-8 text-success-500 mx-auto animate-bounce" />
                  <h5 className="font-bold">E-Signature Captured Successfully!</h5>
                  <p className="text-[11px] text-neutral-300">Generating secure cryptographic envelope and schedule details...</p>
                </div>
              ) : (
                <form onSubmit={handleEsignSubmit} className="space-y-4">
                  {signError && (
                    <div className="bg-error-900/20 text-error-800 text-xs p-3 rounded-xl border border-error-100 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      <span>{signError}</span>
                    </div>
                  )}

                  <div className="bg-warning-900/20 border border-warning-100 text-warning-800 p-3.5 rounded-xl text-center text-[10px] font-semibold">
                    🔑 FOR TESTING: ENTER OTP <strong className="text-xs">123456</strong> TO CONFIRM CLICK-TO-SIGN
                  </div>

                  <div className="flex gap-4 items-end">
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-neutral-500 mb-1">ENTER SMS CODE RECEIVED ON MOBILE LINK</label>
                      <input
                        id="sign-otp"
                        type="text"
                        maxLength={6}
                        className="w-full text-center px-3 py-2 border border-neutral-300 rounded-xl tracking-widest font-mono text-base"
                        placeholder="••••••"
                        value={signOtp}
                        onChange={(e) => setSignOtp(e.target.value)}
                      />
                    </div>
                    <button
                      id="btn-sign-confirm"
                      type="submit"
                      className="px-6 py-2.5 bg-warning-500 hover:bg-warning-600 text-white rounded-xl text-xs font-bold transition h-[42px] cursor-pointer"
                    >
                      Apply Signature
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

    </motion.div>
  );
}
