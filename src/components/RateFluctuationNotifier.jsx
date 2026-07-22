import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  TrendingDown, 
  TrendingUp, 
  Sparkles, 
  ShieldCheck, 
  X, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle,
  HelpCircle,
  Activity,
  Gauge
} from "lucide-react";

export default function RateFluctuationNotifier({ user }) {
  const [toasts, setToasts] = useState([]);
  const [marketStatus, setMarketStatus] = useState("STABLE"); // "STABLE" | "BULLISH" | "EASED"
  const [creditScore, setCreditScore] = useState(710);
  const [baseRate, setBaseRate] = useState(14.5);

  // Trigger a Toast Notification
  const triggerToast = (toast) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    const newToast = { id, ...toast };
    setToasts((prev) => [...prev, newToast]);

    // Auto dismiss after 7 seconds
    setTimeout(() => {
      dismissToast(id);
    }, 7500);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Simulators
  const triggerMarketRateChange = (direction) => {
    const delta = direction === "down" ? -0.5 : 0.45;
    const nextRate = parseFloat((baseRate + delta).toFixed(2));
    setBaseRate(nextRate);
    setMarketStatus(direction === "down" ? "EASED" : "BULLISH");

    // Dispatch the custom event to sync with calculators
    window.dispatchEvent(
      new CustomEvent("nova-rate-updated", {
        detail: { loanType: "PERSONAL", interestRate: nextRate }
      })
    );

    triggerToast({
      title: direction === "down" ? "Market Alert: Rate Cut Initiated" : "Market Alert: Rate Hike Registered",
      description: direction === "down" 
        ? `Central Bank of Sri Lanka (CBSL) eased key policy rates. Your indicative Personal Loan rate fell to ${nextRate}% p.a. (-0.50% cut).`
        : `Lending benchmarks expanded due to liquidity constraints. Pre-approved personal rates adjusted to ${nextRate}% p.a. (+0.45%).`,
      type: "market",
      direction,
      rate: nextRate,
      oldRate: parseFloat((nextRate - delta).toFixed(2))
    });
  };

  const triggerCreditScoreImprovement = () => {
    const prevScore = creditScore;
    const nextScore = Math.min(850, creditScore + 40);
    if (prevScore === nextScore) return;

    setCreditScore(nextScore);

    // Apply special discount interest rate on score boost
    const discountRate = parseFloat((14.5 - (nextScore - 700) * 0.015).toFixed(2));
    
    // Dispatch to sync with calculators
    window.dispatchEvent(
      new CustomEvent("nova-rate-updated", {
        detail: { loanType: "PERSONAL", interestRate: discountRate }
      })
    );

    triggerToast({
      title: "Credit Standing Level Up!",
      description: `CRIB updated: your credit score boosted from ${prevScore} to ${nextScore}. NovaBank auto-applied a credit tier discount lowering your Personal Loan rate to ${discountRate}% p.a.`,
      type: "credit",
      direction: "down",
      rate: discountRate,
      oldRate: parseFloat((14.5 - (prevScore - 700) * 0.015).toFixed(2)),
      score: nextScore
    });
  };

  // Automatically simulate a subtle market rate shift after 10 seconds of session start, and then every 45 seconds
  useEffect(() => {
    if (!user || user.role !== "CUSTOMER") return;

    const firstTimer = setTimeout(() => {
      triggerMarketRateChange("down");
    }, 12000);

    const intervalTimer = setInterval(() => {
      const directions = ["down", "up"];
      const randDirection = directions[Math.floor(Math.random() * directions.length)];
      triggerMarketRateChange(randDirection);
    }, 55000);

    return () => {
      clearTimeout(firstTimer);
      clearInterval(intervalTimer);
    };
  }, [user]);

  // Handle scrolling and flashing the calculators
  const handleApplyRate = (targetRate) => {
    // Smooth scroll to calculator
    const calcElement = document.getElementById("loan-eligibility-calculator-section") || document.getElementById("btn-calc-submit");
    if (calcElement) {
      calcElement.scrollIntoView({ behavior: "smooth" });
      calcElement.classList.add("ring-4", "ring-teal-400", "scale-[1.01]");
      setTimeout(() => {
        calcElement.classList.remove("ring-4", "ring-teal-400", "scale-[1.01]");
      }, 2500);
    }
  };

  if (!user || user.role !== "CUSTOMER") return null;

  return (
    <>
      {/* Floating Toast Notification Stack (Rendered at top-right or bottom-right) */}
      <div 
        className="fixed top-20 right-4 z-50 flex flex-col gap-3.5 max-w-sm w-full pointer-events-none" 
        id="rate-fluctuation-toast-stack"
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="glass-panel rounded-2xl/85 rounded-2xl shadow-2xl p-4.5 pointer-events-auto flex gap-3.5 relative overflow-hidden"
            >
              {/* Highlight accent side-bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                toast.type === "credit" ? "bg-success-500" : toast.direction === "down" ? "bg-teal-500" : "bg-error-500"
              }`} />

              {/* Icon */}
              <div className={`h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                toast.type === "credit" 
                  ? "bg-success-900/20 text-success-600 border-success-100" 
                  : toast.direction === "down"
                  ? "bg-teal-50 text-teal-600 border-teal-100"
                  : "bg-error-900/20 text-error-600 border-error-100"
              }`}>
                {toast.type === "credit" ? (
                  <Gauge className="h-4.5 w-4.5 animate-pulse" />
                ) : toast.direction === "down" ? (
                  <TrendingDown className="h-4.5 w-4.5" />
                ) : (
                  <TrendingUp className="h-4.5 w-4.5" />
                )}
              </div>

              {/* Text content block */}
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center justify-between gap-2 pr-4">
                  <span className="font-extrabold text-neutral-50 text-[11px] uppercase tracking-tight">
                    {toast.title}
                  </span>
                  <span className="text-[8px] bg-neutral-800/50 px-1.5 py-0.5 rounded font-mono text-neutral-500 font-bold uppercase">
                    {toast.type}
                  </span>
                </div>
                
                <p className="text-[10px] text-neutral-500 leading-normal pr-3">
                  {toast.description}
                </p>

                {/* Micro visual stats tracker */}
                <div className="flex items-center gap-4 bg-neutral-900/30 border border-neutral-700/30 rounded-xl p-2 font-mono text-[10px]">
                  <div>
                    <span className="text-neutral-400 block text-[8px]">PREVIOUS RATE</span>
                    <span className="font-bold text-neutral-500 line-through">{toast.oldRate}%</span>
                  </div>
                  <div className="text-neutral-300 font-bold font-sans">&rarr;</div>
                  <div>
                    <span className="text-neutral-400 block text-[8px]">NEW OFFER RATE</span>
                    <span className={`font-extrabold ${toast.direction === "down" ? "text-teal-600" : "text-error-500"}`}>
                      {toast.rate}% p.a.
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => {
                      handleApplyRate(toast.rate);
                      dismissToast(toast.id);
                    }}
                    className="text-[10px] font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer transition-all duration-200"
                  >
                    <span>Analyze in Calculator</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => dismissToast(toast.id)}
                className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-300 p-0.5 rounded hover:bg-neutral-900/30 transition cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Floating Dynamic Simulator Controls Block */}
      <div 
        className="fixed bottom-4 right-4 z-40 max-w-sm bg-neutral-900/50/95 backdrop-blur-md border border-neutral-700/50/90 rounded-2xl shadow-xl p-4 font-sans text-xs select-none" 
        id="rate-fluctuation-simulator-panel"
      >
        <div className="flex items-center justify-between border-b border-neutral-700/50 pb-2 mb-2">
          <div className="flex items-center gap-1.5">
            <Activity className="h-4 w-4 text-teal-500 animate-pulse" />
            <h5 className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500">
              Live Rate Watch Simulator
            </h5>
          </div>
          <span className="text-[8px] bg-teal-50 text-teal-600 font-bold px-1.5 py-0.5 rounded border border-teal-100 font-mono uppercase">
            ACTIVE
          </span>
        </div>

        <p className="text-[9px] text-neutral-500 mb-3 leading-relaxed">
          Test interactive interest rate update events! Triggering an option below dispatches a highly styled toast alert and automatically recalibrates loan/EMI calculators on the dashboard.
        </p>

        {/* Buttons grid */}
        <div className="grid grid-cols-2 gap-2 text-[9px] font-bold">
          <button
            onClick={() => triggerMarketRateChange("down")}
            className="p-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200/50 transition duration-150 flex items-center gap-1.5 justify-center cursor-pointer"
          >
            <TrendingDown className="h-3.5 w-3.5 text-teal-600" />
            <span>Market Rate Cut (-0.5%)</span>
          </button>

          <button
            onClick={() => triggerMarketRateChange("up")}
            className="p-2 rounded-xl bg-error-900/20 hover:bg-error-100 text-error-800 border border-error-200/50 transition duration-150 flex items-center gap-1.5 justify-center cursor-pointer"
          >
            <TrendingUp className="h-3.5 w-3.5 text-error-600" />
            <span>Market Rate Hike (+0.45%)</span>
          </button>

          <button
            onClick={triggerCreditScoreImprovement}
            className="col-span-2 p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white transition duration-150 flex items-center gap-1.5 justify-center cursor-pointer shadow-md shadow-primary/5"
          >
            <Gauge className="h-3.5 w-3.5 text-teal-400 animate-bounce-short" />
            <span>Boost Credit Rating (CRIB Score Check)</span>
          </button>
        </div>

        <div className="mt-3 pt-2.5 border-t border-neutral-700/30 flex items-center justify-between text-[8px] font-mono text-neutral-400">
          <div>
            <span>CURRENT SCORE: </span>
            <span className="font-bold text-teal-600">{creditScore}</span>
          </div>
          <div>
            <span>BASE RATE: </span>
            <span className="font-bold text-neutral-200">{baseRate}%</span>
          </div>
        </div>
      </div>
    </>
  );
}
