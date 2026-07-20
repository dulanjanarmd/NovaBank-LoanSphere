import React, { useState } from "react";
import LoanEligibilityCalculator from "./LoanEligibilityCalculator.jsx";
import { 
  Landmark, 
  Shield, 
  Mail, 
  Key, 
  UserCheck, 
  AlertCircle, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  ChevronRight,
  Info
} from "lucide-react";

/**
 * Login & Registration Interface
 * 
 * DESIGN INTEGRATION NOTES FOR SPRING BOOT:
 * - Registration fields map precisely to `RegisterRequest` in AuthController.java & the MySQL `customers` table.
 * - Login credentials map to `LoginRequest` in AuthController.java & the MySQL `users`/`customers` table.
 * - Simulates local storage token caching (mock JWT flow) before forwarding success state up to App.jsx.
 */
export default function Login({ onLoginSuccess, registerMode, setRegisterMode }) {
  // --- UI and General State ---
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // --- Login Form State ---
  const [loginUser, setLoginUser] = useState("");
  const [loginPassword, setLoginPassword] = useState("password");
  const [loginError, setLoginError] = useState("");
  const [loginTouched, setLoginTouched] = useState({});

  // --- Multi-Factor Authentication (MFA) State ---
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [mfaError, setMfaError] = useState("");
  const [tempToken, setTempToken] = useState(null);
  const [tempUser, setTempUser] = useState(null);

  // --- Registration Form State ---
  const [regNic, setRegNic] = useState("");
  const [regName, setRegName] = useState("");
  const [regDob, setRegDob] = useState("1994-08-12");
  const [regMobile, setRegMobile] = useState("+94771234567");
  const [regEmail, setRegEmail] = useState("");
  const [regAddress, setRegAddress] = useState("");
  const [regOccupation, setRegOccupation] = useState("Corporate Employee");
  const [regFunds, setRegFunds] = useState("Salary");
  const [regTurnover, setRegTurnover] = useState("180000");

  // Real-time validation states
  const [regErrors, setRegErrors] = useState({});
  const [regTouched, setRegTouched] = useState({});
  const [regSuccess, setRegSuccess] = useState(false);
  const [regError, setRegError] = useState("");

  // Demo Assist Config
  const demoUsers = [
    { label: "Customer (Kamal)", val: "+94771234567", role: "CUSTOMER" },
    { label: "Loan Officer (Aruni)", val: "officer", role: "STAFF" },
    { label: "Compliance (Sajith)", val: "compliance", role: "STAFF" },
    { label: "Branch Manager (Niranjan)", val: "manager", role: "STAFF" },
    { label: "Admin (System)", val: "admin", role: "STAFF" }
  ];

  // --- Validation Business Logic ---

  /**
   * Validate Sri Lankan NIC (National Identity Card) Format
   * CBSL Compliance: Mandatory for verifying local customer identity.
   */
  const validateNic = (val) => {
    if (!val) return "NIC number is required for digital verification.";
    // Matches classic 9 digits + V/X OR modern 12 digits
    const nicRegex = /^([0-9]{9}[vVxX]|[0-9]{12})$/;
    if (!nicRegex.test(val)) {
      return "Invalid Format: Must be 9 digits + 'V'/'X' or 12 digits.";
    }
    return "";
  };

  /**
   * Validate Full Name
   * KYC Policy: Ensure full name matches official state registers.
   */
  const validateName = (val) => {
    if (!val || val.trim().length < 3) return "Full Name must be at least 3 characters long.";
    if (!/^[A-Za-z\s.]+$/.test(val)) {
      return "Letters, spaces, and dots are only permitted.";
    }
    return "";
  };

  /**
   * Validate Applicant Date of Birth
   * Legal constraint: Customer must be >= 18 years old to legally open accounts/loans.
   */
  const validateDob = (val) => {
    if (!val) return "Date of Birth is mandatory.";
    const birthDate = new Date(val);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 18) {
      return `Age restriction: Applicant is ${age} years old. Must be at least 18.`;
    }
    if (age > 110) {
      return "Please enter a valid Date of Birth.";
    }
    return "";
  };

  /**
   * Validate Sri Lankan Mobile Number
   * OTP Compliance: Must register a reliable, verifiable SMS endpoint.
   */
  const validateMobile = (val) => {
    if (!val) return "Mobile number is required.";
    // Matches Sri Lankan formats: +94771234567, 0771234567, or 771234567
    const mobileRegex = /^(?:\+94|0)?7[0-9]{8}$/;
    if (!mobileRegex.test(val)) {
      return "Format invalid. Must be a Sri Lankan mobile number (e.g., +94771234567).";
    }
    return "";
  };

  /**
   * Validate Email Address
   */
  const validateEmail = (val) => {
    if (!val) return "Email address is required.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) {
      return "Invalid email address format.";
    }
    return "";
  };

  /**
   * Validate Monthly Turnover
   * AML Check: Required for setting transaction velocity thresholds.
   */
  const validateTurnover = (val) => {
    if (!val) return "Declared monthly turnover is required.";
    const num = parseFloat(val);
    if (isNaN(num) || num <= 0) {
      return "Please declare a valid positive monetary turnover amount.";
    }
    return "";
  };

  // Run dynamic registration validations on specific field changes
  const handleRegFieldChange = (field, value, validator) => {
    // Update raw state value dynamically
    switch(field) {
      case "regNic": setRegNic(value); break;
      case "regName": setRegName(value); break;
      case "regDob": setRegDob(value); break;
      case "regMobile": setRegMobile(value); break;
      case "regEmail": setRegEmail(value); break;
      case "regAddress": setRegAddress(value); break;
      case "regOccupation": setRegOccupation(value); break;
      case "regFunds": setRegFunds(value); break;
      case "regTurnover": setRegTurnover(value); break;
      default: break;
    }

    // Evaluate live errors
    if (validator) {
      const errorMsg = validator(value);
      setRegErrors(prev => ({ ...prev, [field]: errorMsg }));
    }
  };

  // On blur validations
  const handleRegBlur = (field, value, validator) => {
    setRegTouched(prev => ({ ...prev, [field]: true }));
    if (validator) {
      const errorMsg = validator(value);
      setRegErrors(prev => ({ ...prev, [field]: errorMsg }));
    }
  };

  // Quick Demo Auto-fill Assist
  const handleDemoFill = (item) => {
    setLoginUser(item.val);
    setLoginPassword("password");
    setLoginError("");
    setMfaRequired(false);
  };

  // --- Form Submission Handlers ---

  /**
   * Secure Login Form Handler
   */
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginTouched({ loginUser: true, loginPassword: true });

    if (!loginUser) {
      setLoginError("Please enter your username, NIC, or registered mobile number.");
      return;
    }
    if (!loginPassword || loginPassword.length < 4) {
      setLoginError("Password must be at least 4 characters long.");
      return;
    }

    setSubmitting(true);
    try {
      // Direct REST API Call configured in server.ts (proxied in build sandbox)
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginUser, password: loginPassword })
      });
      const data = await response.json();

      if (data.success) {
        // If staff, require simulated Multi-Factor Authentication
        if (data.user.role !== "CUSTOMER") {
          setMfaRequired(true);
          setTempToken(data.token);
          setTempUser(data.user);
        } else {
          onLoginSuccess(data.token, data.user);
        }
      } else {
        setLoginError(data.message || "Invalid credentials. Please verify username and security password.");
      }
    } catch (err) {
      setLoginError("Network connection error. Unable to synchronize with authentication microservice.");
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Simulated SMS MFA Verification Challenge for internal audit staff
   */
  const handleMfaSubmit = (e) => {
    e.preventDefault();
    setMfaError("");
    
    // Standard sandbox test credentials
    if (mfaCode === "123456" || mfaCode === "1234") {
      onLoginSuccess(tempToken, tempUser);
    } else {
      setMfaError("MFA Verification failed. Enter test credential '123456' to access compliance sandbox.");
    }
  };

  /**
   * Onboarding Customer Registration Handler with comprehensive validation guards
   */
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegError("");

    // Force touch & validate all fields to prevent skipped validation states
    const errorsMap = {
      regNic: validateNic(regNic),
      regName: validateName(regName),
      regDob: validateDob(regDob),
      regMobile: validateMobile(regMobile),
      regEmail: validateEmail(regEmail),
      regTurnover: validateTurnover(regTurnover),
    };

    setRegErrors(errorsMap);
    setRegTouched({
      regNic: true,
      regName: true,
      regDob: true,
      regMobile: true,
      regEmail: true,
      regTurnover: true,
    });

    const hasErrors = Object.values(errorsMap).some(err => err !== "");
    if (hasErrors) {
      setRegError("Please correct the validation errors highlighted in red before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      // Connect to the REST endpoint (matches Spring Boot controller mapped structure)
      const response = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nic_number: regNic,
          full_name: regName,
          date_of_birth: regDob,
          mobile_number: regMobile,
          email: regEmail,
          address: regAddress || "Declared No-Fixed Address",
          occupation: regOccupation || "Unemployed / Student",
          source_of_funds: regFunds,
          monthly_turnover: parseFloat(regTurnover)
        })
      });
      const data = await response.json();

      if (data.success) {
        setRegSuccess(true);
        // Soft transition delay to display liveness/verification progress animations
        setTimeout(() => {
          onLoginSuccess(data.token, data.user);
        }, 1500);
      } else {
        setRegError(data.message || "E-KYC Identity collision. NIC or mobile number is already registered.");
      }
    } catch (err) {
      setRegError("Unable to post registration payloads. Check server or local db connectivity.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-10 max-w-4xl mx-auto my-8">
      <div className="px-4 grid md:grid-cols-12 gap-8 items-stretch animate-fade-in text-xs">
      
      {/* Brand Presentation Panel */}
      <div className="md:col-span-5 flex flex-col justify-between space-y-6 text-slate-700 bg-slate-100/60 border border-slate-200/50 p-6 rounded-3xl">
        <div className="space-y-6">
          <div className="flex items-center space-x-3 text-brand-primary">
            <div className="bg-brand-primary p-3 rounded-2xl text-white shadow-xl shadow-blue-900/10 flex items-center justify-center">
              <Landmark className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">NovaBank</h2>
              <span className="text-brand-secondary font-mono text-[9px] uppercase font-bold tracking-wider block">
                LoanSphere Core Eng
              </span>
            </div>
          </div>

          <p className="text-[11px] leading-relaxed text-slate-500">
            A state-of-the-art secure digital onboarding suite designed to meet stringent Central Bank of Sri Lanka (CBSL) AML standards and automated credit risk assessments.
          </p>

          <div className="space-y-3.5 pt-2">
            <div className="flex items-start gap-3">
              <div className="bg-blue-50 text-brand-primary p-1 rounded-lg mt-0.5">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-[11px] font-semibold text-slate-800">Regulatory Compliance (CDD Rules)</h4>
                <p className="text-[10px] text-slate-500 leading-normal">
                  Guarantees full alignment with e-KYC Guidelines No. 11 of 2018 for automated customer onboarding and watchlist scans.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-teal-50 text-brand-secondary p-1 rounded-lg mt-0.5">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-[11px] font-semibold text-slate-800">Smart Underwriting Engine</h4>
                <p className="text-[10px] text-slate-500 leading-normal">
                  Runs dynamic debt-to-income (DTI) calibrations, biometrics liveness validation scores, and internal risk categorization.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sandbox Dev Shortcuts */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-2.5">
          <div className="flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
            <Info className="h-3 w-3 text-brand-secondary" />
            <h4 className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-400">
              Dev Sandbox Fast-Pass
            </h4>
          </div>
          
          <div className="flex flex-wrap gap-1.5">
            {demoUsers.map((item, idx) => (
              <button
                key={idx}
                id={`demo-user-${idx}`}
                type="button"
                onClick={() => {
                  setRegisterMode(false);
                  handleDemoFill(item);
                }}
                className={`text-[10px] font-medium px-2.5 py-1.5 rounded-lg border transition-all duration-150 flex items-center gap-1 ${
                  loginUser === item.val
                    ? "bg-brand-primary text-white border-brand-primary shadow-sm scale-[1.02]"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <UserCheck className="h-3 w-3" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="md:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md relative flex flex-col justify-between">
        
        {/* Decorative corner blur accent */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-secondary/5 rounded-full filter blur-xl pointer-events-none"></div>

        {/* REGISTER SECTION */}
        {registerMode ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-md font-bold text-slate-800">Create Digital Profile</h3>
              <p className="text-[11px] text-slate-400">Provide verified National Identity particulars for instant e-KYC matching.</p>
            </div>

            {regSuccess ? (
              <div className="bg-emerald-50 text-emerald-800 p-8 rounded-2xl border border-emerald-100 flex flex-col items-center text-center space-y-3 my-4 animate-fade-in">
                <CheckCircle2 className="h-12 w-12 text-brand-secondary animate-bounce" />
                <h4 className="text-sm font-bold">Verification Successful!</h4>
                <p className="text-xs text-slate-600 max-w-xs">
                  Biometric liveness passed. Generating secure cryptographically-signed JWT session tokens...
                </p>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                {regError && (
                  <div className="bg-rose-50 text-rose-800 text-[11px] p-3.5 rounded-xl border border-rose-100 flex items-start gap-2 animate-shake">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{regError}</span>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">
                      NIC NUMBER <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="reg-nic"
                      type="text"
                      className={`w-full px-3 py-1.5 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-secondary transition-all ${
                        regTouched.regNic
                          ? regErrors.regNic
                            ? "border-rose-400 bg-rose-50/20"
                            : "border-emerald-400 bg-emerald-50/10"
                          : "border-slate-200"
                      }`}
                      placeholder="e.g., 199434509123 or 943450912V"
                      value={regNic}
                      onChange={(e) => handleRegFieldChange("regNic", e.target.value, validateNic)}
                      onBlur={() => handleRegBlur("regNic", regNic, validateNic)}
                    />
                    {regTouched.regNic && regErrors.regNic && (
                      <span className="text-[9px] text-rose-600 mt-1 block font-medium">
                        {regErrors.regNic}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">
                      FULL NAME (AS PER NIC) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="reg-name"
                      type="text"
                      className={`w-full px-3 py-1.5 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-secondary transition-all ${
                        regTouched.regName
                          ? regErrors.regName
                            ? "border-rose-400 bg-rose-50/20"
                            : "border-emerald-400 bg-emerald-50/10"
                          : "border-slate-200"
                      }`}
                      placeholder="Kamal Bandara"
                      value={regName}
                      onChange={(e) => handleRegFieldChange("regName", e.target.value, validateName)}
                      onBlur={() => handleRegBlur("regName", regName, validateName)}
                    />
                    {regTouched.regName && regErrors.regName && (
                      <span className="text-[9px] text-rose-600 mt-1 block font-medium">
                        {regErrors.regName}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">
                      DATE OF BIRTH <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="reg-dob"
                      type="date"
                      className={`w-full px-3 py-1.5 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-secondary transition-all ${
                        regTouched.regDob
                          ? regErrors.regDob
                            ? "border-rose-400 bg-rose-50/20"
                            : "border-emerald-400 bg-emerald-50/10"
                          : "border-slate-200"
                      }`}
                      value={regDob}
                      onChange={(e) => handleRegFieldChange("regDob", e.target.value, validateDob)}
                      onBlur={() => handleRegBlur("regDob", regDob, validateDob)}
                    />
                    {regTouched.regDob && regErrors.regDob && (
                      <span className="text-[9px] text-rose-600 mt-1 block font-medium">
                        {regErrors.regDob}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">
                      MOBILE NUMBER <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="reg-mobile"
                      type="text"
                      className={`w-full px-3 py-1.5 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-secondary transition-all ${
                        regTouched.regMobile
                          ? regErrors.regMobile
                            ? "border-rose-400 bg-rose-50/20"
                            : "border-emerald-400 bg-emerald-50/10"
                          : "border-slate-200"
                      }`}
                      placeholder="e.g., +94771234567"
                      value={regMobile}
                      onChange={(e) => handleRegFieldChange("regMobile", e.target.value, validateMobile)}
                      onBlur={() => handleRegBlur("regMobile", regMobile, validateMobile)}
                    />
                    {regTouched.regMobile && regErrors.regMobile && (
                      <span className="text-[9px] text-rose-600 mt-1 block font-medium">
                        {regErrors.regMobile}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">
                      EMAIL ADDRESS <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="reg-email"
                      type="email"
                      className={`w-full px-3 py-1.5 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-secondary transition-all ${
                        regTouched.regEmail
                          ? regErrors.regEmail
                            ? "border-rose-400 bg-rose-50/20"
                            : "border-emerald-400 bg-emerald-50/10"
                          : "border-slate-200"
                      }`}
                      placeholder="kamal@gmail.com"
                      value={regEmail}
                      onChange={(e) => handleRegFieldChange("regEmail", e.target.value, validateEmail)}
                      onBlur={() => handleRegBlur("regEmail", regEmail, validateEmail)}
                    />
                    {regTouched.regEmail && regErrors.regEmail && (
                      <span className="text-[9px] text-rose-600 mt-1 block font-medium">
                        {regErrors.regEmail}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">
                      CURRENT OCCUPATION
                    </label>
                    <input
                      id="reg-occupation"
                      type="text"
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                      placeholder="Software Engineer"
                      value={regOccupation}
                      onChange={(e) => handleRegFieldChange("regOccupation", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">
                    RESIDENTIAL STREET ADDRESS
                  </label>
                  <input
                    id="reg-address"
                    type="text"
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-secondary"
                    placeholder="No. 45, Flower Road, Colombo 07"
                    value={regAddress}
                    onChange={(e) => handleRegFieldChange("regAddress", e.target.value)}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">
                      PRIMARY FUNDS SOURCE
                    </label>
                    <select
                      id="reg-funds"
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-secondary bg-white"
                      value={regFunds}
                      onChange={(e) => handleRegFieldChange("regFunds", e.target.value)}
                    >
                      <option value="Salary">Salary / Corporate Employment</option>
                      <option value="Business Revenue">Sole Proprietorship / Business Revenue</option>
                      <option value="Savings">Family Inheritance / Savings</option>
                      <option value="Foreign Remittance">Foreign Worker Remittance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">
                      MONTHLY DECLARED TURNOVER (LKR) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="reg-turnover"
                      type="number"
                      className={`w-full px-3 py-1.5 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-secondary transition-all ${
                        regTouched.regTurnover
                          ? regErrors.regTurnover
                            ? "border-rose-400 bg-rose-50/20"
                            : "border-emerald-400 bg-emerald-50/10"
                          : "border-slate-200"
                      }`}
                      placeholder="180000"
                      value={regTurnover}
                      onChange={(e) => handleRegFieldChange("regTurnover", e.target.value, validateTurnover)}
                      onBlur={() => handleRegBlur("regTurnover", regTurnover, validateTurnover)}
                    />
                    {regTouched.regTurnover && regErrors.regTurnover && (
                      <span className="text-[9px] text-rose-600 mt-1 block font-medium">
                        {regErrors.regTurnover}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  id="btn-register-submit"
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-3 bg-brand-secondary hover:bg-teal-600 text-white font-semibold py-2.5 rounded-xl transition duration-200 cursor-pointer text-xs flex items-center justify-center gap-1.5 shadow"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Validating KYC Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Onboarding Application & Issue JWT</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] text-slate-500 pt-1">
                  Already registered?{" "}
                  <button 
                    type="button" 
                    onClick={() => setRegisterMode(false)} 
                    className="text-brand-primary font-bold hover:underline"
                  >
                    Authenticate Session
                  </button>
                </p>
              </form>
            )}
          </div>
        ) : (
          /* LOGIN SECTION */
          <div className="space-y-5">
            {!mfaRequired ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-bold text-slate-800">Authenticate Account</h3>
                  <p className="text-[11px] text-slate-400">Enter security tokens or registered credentials to access services.</p>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                  {loginError && (
                    <div className="bg-rose-50 text-rose-800 text-[11px] p-3 rounded-xl border border-rose-100 flex items-center gap-2 animate-shake">
                      <AlertCircle className="h-4 w-4 flex-shrink-0 text-rose-500" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">
                      USERNAME / PHONE / NIC IDENTIFIER
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        id="login-user"
                        type="text"
                        className={`w-full pl-10 pr-3 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary ${
                          loginTouched.loginUser && !loginUser ? "border-rose-300 bg-rose-50/10" : "border-slate-200"
                        }`}
                        placeholder="e.g., +94771234567 or officer / manager"
                        value={loginUser}
                        onChange={(e) => {
                          setLoginUser(e.target.value);
                          if (loginTouched.loginUser) setLoginTouched(prev => ({ ...prev, loginUser: false }));
                        }}
                        onBlur={() => setLoginTouched(prev => ({ ...prev, loginUser: true }))}
                      />
                    </div>
                    {loginTouched.loginUser && !loginUser && (
                      <span className="text-[9px] text-rose-600 mt-1 block">Username/Phone/NIC is required.</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">
                      SECURITY PASSPHRASE
                    </label>
                    <div className="relative">
                      <Key className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        className="w-full pl-10 pr-10 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    id="btn-login-submit"
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-brand-primary hover:bg-blue-800 text-white font-semibold py-2.5 rounded-xl transition duration-200 cursor-pointer text-xs flex items-center justify-center gap-1.5 shadow"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        <span>Validating Credentials...</span>
                      </>
                    ) : (
                      <>
                        <span>Verify Secure Session</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-slate-500 pt-1">
                    New applicant?{" "}
                    <button 
                      type="button" 
                      onClick={() => setRegisterMode(true)} 
                      className="text-brand-secondary font-bold hover:underline"
                    >
                      Apply Online Now
                    </button>
                  </p>
                </form>
              </div>
            ) : (
              /* Simulated SMS OTP Access Token Challenge */
              <div className="space-y-4 animate-fade-in text-center">
                <div className="inline-flex bg-brand-accent/10 text-brand-accent p-3.5 rounded-full mb-1">
                  <Send className="h-5 w-5 animate-pulse" />
                </div>
                
                <div>
                  <h3 className="text-md font-bold text-slate-800">Two-Factor OTP Security Challenge</h3>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                    We sent an end-to-end encrypted verification OTP code to your registered corporate security device.
                  </p>
                </div>

                <form onSubmit={handleMfaSubmit} className="space-y-4 text-left">
                  {mfaError && (
                    <div className="bg-rose-50 text-rose-800 text-[11px] p-3 rounded-xl border border-rose-100 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 flex-shrink-0 text-rose-500" />
                      <span>{mfaError}</span>
                    </div>
                  )}

                  <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-[11px] text-slate-600 text-center font-mono">
                    SANDBOX ACCESS CODE: <span className="font-bold text-brand-secondary text-xs">123456</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-500 text-center uppercase tracking-wider">
                      SMS Code
                    </label>
                    <input
                      id="mfa-code"
                      type="text"
                      maxLength={6}
                      className="w-32 mx-auto block text-center px-3 py-2 text-base tracking-widest font-mono font-bold border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-accent bg-slate-50"
                      placeholder="••••••"
                      value={mfaCode}
                      onChange={(e) => setMfaCode(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      id="btn-mfa-cancel"
                      type="button"
                      onClick={() => setMfaRequired(false)}
                      className="w-1/2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium py-2 rounded-xl text-xs transition duration-150"
                    >
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
