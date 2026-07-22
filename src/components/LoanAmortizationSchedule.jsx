import React, { useState, useMemo } from "react";
import { 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Info, 
  DollarSign, 
  Percent,
  Download,
  Filter,
  Layers,
  ArrowRight,
  FileText
} from "lucide-react";
import { exportLoanQuotePDF } from "../utils/pdfExport.js";

export default function LoanAmortizationSchedule({ 
  user, 
  token,
  loanType = "PERSONAL", 
  principal, 
  annualRate, 
  tenureMonths, 
  passedMetrics, 
  eligibilityStatus = "ELIGIBLE", 
  dtiFixed = "0.0" 
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedYear, setSelectedYear] = useState("ALL"); // "ALL" or specific year number 1, 2...
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Generate the full schedule dynamically
  const schedule = useMemo(() => {
    if (!principal || !annualRate || !tenureMonths) return [];

    const p = parseFloat(principal);
    const r = (parseFloat(annualRate) / 100) / 12;
    const n = parseInt(tenureMonths);

    if (isNaN(p) || isNaN(r) || isNaN(n) || p <= 0 || r <= 0 || n <= 0) return [];

    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const monthlyPayment = isNaN(emi) || !isFinite(emi) ? 0 : emi;

    let remainingBalance = p;
    let cumulativeInterest = 0;
    let cumulativePrincipal = 0;
    const list = [];

    for (let month = 1; month <= n; month++) {
      const interestPayment = remainingBalance * r;
      const principalPayment = Math.min(remainingBalance, monthlyPayment - interestPayment);
      
      cumulativeInterest += interestPayment;
      cumulativePrincipal += principalPayment;
      remainingBalance = Math.max(0, remainingBalance - principalPayment);

      const yearNumber = Math.ceil(month / 12);

      list.push({
        month,
        year: yearNumber,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        cumulativeInterest,
        cumulativePrincipal,
        balance: remainingBalance
      });
    }

    return list;
  }, [principal, annualRate, tenureMonths]);

  // Compute overall schedule metrics
  const metrics = useMemo(() => {
    if (schedule.length === 0) return { totalInterest: 0, totalPayment: 0 };
    const lastItem = schedule[schedule.length - 1];
    return {
      totalInterest: lastItem.cumulativeInterest,
      totalPayment: lastItem.cumulativeInterest + parseFloat(principal)
    };
  }, [schedule, principal]);

  // Get total years available
  const totalYears = useMemo(() => {
    if (schedule.length === 0) return 0;
    return Math.ceil(schedule.length / 12);
  }, [schedule]);

  // Year options for the filter tabs
  const yearOptions = useMemo(() => {
    const options = [{ value: "ALL", label: "Full Term" }];
    for (let y = 1; y <= totalYears; y++) {
      options.push({ value: y.toString(), label: `Year ${y}` });
    }
    return options;
  }, [totalYears]);

  // Filter schedule by selected year and search query
  const filteredSchedule = useMemo(() => {
    let result = schedule;

    if (selectedYear !== "ALL") {
      const yearInt = parseInt(selectedYear);
      result = result.filter(item => item.year === yearInt);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.trim();
      result = result.filter(item => item.month.toString() === query);
    }

    return result;
  }, [schedule, selectedYear, searchQuery]);

  // Reset page whenever filter/search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedYear, searchQuery]);

  // Pagination bounds
  const paginatedSchedule = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSchedule.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSchedule, currentPage]);

  const totalPages = Math.ceil(filteredSchedule.length / itemsPerPage);

  // Selected period summary statistics
  const periodSummary = useMemo(() => {
    if (filteredSchedule.length === 0) return { principal: 0, interest: 0, total: 0 };
    const totalPrincipal = filteredSchedule.reduce((sum, item) => sum + item.principal, 0);
    const totalInterest = filteredSchedule.reduce((sum, item) => sum + item.interest, 0);
    return {
      principal: totalPrincipal,
      interest: totalInterest,
      total: totalPrincipal + totalInterest
    };
  }, [filteredSchedule]);

  const handleDownloadCSV = () => {
    if (schedule.length === 0) return;

    const headers = ["Installment No.", "Installment (EMI)", "Principal Paid", "Interest Paid", "Cumulative Interest", "Outstanding Balance"];
    const rows = schedule.map(item => [
      item.month,
      item.payment.toFixed(2),
      item.principal.toFixed(2),
      item.interest.toFixed(2),
      item.cumulativeInterest.toFixed(2),
      item.balance.toFixed(2)
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Amortization_Schedule_LKR_${principal}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDF = () => {
    if (schedule.length === 0) return;
    exportLoanQuotePDF({
      user,
      token,
      loanType,
      principal,
      annualRate,
      tenureMonths,
      schedule,
      metrics: passedMetrics || metrics || periodSummary,
      eligibilityStatus,
      dtiFixed
    });
  };

  if (schedule.length === 0) return null;

  return (
    <div className="bg-neutral-900/30 rounded-3xl border border-neutral-700/50 overflow-hidden" id="amortization-schedule-widget">
      
      {/* Accordion Trigger Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-neutral-800/50/60 transition cursor-pointer"
        id="btn-toggle-amortization"
      >
        <div className="flex items-center gap-3">
          <div className="bg-primary-100 text-primary-700 p-2 rounded-xl border border-primary-200">
            <Layers className="h-4.5 w-4.5" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-neutral-50 uppercase tracking-wider">
              Interactive Amortization Schedule
            </h4>
            <p className="text-[10px] text-neutral-500 font-medium">
              View month-by-month repayment & principal amortization breakdown
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-primary-600 bg-primary-100/60 px-2.5 py-0.5 rounded-full border border-primary-200">
            {schedule.length} Installments
          </span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-neutral-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-neutral-400" />
          )}
        </div>
      </button>

      {/* Amortization Body (Expandable) */}
      {isExpanded && (
        <div className="p-5 border-t border-neutral-700/50 bg-neutral-900/50 space-y-5 animate-fade-in text-xs text-neutral-200">
          
          {/* Quick Filters and Search bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5 pb-2 border-b border-neutral-700/30">
            
            {/* Year tabs selection */}
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">
                Filter by Year
              </span>
              <div className="flex flex-wrap gap-1">
                {yearOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSelectedYear(opt.value)}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition cursor-pointer ${
                      selectedYear === opt.value
                        ? "bg-neutral-900 text-white border-neutral-900"
                        : "bg-neutral-900/30 border-neutral-700/50 text-neutral-300 hover:bg-neutral-800/50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Month Search / CSV download */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              
              {/* Search month input */}
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block sm:hidden">
                  Search Month
                </span>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-neutral-400" />
                  <input
                    type="number"
                    min="1"
                    max={schedule.length}
                    placeholder="Search Month (e.g. 12)"
                    className="pl-8 pr-3 py-1.5 border border-neutral-700/50 rounded-xl w-full sm:w-44 font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-primary-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* CSV Export Button */}
              <button
                type="button"
                onClick={handleDownloadCSV}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 border border-neutral-700/50 rounded-xl bg-neutral-900/30 hover:bg-neutral-800/50 text-[10px] font-bold transition cursor-pointer text-neutral-200"
                title="Export complete schedule to CSV"
                id="btn-export-csv"
              >
                <Download className="h-3.5 w-3.5 text-primary-600" />
                <span>Export CSV</span>
              </button>

              {/* PDF Export Button */}
              <button
                type="button"
                onClick={handleDownloadPDF}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 border border-error-200 rounded-xl bg-error-900/20 hover:bg-error-100/80 text-[10px] font-bold transition cursor-pointer text-error-700"
                title="Export official quote and full amortization schedule to PDF"
                id="btn-export-pdf"
              >
                <FileText className="h-3.5 w-3.5 text-error-600" />
                <span>Export PDF Report</span>
              </button>

            </div>

          </div>

          {/* Quick Metrics of Selected Filter Period */}
          <div className="grid grid-cols-3 gap-3.5 bg-neutral-900/30/50 p-4 rounded-2xl border border-neutral-700/50">
            <div>
              <span className="text-neutral-400 text-[9px] block font-mono font-bold uppercase tracking-wider">
                {selectedYear === "ALL" ? "Total Term Principal" : "Yearly Principal Portion"}
              </span>
              <span className="font-extrabold text-neutral-50 text-xs font-mono">
                LKR {Math.round(periodSummary.principal).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-neutral-400 text-[9px] block font-mono font-bold uppercase tracking-wider">
                {selectedYear === "ALL" ? "Total Term Interest" : "Yearly Interest Portion"}
              </span>
              <span className="font-extrabold text-warning-600 text-xs font-mono">
                LKR {Math.round(periodSummary.interest).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-neutral-400 text-[9px] block font-mono font-bold uppercase tracking-wider">
                Cumulative Payment
              </span>
              <span className="font-extrabold text-primary-700 text-xs font-mono">
                LKR {Math.round(periodSummary.total).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Table Element */}
          <div className="overflow-x-auto rounded-xl border border-neutral-700/50 shadow-md shadow-primary/5">
            <table className="w-full text-left border-collapse bg-neutral-900/50">
              <thead>
                <tr className="bg-neutral-900 text-white font-mono text-[10px] tracking-wider uppercase border-b border-neutral-800">
                  <th className="py-2.5 px-3 text-center w-14">Month</th>
                  <th className="py-2.5 px-3 text-right">Installment (EMI)</th>
                  <th className="py-2.5 px-3 text-right text-primary-300">Principal Paid</th>
                  <th className="py-2.5 px-3 text-right text-warning-300">Interest Paid</th>
                  <th className="py-2.5 px-3 text-right text-neutral-300">Cumulative Interest</th>
                  <th className="py-2.5 px-3 text-right">Outstanding Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-mono text-[11px] font-bold text-neutral-200">
                {paginatedSchedule.length > 0 ? (
                  paginatedSchedule.map((item) => (
                    <tr key={item.month} className="hover:bg-neutral-900/30/70 transition">
                      <td className="py-2 px-3 text-center text-neutral-500 bg-neutral-900/30/50 font-bold border-r border-neutral-700/30">
                        {item.month}
                      </td>
                      <td className="py-2 px-3 text-right text-neutral-50">
                        LKR {Math.round(item.payment).toLocaleString()}
                      </td>
                      <td className="py-2 px-3 text-right text-primary-600">
                        LKR {Math.round(item.principal).toLocaleString()}
                      </td>
                      <td className="py-2 px-3 text-right text-warning-600">
                        LKR {Math.round(item.interest).toLocaleString()}
                      </td>
                      <td className="py-2 px-3 text-right text-neutral-500 font-medium">
                        LKR {Math.round(item.cumulativeInterest).toLocaleString()}
                      </td>
                      <td className="py-2 px-3 text-right text-neutral-950 font-extrabold">
                        LKR {Math.round(item.balance).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-6 px-3 text-center text-neutral-400 font-sans font-bold">
                      No matching installments found. Try resetting the filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-1 font-sans">
              <span className="text-[10px] text-neutral-500 font-bold">
                Showing {filteredSchedule.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).length} of {filteredSchedule.length} months
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="px-2.5 py-1 rounded-xl border border-neutral-700/50 text-[10px] font-bold bg-neutral-900/30 hover:bg-neutral-800/50 disabled:opacity-40 transition cursor-pointer"
                >
                  Prev
                </button>
                <span className="text-[10px] font-mono font-bold text-neutral-300 bg-neutral-800/50 px-2 py-0.5 rounded border">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="px-2.5 py-1 rounded-xl border border-neutral-700/50 text-[10px] font-bold bg-neutral-900/30 hover:bg-neutral-800/50 disabled:opacity-40 transition cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Educational Insights / Amortization Concept note */}
          <div className="p-4 bg-primary-900/20/50 border border-primary-100 rounded-2xl flex gap-3 leading-normal text-[11px] text-neutral-500">
            <Info className="h-4 w-4 text-primary-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-neutral-50">Financial Planning Tip:</p>
              <p>
                As the tenure progresses, note how the interest portion <strong className="text-warning-600">(amber)</strong> decreases while the principal portion <strong className="text-primary-600">(blue)</strong> increases. This is due to the interest being calculated on the reducing outstanding principal balance.
              </p>
              <p className="text-[10px] italic text-neutral-400">
                *Making lump-sum pre-payments early in the term significantly reduces overall interest paid and shortens the tenure.
              </p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
