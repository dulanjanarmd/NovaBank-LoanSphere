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
      <div className="bg-success-900 rounded-2xl p-5 text-white shadow-lg flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[10px] font-mono tracking-wider font-bold text-success-300 uppercase">Checker Gate (Delegated Authority)</span>
          <h2 className="text-sm font-bold">Branch Manager Dashboard</h2>
          <p className="text-[11px] text-success-200">Review Loan Officer recommendations, append legal conditional clauses, and execute final payouts to Core ledger.</p>
        </div>
        <div className="hidden sm:block bg-success-800 p-2.5 rounded-xl border border-success-700">
          <ShieldCheck className="h-6 w-6 text-success-300" />
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        
        {/* Left Side: Awaiting Review Inbox */}
        <div className="md:col-span-4 space-y-4">
          
          {/* Reviewing queue (Checker review) */}
          <div>
            <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-2 flex items-center justify-between">
              <span>Checker Inbox</span>
              <span className="bg-neutral-200 text-neutral-200 px-2 py-0.5 rounded-full text-[9px]">{reviewQueue.length} Cases</span>
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
                        ? "bg-success-900/20/50 border-success-500"
                        : "bg-neutral-900/50 border-neutral-700/50 hover:bg-neutral-900/30"
                    }`}
                  >
                    <div className="flex justify-between font-mono font-bold text-[10px]">
                      <span>{app.application_ref}</span>
                      <span className="text-success-700 bg-success-900/20 px-2 rounded-full border border-success-100 uppercase">{app.loan_type}</span>
                    </div>
                    <p className="font-bold text-neutral-50 mt-1.5">LKR {app.requested_amount.toLocaleString()}</p>
                    <span className="text-[9px] text-neutral-400 font-mono block mt-2">DTI: {app.assessment.dti_ratio}% | Score: {app.assessment.internal_score}</span>
                  </div>
                ))
              ) : (
                <div className="bg-neutral-900/50 border p-4 rounded-xl text-center text-neutral-400 text-[11px]">
                  <span>No applications pending checker sign-off.</span>
                </div>
              )}
            </div>
          </div>

          {/* Disbursement queue (E-signed, waiting release) */}
          <div>
            <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-2 flex items-center justify-between">
              <span>E-Signed Release Queue</span>
              <span className="bg-warning-100 text-warning-800 px-2 py-0.5 rounded-full text-[9px]">{signQueue.length} Cases</span>
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
                        ? "bg-warning-900/20/50 border-warning-500"
                        : "bg-neutral-900/50 border-neutral-700/50 hover:bg-neutral-900/30"
                    }`}
                  >
                    <div className="flex justify-between font-mono font-bold text-[10px]">
                      <span>{app.application_ref}</span>
                      <span className="text-warning-700 bg-warning-900/20 px-2 rounded-full border border-warning-100">SIGNED</span>
                    </div>
                    <p className="font-bold text-neutral-50 mt-1.5">LKR {app.requested_amount.toLocaleString()}</p>
                    <span className="text-[9px] text-neutral-400 font-mono block mt-2">Ready for ledger payout release.</span>
                  </div>
                ))
              ) : (
                <div className="bg-neutral-900/50 border p-4 rounded-xl text-center text-neutral-400 text-[11px]">
                  <span>No e-signed loans pending disbursement release.</span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Side: Manager Review and Action Panel */}
        <div className="md:col-span-8">
          {selectedApp ? (
            <div className="glass-panel rounded-2xl rounded-3xl p-6 sm:p-8 space-y-6 shadow-md shadow-primary/5 animate-fade-in">
              
              {/* Header details bar */}
              <div className="flex items-start justify-between border-b border-neutral-700/30 pb-3">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono font-bold text-success-600 uppercase">Checker Authority Verification</span>
                  <h4 className="font-bold text-neutral-50 text-sm">
                    {selectedApp.application_ref} — Kamal Bandara
                  </h4>
                  <p className="text-xs font-bold text-brand-primary">LKR {selectedApp.requested_amount.toLocaleString()} ({selectedApp.loan_type} loan)</p>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="text-xs text-error-500 hover:underline font-bold transition-all duration-200"
                >
                  Close Review
                </button>
              </div>

              {/* 1. Review Mode (Status is UNDER_REVIEW) */}
              {selectedApp.status === "UNDER_REVIEW" && (
                <div className="space-y-5">
                  {/* Underwriting assessment facts */}
                  <div className="grid sm:grid-cols-3 gap-3 bg-neutral-900/30 border p-4 rounded-xl text-center font-mono">
                    <div>
                      <span className="text-[9px] text-neutral-400 uppercase">Risk Score</span>
                      <p className="font-bold text-teal-600 text-xs mt-1">{selectedApp.assessment.internal_score} / 1000</p>
                    </div>
                    <div>
                      <span className="text-[9px] text-neutral-400 uppercase">DTI Ratio</span>
                      <p className="font-bold text-success-600 text-xs mt-1">{selectedApp.assessment.dti_ratio}%</p>
                    </div>
                    <div>
                      <span className="text-[9px] text-neutral-400 uppercase">LTV Ratio</span>
                      <p className="font-bold text-neutral-200 text-xs mt-1">{selectedApp.assessment.ltv_ratio ? `${selectedApp.assessment.ltv_ratio}%` : "N/A"}</p>
                    </div>
                  </div>

                  {/* Maker recommendation log */}
                  {selectedApp.approvals && selectedApp.approvals.length > 0 && (
                    <div className="bg-primary-900/20/50 border border-primary-100 p-4 rounded-xl space-y-1">
                      <span className="text-[10px] font-bold text-primary-800 uppercase font-mono">Loan Officer recommendation log</span>
                      <p className="text-neutral-200 italic">"{selectedApp.approvals[0].comments}"</p>
                      <span className="text-[9px] text-neutral-400 block mt-1">Recommended by: {selectedApp.approvals[0].approver} (Loan Officer)</span>
                    </div>
                  )}

                  {/* Workflow Checker Decision Form */}
                  <form onSubmit={handleWorkflowSubmit} className="space-y-4 bg-neutral-900/30 border border-neutral-700/50 rounded-2xl p-5">
                    <h5 className="font-bold text-neutral-200 uppercase font-mono tracking-wider text-[10px] flex items-center gap-1">
                      <Landmark className="h-4 w-4 text-neutral-400" /> checker authorization decision
                    </h5>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-500 mb-1">DECISION ACTION</label>
                        <select
                          id="manager-decision"
                          className="w-full px-3 py-2 border border-neutral-700/50 bg-neutral-900/50 rounded-xl"
                          value={decision}
                          onChange={(e) => setDecision(e.target.value)}
                        >
                          <option value="APPROVE">Approve Loan & Issue Offer Letter</option>
                          <option value="REJECT">Decline Application</option>
                          <option value="RETURN_FOR_INFO">Return to Officer (More Info Required)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-500 mb-1">DECISION JUSTIFICATION COMMENTS</label>
                        <input
                          id="manager-comments"
                          type="text"
                          className="w-full px-3 py-2 border border-neutral-700/50 bg-neutral-900/50 rounded-xl"
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
                      className="w-full bg-success-600 hover:bg-success-700 text-white font-bold py-2 rounded-xl cursor-pointer transition-all duration-200"
                    >
                      {loading ? "Processing..." : "Commit Authorization Decision"}
                    </button>
                  </form>
                </div>
              )}

              {/* 2. Disbursement Mode (Status is SIGNED) */}
              {selectedApp.status === "SIGNED" && (
                <div className="space-y-5">
                  <div className="bg-warning-900/20 text-warning-800 p-4 border border-warning-200 rounded-xl flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-warning-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-bold">E-Signed Document Envelope Active</h5>
                      <p className="text-[11px] mt-0.5">The borrower Kamal Bandara e-signed the loan offer on his mobile device. The cryptographic click-to-sign transaction matches. All conditional criteria checked successfully.</p>
                    </div>
                  </div>

                  {/* Disbursement Trigger details */}
                  <div className="bg-neutral-900/30 border border-neutral-700/50 rounded-2xl p-5 space-y-4">
                    <h5 className="font-bold text-neutral-200 uppercase font-mono tracking-wider text-[10px] flex items-center gap-1">
                      <CreditCard className="h-4 w-4 text-neutral-400" /> Execute Core Banking Ledger Payout
                    </h5>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-500 mb-1">RECIPIENT SAVINGS ACCOUNT</label>
                        <input
                          id="target-account"
                          type="text"
                          className="w-full px-3 py-2 border border-neutral-700/50 bg-neutral-900/50 rounded-xl font-mono text-sm"
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
                          className="w-full h-[38px] bg-success-600 hover:bg-success-700 text-white font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow"
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
            <div className="glass-panel rounded-2xl rounded-3xl p-12 text-center text-neutral-400 flex flex-col justify-center items-center h-full min-h-[400px]">
              <ClipboardCheck className="h-10 w-10 text-neutral-300 mb-3" />
              <h4 className="font-bold text-neutral-200">No Review File Selected</h4>
              <p className="text-neutral-400 max-w-xs mt-1">Select an active loan case from the Checker or Disbursement queues in the left sidebar to perform delegated audits.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
