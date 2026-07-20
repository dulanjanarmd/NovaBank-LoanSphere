import React, { useState } from "react";
import { List, CheckSquare, ClipboardCheck, AlertCircle, FileText, Check, X, ArrowRight, Landmark, ShieldCheck, CreditCard, RefreshCw } from "lucide-react";

export default function ManagerDashboard({ user, applications, fetchCustomerData }) {
  const [selectedApp, setSelectedApp] = useState(null);
  const [decision, setDecision] = useState("APPROVE");
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Condition configuration
  const [addedConditions, setAddedConditions] = useState([]);
  const [newConditionText, setNewConditionText] = useState("");

  // Target account number for disbursement
  const [targetAccount, setTargetAccount] = useState("8120045610");

  // Filter queues:
  // 1. Review Queue: status of UNDER_REVIEW
  // 2. Disbursement Queue: status of SIGNED
  const reviewQueue = applications.filter(app => app.status === "UNDER_REVIEW");
  const signQueue = applications.filter(app => app.status === "SIGNED");

  const handleSelectApp = (app) => {
    setSelectedApp(app);
    setDecision("APPROVE");
    setComments("");
    setAddedConditions([]);
  };

  const handleAddCondition = () => {
    if (!newConditionText) return;
    setAddedConditions([...addedConditions, { id: addedConditions.length + 1, text: newConditionText, status: "PENDING" }]);
    setNewConditionText("");
  };

  const handleWorkflowSubmit = async (e) => {
    e.preventDefault();
    if (!comments) {
      alert("Please enter approval/rejection justification comments.");
      return;
    }
    setLoading(true);

    try {
      // Branch Manager decision
      const res = await fetch("/api/v1/loans/decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          application_id: selectedApp.application_id,
          decision,
          comments,
          staff_name: user.fullName,
          role: user.role
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Checker Decision Logged!\nApplication state updated to: ${data.application.status}`);
        setSelectedApp(null);
        fetchCustomerData();
      }
    } catch (err) {
      alert("Error saving manager decision.");
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerDisbursement = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/loans/disburse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          application_id: selectedApp.application_id,
          staff_name: user.fullName,
          target_account_number: targetAccount
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(`DISBURSEMENT SUCCESSFUL!\nFunds of LKR ${selectedApp.requested_amount.toLocaleString()} posted to account ${targetAccount}.\nCBS reference: ${data.application.disbursement_details.reference}`);
        setSelectedApp(null);
        fetchCustomerData();
      } else {
        alert(data.message || "Disbursement failed.");
      }
    } catch (err) {
      alert("Error calling Core Banking disbursement API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      
      {/* Manager header */}
      <div className="bg-emerald-900 rounded-2xl p-5 text-white shadow-lg flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[10px] font-mono tracking-wider font-bold text-emerald-300 uppercase">Checker Gate (Delegated Authority)</span>
          <h2 className="text-sm font-bold">Branch Manager Dashboard</h2>
          <p className="text-[11px] text-emerald-200">Review Loan Officer recommendations, append legal conditional clauses, and execute final payouts to Core ledger.</p>
        </div>
        <div className="hidden sm:block bg-emerald-800 p-2.5 rounded-xl border border-emerald-700">
          <ShieldCheck className="h-6 w-6 text-emerald-300" />
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        
        {/* Left Side: Awaiting Review Inbox */}
        <div className="md:col-span-4 space-y-4">
          
          {/* Reviewing queue (Checker review) */}
          <div>
            <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
              <span>Checker Inbox</span>
              <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-[9px]">{reviewQueue.length} Cases</span>
            </h3>

            <div className="grid gap-2">
              {reviewQueue.length > 0 ? (
                reviewQueue.map((app) => (
                  <div
                    key={app.application_id}
                    id={`manager-app-${app.application_id}`}
                    onClick={() => handleSelectApp(app)}
                    className={`p-3 border rounded-xl cursor-pointer transition ${
                      selectedApp?.application_id === app.application_id
                        ? "bg-emerald-50/50 border-emerald-500"
                        : "bg-white border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex justify-between font-mono font-bold text-[10px]">
                      <span>{app.application_ref}</span>
                      <span className="text-emerald-700 bg-emerald-50 px-2 rounded-full border border-emerald-100 uppercase">{app.loan_type}</span>
                    </div>
                    <p className="font-bold text-slate-800 mt-1.5">LKR {app.requested_amount.toLocaleString()}</p>
                    <span className="text-[9px] text-slate-400 font-mono block mt-2">DTI: {app.assessment.dti_ratio}% | Score: {app.assessment.internal_score}</span>
                  </div>
                ))
              ) : (
                <div className="bg-white border p-4 rounded-xl text-center text-slate-400 text-[11px]">
                  <span>No applications pending checker sign-off.</span>
                </div>
              )}
            </div>
          </div>

          {/* Disbursement queue (E-signed, waiting release) */}
          <div>
            <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
              <span>E-Signed Release Queue</span>
              <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-[9px]">{signQueue.length} Cases</span>
            </h3>

            <div className="grid gap-2">
              {signQueue.length > 0 ? (
                signQueue.map((app) => (
                  <div
                    key={app.application_id}
                    id={`disb-app-${app.application_id}`}
                    onClick={() => handleSelectApp(app)}
                    className={`p-3 border rounded-xl cursor-pointer transition ${
                      selectedApp?.application_id === app.application_id
                        ? "bg-amber-50/50 border-amber-500"
                        : "bg-white border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex justify-between font-mono font-bold text-[10px]">
                      <span>{app.application_ref}</span>
                      <span className="text-amber-700 bg-amber-50 px-2 rounded-full border border-amber-100">SIGNED</span>
                    </div>
                    <p className="font-bold text-slate-800 mt-1.5">LKR {app.requested_amount.toLocaleString()}</p>
                    <span className="text-[9px] text-slate-400 font-mono block mt-2">Ready for ledger payout release.</span>
                  </div>
                ))
              ) : (
                <div className="bg-white border p-4 rounded-xl text-center text-slate-400 text-[11px]">
                  <span>No e-signed loans pending disbursement release.</span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Side: Manager Review and Action Panel */}
        <div className="md:col-span-8">
          {selectedApp ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm animate-fade-in">
              
              {/* Header details bar */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono font-bold text-emerald-600 uppercase">Checker Authority Verification</span>
                  <h4 className="font-bold text-slate-800 text-sm">
                    {selectedApp.application_ref} — Kamal Bandara
                  </h4>
                  <p className="text-xs font-bold text-brand-primary">LKR {selectedApp.requested_amount.toLocaleString()} ({selectedApp.loan_type} loan)</p>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="text-xs text-rose-500 hover:underline font-bold"
                >
                  Close Review
                </button>
              </div>

              {/* 1. Review Mode (Status is UNDER_REVIEW) */}
              {selectedApp.status === "UNDER_REVIEW" && (
                <div className="space-y-5">
                  {/* Underwriting assessment facts */}
                  <div className="grid sm:grid-cols-3 gap-3 bg-slate-50 border p-4 rounded-xl text-center font-mono">
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase">Risk Score</span>
                      <p className="font-bold text-teal-600 text-xs mt-1">{selectedApp.assessment.internal_score} / 1000</p>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase">DTI Ratio</span>
                      <p className="font-bold text-emerald-600 text-xs mt-1">{selectedApp.assessment.dti_ratio}%</p>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase">LTV Ratio</span>
                      <p className="font-bold text-slate-700 text-xs mt-1">{selectedApp.assessment.ltv_ratio ? `${selectedApp.assessment.ltv_ratio}%` : "N/A"}</p>
                    </div>
                  </div>

                  {/* Maker recommendation log */}
                  {selectedApp.approvals && selectedApp.approvals.length > 0 && (
                    <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl space-y-1">
                      <span className="text-[10px] font-bold text-blue-800 uppercase font-mono">Loan Officer recommendation log</span>
                      <p className="text-slate-700 italic">"{selectedApp.approvals[0].comments}"</p>
                      <span className="text-[9px] text-slate-400 block mt-1">Recommended by: {selectedApp.approvals[0].approver} (Loan Officer)</span>
                    </div>
                  )}

                  {/* Workflow Checker Decision Form */}
                  <form onSubmit={handleWorkflowSubmit} className="space-y-4 bg-slate-50 border border-slate-200 rounded-2xl p-5">
                    <h5 className="font-bold text-slate-700 uppercase font-mono tracking-wider text-[10px] flex items-center gap-1">
                      <Landmark className="h-4 w-4 text-slate-400" /> checker authorization decision
                    </h5>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">DECISION ACTION</label>
                        <select
                          id="manager-decision"
                          className="w-full px-3 py-2 border border-slate-200 bg-white rounded-xl"
                          value={decision}
                          onChange={(e) => setDecision(e.target.value)}
                        >
                          <option value="APPROVE">Approve Loan & Issue Offer Letter</option>
                          <option value="REJECT">Decline Application</option>
                          <option value="RETURN_FOR_INFO">Return to Officer (More Info Required)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">DECISION JUSTIFICATION COMMENTS</label>
                        <input
                          id="manager-comments"
                          type="text"
                          className="w-full px-3 py-2 border border-slate-200 bg-white rounded-xl"
                          placeholder="e.g. Cleared for approval. Verified CRIB status and employment records."
                          value={comments}
                          onChange={(e) => setComments(e.target.value)}
                        />
                      </div>
                    </div>

                    <button
                      id="btn-manager-decision-submit"
                      type="submit"
                      disabled={loading}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl cursor-pointer"
                    >
                      {loading ? "Processing..." : "Commit Authorization Decision"}
                    </button>
                  </form>
                </div>
              )}

              {/* 2. Disbursement Mode (Status is SIGNED) */}
              {selectedApp.status === "SIGNED" && (
                <div className="space-y-5">
                  <div className="bg-amber-50 text-amber-800 p-4 border border-amber-200 rounded-xl flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-bold">E-Signed Document Envelope Active</h5>
                      <p className="text-[11px] mt-0.5">The borrower Kamal Bandara e-signed the loan offer on his mobile device. The cryptographic click-to-sign transaction matches. All conditional criteria checked successfully.</p>
                    </div>
                  </div>

                  {/* Disbursement Trigger details */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                    <h5 className="font-bold text-slate-700 uppercase font-mono tracking-wider text-[10px] flex items-center gap-1">
                      <CreditCard className="h-4 w-4 text-slate-400" /> Execute Core Banking Ledger Payout
                    </h5>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">RECIPIENT SAVINGS ACCOUNT</label>
                        <input
                          id="target-account"
                          type="text"
                          className="w-full px-3 py-2 border border-slate-200 bg-white rounded-xl font-mono text-sm"
                          value={targetAccount}
                          onChange={(e) => setTargetAccount(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col justify-end">
                        <button
                          id="btn-disburse-submit"
                          type="button"
                          onClick={handleTriggerDisbursement}
                          disabled={loading}
                          className="w-full h-[38px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow"
                        >
                          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                          <span>Authorize Disbursement</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-400 flex flex-col justify-center items-center h-full min-h-[400px]">
              <ClipboardCheck className="h-10 w-10 text-slate-300 mb-3" />
              <h4 className="font-bold text-slate-700">No Review File Selected</h4>
              <p className="text-slate-400 max-w-xs mt-1">Select an active loan case from the Checker or Disbursement queues in the left sidebar to perform delegated audits.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
