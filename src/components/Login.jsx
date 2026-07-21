import React, { useState } from "react";
import {
  Landmark,
  Shield,
  Mail,
  Key,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Info,
} from "lucide-react";

/**
 * NovaBank LoanSphere — Login & Registration
 * Professional banking UI, no AI/animated widgets.
 */
export default function Login({ onLoginSuccess }) {
  const [registerMode, setRegisterMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ── Login state ──────────────────────────────────────────────
  const [loginUser, setLoginUser] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // ── Registration state ────────────────────────────────────────
  const [regNic, setRegNic] = useState("");
  const [regName, setRegName] = useState("");
  const [regDob, setRegDob] = useState("");
  const [regMobile, setRegMobile] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regAddress, setRegAddress] = useState("");
  const [regOccupation, setRegOccupation] = useState("");
  const [regFunds, setRegFunds] = useState("Salary");
  const [regTurnover, setRegTurnover] = useState("");
  const [regSuccess, setRegSuccess] = useState(false);
  const [regError, setRegError] = useState("");

  // ── Handlers ──────────────────────────────────────────────────
  const prefillDemo = (val) => {
    setLoginUser(val);
    setLoginPassword("password");
    setLoginError("");
    setRegisterMode(false);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    if (!loginUser) {
      setLoginError("Please enter your username, phone number, or NIC.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginUser, password: loginPassword }),
      });
      const data = await res.json();
      if (data.success) {
        onLoginSuccess(data.token, data.user);
      } else {
        setLoginError(data.message || "Invalid credentials. Please try again.");
      }
    } catch {
      setLoginError("Network error. Could not reach the authentication service.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegError("");
    if (!regNic || !regName || !regDob || !regMobile || !regEmail || !regTurnover) {
      setRegError("Please fill in all mandatory fields marked with *.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nic_number: regNic,
          full_name: regName,
          date_of_birth: regDob,
          mobile_number: regMobile,
          email: regEmail,
          address: regAddress || "Not Provided",
          occupation: regOccupation || "Not Specified",
          source_of_funds: regFunds,
          monthly_turnover: parseFloat(regTurnover),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRegSuccess(true);
        setTimeout(() => onLoginSuccess(data.token, data.user), 1500);
      } else {
        setRegError(data.message || "Registration failed. NIC or mobile may already be registered.");
      }
    } catch {
      setRegError("Network error. Could not reach the registration service.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto my-8 px-4">
      <div className="grid md:grid-cols-12 gap-8 items-start">

        {/* ── Left: Brand Panel ── */}
        <aside className="md:col-span-5 bg-color-brand-primary border border-color-brand-secondary rounded-lg shadow-sm p-6 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-slate-800 p-3 rounded-md text-white">
              <Landmark className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white">NovaBank</h2>
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                LoanSphere Core
              </span>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            Secure digital onboarding suite aligned with Central Bank of Sri Lanka (CBSL) AML and e‑KYC guidelines.
          </p>

          <div className="border-t border-slate-700 pt-4 flex items-start gap-3">
            <div className="bg-slate-700 text-slate-300 p-2 rounded mt-0.5 flex-shrink-0">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-200">Regulatory Compliance</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Full alignment with e‑KYC Guidelines No. 11 of 2018 for automated customer onboarding and AML screening.
              </p>
            </div>
          </div>

          {/* Demo shortcuts */}
          <div className="bg-slate-800 border border-slate-700 rounded-md p-4 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-700">
              <Info className="h-4 w-4 text-slate-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                Test Accounts
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Customer", val: "+94771234567" },
                { label: "Loan Officer", val: "officer" },
                { label: "Compliance", val: "compliance" },
                { label: "Manager", val: "manager" },
                { label: "Admin", val: "admin" },
              ].map((d) => (
                <button
                  key={d.val}
                  type="button"
                  onClick={() => prefillDemo(d.val)}
                  className="text-xs px-3 py-1 bg-slate-700 border border-slate-600 rounded hover:bg-slate-600 transition-colors text-white"
                >
                  {d.label}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-500">All test accounts use password: <code className="font-mono font-bold">password</code></p>
          </div>
        </aside>

        {/* ── Right: Auth Card ── */}
        <div className="md:col-span-7 bg-color-brand-primary border border-color-brand-secondary rounded-lg shadow-sm p-6 sm:p-8">

          {/* ── Registration Form ── */}
          {registerMode ? (
            <div className="space-y-5">
              <div className="pb-4 border-b border-slate-700">
                <h3 className="text-lg font-bold text-white">Create Digital Profile</h3>
                <p className="text-sm text-slate-400 mt-1">Complete e‑KYC onboarding to open a customer account.</p>
              </div>

              {regSuccess ? (
                <div className="flex flex-col items-center gap-3 py-8 text-center bg-emerald-50 border border-emerald-200 rounded-lg">
                  <CheckCircle2 className="h-12 w-12 text-emerald-600" />
                  <h4 className="text-base font-bold text-emerald-800">Registration Successful!</h4>
                  <p className="text-sm text-slate-600">Redirecting to your dashboard…</p>
                </div>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  {regError && (
                    <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-800 text-sm p-3 rounded">
                      <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span>{regError}</span>
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">NIC NUMBER *</label>
                      <input type="text" required value={regNic} onChange={(e) => setRegNic(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-600 rounded text-sm focus:outline-none focus:border-slate-400 bg-slate-800 text-white"
                        placeholder="199234509123" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">FULL NAME *</label>
                      <input type="text" required value={regName} onChange={(e) => setRegName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-600 rounded text-sm focus:outline-none focus:border-slate-400 bg-slate-800 text-white"
                        placeholder="Kamal Bandara" />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">DATE OF BIRTH *</label>
                      <input type="date" required value={regDob} onChange={(e) => setRegDob(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-600 rounded text-sm focus:outline-none focus:border-slate-400 bg-slate-800 text-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">MOBILE NUMBER *</label>
                      <input type="text" required value={regMobile} onChange={(e) => setRegMobile(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-600 rounded text-sm focus:outline-none focus:border-slate-400 bg-slate-800 text-white"
                        placeholder="+94771234567" />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">EMAIL ADDRESS *</label>
                      <input type="email" required value={regEmail} onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-600 rounded text-sm focus:outline-none focus:border-slate-400 bg-slate-800 text-white"
                        placeholder="kamal@gmail.com" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">OCCUPATION</label>
                      <input type="text" value={regOccupation} onChange={(e) => setRegOccupation(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-600 rounded text-sm focus:outline-none focus:border-slate-400 bg-slate-800 text-white"
                        placeholder="Software Engineer" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">RESIDENTIAL ADDRESS</label>
                    <input type="text" value={regAddress} onChange={(e) => setRegAddress(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-slate-500"
                      placeholder="No. 45, Flower Road, Colombo 07" />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">SOURCE OF FUNDS</label>
                      <select value={regFunds} onChange={(e) => setRegFunds(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-slate-500 bg-white">
                        <option value="Salary">Salary</option>
                        <option value="Business Revenue">Business Revenue</option>
                        <option value="Savings">Savings / Inheritance</option>
                        <option value="Foreign Remittance">Foreign Remittance</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">MONTHLY TURNOVER (LKR) *</label>
                      <input type="number" required value={regTurnover} onChange={(e) => setRegTurnover(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-slate-500"
                        placeholder="180000" />
                    </div>
                  </div>

                  <button type="submit" disabled={submitting}
                    className="w-full bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white font-semibold py-2.5 rounded text-sm transition-colors mt-2">
                    {submitting ? "Submitting…" : "Submit Application"}
                  </button>

                  <p className="text-center text-sm text-slate-500 pt-2">
                    Already have an account?{" "}
                    <button type="button" onClick={() => setRegisterMode(false)}
                      className="font-bold text-slate-800 hover:underline">
                      Log in
                    </button>
                  </p>
                </form>
              )}
            </div>

          ) : (
            /* ── Login Form ── */
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-900">Account Login</h3>
                <p className="text-sm text-slate-500 mt-1">Enter your credentials to access your dashboard.</p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-5">
                {loginError && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-800 text-sm p-3 rounded">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">USERNAME / PHONE / NIC</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={loginUser}
                      onChange={(e) => setLoginUser(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-slate-500"
                      placeholder="+94771234567 or officer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">PASSWORD</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-slate-500"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white font-semibold py-2.5 rounded text-sm transition-colors"
                >
                  {submitting ? "Authenticating…" : "Log In Securely"}
                </button>

                <p className="text-center text-sm text-slate-500 pt-2">
                  New customer?{" "}
                  <button type="button" onClick={() => setRegisterMode(true)}
                    className="font-bold text-slate-800 hover:underline">
                    Register here
                  </button>
                </p>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}