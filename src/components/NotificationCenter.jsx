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
      element.classList.add("ring-4", "ring-warning-400");
      setTimeout(() => {
        element.classList.remove("ring-4", "ring-warning-400");
      }, 2000);
    }
  };

  return (
    <div className="relative" id="dashboard-notification-center">
      
      {/* Bell Button Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-neutral-300 hover:text-neutral-900 hover:bg-neutral-800/50 transition-all cursor-pointer focus:outline-none"
        title="View Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-error-500"></span>
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

          <div className="absolute right-0 mt-2.5 w-80 sm:w-96 glass-panel rounded-2xl shadow-2xl rounded-2xl overflow-hidden z-50 animate-fade-in font-sans text-xs">
            
            {/* Panel Header */}
            <div className="bg-neutral-900 text-white p-4 flex items-center justify-between border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-teal-400" />
                <span className="font-extrabold uppercase tracking-wider text-[10px]">
                  Alert Center ({unreadCount})
                </span>
              </div>
              
              {unreadCount > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-[9px] font-mono text-neutral-400 hover:text-error-400 transition cursor-pointer flex items-center gap-1"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Dismiss All</span>
                </button>
              )}
            </div>

            {/* Notifications Body List */}
            <div className="max-h-[360px] overflow-y-auto divide-y divide-neutral-100">
              {systemNotifications.length > 0 ? (
                systemNotifications.map((notif) => {
                  const Icon = notif.icon;
                  return (
                    <div 
                      key={notif.id} 
                      className={`p-4 hover:bg-neutral-900/30 transition-colors duration-150 flex gap-3.5 items-start ${
                        notif.type === "warning" ? "bg-warning-900/20/20" : ""
                      }`}
                    >
                      {/* Icon with colored container */}
                      <div className={`h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                        notif.type === "success" 
                          ? "bg-success-900/20 text-success-600 border-success-100" 
                          : notif.type === "warning"
                          ? "bg-warning-900/20 text-warning-600 border-warning-100"
                          : notif.type === "error"
                          ? "bg-error-900/20 text-error-600 border-error-100"
                          : "bg-primary-900/20 text-primary-600 border-primary-100"
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>

                      {/* Content block */}
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-extrabold text-neutral-50 tracking-tight leading-tight">
                            {notif.title}
                          </span>
                          <span className="text-[9px] text-neutral-400 font-mono flex-shrink-0">
                            {notif.time}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 leading-normal">
                          {notif.desc}
                        </p>

                        {/* Interactive CTAs inside alerts */}
                        {notif.actionId && (
                          <div className="pt-1.5">
                            <button
                              onClick={() => triggerScrollToElement(notif.actionId)}
                              className="inline-flex items-center gap-1 text-[10px] text-warning-700 bg-warning-900/20 hover:bg-warning-100 border border-warning-200/50 px-2 py-1 rounded-lg font-bold transition-all cursor-pointer"
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
                <div className="py-12 px-4 text-center text-neutral-400">
                  <div className="bg-neutral-900/30 text-neutral-400 p-2.5 rounded-full inline-block border border-neutral-700/30 mb-2">
                    <Check className="h-5 w-5" />
                  </div>
                  <p className="font-bold">All clear!</p>
                  <p className="text-[10px] text-neutral-400 max-w-[200px] mx-auto mt-1">
                    No active loan revisions or account provisioning flags pending your review.
                  </p>
                </div>
              )}
            </div>

            {/* Panel Footer */}
            <div className="bg-neutral-900/30 p-2.5 border-t border-neutral-700/50 text-center text-[9px] font-mono text-neutral-400">
              <span>NovaBank-LoanSphere Digital Notification System</span>
            </div>

          </div>
        </>
      )}

    </div>
  );
}
