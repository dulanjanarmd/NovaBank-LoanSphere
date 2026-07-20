import React, { useState, useEffect } from "react";
import { 
  FileText, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  DollarSign, 
  Calendar, 
  Upload, 
  ClipboardCheck, 
  Info, 
  Sparkles,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  TrendingUp,
  AlertTriangle,
  Scale,
  Lock,
  ShieldCheck,
  Building,
  Trash2
} from "lucide-react";

export default function LoanWizard({ user, onCompleteDLO, onCancel }) {
  // --- Wizard Step ---
  const [step, setStep] = useState(1);

  // --- Active products from server ---
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loanType, setLoanType] = useState("PERSONAL");

  // --- Step 1 State: Loan Parameters ---
  const [reqAmount, setReqAmount] = useState("500000");
  const [tenure, setTenure] = useState("36");
  const [emiQuote, setEmiQuote] = useState(0);

  // --- Step 2 State: Applicant Identity details ---
  const [fullName, setFullName] = useState("");
  const [nicNumber, setNicNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  // --- Step 3 State: Financial & Income Details ---
  const [employmentStatus, setEmploymentStatus] = useState("Salaried");
  const [occupation, setOccupation] = useState("");
  const [employerName, setEmployerName] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [monthlyExpenses, setMonthlyExpenses] = useState("");
  const [sourceOfFunds, setSourceOfFunds] = useState("Salary");

  // Type-specific specs
  const [homeLocation, setHomeLocation] = useState("Colombo Fort");
  const [homeCollateralVal, setHomeCollateralVal] = useState("12000000");
  const [vehicleMake, setVehicleMake] = useState("Toyota Vitz 2020");
  const [vehicleVal, setVehicleVal] = useState("6500000");
  const [smeRegNo, setSmeRegNo] = useState("PV-99120");
  const [smeYears, setSmeYears] = useState("4");

  // --- Step 4 State: Document Checklist & Drag-n-Drop ---
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  const [dragOverDoc, setDragOverDoc] = useState(null);

  // --- Step 5 State: Final review & Consent ---
  const [termsAccepted, setTermsAccepted] = useState(false);

  // --- Validation Errors and Touched states ---
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Fetch loan configuration products on mount
  useEffect(() => {
    fetch("/api/v1/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.loans) {
          setProducts(data.loans);
          const defaultProd = data.loans.find(p => p.type === "PERSONAL") || data.loans[0];
          if (defaultProd) {
            setSelectedProduct(defaultProd);
            setReqAmount(String(defaultProd.minAmount));
            setTenure(String(defaultProd.defaultTenure));
          }
        }
      })
      .catch((err) => console.error("Error loading loan products:", err));
  }, []);

  // Initialize applicant info from logged-in user details
  useEffect(() => {
    if (user) {
      const details = user.customerDetails || {};
      setFullName(user.fullName || details.full_name || "");
      setNicNumber(user.username || details.nic_number || "");
      setDateOfBirth(details.date_of_birth || "1992-05-14");
      setMobileNumber(details.mobile_number || "+94771234567");
      setEmail(details.email || "customer@novabank.com");
      setAddress(details.address || "");
      setOccupation(details.occupation || "");
      setMonthlyIncome(details.monthly_turnover || "250000");
      setMonthlyExpenses("45000"); // default estimate
      setSourceOfFunds(details.source_of_funds || "Salary");
    }
  }, [user]);

  // Update default bounds when switching loan type
  const handleTypeChange = (type) => {
    setLoanType(type);
    const prod = products.find(p => p.type === type);
    if (prod) {
      setSelectedProduct(prod);
      setReqAmount(String(prod.minAmount));
      setTenure(String(prod.defaultTenure));
      setUploadedFiles({});
      // clear error references
      setErrors(prev => ({ ...prev, amount: "", tenure: "" }));
    }
  };

  // Run dynamic EMI calculation (Indicative only)
  useEffect(() => {
    if (selectedProduct) {
      const p = parseFloat(reqAmount) || 0;
      const r = (selectedProduct.interestRate / 100) / 12;
      const n = parseInt(tenure) || 12;
      if (p > 0 && r > 0 && n > 0) {
        const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        setEmiQuote(Math.round(emi));
      } else {
        setEmiQuote(0);
      }
    }
  }, [reqAmount, tenure, selectedProduct]);

  // Document checklist resolver based on loan type
  const getRequiredDocsForType = (type) => {
    switch (type) {
      case "HOME": 
        return ["NIC Copy (Self)", "Salary Slips (3 mos)", "Land Registry Deed", "Collateral Valuation Report"];
      case "VEHICLE": 
        return ["NIC Copy (Self)", "Salary Slips (3 mos)", "Vehicle Dealer Invoice", "CRIB Statement (Personal)"];
      case "SME": 
        return ["Business Registration PV", "Audited Accounts (3 yrs)", "Corporate Tax Slips", "Collateral Title Valuation"];
      default: 
        return ["NIC Copy (Self)", "Salary Slips (3 mos)", "Bank Account Statement (6 mos)", "Proof of Residence"];
    }
  };

  const handleFileUpload = (doc, file) => {
    if (!file) return;

    // Start progress simulation
    setUploadProgress(prev => ({ ...prev, [doc]: 0 }));

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        // Mark file as uploaded
        setUploadedFiles(prev => ({
          ...prev,
          [doc]: { 
            name: file.name, 
            size: `${(file.size / 1024).toFixed(1)} KB`,
            uploaded: true 
          }
        }));
        setUploadProgress(prev => ({ ...prev, [doc]: null }));
      } else {
        setUploadProgress(prev => ({ ...prev, [doc]: progress }));
      }
    }, 100);
  };

  const handleSimulateUpload = (doc) => {
    setUploadProgress(prev => ({ ...prev, [doc]: 0 }));

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        setUploadedFiles(prev => ({
          ...prev,
          [doc]: { 
            name: `${doc.toLowerCase().replace(/[^a-z0-9]/g, "_")}_verified.pdf`, 
            size: "1,245.8 KB",
            uploaded: true 
          }
        }));
        setUploadProgress(prev => ({ ...prev, [doc]: null }));
      } else {
        setUploadProgress(prev => ({ ...prev, [doc]: progress }));
      }
    }, 100);
  };

  const handleDeleteFile = (doc) => {
    setUploadedFiles(prev => {
      const copy = { ...prev };
      delete copy[doc];
      return copy;
    });
    setUploadProgress(prev => {
      const copy = { ...prev };
      delete copy[doc];
      return copy;
    });
  };

  const handleDragOver = (e, doc) => {
    e.preventDefault();
    setDragOverDoc(doc);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOverDoc(null);
  };

  const handleDrop = (e, doc) => {
    e.preventDefault();
    setDragOverDoc(null);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(doc, e.dataTransfer.files[0]);
    }
  };

  // --- In-line Step Validations ---

  const validateStep1 = () => {
    const stepErrors = {};
    const amt = parseFloat(reqAmount);
    const mos = parseInt(tenure);

    if (isNaN(amt) || amt <= 0) {
      stepErrors.amount = "Please declare a valid positive loan principal amount.";
    } else if (selectedProduct) {
      if (amt < selectedProduct.minAmount) {
        stepErrors.amount = `Minimum permitted amount for this product is LKR ${selectedProduct.minAmount.toLocaleString()}`;
      } else if (amt > selectedProduct.maxAmount) {
        stepErrors.amount = `Maximum permitted amount for this product is LKR ${selectedProduct.maxAmount.toLocaleString()}`;
      }
    }

    if (isNaN(mos) || mos <= 0) {
      stepErrors.tenure = "Please declare a valid tenure.";
    } else if (mos < 12) {
      stepErrors.tenure = "Minimum loan duration is 12 months.";
    } else if (mos > 240) {
      stepErrors.tenure = "Maximum loan duration is 240 months (20 years).";
    }

    setErrors(prev => ({ ...prev, ...stepErrors }));
    return Object.keys(stepErrors).length === 0;
  };

  const validateStep2 = () => {
    const stepErrors = {};
    
    // Full Name
    if (!fullName || fullName.trim().length < 3) {
      stepErrors.fullName = "Full name must be at least 3 characters long.";
    } else if (!/^[A-Za-z\s.]+$/.test(fullName)) {
      stepErrors.fullName = "Full name can only contain alphabetic characters, spaces, or dots.";
    }

    // Sri Lankan NIC verification 
    const nicRegex = /^([0-9]{9}[vVxX]|[0-9]{12})$/;
    if (!nicNumber) {
      stepErrors.nicNumber = "NIC number is mandatory.";
    } else if (!nicRegex.test(nicNumber)) {
      stepErrors.nicNumber = "Invalid format: Enter 9 digits followed by 'V'/'X' or a modern 12-digit format.";
    }

    // Date of Birth & Age >= 18
    if (!dateOfBirth) {
      stepErrors.dateOfBirth = "Date of Birth is mandatory.";
    } else {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 18) {
        stepErrors.dateOfBirth = `Applicant age restriction: Applicant is ${age} years old. Must be at least 18.`;
      } else if (age > 100) {
        stepErrors.dateOfBirth = "Please declare a valid birth date.";
      }
    }

    // Mobile Phone
    const mobileRegex = /^(?:\+94|0)?7[0-9]{8}$/;
    if (!mobileNumber) {
      stepErrors.mobileNumber = "Mobile number is required.";
    } else if (!mobileRegex.test(mobileNumber)) {
      stepErrors.mobileNumber = "Format invalid. Must be a valid Sri Lankan mobile number (e.g. +94771234567).";
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      stepErrors.email = "Email address is required.";
    } else if (!emailRegex.test(email)) {
      stepErrors.email = "Invalid email format.";
    }

    // Address
    if (!address || address.trim().length < 8) {
      stepErrors.address = "Please provide your detailed street address (minimum 8 characters).";
    }

    setErrors(prev => ({ ...prev, ...stepErrors }));
    return Object.keys(stepErrors).length === 0;
  };

  const validateStep3 = () => {
    const stepErrors = {};
    const inc = parseFloat(monthlyIncome);
    const exp = parseFloat(monthlyExpenses);

    if (!occupation || occupation.trim().length < 2) {
      stepErrors.occupation = "Job Designation/Profession is required.";
    }

    if (employmentStatus === "Salaried" && (!employerName || employerName.trim().length < 2)) {
      stepErrors.employerName = "Employer Company name is required for salaried applicants.";
    }

    if (isNaN(inc) || inc <= 0) {
      stepErrors.monthlyIncome = "Gross Monthly Income must be a positive number.";
    }

    if (isNaN(exp) || exp < 0) {
      stepErrors.monthlyExpenses = "Existing expenses must be a valid number (use 0 if none).";
    }

    // Type specific conditional validations
    if (loanType === "HOME") {
      if (!homeLocation || homeLocation.trim().length < 3) {
        stepErrors.homeLocation = "Property location/town is required.";
      }
      const val = parseFloat(homeCollateralVal);
      if (isNaN(val) || val <= 0) {
        stepErrors.homeCollateralVal = "Property valuation is required and must be greater than zero.";
      }
    } else if (loanType === "VEHICLE") {
      if (!vehicleMake || vehicleMake.trim().length < 3) {
        stepErrors.vehicleMake = "Vehicle make, year, and model are required.";
      }
      const val = parseFloat(vehicleVal);
      if (isNaN(val) || val <= 0) {
        stepErrors.vehicleVal = "Vehicle estimated valuation must be greater than zero.";
      }
    } else if (loanType === "SME") {
      if (!smeRegNo || smeRegNo.trim().length < 4) {
        stepErrors.smeRegNo = "Business registration number is required.";
      }
      const years = parseInt(smeYears);
      if (isNaN(years) || years < 0) {
        stepErrors.smeYears = "Years of operation must be a valid positive integer.";
      }
    }

    setErrors(prev => ({ ...prev, ...stepErrors }));
    return Object.keys(stepErrors).length === 0;
  };

  const validateStep4 = () => {
    const docsList = getRequiredDocsForType(loanType);
    const allUploaded = docsList.every(d => uploadedFiles[d]?.uploaded);
    if (!allUploaded) {
      alert("Please simulate upload for all required documents to satisfy CBSL checklist mandates.");
      return false;
    }
    return true;
  };

  // --- Step navigation controllers ---
  const handleNext = () => {
    // Run validation prior to step progression
    let isValid = false;
    if (step === 1) isValid = validateStep1();
    else if (step === 2) isValid = validateStep2();
    else if (step === 3) isValid = validateStep3();
    else if (step === 4) isValid = validateStep4();
    else isValid = true;

    if (isValid) {
      setStep(prev => prev + 1);
      // Clear errors after successfully advancing
      setErrors({});
    } else {
      // Set all inputs in active step as touched to trigger visual warnings
      const activeStepTouched = {};
      if (step === 1) {
        activeStepTouched.amount = true;
        activeStepTouched.tenure = true;
      } else if (step === 2) {
        activeStepTouched.fullName = true;
        activeStepTouched.nicNumber = true;
        activeStepTouched.dateOfBirth = true;
        activeStepTouched.mobileNumber = true;
        activeStepTouched.email = true;
        activeStepTouched.address = true;
      } else if (step === 3) {
        activeStepTouched.occupation = true;
        activeStepTouched.employerName = true;
        activeStepTouched.monthlyIncome = true;
        activeStepTouched.monthlyExpenses = true;
        activeStepTouched.homeLocation = true;
        activeStepTouched.homeCollateralVal = true;
        activeStepTouched.vehicleMake = true;
        activeStepTouched.vehicleVal = true;
        activeStepTouched.smeRegNo = true;
        activeStepTouched.smeYears = true;
      }
      setTouched(prev => ({ ...prev, ...activeStepTouched }));
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
      setErrors({});
    }
  };

  // --- Final submission workflow ---
  const handleSubmitApplication = async () => {
    if (!termsAccepted) {
      alert("You must check and authorize the CRIB query and credit screening terms to submit this application.");
      return;
    }

    setSubmitting(true);
    try {
      const docsList = getRequiredDocsForType(loanType);
      const docsPayload = docsList.map(d => ({ name: d, url: uploadedFiles[d]?.name || "uploaded_file.pdf" }));
      
      // Post registration data and trigger preliminary scoring in server.ts
      const response = await fetch("/api/v1/loans/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: user.customer_id,
          loan_product_id: selectedProduct.id,
          loan_type: loanType,
          requested_amount: parseFloat(reqAmount),
          tenure_months: parseInt(tenure),
          documents: docsPayload
        })
      });
      const data = await response.json();
      if (data.success) {
        alert(`Application Submitted Successfully!\nReference: ${data.application.application_ref}\nOur Automated Scoring Engine is analyzing your eligibility scores.`);
        onCompleteDLO();
      } else {
        alert(data.message || "Failed to submit loan application.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("Connection failure. Unable to contact LoanSphere core API microservice.");
    } finally {
      setSubmitting(false);
    }
  };

  // Calculated metrics
  const parsedIncome = parseFloat(monthlyIncome) || 1;
  const parsedExpenses = parseFloat(monthlyExpenses) || 0;
  const dtiVal = (((parsedExpenses + emiQuote) / parsedIncome) * 100).toFixed(1);
  const isHighRiskDti = parseFloat(dtiVal) > 55;
  const isModerateRiskDti = parseFloat(dtiVal) >= 35 && parseFloat(dtiVal) <= 55;

  if (!selectedProduct) {
    return <div className="p-8 text-center text-xs text-slate-500">Retrieving Loan Sphere configuration parameters...</div>;
  }

  const docsToUpload = getRequiredDocsForType(loanType);

  return (
    <div className="max-w-3xl mx-auto my-6 bg-white border border-slate-200 shadow-xl rounded-3xl overflow-hidden animate-fade-in">
      
      {/* Header Container */}
      <div className="bg-slate-900 text-white p-6 flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono tracking-widest font-bold bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/10 uppercase">
              Step {step} of 5
            </span>
            <span className="text-[10px] font-mono text-slate-400">Maker-Checker Compliant</span>
          </div>
          <h3 className="text-base font-bold tracking-tight">Digital Loan Origination (DLO)</h3>
          <p className="text-xs text-slate-400">Configure parameters, verify personal/financial stats, and submit for instant scoring.</p>
        </div>
        <button
          onClick={onCancel}
          className="text-xs font-bold text-rose-400 hover:text-rose-300 hover:underline mt-2 md:mt-0 self-start md:self-center transition"
        >
          Cancel & Exit
        </button>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-slate-100 flex">
        <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${(step / 5) * 100}%` }}></div>
      </div>

      <div className="p-6 sm:p-8">
        
        {/* STEP 1: Product Selection & Terms */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in text-xs">
            
            {/* Category Selectors */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">Loan Category Selection</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { type: "PERSONAL", label: "Personal Loan", desc: "Unsecured Cash" },
                  { type: "HOME", label: "Home Loan", desc: "Housing Property" },
                  { type: "VEHICLE", label: "Vehicle Loan", desc: "Leasing Solutions" },
                  { type: "SME", label: "SME Engine", desc: "Business Capital" }
                ].map((item) => (
                  <button
                    key={item.type}
                    id={`type-btn-${item.type}`}
                    type="button"
                    onClick={() => handleTypeChange(item.type)}
                    className={`py-3 px-3.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between h-20 ${
                      loanType === item.type
                        ? "bg-slate-900 text-white border-slate-900 shadow-lg"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span className="font-bold text-xs">{item.label}</span>
                    <span className={`text-[9px] ${loanType === item.type ? "text-slate-300" : "text-slate-400"}`}>{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Config terms */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 gap-2">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-800 p-1 rounded-lg">
                    <DollarSign className="h-4 w-4" />
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-800">{selectedProduct.name}</h4>
                    <p className="text-[10px] text-slate-400">Underwriting ID: NBLS-P-{selectedProduct.id}</p>
                  </div>
                </div>
                <div className="text-right sm:text-right">
                  <span className="text-xs font-bold text-emerald-600 font-mono tracking-tight bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 block sm:inline-block">
                    Interest: {selectedProduct.interestRate}% p.a. Fixed
                  </span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                
                {/* Desired Amount */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Requested Principal (LKR)</label>
                    <span className="text-[10px] font-bold text-slate-400">Min: LKR {selectedProduct.minAmount.toLocaleString()}</span>
                  </div>
                  
                  <input
                    id="loan-wizard-amt"
                    type="number"
                    min={selectedProduct.minAmount}
                    max={selectedProduct.maxAmount}
                    className={`w-full px-3.5 py-2 border rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      touched.amount && errors.amount ? "border-rose-400 bg-rose-50/15" : "border-slate-200 bg-white"
                    }`}
                    value={reqAmount}
                    onChange={(e) => {
                      setReqAmount(e.target.value);
                      setErrors(prev => ({ ...prev, amount: "" }));
                    }}
                  />
                  
                  <input
                    type="range"
                    min={selectedProduct.minAmount}
                    max={selectedProduct.maxAmount}
                    step={loanType === "SME" ? 500000 : 50000}
                    className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                    value={parseFloat(reqAmount) || selectedProduct.minAmount}
                    onChange={(e) => {
                      setReqAmount(e.target.value);
                      setErrors(prev => ({ ...prev, amount: "" }));
                    }}
                  />
                  
                  {touched.amount && errors.amount ? (
                    <span className="text-[10px] text-rose-600 font-semibold block">{errors.amount}</span>
                  ) : (
                    <p className="text-[9px] text-slate-400">Maximum limit: LKR {selectedProduct.maxAmount.toLocaleString()}</p>
                  )}
                </div>

                {/* Tenure */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Tenure Duration (Months)</label>
                    <span className="text-[10px] font-bold text-slate-400">Default: {selectedProduct.defaultTenure} Mos</span>
                  </div>

                  <input
                    id="loan-wizard-tenure"
                    type="number"
                    className={`w-full px-3.5 py-2 border rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      touched.tenure && errors.tenure ? "border-rose-400 bg-rose-50/15" : "border-slate-200 bg-white"
                    }`}
                    value={tenure}
                    onChange={(e) => {
                      setTenure(e.target.value);
                      setErrors(prev => ({ ...prev, tenure: "" }));
                    }}
                  />

                  <input
                    type="range"
                    min="12"
                    max="180"
                    step="12"
                    className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                    value={parseInt(tenure) || 12}
                    onChange={(e) => {
                      setTenure(e.target.value);
                      setErrors(prev => ({ ...prev, tenure: "" }));
                    }}
                  />

                  {touched.tenure && errors.tenure ? (
                    <span className="text-[10px] text-rose-600 font-semibold block">{errors.tenure}</span>
                  ) : (
                    <p className="text-[9px] text-slate-400">Enter a duration between 12 and 180 months.</p>
                  )}
                </div>

              </div>
            </div>

            {/* Dynamic Quote Breakdown */}
            {emiQuote > 0 && (
              <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-blue-600">
                    <Scale className="h-4 w-4" />
                    <span className="font-bold tracking-wider uppercase text-[9px] font-mono">Indicative Repayment Estimate</span>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 tracking-tight">
                    LKR {emiQuote.toLocaleString()} <span className="text-[10px] font-normal text-slate-500">/ month</span>
                  </h4>
                  <p className="text-[10px] text-slate-400">Amortized at {selectedProduct.interestRate}% APR over {tenure} months.</p>
                </div>

                {/* Stacked mini chart represent interest/principal proportion */}
                <div className="w-full md:w-52 space-y-1.5">
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Principal (Est)</span>
                    <span>Interest (Est)</span>
                  </div>
                  <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden flex">
                    <div className="bg-blue-600 h-full" style={{ width: "70%" }}></div>
                    <div className="bg-teal-500 h-full" style={{ width: "30%" }}></div>
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-400">
                    <span>~70% of payment</span>
                    <span>~30% of payment</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* STEP 2: Applicant Identity particulars */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in text-xs">
            <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <User className="h-4.5 w-4.5 text-blue-600" /> Confirm Applicant Personal Particulars
            </h4>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Verify your official state identifiers and coordinates. Details must match your physical National Identity Card (NIC).
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              
              {/* Full Name */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Full Name (As per NIC)</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    className={`w-full pl-10 pr-3.5 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      touched.fullName && errors.fullName ? "border-rose-400 bg-rose-50/15" : "border-slate-200"
                    }`}
                    placeholder="Kamal Bandara"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      setErrors(prev => ({ ...prev, fullName: "" }));
                    }}
                  />
                </div>
                {touched.fullName && errors.fullName && (
                  <span className="text-[10px] text-rose-600 font-medium block">{errors.fullName}</span>
                )}
              </div>

              {/* NIC Number */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">National Identity (NIC) Number</label>
                <div className="relative">
                  <ClipboardCheck className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    className={`w-full pl-10 pr-3.5 py-2 border rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      touched.nicNumber && errors.nicNumber ? "border-rose-400 bg-rose-50/15" : "border-slate-200"
                    }`}
                    placeholder="199234509123 or 923450912V"
                    value={nicNumber}
                    onChange={(e) => {
                      setNicNumber(e.target.value);
                      setErrors(prev => ({ ...prev, nicNumber: "" }));
                    }}
                  />
                </div>
                {touched.nicNumber && errors.nicNumber ? (
                  <span className="text-[10px] text-rose-600 font-medium block">{errors.nicNumber}</span>
                ) : (
                  <p className="text-[9px] text-slate-400">9-digit V/X format or modern 12-digit format.</p>
                )}
              </div>

              {/* Date of Birth */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Applicant Date of Birth</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="date"
                    className={`w-full pl-10 pr-3.5 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      touched.dateOfBirth && errors.dateOfBirth ? "border-rose-400 bg-rose-50/15" : "border-slate-200"
                    }`}
                    value={dateOfBirth}
                    onChange={(e) => {
                      setDateOfBirth(e.target.value);
                      setErrors(prev => ({ ...prev, dateOfBirth: "" }));
                    }}
                  />
                </div>
                {touched.dateOfBirth && errors.dateOfBirth && (
                  <span className="text-[10px] text-rose-600 font-medium block">{errors.dateOfBirth}</span>
                )}
              </div>

              {/* Mobile Phone */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Verified Mobile Contact</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    className={`w-full pl-10 pr-3.5 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      touched.mobileNumber && errors.mobileNumber ? "border-rose-400 bg-rose-50/15" : "border-slate-200"
                    }`}
                    placeholder="+94771234567"
                    value={mobileNumber}
                    onChange={(e) => {
                      setMobileNumber(e.target.value);
                      setErrors(prev => ({ ...prev, mobileNumber: "" }));
                    }}
                  />
                </div>
                {touched.mobileNumber && errors.mobileNumber && (
                  <span className="text-[10px] text-rose-600 font-medium block">{errors.mobileNumber}</span>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    className={`w-full pl-10 pr-3.5 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      touched.email && errors.email ? "border-rose-400 bg-rose-50/15" : "border-slate-200"
                    }`}
                    placeholder="kamal@gmail.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors(prev => ({ ...prev, email: "" }));
                    }}
                  />
                </div>
                {touched.email && errors.email && (
                  <span className="text-[10px] text-rose-600 font-medium block">{errors.email}</span>
                )}
              </div>

              {/* Physical Street Address */}
              <div className="space-y-1 sm:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Residential Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    className={`w-full pl-10 pr-3.5 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      touched.address && errors.address ? "border-rose-400 bg-rose-50/15" : "border-slate-200"
                    }`}
                    placeholder="No. 45, Flower Road, Colombo 07"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      setErrors(prev => ({ ...prev, address: "" }));
                    }}
                  />
                </div>
                {touched.address && errors.address && (
                  <span className="text-[10px] text-rose-600 font-medium block">{errors.address}</span>
                )}
              </div>

            </div>

          </div>
        )}

        {/* STEP 3: Financials & Income Specs */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in text-xs">
            <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <TrendingUp className="h-4.5 w-4.5 text-blue-600" /> Declare Income and Security Specifics
            </h4>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Declare reliable gross income and monthly liability streams. Inconsistent figures will trigger compliance checker holds.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              
              {/* Employment Status */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Employment Status</label>
                <select
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={employmentStatus}
                  onChange={(e) => setEmploymentStatus(e.target.value)}
                >
                  <option value="Salaried">Salaried Employee</option>
                  <option value="SelfEmployed">Self-Employed / Entrepreneur</option>
                  <option value="Retired">Retired / Pensions</option>
                </select>
              </div>

              {/* Occupation */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Profession / Job Title</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    className={`w-full pl-10 pr-3.5 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      touched.occupation && errors.occupation ? "border-rose-400 bg-rose-50/15" : "border-slate-200"
                    }`}
                    placeholder="Senior Software Engineer"
                    value={occupation}
                    onChange={(e) => {
                      setOccupation(e.target.value);
                      setErrors(prev => ({ ...prev, occupation: "" }));
                    }}
                  />
                </div>
                {touched.occupation && errors.occupation && (
                  <span className="text-[10px] text-rose-600 font-medium block">{errors.occupation}</span>
                )}
              </div>

              {/* Employer Company Name (Conditional on Salaried) */}
              {employmentStatus === "Salaried" && (
                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Employer Company Name</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      className={`w-full pl-10 pr-3.5 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        touched.employerName && errors.employerName ? "border-rose-400 bg-rose-50/15" : "border-slate-200"
                      }`}
                      placeholder="IFS Sri Lanka PLC"
                      value={employerName}
                      onChange={(e) => {
                        setEmployerName(e.target.value);
                        setErrors(prev => ({ ...prev, employerName: "" }));
                      }}
                    />
                  </div>
                  {touched.employerName && errors.employerName && (
                    <span className="text-[10px] text-rose-600 font-medium block">{errors.employerName}</span>
                  )}
                </div>
              )}

              {/* Gross Income */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Gross Monthly Income (LKR)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="number"
                    className={`w-full pl-10 pr-3.5 py-2 border rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      touched.monthlyIncome && errors.monthlyIncome ? "border-rose-400 bg-rose-50/15" : "border-slate-200"
                    }`}
                    placeholder="250000"
                    value={monthlyIncome}
                    onChange={(e) => {
                      setMonthlyIncome(e.target.value);
                      setErrors(prev => ({ ...prev, monthlyIncome: "" }));
                    }}
                  />
                </div>
                {touched.monthlyIncome && errors.monthlyIncome && (
                  <span className="text-[10px] text-rose-600 font-medium block">{errors.monthlyIncome}</span>
                )}
              </div>

              {/* Existing Liabilities */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Existing Monthly Expenses/EMIs (LKR)</label>
                <div className="relative">
                  <Scale className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="number"
                    className={`w-full pl-10 pr-3.5 py-2 border rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      touched.monthlyExpenses && errors.monthlyExpenses ? "border-rose-400 bg-rose-50/15" : "border-slate-200"
                    }`}
                    placeholder="45000"
                    value={monthlyExpenses}
                    onChange={(e) => {
                      setMonthlyExpenses(e.target.value);
                      setErrors(prev => ({ ...prev, monthlyExpenses: "" }));
                    }}
                  />
                </div>
                {touched.monthlyExpenses && errors.monthlyExpenses && (
                  <span className="text-[10px] text-rose-600 font-medium block">{errors.monthlyExpenses}</span>
                )}
              </div>

              {/* Funds source */}
              <div className="space-y-1 sm:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Primary Source of Funds</label>
                <select
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={sourceOfFunds}
                  onChange={(e) => setSourceOfFunds(e.target.value)}
                >
                  <option value="Salary">Salary / Corporate Employment Remuneration</option>
                  <option value="Business Revenue">Entrepreneurial / Business Revenue</option>
                  <option value="Investment">Investment Yield / Dividends</option>
                  <option value="Family Inheritance">Family Savings & Inheritance</option>
                </select>
              </div>

            </div>

            {/* PRODUCT SPECIFIC COLLATERAL / SECURITIES */}
            {(loanType === "HOME" || loanType === "VEHICLE" || loanType === "SME") && (
              <div className="mt-5 p-5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-4">
                <h5 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
                  <Lock className="h-3.5 w-3.5 text-blue-600" /> Collateral & Security Details
                </h5>

                {loanType === "HOME" && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold text-slate-500">Property Location / Town</label>
                      <input
                        type="text"
                        className={`w-full px-3 py-1.5 border rounded-lg text-xs focus:ring-2 focus:ring-blue-500 ${
                          touched.homeLocation && errors.homeLocation ? "border-rose-400 bg-rose-50/15" : "border-slate-200"
                        }`}
                        value={homeLocation}
                        onChange={(e) => {
                          setHomeLocation(e.target.value);
                          setErrors(prev => ({ ...prev, homeLocation: "" }));
                        }}
                      />
                      {touched.homeLocation && errors.homeLocation && (
                        <span className="text-[9px] text-rose-600 block">{errors.homeLocation}</span>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold text-slate-500">Estimated Market Value (LKR)</label>
                      <input
                        type="number"
                        className={`w-full px-3 py-1.5 border rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 ${
                          touched.homeCollateralVal && errors.homeCollateralVal ? "border-rose-400 bg-rose-50/15" : "border-slate-200"
                        }`}
                        value={homeCollateralVal}
                        onChange={(e) => {
                          setHomeCollateralVal(e.target.value);
                          setErrors(prev => ({ ...prev, homeCollateralVal: "" }));
                        }}
                      />
                      {touched.homeCollateralVal && errors.homeCollateralVal && (
                        <span className="text-[9px] text-rose-600 block">{errors.homeCollateralVal}</span>
                      )}
                    </div>
                  </div>
                )}

                {loanType === "VEHICLE" && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold text-slate-500">Vehicle Make, Year & Model</label>
                      <input
                        type="text"
                        className={`w-full px-3 py-1.5 border rounded-lg text-xs focus:ring-2 focus:ring-blue-500 ${
                          touched.vehicleMake && errors.vehicleMake ? "border-rose-400 bg-rose-50/15" : "border-slate-200"
                        }`}
                        value={vehicleMake}
                        onChange={(e) => {
                          setVehicleMake(e.target.value);
                          setErrors(prev => ({ ...prev, vehicleMake: "" }));
                        }}
                      />
                      {touched.vehicleMake && errors.vehicleMake && (
                        <span className="text-[9px] text-rose-600 block">{errors.vehicleMake}</span>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold text-slate-500">Dealer Market Value (LKR)</label>
                      <input
                        type="number"
                        className={`w-full px-3 py-1.5 border rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 ${
                          touched.vehicleVal && errors.vehicleVal ? "border-rose-400 bg-rose-50/15" : "border-slate-200"
                        }`}
                        value={vehicleVal}
                        onChange={(e) => {
                          setVehicleVal(e.target.value);
                          setErrors(prev => ({ ...prev, vehicleVal: "" }));
                        }}
                      />
                      {touched.vehicleVal && errors.vehicleVal && (
                        <span className="text-[9px] text-rose-600 block">{errors.vehicleVal}</span>
                      )}
                    </div>
                  </div>
                )}

                {loanType === "SME" && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold text-slate-500">Business Registration Number (PV/N-xxxx)</label>
                      <input
                        type="text"
                        className={`w-full px-3 py-1.5 border rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 ${
                          touched.smeRegNo && errors.smeRegNo ? "border-rose-400 bg-rose-50/15" : "border-slate-200"
                        }`}
                        value={smeRegNo}
                        onChange={(e) => {
                          setSmeRegNo(e.target.value);
                          setErrors(prev => ({ ...prev, smeRegNo: "" }));
                        }}
                      />
                      {touched.smeRegNo && errors.smeRegNo && (
                        <span className="text-[9px] text-rose-600 block">{errors.smeRegNo}</span>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold text-slate-500">Years of Operation</label>
                      <input
                        type="number"
                        className={`w-full px-3 py-1.5 border rounded-lg text-xs focus:ring-2 focus:ring-blue-500 ${
                          touched.smeYears && errors.smeYears ? "border-rose-400 bg-rose-50/15" : "border-slate-200"
                        }`}
                        value={smeYears}
                        onChange={(e) => {
                          setSmeYears(e.target.value);
                          setErrors(prev => ({ ...prev, smeYears: "" }));
                        }}
                      />
                      {touched.smeYears && errors.smeYears && (
                        <span className="text-[9px] text-rose-600 block">{errors.smeYears}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Debt-to-Income (DTI) Live Analyzer Card */}
            {parsedIncome > 1 && (
              <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-5 transition ${
                isHighRiskDti 
                  ? "bg-rose-50 border-rose-100 text-rose-900" 
                  : isModerateRiskDti 
                  ? "bg-amber-50/50 border-amber-100 text-amber-900" 
                  : "bg-emerald-50/45 border-emerald-100 text-emerald-900"
              }`}>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Scale className="h-4 w-4" />
                    <span className="font-bold tracking-wider uppercase text-[9px] font-mono">DTI Risk Indicator</span>
                  </div>
                  <h4 className="text-base font-bold">
                    Ratio Estimate: {dtiVal}%
                  </h4>
                  <p className="text-[10px] text-slate-500 leading-snug">
                    {isHighRiskDti 
                      ? "High Risk: Total expenses exceed 55% of income. Approval might require co-signers." 
                      : isModerateRiskDti 
                      ? "Moderate Risk: DTI falls within acceptable limits. Standard compliance check applied." 
                      : "Excellent: Low DTI ratio. Quick-pass automatic underwriting highly probable."}
                  </p>
                </div>

                <div className="text-left sm:text-right font-mono text-[10px]">
                  <div>EMI: LKR {emiQuote.toLocaleString()}</div>
                  <div>Expenses: LKR {parsedExpenses.toLocaleString()}</div>
                  <div>Income: LKR {parsedIncome.toLocaleString()}</div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* STEP 4: Documents Upload & Verification */}
        {step === 4 && (
          <div className="space-y-5 animate-fade-in text-xs">
            <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <Upload className="h-4.5 w-4.5 text-blue-600" /> Secure Document Vault Uploads
            </h4>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              CBSL and FIU digital directives mandate cryptographically secured proof attachments for e-KYC validation. You can **drag-and-drop** files directly, browse manually, or run immediate progress-tracked simulations.
            </p>

            <div className="space-y-4 pt-2">
              {docsToUpload.map((doc) => {
                const fileObj = uploadedFiles[doc];
                const progress = uploadProgress[doc];
                const isUploading = progress !== undefined && progress !== null;
                const isDragOver = dragOverDoc === doc;

                return (
                  <div 
                    key={doc}
                    onDragOver={(e) => handleDragOver(e, doc)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, doc)}
                    className={`relative p-5 border-2 border-dashed rounded-3xl transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      fileObj?.uploaded 
                        ? "bg-emerald-50/20 border-emerald-300" 
                        : isUploading
                        ? "bg-blue-50/10 border-blue-400"
                        : isDragOver
                        ? "bg-blue-50/50 border-blue-500 ring-4 ring-blue-50 scale-[1.01]"
                        : "bg-slate-50/50 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {/* Hidden Native File Input */}
                    <input 
                      type="file"
                      id={`file-input-${doc.replace(/\s+/g, "-")}`}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(doc, e.target.files[0]);
                        }
                      }}
                    />

                    <div className="space-y-1.5 max-w-md flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`p-1.5 rounded-lg ${fileObj?.uploaded ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                          <FileText className="h-4 w-4" />
                        </span>
                        <div>
                          <h5 className="font-bold text-slate-800 text-[11px]">{doc}</h5>
                          <p className="text-[10px] text-slate-400 leading-normal">
                            Requires official PDF statement or scanned/biometric JPEG copy. Max size 5MB.
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar Indicator */}
                      {isUploading && (
                        <div className="space-y-1 mt-2.5 max-w-xs bg-white p-2 rounded-xl border border-blue-100 shadow-sm animate-pulse">
                          <div className="flex justify-between text-[9px] font-bold text-blue-600">
                            <span>Transmitting securely...</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-600 rounded-full transition-all duration-150"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {/* File Details display */}
                      {fileObj?.uploaded && (
                        <div className="flex items-center gap-2 mt-1.5 text-[10px] font-mono font-bold text-slate-600 bg-emerald-50/50 border border-emerald-100/60 py-1 px-2.5 rounded-lg w-fit">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                          <span className="truncate max-w-[200px]">{fileObj.name}</span>
                          <span className="text-slate-400 text-[9px]">({fileObj.size || "1,245.8 KB"})</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5 self-end md:self-center">
                      {fileObj?.uploaded ? (
                        <button
                          type="button"
                          onClick={() => handleDeleteFile(doc)}
                          className="px-3 py-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
                          title="Remove uploaded document"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete</span>
                        </button>
                      ) : isUploading ? (
                        <div className="text-[10px] font-semibold text-blue-600 animate-pulse bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-100">
                          Encrypting...
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                          <button
                            type="button"
                            onClick={() => document.getElementById(`file-input-${doc.replace(/\s+/g, "-")}`).click()}
                            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-bold transition duration-150 shadow-sm cursor-pointer whitespace-nowrap text-center"
                          >
                            Browse File
                          </button>
                          <span className="text-[10px] text-slate-400 text-center self-center font-bold">or</span>
                          <button
                            id={`btn-upload-${doc.replace(/\s+/g, "-")}`}
                            type="button"
                            onClick={() => handleSimulateUpload(doc)}
                            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10px] font-bold transition duration-150 shadow-sm cursor-pointer whitespace-nowrap text-center"
                          >
                            Simulate Upload
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-2xl flex gap-3 text-[11px] text-slate-500 leading-relaxed mt-4">
              <ShieldCheck className="h-4.5 w-4.5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Secured Document Vault Protocol:</strong> NovaBank utilizes end-to-end AES-256 GCM cryptographic envelope technology. Uploaded materials are strictly hashed for automated credit assessment without manual file persistence leaks.
              </div>
            </div>

          </div>
        )}

        {/* STEP 5: Summary, Scoring & Submit */}
        {step === 5 && (
          <div className="space-y-5 animate-fade-in text-xs">
            <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <ClipboardCheck className="h-4.5 w-4.5 text-blue-600" /> Review Particulars & Sign Contract
            </h4>

            {/* Bento Summary Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              
              {/* Product Specifications Summary */}
              <div className="border border-slate-200/80 rounded-2xl p-4 space-y-2 bg-slate-50/40">
                <h5 className="font-bold text-[10px] text-slate-400 uppercase tracking-wider">Loan Specifications</h5>
                <div className="divide-y divide-slate-100 text-[11px]">
                  <div className="py-1.5 flex justify-between">
                    <span className="text-slate-400">Loan Type:</span>
                    <span className="font-bold text-slate-800">{loanType} LOAN</span>
                  </div>
                  <div className="py-1.5 flex justify-between">
                    <span className="text-slate-400">Product:</span>
                    <span className="font-bold text-blue-600 font-mono text-[10px]">{selectedProduct.name}</span>
                  </div>
                  <div className="py-1.5 flex justify-between">
                    <span className="text-slate-400">Principal Requested:</span>
                    <span className="font-bold text-slate-800 font-mono">LKR {(parseFloat(reqAmount) || 0).toLocaleString()}</span>
                  </div>
                  <div className="py-1.5 flex justify-between">
                    <span className="text-slate-400">Tenure:</span>
                    <span className="font-bold text-slate-800 font-mono">{tenure} Months</span>
                  </div>
                  <div className="py-1.5 flex justify-between">
                    <span className="text-slate-400">Interest Rate:</span>
                    <span className="font-bold text-slate-800 font-mono">{selectedProduct.interestRate}% p.a. Fixed</span>
                  </div>
                  <div className="py-1.5 flex justify-between">
                    <span className="text-slate-400">Indicative EMI Amount:</span>
                    <span className="font-bold text-emerald-600 font-mono">LKR {emiQuote.toLocaleString()} / mo</span>
                  </div>
                </div>
              </div>

              {/* Applicant Personal Summary */}
              <div className="border border-slate-200/80 rounded-2xl p-4 space-y-2 bg-slate-50/40">
                <h5 className="font-bold text-[10px] text-slate-400 uppercase tracking-wider">Applicant Particulars</h5>
                <div className="divide-y divide-slate-100 text-[11px]">
                  <div className="py-1.5 flex justify-between">
                    <span className="text-slate-400">Full Name:</span>
                    <span className="font-bold text-slate-800 truncate max-w-[150px]">{fullName}</span>
                  </div>
                  <div className="py-1.5 flex justify-between">
                    <span className="text-slate-400">NIC Identifier:</span>
                    <span className="font-bold text-slate-800 font-mono">{nicNumber}</span>
                  </div>
                  <div className="py-1.5 flex justify-between">
                    <span className="text-slate-400">Mobile Phone:</span>
                    <span className="font-bold text-slate-800 font-mono">{mobileNumber}</span>
                  </div>
                  <div className="py-1.5 flex justify-between">
                    <span className="text-slate-400">Assigned Email:</span>
                    <span className="font-bold text-slate-800 truncate max-w-[150px]">{email}</span>
                  </div>
                  <div className="py-1.5 flex justify-between">
                    <span className="text-slate-400">Income Declared:</span>
                    <span className="font-bold text-slate-800 font-mono">LKR {(parseFloat(monthlyIncome) || 0).toLocaleString()}</span>
                  </div>
                  <div className="py-1.5 flex justify-between">
                    <span className="text-slate-400">DTI Calculated:</span>
                    <span className={`font-bold ${isHighRiskDti ? "text-rose-600" : "text-emerald-600"}`}>{dtiVal}%</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Simulated Underwriting Scores */}
            <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-3 shadow-md">
              <div className="flex items-center gap-1.5 text-blue-400">
                <Sparkles className="h-4 w-4 animate-spin-slow" />
                <span className="font-bold text-[9px] font-mono tracking-wider uppercase">Liveness Underwriting Estimate</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-sm">Automated Preliminary Analysis</h4>
                  <p className="text-[10px] text-slate-400">We scanned mock credit registry files and estimated your initial risk profile.</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-blue-600/30 text-blue-300 border border-blue-500/20 px-3 py-1.5 rounded-xl text-center">
                    <span className="text-[8px] uppercase font-mono block text-slate-400">Credit Score</span>
                    <span className="font-bold font-mono text-sm">745 / 900</span>
                  </div>
                  <div className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/10 px-3 py-1.5 rounded-xl text-center">
                    <span className="text-[8px] uppercase font-mono block text-slate-400">CRIB Rank</span>
                    <span className="font-bold text-sm">Grade A</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Agreement Terms */}
            <div className="p-4 border border-slate-200 bg-slate-50 rounded-2xl flex items-start gap-3">
              <input
                id="terms-accepted"
                type="checkbox"
                className="mt-1 h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <div className="space-y-1">
                <label htmlFor="terms-accepted" className="font-bold text-slate-800 text-[11px] cursor-pointer block">
                  CRIB Verification & Information Disclosure Authorization
                </label>
                <p className="text-[10px] text-slate-500 leading-normal">
                  I hereby authorize NovaBank PLC to request my Credit Information Bureau of Sri Lanka (CRIB) history, perform background e-KYC watchlist scans, and evaluate financial metrics strictly for digital loan origination underwriting.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* Action Controls Footer */}
        <div className="flex justify-between pt-6 border-t border-slate-100 mt-8">
          <button
            id="btn-loan-back"
            type="button"
            disabled={step === 1}
            onClick={handleBack}
            className="flex items-center gap-1.5 px-4.5 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-semibold disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer transition"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back</span>
          </button>

          {step < 5 ? (
            <button
              id="btn-loan-next"
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow transition cursor-pointer"
            >
              <span>Next Step</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              id="btn-loan-submit"
              type="button"
              disabled={submitting}
              onClick={handleSubmitApplication}
              className="flex items-center gap-1.5 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin" />
                  <span>Submitting Loan...</span>
                </>
              ) : (
                <>
                  <span>Submit Application</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
