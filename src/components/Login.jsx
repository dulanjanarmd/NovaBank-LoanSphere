import React, { useState } from "react";
import LoanEligibilityCalculator from "./LoanEligibilityCalculator.jsx";
import { 
  Landmark, 
  Shield, 
  Mail, 
  Key, 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Info
} from "lucide-react";

/**
 * Login & Registration Interface
 */
export default function Login({ onLoginSuccess }) {
  const [registerMode, setRegisterMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // --- Login Form State ---
  const [loginUser, setLoginUser] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginTouched, setLoginTouched] = useState({});

  // --- Registration Form State ---
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

  // Quick Demo Auto-fill Assist
  const handleDemoFill = (val) => {
    setLoginUser(val);
    setLoginPassword("password");
    setLoginError("");
    setRegisterMode(false);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginTouched({ loginUser: true, loginPassword: true });

    if (!loginUser) {
      setLoginError("Please enter your username.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginUser, password: loginPassword })
      });
      const data = await response.json();

      if (data.success) {
        onLoginSuccess(data.token, data.user);
      } else {
        setLoginError(data.message || "Invalid credentials.");
      }
    } catch (err) {
      setLoginError("Network connection error.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegError("");

    if (!regNic || !regName || !regDob || !regMobile || !regEmail || !regTurnover) {
      setRegError("Please fill all mandatory fields.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nic_number: regNic,
          full_name: regName,
          date_of_birth: regDob,
          mobile_number: regMobile,
          email: regEmail,
          address: regAddress,
          occupation: regOccupation,
          source_of_funds: regFunds,
          monthly_turnover: parseFloat(regTurnover)
        })
      });
      const data = await response.json();

      if (data.success) {
        setRegSuccess(true);
        setTimeout(() => {
          onLoginSuccess(data.token, data.user);
        }, 1500);
      } else {
        setRegError(data.message || "E-KYC Identity collision. NIC or mobile number is already registered.");
      }
    } catch (err) {
      setRegError("Unable to post registration payloads.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-10 max-w-4xl mx-auto my-8">
      <div className="px-4 grid md:grid-cols-12 gap-8 items-stretch text-sm">
      
      {/* Brand Presentation Panel */}
      <div className="md:col-span-5 flex flex-col justify-between space-y-6 text-slate-700 bg-white border border-slate-200 p-6 rounded-lg shadow-sm">
        <div className="space-y-6">
          <div className="flex items-center space-x-3 text-slate-800">
            <div className="bg-slate-800 p-3 rounded-md text-white flex items-center justify-center">
              <Landmark className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">NovaBank</h2>
              <span className="text-slate-500 font-mono text-xs uppercase font-bold tracking-wider block">
                LoanSphere Core
              </span>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-slate-600">
            Secure digital onboarding suite designed to meet stringent Central Bank of Sri Lanka (CBSL) AML standards.
          </p>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-start gap-3">
              <div className="bg-slate-100 text-slate-700 p-2 rounded mt-1">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-800">Regulatory Compliance</h4>
                <p className="text-xs text-slate-500 leading-normal mt-1">
                  Guarantees full alignment with e-KYC Guidelines No. 11 of 2018 for automated customer onboarding.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sandbox Dev Shortcuts */}
        <div className="bg-slate-50 p-4 rounded border border-slate-200 mt-6 space-y-2">
          <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2">
            <Info className="h-4 w-4 text-slate-500" />
            <h4 className="text-xs font-mono font-bold tracking-wider uppercase text-slate-600">
              Test Accounts
            </h4>
          </div>
          
          <div className="flex flex-wrap gap-2 pt-2">
            <button onClick={() => handleDemoFill("+94771234567")} className="text-xs px-3 py-1 bg-white border border-slate-300 rounded hover:bg-slate-100">Customer</button>
            <button onClick={() => handleDemoFill("officer")} className="text-xs px-3 py-1 bg-white border border-slate-300 rounded hover:bg-slate-100">Officer</button>
            <button onClick={() => handleDemoFill("manager")} className="text-xs px-3 py-1 bg-white border border-slate-300 rounded hover:bg-slate-100">Manager</button>
          </div>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="md:col-span-7 bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-sm">
        
        {registerMode ? (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-800">Create Digital Profile</h3>
              <p className="text-sm text-slate-500 mt-1">Provide verified particulars for instant e-KYC matching.</p>
            </div>

            {regSuccess ? (
              <div className="bg-emerald-50 text-emerald-800 p-6 rounded border border-emerald-200 flex flex-col items-center text-center space-y-3 my-4">
                <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                <h4 className="font-bold text-lg">Verification Successful!</h4>
                <p className="text-sm">Creating secure session...</p>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                {regError && (
                  <div className="bg-red-50 text-red-800 text-sm p-3 rounded border border-red-200 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{regError}</span>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">NIC NUMBER *</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-slate-500"
                      value={regNic}
                      onChange={(e) => setRegNic(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">FULL NAME *</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-slate-500"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">DATE OF BIRTH *</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-slate-500"
                      value={regDob}
                      onChange={(e) => setRegDob(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">MOBILE NUMBER *</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-slate-500"
                      value={regMobile}
                      onChange={(e) => setRegMobile(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">EMAIL ADDRESS *</label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-slate-500"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">OCCUPATION</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-slate-500"
                      value={regOccupation}
                      onChange={(e) => setRegOccupation(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">ADDRESS</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-slate-500"
                    value={regAddress}
                    onChange={(e) => setRegAddress(e.target.value)}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">FUNDS SOURCE</label>
                    <select
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-slate-500 bg-white"
                      value={regFunds}
                      onChange={(e) => setRegFunds(e.target.value)}
                    >
                      <option value="Salary">Salary</option>
                      <option value="Business Revenue">Business Revenue</option>
                      <option value="Savings">Savings</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">MONTHLY TURNOVER *</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-slate-500"
                      value={regTurnover}
                      onChange={(e) => setRegTurnover(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-6 bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded transition duration-200 text-sm flex items-center justify-center gap-2"
                >
                  {submitting ? "Processing..." : "Submit Application"}
                </button>

                <p className="text-center text-sm text-slate-500 pt-4">
                  Already registered?{" "}
                  <button type="button" onClick={() => setRegisterMode(false)} className="text-slate-800 font-bold hover:underline">
                    Log in here
                  </button>
                </p>
              </form>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-800">Account Login</h3>
              <p className="text-sm text-slate-500 mt-1">Enter registered credentials to access your dashboard.</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-5">
              {loginError && (
                <div className="bg-red-50 text-red-800 text-sm p-3 rounded border border-red-200 flex items-center gap-2">
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
                    className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-slate-500"
                    value={loginUser}
                    onChange={(e) => setLoginUser(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">PASSWORD</label>
                <div className="relative">
                  <Key className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full pl-10 pr-10 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-slate-500"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                  <button
                      Back to Login
                    </button>
                    <button
                      id="btn-mfa-verify"
                      type="submit"
                      className="w-1/2 bg-brand-accent hover:bg-amber-600 text-white font-bold py-2 rounded-xl text-xs transition duration-150 shadow"
                    >
                      Authenticate Tokens
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

      </div>
    </div>

    {/* Public Interactive Loan Eligibility Calculator */}
    <div className="px-4">
      <LoanEligibilityCalculator 
        onNavigateToRegister={() => setRegisterMode(true)} 
      />
    </div>
  </div>
  );
}
