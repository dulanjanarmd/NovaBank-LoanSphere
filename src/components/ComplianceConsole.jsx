import React, { useState } from "react";
import { ShieldCheck, HelpCircle, Eye, AlertCircle, FileSearch, CheckCircle2, UserCircle2, Ban, Landmark } from "lucide-react";

export default function ComplianceConsole({ user, customers, fetchCustomerData }) {
  const [selectedCust, setSelectedCust] = useState(null);
  const [eddReport, setEddReport] = useState("");
  const [runningEdd, setRunningEdd] = useState(false);
  const [comments, setComments] = useState("");

  const handleRunEdd = () => {
    setRunningEdd(true);
    setTimeout(() => {
      setRunningEdd(false);
      setEddReport(`
--- ENHANCED DUE DILIGENCE REPORT (COMPLIANCE) ---
DATE PERFORMED: ${new Date().toISOString().slice(0,10)}
WATCHLIST CLASSIFICATION: FUZZY-MATCH CHECK COMPLETED
AML SANCTION MATRIX MATCH SCORE: 4.2% (BELOW EXCLUSION THRESHOLD)
PEP DETERMINATION: SUBJECT IS NOT A POLITICALLY EXPOSED PERSON OR FAMILY CLOSE ASSOCIATE.
VERDICT: LOW/MEDIUM PROBABILITY FRAUD METRICS ENCOUNTERED. RECOMMENDED FOR MANUAL KYC PASS.
      `);
    }, 1500);
  };

  const handleKycClear = async (status) => {
    if (!comments) {
      alert("Please provide audit clearance comments first.");
      return;
    }

    try {
      const response = await fetch("/api/v1/accounts/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: selectedCust.customer_id,
          product_name: "Regular Savings",
          livenessScore: 95.0,
          screeningStatus: status === "CLEARED" ? "CLEAR" : "HIT",
          riskTier: "LOW"
        })
      });
      const data = await response.json();
      if (data.success) {
        alert(`Compliance clearance logged successfully. Status: ${status}`);
        setSelectedCust(null);
        setEddReport("");
        setComments("");
        fetchCustomerData();
      }
    } catch (err) {
      alert("Error saving compliance clearance.");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      
      {/* Compliance banner */}
      <div className="bg-accent-violet-900 rounded-2xl p-5 text-white shadow-lg flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[10px] font-mono tracking-wider font-bold text-accent-violet-300 uppercase">AML & Sanctions Surveillance</span>
          <h2 className="text-sm font-bold">Compliance Officer Operations</h2>
          <p className="text-[11px] text-accent-violet-200">Enforce FIU AML/CFT directives, monitor high-risk PEP indicators, and audit e-KYC matching logs.</p>
        </div>
        <div className="hidden sm:block bg-accent-violet-800 p-2.5 rounded-xl border border-accent-violet-700">
          <ShieldCheck className="h-6 w-6 text-accent-violet-300" />
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        
        {/* Left Side: Flagged Customers Inbox */}
        <div className="md:col-span-5 space-y-4">
          <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400">KYC Sanctions Inbox</h3>

          <div className="glass-panel rounded-2xl rounded-2xl divide-y divide-neutral-100 overflow-hidden shadow-md shadow-primary/5">
            {customers && customers.length > 0 ? (
              customers.map((cust) => (
                <div
                  key={cust.customer_id}
                  id={`cust-row-${cust.customer_id}`}
                  onClick={() => {
                    setSelectedCust(cust);
                    setEddReport("");
                    setComments("");
                  }}
                  className={`p-4 cursor-pointer transition flex items-center justify-between gap-4 ${
                    selectedCust?.customer_id === cust.customer_id
                      ? "bg-accent-violet-900/20/50"
                      : "hover:bg-neutral-900/30"
                  }`}
                >
                  <div className="space-y-1">
                    <h5 className="font-bold text-neutral-50">{cust.full_name}</h5>
                    <p className="text-[10px] text-neutral-400 font-mono">NIC: {cust.nic_number}</p>
                    <p className="text-[10px] text-neutral-400 font-mono">Occupation: {cust.occupation}</p>
                  </div>

                  <div className="text-right space-y-1">
                    <span className={`px-2 py-0.5 rounded-full font-bold uppercase text-[8px] border ${
                      cust.risk_tier === "HIGH" ? "bg-error-900/20 text-error-700 border-error-200" : "bg-success-900/20 text-success-700 border-success-200"
                    }`}>
                      {cust.risk_tier} RISK
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono block">Turnover: {cust.monthly_turnover} LKR</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-neutral-400">
                <span>No registered customer identities in database.</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Enhanced Due Diligence Panel */}
        <div className="md:col-span-7">
          {selectedCust ? (
            <div className="glass-panel rounded-2xl rounded-3xl p-6 sm:p-8 space-y-6 shadow-md shadow-primary/5 animate-fade-in">
              
              {/* Header */}
              <div className="flex items-start justify-between border-b border-neutral-700/30 pb-3">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono font-bold text-accent-violet-600 uppercase">Customer Due Diligence (CDD) Dossier</span>
                  <h4 className="font-bold text-neutral-50 text-sm flex items-center gap-1.5">
                    <UserCircle2 className="h-4.5 w-4.5 text-accent-violet-600" /> {selectedCust.full_name}
                  </h4>
                </div>
                <button
                  onClick={() => {
                    setSelectedCust(null);
                    setEddReport("");
                  }}
                  className="text-xs text-error-500 hover:underline font-bold transition-all duration-200"
                >
                  Close Dossier
                </button>
              </div>

              {/* Quick specs */}
              <div className="grid sm:grid-cols-2 gap-4 text-xs bg-neutral-900/30 p-4 border border-neutral-700/50/60 rounded-2xl">
                <div>
                  <span className="text-neutral-400 text-[10px]">Source of Declared Funds:</span>
                  <p className="font-bold text-neutral-50">{selectedCust.source_of_funds || "Employment"}</p>
                </div>
                <div>
                  <span className="text-neutral-400 text-[10px]">Residential Spec:</span>
                  <p className="font-bold text-neutral-50">{selectedCust.address}</p>
                </div>
              </div>

              {/* EDD triggering block */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-700/30 pb-2">
                  <h4 className="font-bold text-neutral-200 uppercase font-mono tracking-wider text-[10px]">Enhanced Due Diligence (EDD) Matrix</h4>
                  <button
                    id="btn-run-edd"
                    type="button"
                    onClick={handleRunEdd}
                    disabled={runningEdd}
                    className="px-3 py-1.5 bg-accent-violet-600 hover:bg-accent-violet-700 text-white rounded-xl font-semibold flex items-center gap-1 cursor-pointer transition shadow"
                  >
                    <FileSearch className="h-3.5 w-3.5" />
                    <span>{runningEdd ? "Searching records..." : "Trigger Live AML / PEP check"}</span>
                  </button>
                </div>

                {eddReport ? (
                  <pre className="bg-neutral-950 text-success-400 p-4 rounded-xl font-mono text-[10px] overflow-x-auto whitespace-pre-wrap leading-tight shadow-inner">
                    {eddReport}
                  </pre>
                ) : (
                  <div className="bg-neutral-900/30 border border-dashed border-neutral-700/50 p-6 rounded-xl text-center text-neutral-400">
                    <span>Click the trigger button to scan national sanctions databases.</span>
                  </div>
                )}
              </div>

              {/* Clearance action portal */}
              <div className="bg-accent-violet-900/20/50 border border-accent-violet-100 rounded-2xl p-5 space-y-4">
                <h4 className="font-bold text-accent-violet-900 uppercase font-mono tracking-wider text-[10px] flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4" /> Compliance Audit Decision
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-accent-violet-700 mb-1">AUDIT CLEARANCE LOG COMMENTS</label>
                    <input
                      id="compliance-comments"
                      type="text"
                      className="w-full px-3 py-2 border border-accent-violet-200 bg-neutral-900/50 rounded-xl"
                      placeholder="e.g. Scanned DRP and PEP databases. Low matching density, validated source of funds."
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-2.5">
                    <button
                      id="btn-compliance-clear"
                      type="button"
                      onClick={() => handleKycClear("CLEARED")}
                      className="flex-1 bg-accent-violet-600 hover:bg-accent-violet-700 text-white font-bold py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Release Hold (Approve KYC)</span>
                    </button>

                    <button
                      id="btn-compliance-restrict"
                      type="button"
                      onClick={() => handleKycClear("RESTRICTED")}
                      className="px-4 bg-error-100 hover:bg-error-200 border border-error-200 text-error-700 font-bold py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Ban className="h-4 w-4" />
                      <span>Flag / Suspend Onboarding</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="glass-panel rounded-2xl rounded-3xl p-12 text-center text-neutral-400 flex flex-col justify-center items-center h-full min-h-[400px]">
              <FileSearch className="h-10 w-10 text-neutral-300 mb-3" />
              <h4 className="font-bold text-neutral-200">No Dossier Active</h4>
              <p className="text-neutral-400 max-w-xs mt-1">Select an applicant file from the KYC registry list to verify risk scores and run watch-list screening.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
