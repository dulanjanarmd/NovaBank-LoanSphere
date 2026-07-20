import React, { useState, useMemo } from "react";
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Info, 
  Check, 
  Trash2, 
  FileText, 
  Sparkles, 
  Landmark,
  X
} from "lucide-react";

export default function NotificationCenter({ customerApplications, customerAccounts }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClearedAll, setIsClearedAll] = useState(false);

  // Generate dynamic system alerts/notifications based on the user's active applications & accounts
  const systemNotifications = useMemo(() => {
    if (isClearedAll) return [];

    const list = [];
    let idCounter = 1;

    // 1. Check Accounts
    if (customerAccounts && customerAccounts.length > 0) {
      customerAccounts.forEach(acc => {
        list.push({
          id: `acc-${idCounter++}`,
          title: "Account Active & Provisioned",
          desc: `Your savings account ${acc.account_number} is fully setup and ready for immediate funding transactions.`,
          type: "success",
          time: "Just now",
          category: "onboarding",
          icon: Landmark
        });
      });
    } else {
      list.push({
        id: `acc-none`,
        title: "Savings Account Setup Pending",
        desc: "You haven't activated a Nova savings ledger account yet. Start standard onboarding or Express Quick Open to activate.",
        type: "info",
        time: "1 hour ago",
        category: "onboarding",
        icon: Landmark
      });
    }

    // 2. Check Applications
    if (customerApplications && customerApplications.length > 0) {
      customerApplications.forEach(app => {
        // Status based notifications
        if (app.status === "APPROVED") {
          list.push({
            id: `app-${app.application_id}-approved`,
            title: "Action Required: E-Sign Agreement",
            desc: `Your requested loan ref: ${app.application_ref} of LKR ${app.requested_amount.toLocaleString()} is APPROVED! Please e-sign the agreement to start disbursement.`,
            type: "warning",
            time: "Recently",
            category: "loan",
            icon: FileText,
            actionId: `btn-sign-${app.application_id}`
          });
        } else if (app.status === "DISBURSED") {
          list.push({
            id: `app-${app.application_id}-disbursed`,
            title: "Funds Disbursed Successfully",
            desc: `LKR ${app.requested_amount.toLocaleString()} has been routed to your active account for loan ref: ${app.application_ref}. Monthly repayments are active.`,
            type: "success",
            time: "1 day ago",
            category: "loan",
            icon: CheckCircle
          });
        } else if (app.status === "SUBMITTED" || app.status === "UNDER_REVIEW") {
          list.push({
            id: `app-${app.application_id}-review`,
            title: "Application Under Assessment",
            desc: `Credit underwriting desk is processing application ref: ${app.application_ref}. Automated CRIB checks completed successfully.`,
            type: "info",
            time: "A few minutes ago",
            category: "loan",
            icon: Clock
          });
        } else if (app.status === "REJECTED") {
          list.push({
            id: `app-${app.application_id}-rejected`,
            title: "Application Unsatisfactory",
            desc: `Regrettably, your application ref: ${app.application_ref} was declined as it did not satisfy the minimum credit scoring threshold parameters.`,
            type: "error",
            time: "2 days ago",
            category: "loan",
            icon: AlertTriangle
          });
        }
      });
    }

    return list;
  }, [customerApplications, customerAccounts, isClearedAll]);

  // Count unread notifications
  const unreadCount = systemNotifications.length;

  const handleClearAll = () => {
    setIsClearedAll(true);
  };

  const triggerScrollToElement = (elementId) => {
    setIsOpen(false);
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      // Flash animation helper
      element.classList.add("ring-4", "ring-amber-400");
      setTimeout(() => {
        element.classList.remove("ring-4", "ring-amber-400");
      }, 2000);
    }
  };

  return (
    <div className="relative" id="dashboard-notification-center">
      
      {/* Bell Button Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer focus:outline-none"
        title="View Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          {/* Transparent Backdrop Click to close */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          ></div>

          <div className="absolute right-0 mt-2.5 w-80 sm:w-96 bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden z-50 animate-fade-in font-sans text-xs">
            
            {/* Panel Header */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-teal-400" />
                <span className="font-extrabold uppercase tracking-wider text-[10px]">
                  Alert Center ({unreadCount})
                </span>
              </div>
              
              {unreadCount > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-[9px] font-mono text-slate-400 hover:text-rose-400 transition cursor-pointer flex items-center gap-1"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Dismiss All</span>
                </button>
              )}
            </div>

            {/* Notifications Body List */}
            <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100">
              {systemNotifications.length > 0 ? (
                systemNotifications.map((notif) => {
                  const Icon = notif.icon;
                  return (
                    <div 
                      key={notif.id} 
                      className={`p-4 hover:bg-slate-50 transition-colors duration-150 flex gap-3.5 items-start ${
                        notif.type === "warning" ? "bg-amber-50/20" : ""
                      }`}
                    >
                      {/* Icon with colored container */}
                      <div className={`h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                        notif.type === "success" 
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                          : notif.type === "warning"
                          ? "bg-amber-50 text-amber-600 border-amber-100"
                          : notif.type === "error"
                          ? "bg-rose-50 text-rose-600 border-rose-100"
                          : "bg-blue-50 text-blue-600 border-blue-100"
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>

                      {/* Content block */}
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-extrabold text-slate-800 tracking-tight leading-tight">
                            {notif.title}
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono flex-shrink-0">
                            {notif.time}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-normal">
                          {notif.desc}
                        </p>

                        {/* Interactive CTAs inside alerts */}
                        {notif.actionId && (
                          <div className="pt-1.5">
                            <button
                              onClick={() => triggerScrollToElement(notif.actionId)}
                              className="inline-flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/50 px-2 py-1 rounded-md font-bold transition-all cursor-pointer"
                            >
                              <span>Complete Step</span>
                              <span>&rarr;</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 px-4 text-center text-slate-400">
                  <div className="bg-slate-50 text-slate-400 p-2.5 rounded-full inline-block border border-slate-100 mb-2">
                    <Check className="h-5 w-5" />
                  </div>
                  <p className="font-bold">All clear!</p>
                  <p className="text-[10px] text-slate-400 max-w-[200px] mx-auto mt-1">
                    No active loan revisions or account provisioning flags pending your review.
                  </p>
                </div>
              )}
            </div>

            {/* Panel Footer */}
            <div className="bg-slate-50 p-2.5 border-t border-slate-200 text-center text-[9px] font-mono text-slate-400">
              <span>NovaBank-LoanSphere Digital Notification System</span>
            </div>

          </div>
        </>
      )}

    </div>
  );
}
