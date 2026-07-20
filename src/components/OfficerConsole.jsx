import React, { useState } from "react";
import { List, CheckSquare, ClipboardCheck, AlertCircle, FileText, Check, X, ArrowRight, UserCircle, Shield, Award } from "lucide-react";

export default function OfficerConsole({ user, applications, fetchCustomerData }) {
  const [selectedApp, setSelectedApp] = useState(null);
  const [decision, setDecision] = useState("APPROVE");
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);

  // Reviewing Queue Filter (Officers see Submitted applications)
  const pendingApps = applications.filter(app => app.status === "SUBMITTED" || app.status === "UNDER_REVIEW");

  const handleSelectApp = (app) => {
    setSelectedApp(app);
    setDecision("APPROVE");
    setComments("");
  };

  const handleDocumentVerify = async (docName, status) => {
    let comment = "";
    if (status === "REJECTED") {
      comment = prompt("Please enter the rejection reason for this document:");
      if (!comment) return;
    }

    try {
      const res = await fetch("/api/v1/loans/verify-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          application_id: selectedApp.application_id,
          document_name: docName,
          status,
          comment,
          staff_name: user.fullName
        })
      });
      const data = await res.json();
      if (data.success) {
        // Refresh local selection view
        setSelectedApp(data.application);
        fetchCustomerData();
      }
    } catch (err) {
      alert("Error verifying document.");
    }
  };

  const handleWorkflowSubmit = async (e) => {
    e.preventDefault();
    if (!comments) {
      alert("Please provide recommendation comments / rationale.");
      return;
    }
    setLoading(true);

    try {
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
        alert(`Recommendation dispatched to Branch Manager!\nAction: ${decision}`);
        setSelectedApp(null);
        fetchCustomerData();
      }
    } catch (err) {
      alert("Error submitting decision.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 750) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (score >= 600) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-rose-600 bg-rose-50 border-rose-200";
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      
      {/* Overview stats header */}
      <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-800">Officer Underwriting Queue</h2>
          <p className="text-[11px] text-slate-500">Perform maker-checker verification of borrower profile and CRIB parameters.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white border p-3 rounded-xl text-center">
            <span className="text-[10px] text-slate-400 font-mono block">Pending Reviews</span>
            <span className="text-sm font-bold text-brand-primary">{pendingApps.length} Cases</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        
        {/* Left Side: Pending Applications Table/List */}
        <div className="md:col-span-4 space-y-4">
          <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">Borrower Inbox</h3>
          
          {pendingApps.length > 0 ? (
            <div className="grid gap-2.5">
              {pendingApps.map((app) => (
                <div
                  key={app.application_id}
                  id={`app-card-${app.application_id}`}
                  onClick={() => handleSelectApp(app)}
                  className={`p-4 border rounded-2xl cursor-pointer transition ${
                    selectedApp?.application_id === app.application_id
                      ? "bg-blue-50/50 border-blue-500 shadow-sm"
                      : "bg-white border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-mono font-bold text-slate-800 text-[10px]">{app.application_ref}</span>
                    <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase">
                      {app.loan_type}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-brand-primary mt-2">LKR {app.requested_amount.toLocaleString()}</p>
                  <div className="flex justify-between items-center mt-3 text-[10px] text-slate-400">
                    <span>Tenure: {app.tenure_months}m</span>
                    <span className={`px-2 py-0.5 rounded font-bold uppercase text-[9px] ${
                      app.status === "UNDER_REVIEW" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"
                    }`}>
                      {app.status === "UNDER_REVIEW" ? "In Review" : "Submitted"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border p-6 rounded-2xl text-center text-slate-400">
              <List className="h-6 w-6 mx-auto mb-1 text-slate-300" />
              <span>No outstanding applications inside the underwriting queue.</span>
            </div>
          )}
        </div>

        {/* Right Side: Active Application Assessment Dashboard */}
        <div className="md:col-span-8">
          {selectedApp ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm animate-fade-in">
              
              {/* Profile Details Bar */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono font-bold tracking-wider uppercase">Active Underwriting Review</span>
                  <h3 className="text-md font-bold text-slate-800 flex items-center gap-1.5">
                    <UserCircle className="h-4.5 w-4.5 text-blue-600" /> Kamal Bandara (Client ID: #{selectedApp.customer_id})
                  </h3>
                  <p className="text-[11px] text-slate-500">Applicant declared monthly turnover: <strong>LKR 250,000</strong></p>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="text-xs text-rose-500 hover:underline font-bold"
                >
                  Close Panel
                </button>
              </div>

              {/* Dynamic Assessment Widget: Scores, DTI, LTV */}
              <div className="grid sm:grid-cols-3 gap-4">
                
                {/* Scoring dial block */}
                <div className="bg-slate-50 p-4 border border-slate-200/60 rounded-2xl text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Credit Score</span>
                  <div className={`inline-block px-3 py-1 text-md font-bold font-mono rounded-full border mt-2 ${getScoreColor(selectedApp.assessment?.internal_score)}`}>
                    {selectedApp.assessment?.internal_score}
                  </div>
                  <span className="text-[9px] text-slate-400 block mt-1">Rule-Engine Estimate</span>
                </div>

                {/* Debt-to-income block */}
                <div className="bg-slate-50 p-4 border border-slate-200/60 rounded-2xl text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Debt Ratio (DTI)</span>
                  <div className={`inline-block px-3 py-1 text-md font-bold font-mono rounded-full border mt-2 ${
                    selectedApp.assessment?.dti_ratio <= 40 ? "text-emerald-700 bg-emerald-50 border-emerald-200" : "text-rose-700 bg-rose-50 border-rose-200"
                  }`}>
                    {selectedApp.assessment?.dti_ratio}%
                  </div>
                  <span className="text-[9px] text-slate-400 block mt-1">CBSL Limit: 40%</span>
                </div>

                {/* Loan-to-value block */}
                <div className="bg-slate-50 p-4 border border-slate-200/60 rounded-2xl text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Collateral (LTV)</span>
                  <div className="inline-block px-3 py-1 text-md font-bold font-mono bg-slate-100 text-slate-700 rounded-full border border-slate-200 mt-2">
                    {selectedApp.assessment?.ltv_ratio ? `${selectedApp.assessment.ltv_ratio}%` : "N/A"}
                  </div>
                  <span className="text-[9px] text-slate-400 block mt-1">LTV Ceiling: 80%</span>
                </div>

              </div>

              {/* Document Checklist verification gate */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-700 uppercase font-mono tracking-wider text-[10px] flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <FileText className="h-4 w-4 text-slate-400" /> Supporting Document Checkpoints
                </h4>

                <div className="grid gap-2.5">
                  {selectedApp.documents.map((doc) => (
                    <div key={doc.name} className="flex justify-between items-center p-3 border rounded-xl bg-slate-50/50">
                      <div>
                        <span className="font-bold text-slate-700 text-[11px]">{doc.name}</span>
                        {doc.comment && <p className="text-[9px] text-rose-500 mt-0.5 italic">Reject Reason: {doc.comment}</p>}
                      </div>

                      <div className="flex gap-2">
                        {doc.status === "VERIFIED" ? (
                          <span className="px-2 py-0.5 font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded text-[9px] flex items-center gap-1">
                            <Check className="h-3 w-3" /> VERIFIED
                          </span>
                        ) : doc.status === "REJECTED" ? (
                          <span className="px-2 py-0.5 font-bold text-rose-800 bg-rose-50 border border-rose-200 rounded text-[9px] flex items-center gap-1">
                            <X className="h-3 w-3" /> REJECTED
                          </span>
                        ) : (
                          <>
                            <button
                              id={`btn-doc-verify-${doc.name.replace(/\s+/g, "-")}`}
                              onClick={() => handleDocumentVerify(doc.name, "VERIFIED")}
                              className="p-1 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded cursor-pointer"
                              title="Approve document"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                            <button
                              id={`btn-doc-reject-${doc.name.replace(/\s+/g, "-")}`}
                              onClick={() => handleDocumentVerify(doc.name, "REJECTED")}
                              className="p-1 text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded cursor-pointer"
                              title="Reject document"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Form recommendation dispatch */}
              <form onSubmit={handleWorkflowSubmit} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <h4 className="font-bold text-slate-700 uppercase font-mono tracking-wider text-[10px] flex items-center gap-1">
                  <Shield className="h-4 w-4 text-slate-400" /> Maker Recommendation Workflow
                </h4>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">DECISION SELECTION</label>
                    <select
                      id="officer-decision"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                      value={decision}
                      onChange={(e) => setDecision(e.target.value)}
                    >
                      <option value="APPROVE">Approve & Recommend to Branch Manager</option>
                      <option value="REJECT">Auto-Reject / Decline Application</option>
                      <option value="RETURN_FOR_INFO">Return to Borrower for Information (RFI)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">CREDIT RATIONALE / SUMMARY COMMENTS</label>
                    <input
                      id="officer-comments"
                      type="text"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                      placeholder="e.g. Verified income via payslip. Score is excellent. DTI within limits."
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  id="btn-officer-decision-submit"
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span>Dispatched Processing...</span>
                  ) : (
                    <>
                      <span>Dispatch Decision recommendation</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-400 flex flex-col justify-center items-center h-full min-h-[400px]">
              <CheckSquare className="h-10 w-10 text-slate-300 mb-3 animate-pulse" />
              <h4 className="font-bold text-slate-700">No Case Selected</h4>
              <p className="text-slate-400 max-w-sm mt-1">Select a borrower application file from the Inbox queue in order to inspect collateral, scores, and verify documents.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
