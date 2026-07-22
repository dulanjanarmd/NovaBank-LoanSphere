import React, { useState, useEffect } from "react";
import { 
  Calculator, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Info, 
  HelpCircle, 
  ArrowRight, 
  Percent, 
  DollarSign, 
  Calendar,
  Briefcase,
  Home,
  Car,
  Building,
  User,
  Activity,
  ShieldCheck,
  RefreshCw
} from "lucide-react";
import LoanAmortizationSchedule from "./LoanAmortizationSchedule.jsx";

const PRODUCT_SPECS = {
  PERSONAL: {
    id: 101,
    name: "Speedy Personal Loan",
    minAmount: 50000,
    maxAmount: 1000000,
    interestRate: 14.5,
    defaultTenure: 24,
    maxTenure: 60,
    minIncome: 50000,
    maxDti: 50,
    icon: User,
    color: "blue"
  },
  HOME: {
    id: 102,
    name: "Dream Home Loan",
    minAmount: 1000000,
    maxAmount: 25000000,
    interestRate: 11.2,
    defaultTenure: 120,
    maxTenure: 240,
    minIncome: 150000,
    maxDti: 60,
    icon: Home,
    color: "indigo"
  },
  VEHICLE: {
    id: 103,
    name: "WheelSphere Vehicle Loan",
    minAmount: 500000,
    maxAmount: 10000000,
    interestRate: 12.8,
    defaultTenure: 60,
    maxTenure: 84,
    minIncome: 80000,
    maxDti: 55,
    icon: Car,
    color: "teal"
  },
  SME: {
    id: 104,
    name: "SME Growth Engine Loan",
    minAmount: 1000000,
    maxAmount: 50000000,
    interestRate: 13.5,
    defaultTenure: 48,
    maxTenure: 120,
    minIncome: 200000,
    maxDti: 65,
    icon: Building,
    color: "emerald"
  }
};

export default function LoanEligibilityCalculator({ user, token, onStartDLO, onNavigateToRegister }) {
  const [loanType, setLoanType] = useState("PERSONAL");
  const [income, setIncome] = useState(120000);
  const [desiredAmount, setDesiredAmount] = useState(500000);
  const [tenure, setTenure] = useState(36);
  const [liabilities, setLiabilities] = useState(15000);

  const [rates, setRates] = useState({
    PERSONAL: PRODUCT_SPECS.PERSONAL.interestRate,
    HOME: PRODUCT_SPECS.HOME.interestRate,
    VEHICLE: PRODUCT_SPECS.VEHICLE.interestRate,
    SME: PRODUCT_SPECS.SME.interestRate,
  });

  useEffect(() => {
    const handleRateUpdate = (e) => {
      const { loanType: updatedType, interestRate } = e.detail;
      if (updatedType === "PERSONAL") {
        const delta = interestRate - PRODUCT_SPECS.PERSONAL.interestRate;
        setRates({
          PERSONAL: interestRate,
          HOME: parseFloat((PRODUCT_SPECS.HOME.interestRate + delta).toFixed(2)),
          VEHICLE: parseFloat((PRODUCT_SPECS.VEHICLE.interestRate + delta).toFixed(2)),
          SME: parseFloat((PRODUCT_SPECS.SME.interestRate + delta).toFixed(2)),
        });
      }
    };
    window.addEventListener("nova-rate-updated", handleRateUpdate);
    return () => window.removeEventListener("nova-rate-updated", handleRateUpdate);
  }, []);

  const spec = {
    ...PRODUCT_SPECS[loanType],
    interestRate: rates[loanType]
  };

  // Keep slider values within current active bounds when product type changes
  useEffect(() => {
    const activeSpec = PRODUCT_SPECS[loanType];
    if (desiredAmount < activeSpec.minAmount) {
      setDesiredAmount(activeSpec.minAmount);
    } else if (desiredAmount > activeSpec.maxAmount) {
      setDesiredAmount(activeSpec.maxAmount);
    }
    if (tenure > activeSpec.maxTenure) {
      setTenure(activeSpec.maxTenure);
    }
  }, [loanType]);

  // Handle manual input limits safely on blur or change
  const handleIncomeChange = (val) => {
    const num = parseFloat(val) || 0;
    setIncome(num);
  };

  const handleAmountChange = (val) => {
    const num = parseFloat(val) || 0;
    setDesiredAmount(num);
  };

  const handleLiabilitiesChange = (val) => {
    const num = parseFloat(val) || 0;
    setLiabilities(num);
  };

  const handleTenureChange = (val) => {
    const num = parseInt(val) || 12;
    setTenure(num);
  };

  // --- Calculations ---
  const r = (spec.interestRate / 100) / 12;
  const n = tenure;
  const emi = (desiredAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const calculatedEmi = isNaN(emi) || !isFinite(emi) ? 0 : Math.round(emi);

  const totalRepayment = calculatedEmi * tenure;
  const totalInterest = Math.max(0, totalRepayment - desiredAmount);

  // Debt-To-Income (DTI) Ratio
  const totalMonthlyLiabilities = liabilities + calculatedEmi;
  const dtiRatio = income > 0 ? ((totalMonthlyLiabilities / income) * 100) : 0;
  const dtiFixed = dtiRatio.toFixed(1);

  // Maximum allowed EMI based on CBSL DTI limit and income
  const maxAllowedEmi = Math.max(0, (income * (spec.maxDti / 100)) - liabilities);

  // Max eligible loan amount based on maximum allowed EMI
  const maxEligibleAmount = Math.max(0, (maxAllowedEmi * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n)));
  const maxEligibleRounded = Math.min(spec.maxAmount, Math.round(maxEligibleAmount / 1000) * 1000);

  // --- Rules Check ---
  const isIncomeSufficient = income >= spec.minIncome;
  const isDtiCompliant = dtiRatio <= spec.maxDti;
  const isAmountWithinProductLimits = desiredAmount >= spec.minAmount && desiredAmount <= spec.maxAmount;
  const isWithinEligibleBorrowingCapacity = desiredAmount <= maxEligibleRounded;

  // Determine Overall Status
  let eligibilityStatus = "ELIGIBLE"; // ELIGIBLE, CONDITIONAL, HIGH_RISK, INELIGIBLE
  let statusMessage = "Excellent! You meet all preliminary criteria.";
  let statusColor = "emerald";

  if (!isIncomeSufficient) {
    eligibilityStatus = "INELIGIBLE";
    statusMessage = `Your gross income is below the minimum LKR ${spec.minIncome.toLocaleString()} required for ${spec.name}.`;
    statusColor = "rose";
  } else if (dtiRatio > spec.maxDti + 10) {
    eligibilityStatus = "INELIGIBLE";
    statusMessage = "Your Debt-to-Income (DTI) ratio is critically high. Please declare lower desired amount or clear existing debts.";
    statusColor = "rose";
  } else if (!isAmountWithinProductLimits) {
    eligibilityStatus = "INELIGIBLE";
    statusMessage = `Desired amount must be between LKR ${spec.minAmount.toLocaleString()} and LKR ${spec.maxAmount.toLocaleString()}.`;
    statusColor = "rose";
  } else if (!isWithinEligibleBorrowingCapacity) {
    eligibilityStatus = "HIGH_RISK";
    statusMessage = `Requested amount exceeds your calculated repayment capacity (LKR ${maxEligibleRounded.toLocaleString()}).`;
    statusColor = "amber";
  } else if (dtiRatio > spec.maxDti) {
    eligibilityStatus = "CONDITIONAL";
    statusMessage = "DTI ratio is slightly high. Subject to additional guarantees or co-signers approval.";
    statusColor = "amber";
  } else if (dtiRatio > 40) {
    eligibilityStatus = "CONDITIONAL";
    statusMessage = "Good eligibility, but higher liabilities. Approved subject to routine review.";
    statusColor = "teal";
  }

  const IconComponent = spec.icon;

  const handleApplyClick = () => {
    if (user) {
      if (onStartDLO) {
        // Pre-fill some info or just trigger DLO
        onStartDLO();
      }
    } else {
      if (onNavigateToRegister) {
        onNavigateToRegister();
      }
    }
  };

  return (
    <div className="glass-panel rounded-2xl shadow-xl rounded-3xl overflow-hidden" id="loan-eligibility-calculator-widget">
      
      {/* Widget Header */}
      <div className="bg-neutral-900 text-white p-5 flex items-center justify-between border-b border-neutral-800">
        <div className="flex items-center gap-2.5">
          <div className="bg-primary-600/25 text-primary-400 p-2 rounded-xl border border-primary-500/20">
            <Calculator className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight">Loan Eligibility & EMI Estimator</h3>
            <p className="text-[11px] text-neutral-400">CBSL Policy Compliant Real-time Underwriting Tool</p>
          </div>
        </div>
        <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-primary-500/20 text-primary-300 px-2 py-0.5 rounded border border-primary-500/10">
          v1.2.0 Live
        </span>
      </div>

      <div className="p-5 sm:p-6 lg:p-8 grid md:grid-cols-12 gap-6 lg:gap-8">
        
        {/* Left Inputs Section */}
        <div className="md:col-span-7 space-y-5 text-xs">
          
          {/* Loan Type Category Selector */}
          <div>
            <label className="block text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider mb-2.5">
              Select Loan Product Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.entries(PRODUCT_SPECS).map(([type, item]) => {
                const ItemIcon = item.icon;
                const isActive = loanType === type;
                return (
                  <button
                    key={type}
                    id={`calc-type-${type}`}
                    type="button"
                    onClick={() => setLoanType(type)}
                    className={`py-2 px-3 rounded-xl border text-left transition flex flex-col justify-between h-16 cursor-pointer ${
                      isActive 
                        ? "bg-neutral-900 text-white border-neutral-900 shadow-md" 
                        : "bg-neutral-900/30 border-neutral-700/50 text-neutral-200 hover:bg-neutral-800/50"
                    }`}
                  >
                    <ItemIcon className={`h-4 w-4 ${isActive ? "text-primary-400" : "text-neutral-400"}`} />
                    <span className="font-bold text-[11px] block mt-1.5 truncate">{item.name.split(" ")[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Core Numeric Inputs Grid */}
          <div className="grid sm:grid-cols-2 gap-4 bg-neutral-900/30 border border-neutral-700/50/50 rounded-2xl p-4 sm:p-5">
            
            {/* Monthly Gross Income */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Gross Income / Mo</label>
                <span className="text-[9px] font-mono text-neutral-400">Min: LKR {spec.minIncome.toLocaleString()}</span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 font-bold text-neutral-400 font-mono">LKR</span>
                <input
                  id="calc-income-input"
                  type="number"
                  className="w-full pl-11 pr-3.5 py-2 border border-neutral-700/50 rounded-xl bg-neutral-900/50 font-mono text-xs focus:ring-2 focus:ring-primary-500 font-bold text-neutral-50"
                  value={income || ""}
                  onChange={(e) => handleIncomeChange(e.target.value)}
                  placeholder="0"
                />
              </div>
              <input
                type="range"
                min="30000"
                max="1000000"
                step="5000"
                className="w-full accent-primary-600 h-1 bg-neutral-200 rounded-xl cursor-pointer transition-all duration-200"
                value={income}
                onChange={(e) => setIncome(parseFloat(e.target.value))}
              />
            </div>

            {/* Desired Loan Principal */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Requested Loan Principal</label>
                <span className="text-[9px] font-mono text-neutral-400">Max: LKR {(spec.maxAmount/1000000).toFixed(0)}M</span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 font-bold text-neutral-400 font-mono">LKR</span>
                <input
                  id="calc-desired-input"
                  type="number"
                  className="w-full pl-11 pr-3.5 py-2 border border-neutral-700/50 rounded-xl bg-neutral-900/50 font-mono text-xs focus:ring-2 focus:ring-primary-500 font-bold text-neutral-50"
                  value={desiredAmount || ""}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder="0"
                />
              </div>
              <input
                type="range"
                min={spec.minAmount}
                max={spec.maxAmount}
                step={loanType === "SME" ? 500000 : 50000}
                className="w-full accent-primary-600 h-1 bg-neutral-200 rounded-xl cursor-pointer transition-all duration-200"
                value={desiredAmount}
                onChange={(e) => setDesiredAmount(parseFloat(e.target.value))}
              />
            </div>

            {/* Tenure Duration */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Loan Tenure</label>
                <span className="text-[9px] font-mono text-neutral-400">Max: {spec.maxTenure} Mos</span>
              </div>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-neutral-400" />
                <input
                  id="calc-tenure-input"
                  type="number"
                  className="w-full pl-10 pr-3.5 py-2 border border-neutral-700/50 rounded-xl bg-neutral-900/50 font-mono text-xs focus:ring-2 focus:ring-primary-500 font-bold text-neutral-50"
                  value={tenure || ""}
                  onChange={(e) => handleTenureChange(e.target.value)}
                  placeholder="0"
                />
              </div>
              <input
                type="range"
                min="12"
                max={spec.maxTenure}
                step="12"
                className="w-full accent-primary-600 h-1 bg-neutral-200 rounded-xl cursor-pointer transition-all duration-200"
                value={tenure}
                onChange={(e) => setTenure(parseInt(e.target.value))}
              />
            </div>

            {/* Other Monthly Commitments */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Existing Monthly Debts/EMIs</label>
                <span className="text-[9px] font-mono text-neutral-400">Declared to CRIB</span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 font-bold text-neutral-400 font-mono">LKR</span>
                <input
                  id="calc-liabilities-input"
                  type="number"
                  className="w-full pl-11 pr-3.5 py-2 border border-neutral-700/50 rounded-xl bg-neutral-900/50 font-mono text-xs focus:ring-2 focus:ring-primary-500 font-bold text-neutral-50"
                  value={liabilities || ""}
                  onChange={(e) => handleLiabilitiesChange(e.target.value)}
                  placeholder="0"
                />
              </div>
              <input
                type="range"
                min="0"
                max="250000"
                step="5000"
                className="w-full accent-primary-600 h-1 bg-neutral-200 rounded-xl cursor-pointer transition-all duration-200"
                value={liabilities}
                onChange={(e) => setLiabilities(parseFloat(e.target.value))}
              />
            </div>

          </div>

          {/* Product Specifications Badge */}
          <div className="bg-primary-900/20/50 border border-primary-100 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="bg-primary-100 text-primary-800 p-1 rounded-xl">
                <Info className="h-3.5 w-3.5" />
              </span>
              <div>
                <p className="font-bold text-neutral-50">{spec.name} Policy Info</p>
                <p className="text-[10px] text-neutral-400">Underwriting parameters set by Credit Committee</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-right text-[10px] font-mono font-bold text-neutral-300">
              <div>Interest: <span className="text-primary-600">{spec.interestRate}%</span></div>
              <div>Max DTI: <span className="text-primary-600">{spec.maxDti}%</span></div>
              <div>Min Principal: <span className="text-primary-600">LKR {spec.minAmount.toLocaleString()}</span></div>
              <div>Max Principal: <span className="text-primary-600">LKR {spec.maxAmount.toLocaleString()}</span></div>
            </div>
          </div>

        </div>

        {/* Right Output Assessment Section */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-6">
          
          {/* Main Assessment Summary */}
          <div className="space-y-4">
            
            {/* Status Card Banner */}
            <div className={`p-4 rounded-2xl border text-xs flex items-start gap-3 transition-colors ${
              statusColor === "emerald" 
                ? "bg-success-900/20 border-success-200 text-success-950" 
                : statusColor === "teal"
                ? "bg-teal-50 border-teal-200 text-teal-950"
                : statusColor === "amber" 
                ? "bg-warning-900/20 border-warning-200 text-warning-950" 
                : "bg-error-900/20 border-error-200 text-error-950"
            }`}>
              <div className="mt-0.5">
                {statusColor === "emerald" || statusColor === "teal" ? (
                  <CheckCircle2 className={`h-5 w-5 ${statusColor === "emerald" ? "text-success-600" : "text-teal-600"}`} />
                ) : statusColor === "amber" ? (
                  <AlertTriangle className="h-5 w-5 text-warning-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-error-600" />
                )}
              </div>
              <div className="space-y-1">
                <span className="font-mono tracking-wider font-bold uppercase text-[9px] bg-neutral-900/50/60 px-1.5 py-0.5 rounded border border-black/5">
                  {eligibilityStatus === "ELIGIBLE" ? "Eligible" : eligibilityStatus === "CONDITIONAL" ? "Conditionally Eligible" : eligibilityStatus === "HIGH_RISK" ? "High Debt Risk" : "Ineligible"}
                </span>
                <p className="font-bold leading-tight mt-1">{statusMessage}</p>
              </div>
            </div>

            {/* Calculated Repayments Breakdown */}
            <div className="bg-neutral-900 text-white rounded-3xl p-5 shadow-inner space-y-4">
              <div className="text-center pb-3 border-b border-white/10">
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">Estimated Monthly EMI</span>
                <h4 className="text-2xl font-bold tracking-tight text-white mt-1">
                  LKR {calculatedEmi.toLocaleString()} <span className="text-xs font-normal text-neutral-400">/ month</span>
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px] font-mono">
                <div>
                  <span className="text-neutral-400 block text-[9px]">TOTAL REPAYMENT</span>
                  <span className="font-bold text-neutral-100">LKR {totalRepayment.toLocaleString()}</span>
                </div>
                <div className="text-right">
                  <span className="text-neutral-400 block text-[9px]">TOTAL INTEREST COST</span>
                  <span className="font-bold text-warning-400">+ LKR {totalInterest.toLocaleString()}</span>
                </div>
              </div>

              {/* Progress Proportions */}
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] text-neutral-400 font-mono">
                  <span>Principal: {((desiredAmount / Math.max(1, totalRepayment)) * 100).toFixed(0)}%</span>
                  <span>Interest: {((totalInterest / Math.max(1, totalRepayment)) * 100).toFixed(0)}%</span>
                </div>
                <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden flex">
                  <div className="bg-primary-500 h-full" style={{ width: `${(desiredAmount / Math.max(1, totalRepayment)) * 100}%` }}></div>
                  <div className="bg-warning-400 h-full" style={{ width: `${(totalInterest / Math.max(1, totalRepayment)) * 100}%` }}></div>
                </div>
              </div>
            </div>

            {/* DTI Gauge and Underwriting Criteria */}
            <div className="border border-neutral-700/50 rounded-2xl p-4 text-xs space-y-3.5">
              
              {/* DTI Progress Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-mono text-[10px]">
                  <span className="font-bold text-neutral-500 uppercase tracking-wider">DEBT-TO-INCOME (DTI) ratio</span>
                  <span className={`font-bold ${parseFloat(dtiFixed) > spec.maxDti ? "text-error-600" : "text-success-600"}`}>
                    {dtiFixed}%
                  </span>
                </div>
                <div className="h-2 w-full bg-neutral-800/50 rounded-full overflow-hidden relative border border-neutral-700/50/50">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      parseFloat(dtiFixed) > spec.maxDti ? "bg-error-500" : parseFloat(dtiFixed) > 40 ? "bg-warning-500" : "bg-success-500"
                    }`}
                    style={{ width: `${Math.min(100, parseFloat(dtiFixed))}%` }}
                  ></div>
                  {/* Crossover threshold line */}
                  <div className="absolute top-0 bottom-0 bg-error-600/60 w-0.5" style={{ left: `${spec.maxDti}%` }} title={`Compliance Hold Threshold (${spec.maxDti}%)`}></div>
                </div>
                <div className="flex justify-between text-[8px] text-neutral-400 font-mono">
                  <span>0%</span>
                  <span>CBSL Policy Limit: {spec.maxDti}%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Preliminary Checklist */}
              <div className="space-y-2 pt-2 border-t border-neutral-700/30">
                <span className="block text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider">
                  PRELIMINARY UNDERWRITING MATRIX
                </span>
                
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Gross Income Requirement (LKR {spec.minIncome.toLocaleString()})</span>
                    {isIncomeSufficient ? (
                      <span className="text-success-600 font-bold flex items-center gap-1">Passed <CheckCircle2 className="h-3 w-3" /></span>
                    ) : (
                      <span className="text-error-600 font-bold flex items-center gap-1">Insufficient <XCircle className="h-3 w-3" /></span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">CBSL Policy DTI Ratio (&le; {spec.maxDti}%)</span>
                    {isDtiCompliant ? (
                      <span className="text-success-600 font-bold flex items-center gap-1">Passed <CheckCircle2 className="h-3 w-3" /></span>
                    ) : (
                      <span className="text-error-600 font-bold flex items-center gap-1">Exceeded <XCircle className="h-3 w-3" /></span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Max Eligible Principal Capacity</span>
                    <span className="font-mono font-bold text-neutral-200">LKR {maxEligibleRounded.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Request within borrow limits?</span>
                    {isWithinEligibleBorrowingCapacity ? (
                      <span className="text-success-600 font-bold flex items-center gap-1">Yes <CheckCircle2 className="h-3 w-3" /></span>
                    ) : (
                      <span className="text-error-600 font-bold flex items-center gap-1">Exceeded <XCircle className="h-3 w-3" /></span>
                    )}
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* CTA Action Bar */}
          <div>
            <button
              id="calc-cta-apply-btn"
              onClick={handleApplyClick}
              disabled={eligibilityStatus === "INELIGIBLE"}
              className={`w-full py-3 px-4 rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 transition cursor-pointer ${
                eligibilityStatus === "INELIGIBLE" 
                  ? "bg-neutral-800/50 text-neutral-400 border border-neutral-700/50 cursor-not-allowed shadow-none" 
                  : "btn-premium rounded-xl text-white"
              }`}
            >
              <span>{user ? "Proceed with Online Application" : "Register to Lock in Loan Offer"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <p className="text-[10px] text-center text-neutral-400 mt-2.5 font-sans leading-relaxed">
              *Estimates are indicative, subject to official Credit Information Bureau (CRIB) screening, compliance checks, and formal underwriting validations.
            </p>
          </div>

        </div>

        {/* Amortization Schedule Section */}
        <div className="md:col-span-12 pt-4 border-t border-neutral-700/50">
          <LoanAmortizationSchedule 
            user={user}
            token={token}
            loanType={loanType}
            principal={desiredAmount}
            annualRate={spec.interestRate}
            tenureMonths={tenure}
            metrics={{ totalPayment: totalRepayment, totalInterest: totalInterest }}
            eligibilityStatus={eligibilityStatus}
            dtiFixed={dtiFixed}
          />
        </div>

      </div>

    </div>
  );
}
