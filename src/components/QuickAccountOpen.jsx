import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  CreditCard, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  FileText, 
  X, 
  HelpCircle, 
  Info, 
  Calendar,
  Loader2,
  Briefcase,
  DollarSign
} from "lucide-react";

export default function QuickAccountOpen({ user }) {
  const navigate = useNavigate();

  // Form State
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [nicNo, setNicNo] = useState(user?.username || "");
  const [dob, setDob] = useState("1995-10-24");
  const [email, setEmail] = useState(user?.customerDetails?.email || "kamal@gmail.com");
  const [mobile, setMobile] = useState(user?.customerDetails?.mobile_number || "+94771234567");
  const [occupation, setOccupation] = useState("Software Developer");
  const [sourceOfFunds, setSourceOfFunds] = useState("Salary");
  const [selectedProduct, setSelectedProduct] = useState("Regular Savings");

  // Drag and Drop Document Upload State
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [ocrScanning, setOcrScanning] = useState(false);
  const [ocrSuccess, setOcrSuccess] = useState(false);
  const fileInputRef = useRef(null);

  // Submission / Animation States
  const [submitState, setSubmitState] = useState("idle"); // "idle" | "processing" | "success" | "error"
  const [processingStep, setProcessingStep] = useState(0); // 0 to 4
  const [errorMessage, setErrorMessage] = useState("");
  const [consentApproved, setConsentApproved] = useState(false);
  const [newAccountNumber, setNewAccountNumber] = useState("");

  const processingMilestones = [
    { title: "Verifying e-KYC Signatures", desc: "Verifying digital signatures on uploaded identity document" },
    { title: "Running Sanctions Screening", desc: "Checking against CBSL & FIU PEP & sanctions watch-lists" },
    { title: "Querying Credit Bureau (CRIB)", desc: "Retrieving microfinance exposure summary metrics" },
    { title: "Calling CBS Core Ledger Provisioning", desc: "Binding new deposits ledger account on NovaBank core system" }
  ];

  // Drag Handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = (file) => {
    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      alert("Invalid format. Please upload an image (JPEG, PNG) or PDF of your National Identity Card.");
      return;
    }
    // Set file state
    setUploadedFile({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
      type: file.type
    });

    // Simulate instant OCR scanner
    setOcrScanning(true);
    setTimeout(() => {
      setOcrScanning(false);
      setOcrSuccess(true);
      // Auto-populate fields dynamically with simulated metadata
      if (!fullName) setFullName("Kamal Bandara");
      if (!nicNo) setNicNo(user?.username || "952981244V");
    }, 1200);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Submit and Instant Initiation Process
  const handleInitiateQuickOpen = async (e) => {
    e.preventDefault();

    if (!consentApproved) {
      alert("Please check and accept the FIU & PDPA terms and conditions.");
      return;
    }
    if (!uploadedFile) {
      alert("Please upload an image of your National Identity Card (NIC) to initiate setup.");
      return;
    }
    if (!fullName || !email || !mobile) {
      alert("Please fill in all mandatory contact and identity fields.");
      return;
    }

    // Begin simulated multi-step provisioning process
    setSubmitState("processing");
    setProcessingStep(0);

    const runMilestones = async () => {
      for (let i = 0; i < processingMilestones.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setProcessingStep(i + 1);
      }
    };

    try {
      await runMilestones();

      // Fire real API request to server backend
      const res = await fetch("/api/v1/accounts/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: user.customer_id,
          product_name: selectedProduct,
          ocrDetails: { fullName, dob, nicNo },
          livenessScore: 98.4,
          screeningStatus: "CLEAR",
          riskTier: "LOW"
        })
      });

      const data = await res.json();
      if (data.success) {
        setNewAccountNumber(data.account.account_number);
        setSubmitState("success");
      } else {
        setErrorMessage(data.message || "Failed during instant provisioning.");
        setSubmitState("error");
      }
    } catch (err) {
      setErrorMessage("Service Connection Timeout. Failed to sync with CBS ledger.");
      setSubmitState("error");
    }
  };

  return (
    <div className="bg-white border border-slate-200 shadow-xl rounded-3xl overflow-hidden animate-fade-in max-w-2xl mx-auto" id="quick-open-savings">
      {/* Module Title Block */}
      <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-teal-500/15 text-teal-400 px-2 py-1 rounded-lg text-[9px] font-mono uppercase tracking-wider border border-teal-500/20 font-bold">
              ⚡ Nova Express
            </span>
            <span className="text-teal-400 font-extrabold flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
          </div>
          <h3 className="text-md font-extrabold tracking-tight">Express Savings Account Opening</h3>
          <p className="text-xs text-slate-400">Captures identity, verifies OCR, and boots Core CBS ledger instantly.</p>
        </div>
        <button 
          onClick={() => navigate("/dashboard")}
          className="text-xs text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-all cursor-pointer"
          title="Go Back"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Main Container */}
      <div className="p-5 sm:p-6">
        
        {/* Processing/Validation Loader Panel */}
        {submitState === "processing" && (
          <div className="py-12 px-4 text-center space-y-6" id="quick-open-processing">
            <div className="relative flex justify-center">
              <div className="h-16 w-16 rounded-full border-4 border-teal-100 border-t-teal-500 animate-spin flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-teal-500 animate-pulse" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-extrabold text-slate-800 uppercase tracking-tight">
                Ledger Provisioning In Progress
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Triggering CBS API microservices and routing to Central Credit Registry...
              </p>
            </div>

            {/* Stepper tracker */}
            <div className="max-w-md mx-auto bg-slate-50 border border-slate-150 rounded-2xl p-4 text-left space-y-3">
              {processingMilestones.map((milestone, idx) => {
                const isActive = idx === processingStep;
                const isCompleted = idx < processingStep;
                return (
                  <div key={idx} className="flex gap-3 text-xs items-start">
                    <span className={`h-4.5 w-4.5 rounded-full flex-shrink-0 flex items-center justify-center font-mono text-[9px] font-bold mt-0.5 ${
                      isCompleted ? "bg-emerald-500 text-white" : isActive ? "bg-teal-500 text-white animate-pulse" : "bg-slate-200 text-slate-500"
                    }`}>
                      {isCompleted ? "✓" : idx + 1}
                    </span>
                    <div>
                      <p className={`font-bold ${isCompleted ? "text-slate-700 line-through" : isActive ? "text-teal-600" : "text-slate-400"}`}>
                        {milestone.title}
                      </p>
                      {isActive && <p className="text-[10px] text-slate-500 mt-0.5">{milestone.desc}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Success Screen Panel */}
        {submitState === "success" && (
          <div className="py-8 px-4 text-center space-y-6 animate-scale-up" id="quick-open-success">
            <div className="inline-flex items-center justify-center bg-emerald-100 text-emerald-600 p-4 rounded-full border border-emerald-200">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div className="space-y-2">
              <h4 className="text-base font-extrabold text-slate-800">
                Savings Account Successfully Active!
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                NovaBank Core Ledger has successfully bound your deposits facility. Your account has been provisioned and is active under low-risk e-KYC compliance rules.
              </p>
            </div>

            {/* Generated Account Details block */}
            <div className="max-w-sm mx-auto bg-emerald-50 border border-emerald-100 rounded-2xl p-4 font-mono text-center">
              <span className="text-[9px] uppercase tracking-wider font-bold text-emerald-700 block">
                Assigned core account number
              </span>
              <span className="text-xl font-bold text-slate-800 block mt-1 tracking-widest">
                {newAccountNumber}
              </span>
              <div className="flex justify-around border-t border-emerald-100/50 mt-3 pt-3 text-[10px] text-slate-600">
                <div>
                  <span className="text-slate-400 block text-[9px]">PRODUCT</span>
                  <span className="font-bold text-slate-800">{selectedProduct}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px]">RATE</span>
                  <span className="font-bold text-slate-800">4.50% p.a.</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px]">LIMIT</span>
                  <span className="font-bold text-slate-800">LKR 1.0M</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-sm cursor-pointer"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}

        {/* Error Screen Panel */}
        {submitState === "error" && (
          <div className="py-8 px-4 text-center space-y-6" id="quick-open-error">
            <div className="inline-flex items-center justify-center bg-rose-100 text-rose-600 p-4 rounded-full border border-rose-200">
              <AlertCircle className="h-10 w-10" />
            </div>

            <div className="space-y-2">
              <h4 className="text-base font-extrabold text-slate-800">
                Setup Initiation Failed
              </h4>
              <p className="text-xs text-rose-600 max-w-sm mx-auto font-medium">
                {errorMessage}
              </p>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setSubmitState("idle")}
                className="px-5 py-2.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all cursor-pointer"
              >
                Review Fields & Retry
              </button>
            </div>
          </div>
        )}

        {/* Input Form Screen Panel (Idle) */}
        {submitState === "idle" && (
          <form onSubmit={handleInitiateQuickOpen} className="space-y-5" id="quick-open-form">
            
            {/* Split layout: Upload on Left/Top, Basic Metadata on Right/Bottom */}
            <div className="grid md:grid-cols-2 gap-5">
              
              {/* Left Column: Drag & Drop Identity Uploader */}
              <div className="space-y-4">
                <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                  1. Identification document proof
                </label>
                
                <div 
                  id="drag-drop-area"
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={triggerFileInput}
                  className={`border-2 border-dashed rounded-2xl p-5 text-center flex flex-col items-center justify-center gap-3 cursor-pointer transition-all min-h-[180px] ${
                    dragActive 
                      ? "border-teal-500 bg-teal-50/40" 
                      : uploadedFile 
                      ? "border-emerald-500 bg-emerald-50/20" 
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                  }`}
                >
                  <input 
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/jpeg,image/png,application/pdf"
                  />

                  {uploadedFile ? (
                    <div className="space-y-2">
                      <div className="bg-emerald-100 text-emerald-600 p-2.5 rounded-xl inline-block border border-emerald-200">
                        <FileText className="h-5 w-5" />
                      </div>
                      <p className="text-xs font-bold text-slate-800 line-clamp-1">{uploadedFile.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{uploadedFile.size} • Verified</p>
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded font-mono block w-max mx-auto">
                        OCR READY
                      </span>
                    </div>
                  ) : ocrScanning ? (
                    <div className="space-y-2">
                      <Loader2 className="h-6 w-6 text-teal-600 animate-spin mx-auto" />
                      <p className="text-xs font-bold text-slate-700 animate-pulse">Scanning metadata via OCR...</p>
                      <p className="text-[9px] text-slate-400">Extracting name, DOB and document authentication keys</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="bg-slate-100 text-slate-500 p-3 rounded-xl inline-block border border-slate-200/50">
                        <Upload className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-700">Drag & drop your NIC Card here</p>
                        <p className="text-[10px] text-slate-400">or click to browse local folders (JPEG, PNG, PDF)</p>
                      </div>
                      <span className="text-[9px] text-slate-400 block pt-1 font-mono">
                        Supports National Identity Cards (NIC)
                      </span>
                    </div>
                  )}
                </div>

                {/* Helpful Tips Alert Box */}
                <div className="bg-slate-50 border border-slate-150 rounded-2xl p-3 flex gap-2 text-[10px] text-slate-500 leading-relaxed">
                  <Info className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  <p>
                    <span className="font-bold text-slate-700">Pro-Tip: </span> 
                    Dragging a file triggers immediate automated OCR text parsing, which auto-fills the name and DOB fields for instant setup.
                  </p>
                </div>
              </div>

              {/* Right Column: Identity fields */}
              <div className="space-y-4">
                <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                  2. Identity Details
                </label>

                <div className="space-y-3">
                  {/* Account Product Select */}
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-500 mb-1">Savings Account Product</label>
                    <select
                      id="quick-product"
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-800 font-bold focus:outline-teal-500"
                    >
                      <option value="Regular Savings">Regular Savings (4.50% p.a.)</option>
                      <option value="Youth Savings">Youth Star Savings (5.25% p.a.)</option>
                      <option value="Senior Citizen Savings">Senior Care Ledger (6.00% p.a.)</option>
                      <option value="High-Yield Savings">High-Yield Deposits (4.75% p.a.)</option>
                    </select>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-500 mb-1">Full Name (per Identity Doc)</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                        <User className="h-3.5 w-3.5" />
                      </span>
                      <input
                        id="quick-fullname"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Kamal Bandara"
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-teal-500"
                        required
                      />
                    </div>
                  </div>

                  {/* NIC Number */}
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-500 mb-1">National ID Card (NIC) Number</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                        <CreditCard className="h-3.5 w-3.5" />
                      </span>
                      <input
                        id="quick-nic"
                        type="text"
                        value={nicNo}
                        onChange={(e) => setNicNo(e.target.value)}
                        placeholder="e.g. 199512345678 or 952981244V"
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs font-mono focus:outline-teal-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-500 mb-1">Date of Birth</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                        <Calendar className="h-3.5 w-3.5" />
                      </span>
                      <input
                        id="quick-dob"
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-teal-500"
                        required
                      />
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Split layout Row 2: Secondary Contact and Source details */}
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-slate-100">
              
              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 mb-1">Mobile Contact</label>
                <input
                  id="quick-mobile"
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono focus:outline-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 mb-1">Email Link</label>
                <input
                  id="quick-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 mb-1">Current Occupation</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-slate-400">
                    <Briefcase className="h-3 w-3" />
                  </span>
                  <input
                    id="quick-occupation"
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-teal-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 mb-1">Source of Funds</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-slate-400">
                    <DollarSign className="h-3 w-3" />
                  </span>
                  <select
                    id="quick-funds"
                    value={sourceOfFunds}
                    onChange={(e) => setSourceOfFunds(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-800 focus:outline-teal-500"
                  >
                    <option value="Salary">Salary/Invoices</option>
                    <option value="Business">Business Turnover</option>
                    <option value="Rental">Real Estate Rental</option>
                    <option value="Inheritance">Inheritance/Family Gift</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Compliance Consent Terms Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="quick-consent"
                  checked={consentApproved}
                  onChange={(e) => setConsentApproved(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500 h-3.5 w-3.5 cursor-pointer"
                />
                <label htmlFor="quick-consent" className="text-[10px] text-slate-600 font-medium select-none cursor-pointer">
                  I hereby authorize NovaBank to process my identity credentials via automated optical document capture (OCR) and execute real-time cross-matching with FIU AML, PEP sanctions watch-lists, and Central Credit Bureau datasets per the Sri Lankan Personal Data Protection Act (PDPA) No. 9 of 2022.
                </label>
              </div>
            </div>

            {/* Form Footer Action buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                <Lock className="h-3 w-3 text-teal-500" />
                <span>Secured via TLS 1.3 encryption</span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 transition-all font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl transition-all font-bold flex items-center gap-1 cursor-pointer shadow-sm shadow-teal-600/10"
                >
                  <span>Verify & Open Account</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
