import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Landmark, FileText, ChevronRight, ChevronLeft, CheckCircle2, UserCircle2, ShieldCheck, HelpCircle, Loader2, Award, Upload } from "lucide-react";

export default function OnboardingWizard({ user }) {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loadingKyc, setLoadingKyc] = useState(false);
  const [kycDone, setKycDone] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [nicNo, setNicNo] = useState(user?.username || "");
  const [dob, setDob] = useState("1994-08-12");
  const [email, setEmail] = useState(user?.customerDetails?.email || "kamal@gmail.com");
  const [mobile, setMobile] = useState(user?.customerDetails?.mobile_number || "+94771234567");
  const [address, setAddress] = useState(user?.customerDetails?.address || "No. 45, Flower Road, Colombo 07");
  const [occupation, setOccupation] = useState(user?.customerDetails?.occupation || "Software Engineer");
  const [fundsSource, setFundsSource] = useState("Salary");
  const [turnover, setTurnover] = useState("250000");

  // e-KYC OCR / Match State
  const [nicUploaded, setNicUploaded] = useState(false);
  const [selfieUploaded, setSelfieUploaded] = useState(false);
  const [matchScore, setMatchScore] = useState(null);
  const [screeningStatus, setScreeningStatus] = useState("CLEAR");

  // Product Selection
  const [selectedProduct, setSelectedProduct] = useState("Regular Savings");

  // Consent Checked
  const [pdpaConsent, setPdpaConsent] = useState(false);
  const [fatcaConsent, setFatcaConsent] = useState(false);

  const triggerMockKycVerification = () => {
    if (!nicUploaded || !selfieUploaded) {
      alert("Please upload both your NIC document and a selfie to run biometrics.");
      return;
    }
    setLoadingKyc(true);
    setTimeout(() => {
      setLoadingKyc(false);
      setKycDone(true);
      setMatchScore(94.5); // high fidelity score
      setScreeningStatus("CLEAR"); // watch list checked
      
      // Auto-extract and populate OCR data if fields were empty
      if (!fullName) setFullName("Kamal Bandara");
      if (!dob) setDob("1992-05-14");
    }, 2000);
  };

  const handleFinalSubmit = async () => {
    if (!pdpaConsent) {
      alert("Please accept the PDPA Data Protection terms before submitting.");
      return;
    }

    try {
      const response = await fetch("/api/v1/accounts/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: user.customer_id,
          product_name: selectedProduct,
          ocrDetails: { fullName, dob, nicNo },
          livenessScore: matchScore || 95.0,
          screeningStatus,
          riskTier: "LOW"
        })
      });
      const data = await response.json();
      if (data.success) {
        alert(`Congratulations! Savings Account opened successfully. Your Core Account Number is: ${data.account.account_number}`);
        navigate("/dashboard");
      } else {
        alert(data.message || "DAO Application processing error.");
      }
    } catch (err) {
      alert("Failed to submit account opening application.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-6 bg-white border border-slate-200 shadow-xl rounded-3xl overflow-hidden animate-fade-in">
      
      {/* Dynamic wizard breadcrumbs */}
      <div className="bg-slate-900 text-white p-6 flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800">
        <div>
          <span className="text-[10px] font-mono tracking-wider font-bold text-teal-400 uppercase">
            Step {step} of 5
          </span>
          <h3 className="text-md font-bold text-white">Digital Onboarding Wizard (DAO)</h3>
          <p className="text-xs text-slate-400">Apply for a premium savings account with automated biometric e-KYC.</p>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="text-xs font-bold text-rose-400 hover:underline mt-2 md:mt-0"
        >
          Cancel Application
        </button>
      </div>

      {/* Progress Line */}
      <div className="h-1.5 w-full bg-slate-100 flex">
        <div className={`h-full bg-teal-500 transition-all duration-300`} style={{ width: `${step * 20}%` }}></div>
      </div>

      <div className="p-6 sm:p-8">
        
        {/* STEP 1: Personal Details */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
              <UserCircle2 className="h-4.5 w-4.5 text-teal-600" /> Confirm Personal Specifications
            </h4>

            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">NIC NUMBER (CONFIRMED)</label>
                <input
                  id="dao-nic"
                  type="text"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 font-mono"
                  value={nicNo}
                  disabled
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">FULL NAME (PER NIC)</label>
                <input
                  id="dao-name"
                  type="text"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">DATE OF BIRTH</label>
                <input
                  id="dao-dob"
                  type="date"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">MOBILE LINK</label>
                <input
                  id="dao-mobile"
                  type="text"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 font-mono"
                  value={mobile}
                  disabled
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">EMAIL LINK</label>
                <input
                  id="dao-email"
                  type="email"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">OCCUPATION</label>
                <input
                  id="dao-occupation"
                  type="text"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">SOURCE OF FUNDS</label>
                <select
                  id="dao-funds"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  value={fundsSource}
                  onChange={(e) => setFundsSource(e.target.value)}
                >
                  <option value="Salary">Salary / Employment</option>
                  <option value="Business Revenue">Business Revenue</option>
                  <option value="Savings">Savings / Inheritance</option>
                  <option value="Foreign Remittance">Foreign Remittance</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">EXPECTED MONTHLY TURNOVER (LKR)</label>
                <input
                  id="dao-turnover"
                  type="number"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  value={turnover}
                  onChange={(e) => setTurnover(e.target.value)}
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block text-[11px] font-bold text-slate-500 mb-1">RESIDENTIAL ADDRESS</label>
              <input
                id="dao-address"
                type="text"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* STEP 2: e-KYC document scan & selfie match */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in text-xs">
            <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
              <ShieldCheck className="h-4.5 w-4.5 text-teal-600" /> e-KYC Identity Verification
            </h4>

            <p className="text-slate-500 leading-relaxed text-[11px]">
              Upload high-quality captures of your Sri Lankan NIC (Front & Back) and capture a front-facing liveness selfie. Our automated OCR extracts parameters and matches biometric coordinates in real-time.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {/* NIC Scan Input */}
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center space-y-2">
                <Upload className="h-8 w-8 text-slate-400 mx-auto" />
                <h5 className="font-bold text-slate-700">Sri Lankan NIC (Front & Back)</h5>
                <p className="text-[10px] text-slate-400">JPEG/PNG formats, Max 5MB size.</p>
                {nicUploaded ? (
                  <span className="inline-flex bg-emerald-50 text-emerald-800 py-1 px-2.5 rounded-full font-bold border border-emerald-200 gap-1 items-center mx-auto text-[10px]">
                    ✓ nic_scan.pdf Uploaded
                  </span>
                ) : (
                  <button
                    id="btn-upload-nic"
                    type="button"
                    onClick={() => setNicUploaded(true)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                  >
                    Select/Drop File
                  </button>
                )}
              </div>

              {/* Liveness Selfie Input */}
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center space-y-2">
                <UserCircle2 className="h-8 w-8 text-slate-400 mx-auto" />
                <h5 className="font-bold text-slate-700">Liveness Capture / Selfie</h5>
                <p className="text-[10px] text-slate-400">Position head inside frame & blink.</p>
                {selfieUploaded ? (
                  <span className="inline-flex bg-emerald-50 text-emerald-800 py-1 px-2.5 rounded-full font-bold border border-emerald-200 gap-1 items-center mx-auto text-[10px]">
                    ✓ selfie_raw.jpg Captured
                  </span>
                ) : (
                  <button
                    id="btn-upload-selfie"
                    type="button"
                    onClick={() => setSelfieUploaded(true)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                  >
                    Activate Camera
                  </button>
                )}
              </div>
            </div>

            {/* Validation Trigger Button */}
            {nicUploaded && selfieUploaded && !kycDone && (
              <div className="text-center pt-2">
                <button
                  id="btn-run-ekyc"
                  type="button"
                  onClick={triggerMockKycVerification}
                  disabled={loadingKyc}
                  className="px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl shadow-md inline-flex items-center gap-2 cursor-pointer"
                >
                  {loadingKyc ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Extracting OCR & Checking Liveness...</span>
                    </>
                  ) : (
                    <span>Process e-KYC Verification</span>
                  )}
                </button>
              </div>
            )}

            {/* e-KYC Results Panel */}
            {kycDone && (
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3.5 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                  <span className="font-bold text-slate-700 uppercase font-mono tracking-wider text-[10px]">Verify Result Output</span>
                  <span className="px-2.5 py-0.5 font-bold rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px]">KYC STATUS: VERIFIED</span>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-white p-3 border border-slate-200/60 rounded-xl space-y-1">
                    <span className="text-slate-400 text-[10px]">NIC OCR Name Extraction</span>
                    <p className="font-bold text-slate-800">BANDARA K. KAMAL</p>
                    <span className="text-slate-400 text-[10px]">DOB Extraction</span>
                    <p className="font-bold text-slate-800">1992-05-14</p>
                  </div>

                  <div className="bg-white p-3 border border-slate-200/60 rounded-xl text-center flex flex-col justify-center items-center">
                    <span className="text-slate-400 text-[10px]">Face Matching Index</span>
                    <div className="text-lg font-bold text-teal-600 mt-1 flex items-center gap-1">
                      <Award className="h-5 w-5 text-amber-500" />
                      <span>{matchScore}% Score</span>
                    </div>
                    <span className="text-[9px] text-slate-400 mt-0.5">Biometric match acceptable. Sanctions check: CLEAR.</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Product Select */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in text-xs">
            <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Landmark className="h-4.5 w-4.5 text-teal-600" /> Select Savings Product Portfolio
            </h4>

            <div className="grid gap-3 pt-2">
              {[
                { name: "Regular Savings", rate: "3.5% p.a.", desc: "Standard liquid interest savings with immediate debit card links.", min: "Rs. 1,000" },
                { name: "Youth Savings (18-25)", rate: "4.5% p.a.", desc: "High-yield account designed exclusively for younger professionals.", min: "Rs. 500" },
                { name: "Senior Citizens Savings", rate: "5.5% p.a.", desc: "Maximized monthly interest payouts for individuals aged 60+.", min: "Rs. 1,000" }
              ].map((prod) => (
                <div
                  key={prod.name}
                  id={`prod-${prod.name.replace(/\s+/g, "-")}`}
                  onClick={() => setSelectedProduct(prod.name)}
                  className={`border p-4 rounded-2xl cursor-pointer flex justify-between items-center transition ${
                    selectedProduct === prod.name
                      ? "bg-teal-50/50 border-teal-500 ring-2 ring-teal-500/10 shadow-sm"
                      : "bg-white border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="space-y-1">
                    <h5 className="font-bold text-slate-800">{prod.name}</h5>
                    <p className="text-[11px] text-slate-500">{prod.desc}</p>
                    <span className="text-[10px] text-slate-400 font-mono">Min balance required: {prod.min}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-teal-600 font-mono block">{prod.rate}</span>
                    <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-slate-400 block mt-0.5">Yield Rate</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: Legal Consent & Data Protection */}
        {step === 4 && (
          <div className="space-y-4 animate-fade-in text-xs">
            <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
              <ShieldCheck className="h-4.5 w-4.5 text-teal-600" /> Regulatory Terms & Consent
            </h4>

            <div className="bg-slate-50 p-4 border border-slate-200 rounded-2xl max-h-56 overflow-y-auto leading-relaxed text-[11px] text-slate-600 space-y-2.5">
              <h5 className="font-bold text-slate-800 text-xs">Sri Lanka Personal Data Protection Act (PDPA) No. 9 of 2022 Consent</h5>
              <p>Under the statutory provisions of the PDPA, NovaBank PLC hereby requests your explicit, informed affirmative consent to process, store, and validate your Personal Identifiable Information (PII), including National Identity Card documents and biometrics, solely for the purposes of performing Customer Due Diligence (CDD) under FIU directives.</p>
              <p>Your data will be heavily encrypted using AES-256 protocols and stored on secure cloud-on-prem architectures situated strictly within approved borders of Sri Lanka.</p>
              <p><strong>FATCA Declarations:</strong> By continuing, you affirm that you are a tax resident of Sri Lanka and hold no citizenship or tax liabilities inside the United States of America.</p>
            </div>

            <div className="space-y-3 pt-3">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  id="chk-pdpa"
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded"
                  checked={pdpaConsent}
                  onChange={(e) => setPdpaConsent(e.target.checked)}
                />
                <span className="text-[11px] text-slate-600 leading-tight">
                  I hereby affirmatively consent to NovaBank collecting and validating my NIC data and liveness selfie coordinates per the PDPA No. 9 of 2022 policies.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  id="chk-fatca"
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded"
                  checked={fatcaConsent}
                  onChange={(e) => setFatcaConsent(e.target.checked)}
                />
                <span className="text-[11px] text-slate-600 leading-tight">
                  I confirm that I am a non-US citizen and am solely a tax resident of Sri Lanka.
                </span>
              </label>
            </div>
          </div>
        )}

        {/* STEP 5: Final Review & Submit */}
        {step === 5 && (
          <div className="space-y-4 animate-fade-in text-xs">
            <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
              <CheckCircle2 className="h-4.5 w-4.5 text-teal-600" /> Final Specification Summary
            </h4>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 divide-y divide-slate-200/60 text-xs">
              <div className="py-2 flex justify-between">
                <span className="text-slate-400">Selected Product:</span>
                <span className="font-bold text-teal-600 uppercase font-mono">{selectedProduct}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-400">Account Owner Name:</span>
                <span className="font-bold text-slate-800">{fullName}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-400">NIC Identifier:</span>
                <span className="font-bold text-slate-800 font-mono">{nicNo}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-400">Contact Number:</span>
                <span className="font-bold text-slate-800 font-mono">{mobile}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-400">Verification Match score:</span>
                <span className="font-bold text-emerald-600">{matchScore ? `${matchScore}% Match` : "95.0% Pre-Verified"}</span>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-center space-y-1">
              <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1 justify-center">
                <ShieldCheck className="h-4 w-4" /> SECURE REGULATORY DISPATCH
              </span>
              <p className="text-[10px] text-emerald-600 leading-tight">Submitting will trigger a live mock API dispatch to NovaBank's Core Banking System ledger to provision your accounts instantly.</p>
            </div>
          </div>
        )}

        {/* Footer actions bar */}
        <div className="flex justify-between pt-6 border-t border-slate-100 mt-8">
          <button
            id="btn-wizard-back"
            type="button"
            disabled={step === 1}
            onClick={() => setStep(step - 1)}
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-semibold disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer transition"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back</span>
          </button>

          {step < 5 ? (
            <button
              id="btn-wizard-next"
              type="button"
              disabled={step === 2 && !kycDone}
              onClick={() => {
                if (step === 4 && (!pdpaConsent || !fatcaConsent)) {
                  alert("You must check all mandatory checkboxes to proceed.");
                  return;
                }
                setStep(step + 1);
              }}
              className="flex items-center gap-1.5 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow transition cursor-pointer disabled:opacity-40"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              id="btn-wizard-submit"
              type="button"
              onClick={handleFinalSubmit}
              className="flex items-center gap-1.5 px-6 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-xs font-bold shadow transition cursor-pointer"
            >
              <span>Verify & Submit Account</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
