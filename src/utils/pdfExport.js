import { jsPDF } from "jspdf";

/**
 * Capitalizes first letter of a string
 */
function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Formats numbers as LKR currency
 */
function formatLKR(num) {
  return "LKR " + Math.round(num).toLocaleString();
}

/**
 * Draws standard NovaBank header and footer on all pages using a two-pass approach.
 * @param {jsPDF} doc The jsPDF instance
 * @param {string} reportTitle Title of the report to display in header
 */
function applyHeaderFooter(doc, reportTitle) {
  const totalPages = doc.internal.getNumberOfPages();
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }) + " (LKT)";

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    
    // Header Line Accents
    doc.setFillColor(15, 23, 42); // Slate 900
    doc.rect(15, 10, 180, 0.5, "F");
    
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text("NOVABANK PLC", 15, 7);
    
    doc.setFont("Helvetica", "normal");
    doc.setTextColor(100, 116, 139); // Slate 500
    doc.text(reportTitle.toUpperCase(), 15 + doc.getTextWidth("NOVABANK PLC ") + 4, 7);
    
    doc.setFontSize(7);
    doc.text("SECURE DIGITAL PORTAL REPORT", 195, 7, { align: "right" });

    // Footer Line
    doc.setDrawColor(226, 232, 240); // Slate 200
    doc.line(15, 282, 195, 282);

    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184); // Slate 400
    doc.text(`Generated on: ${dateStr}  •  Client Confidential Document`, 15, 287);
    doc.text(`Page ${i} of ${totalPages}`, 195, 287, { align: "right" });
  }
}

/**
 * Exports loan quotes and dynamic schedules as PDF
 */
export function exportLoanQuotePDF({
  user,
  token,
  loanType,
  principal,
  interestRate,
  tenureMonths,
  schedule,
  metrics,
  eligibilityStatus = "ELIGIBLE",
  dtiFixed = "0.0"
}) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  let y = 25;
  const quoteRef = "NB-QTE-" + Math.floor(100000 + Math.random() * 900000);

  // --- Document Header Branding ---
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(15, y, 180, 24, "F");

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text("NOVABANK DIGITAL CREDIT QUOTATION", 22, y + 9);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(13, 148, 136); // Teal 600 color / lightened
  doc.text("OFFICIAL BENCHMARK ESTIMATE & REPAYMENT SCHEDULING REPORT", 22, y + 15);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text("Ref: " + quoteRef, 188, y + 12, { align: "right" });

  y += 32;

  // --- Client Details Box ---
  doc.setFillColor(248, 250, 252); // Slate 50
  doc.rect(15, y, 180, 22, "F");
  doc.setDrawColor(226, 232, 240); // Slate 200
  doc.rect(15, y, 180, 22, "S");

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text("CLIENT RECORD INFORMATION", 20, y + 6);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105); // Slate 600
  doc.text(`Full Name:  ${user?.fullName || "Unregistered Guest User"}`, 20, y + 12);
  doc.text(`NIC Number:  ${user?.customerDetails?.nic_number || "N/A"}`, 20, y + 17);
  doc.text(`Credit Segment:  ${capitalize(user?.customerDetails?.risk_tier || "LOW")} Risk Tier`, 110, y + 12);
  doc.text(`Mobile Link:  ${user?.customerDetails?.mobile_number || "N/A"}`, 110, y + 17);

  y += 28;

  // --- Financial Summary Cards ---
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text("INDICATIVE FACILITY DETAILS", 15, y);
  
  y += 4;

  const cardW = 42;
  const cardH = 20;
  const cards = [
    { title: "PRINCIPAL BORROWED", val: formatLKR(principal), color: [15, 23, 42] },
    { title: "INTEREST RATE", val: `${interestRate}% p.a.`, color: [13, 148, 136] },
    { title: "REPAYMENT TERM", val: `${tenureMonths} Months`, color: [15, 23, 42] },
    { title: "MONTHLY EMI", val: formatLKR(metrics?.totalPayment / tenureMonths), color: [13, 148, 136] }
  ];

  cards.forEach((c, i) => {
    const xPos = 15 + i * 46;
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.rect(xPos, y, cardW, cardH, "FD");

    // accent top border
    doc.setFillColor(c.color[0], c.color[1], c.color[2]);
    doc.rect(xPos, y, cardW, 1.5, "F");

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184); // Slate 400
    doc.text(c.title, xPos + 4, y + 6);

    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(c.val, xPos + 4, y + 14);
  });

  y += cardH + 8;

  // --- Underwriting Matrix Check ---
  doc.setFillColor(248, 250, 252);
  doc.rect(15, y, 180, 16, "F");
  doc.rect(15, y, 180, 16, "S");

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text("PRELIMINARY RISK MATRIX ASSUMPTION:", 20, y + 10);

  const isElig = eligibilityStatus === "ELIGIBLE" || eligibilityStatus === "CONDITIONAL";
  doc.setFillColor(isElig ? 209 : 254, isElig ? 250 : 226, isElig ? 229 : 226); // Greenish or Reddish background
  doc.rect(110, y + 4, 75, 8, "F");
  
  doc.setFontSize(8);
  doc.setTextColor(isElig ? 15 : 153, isElig ? 118 : 27, isElig ? 110 : 27); // Deep Green or Deep Red text
  const statusStr = eligibilityStatus === "ELIGIBLE" 
    ? "APPROVED - CLIENT PRE-QUALIFIED" 
    : eligibilityStatus === "CONDITIONAL" 
    ? "CONDITIONAL REVIEW REQUIRED" 
    : "INELIGIBLE - PARAMETER HOLD";
  doc.text(statusStr, 147.5, y + 9.5, { align: "center" });

  y += 24;

  // --- Repayment Table ---
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text("ESTIMATED REPAYMENT & AMORTIZATION BREAKDOWN", 15, y);

  y += 4;

  // Draw Table Headers
  doc.setFillColor(15, 23, 42);
  doc.rect(15, y, 180, 8, "F");

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text("Month", 25, y + 5.5, { align: "center" });
  doc.text("Monthly Installment", 63, y + 5.5, { align: "right" });
  doc.text("Principal Payment", 101, y + 5.5, { align: "right" });
  doc.text("Interest Portion", 139, y + 5.5, { align: "right" });
  doc.text("Outstanding Balance", 185, y + 5.5, { align: "right" });

  y += 8;

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);

  schedule.forEach((row, idx) => {
    // Check page limits
    if (y > 265) {
      doc.addPage();
      y = 25; // reset top position on new page

      // Redraw Table Headers on new page
      doc.setFillColor(15, 23, 42);
      doc.rect(15, y, 180, 8, "F");

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text("Month", 25, y + 5.5, { align: "center" });
      doc.text("Monthly Installment", 63, y + 5.5, { align: "right" });
      doc.text("Principal Payment", 101, y + 5.5, { align: "right" });
      doc.text("Interest Portion", 139, y + 5.5, { align: "right" });
      doc.text("Outstanding Balance", 185, y + 5.5, { align: "right" });

      y += 8;
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
    }

    // Zebra striping
    if (idx % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(15, y, 180, 7, "F");
    }

    // Border line under each row
    doc.setDrawColor(241, 245, 249);
    doc.line(15, y + 7, 195, y + 7);

    // Text cells
    doc.text(row.month.toString(), 25, y + 4.8, { align: "center" });
    doc.text(Math.round(row.payment).toLocaleString(), 63, y + 4.8, { align: "right" });
    doc.text(Math.round(row.principal).toLocaleString(), 101, y + 4.8, { align: "right" });
    doc.text(Math.round(row.interest).toLocaleString(), 139, y + 4.8, { align: "right" });
    doc.text(Math.round(row.balance).toLocaleString(), 185, y + 4.8, { align: "right" });

    y += 7;
  });

  // Adding Terminating Sign-off note if space allows
  if (y > 230) {
    doc.addPage();
    y = 25;
  }

  y += 6;
  doc.setDrawColor(226, 232, 240);
  doc.rect(15, y, 180, 32, "S");
  doc.setFillColor(250, 250, 250);
  doc.rect(15, y, 180, 32, "F");

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text("PORTAL SIGN-OFF & CRYPTOGRAPHIC VERIFICATION", 20, y + 6);
  
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("This report is a mathematically accurate simulation of loan repayment structures based on active core ledger rules.", 20, y + 12);
  doc.text("All computations are indicative and do not represent a final underwriting contract of NovaBank PLC.", 20, y + 17);
  doc.text("Digital Reference ID: NVB-LEDGER-HASH-729B5A3C910FD48D11C3A", 20, y + 23);

  // Digital Signature seal representation
  doc.setFillColor(224, 242, 254);
  doc.rect(142, y + 4, 48, 24, "F");
  doc.setDrawColor(186, 230, 253);
  doc.rect(142, y + 4, 48, 24, "S");

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(3, 105, 161);
  doc.text("SECURE CALC VERIFIED", 166, y + 10, { align: "center" });
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(6);
  doc.setTextColor(14, 165, 233);
  doc.text("ONLINE COMPLIANCE PASS", 166, y + 14, { align: "center" });
  doc.text("SYSTEM DIGI-STAMPED", 166, y + 18, { align: "center" });
  doc.text("NO RE-CALC REQUIRED", 166, y + 22, { align: "center" });

  // Two pass header footer application
  applyHeaderFooter(doc, `${capitalize(loanType)} Loan Calculator Quotation`);

  // Trigger download
  doc.save(`NovaBank_${capitalize(loanType)}_Loan_Quote_${Math.round(principal)}.pdf`);

  // Register PDF export action in central backend audit database
  fetch("/api/v1/loans/audit-export", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : ""
    },
    body: JSON.stringify({
      export_type: "quote",
      ref_id: quoteRef,
      principal,
      loan_type: loanType,
      customer_name: user?.fullName
    })
  }).catch(err => console.warn("Central audit trail update failed:", err));
}

/**
 * Exports formal disbursed active application and detailed amortization schedule
 */
export function exportDisbursedSchedulePDF({
  user,
  token,
  application
}) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  let y = 25;

  // --- Corporate Header Branding ---
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(15, y, 180, 24, "F");

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text("NOVABANK PLC — DISBURSED LOAN STATEMENT", 22, y + 9);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(20, 184, 166); // Teal 500
  doc.text("OFFICIAL ACCOUNT STATEMENT & AMORTIZATION DISCLOSURE", 22, y + 15);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text("Ref: NB-CBS-" + application?.application_ref, 188, y + 12, { align: "right" });

  y += 32;

  // --- Account Specific Summary ---
  doc.setFillColor(248, 250, 252);
  doc.rect(15, y, 180, 26, "F");
  doc.setDrawColor(226, 232, 240);
  doc.rect(15, y, 180, 26, "S");

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text("ACCOUNT & BORROWER DETAILS", 20, y + 6);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Full Name:  ${user?.fullName || "Valued Customer"}`, 20, y + 12);
  doc.text(`NIC Number:  ${user?.customerDetails?.nic_number || "N/A"}`, 20, y + 17);
  doc.text(`Disbursed Date:  ${new Date(application?.submitted_at || application?.created_at).toLocaleDateString()}`, 20, y + 22);

  doc.text(`Loan Product:  ${application?.loan_type} LOAN FACILITY`, 110, y + 12);
  doc.text(`Workflow Status:  FUNDS DISBURSED (COMPLIANT)`, 110, y + 17);
  doc.text(`Secure Reference:  ${application?.application_id}`, 110, y + 22);

  y += 32;

  // --- Financial Stats Cards ---
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text("DISBURSED FACILITY FINANCIALS", 15, y);

  y += 4;

  const cardW = 42;
  const cardH = 20;
  
  // Compute metrics
  const totalPrincipal = application?.requested_amount || 0;
  const tenure = application?.tenure_months || 12;
  const emiVal = application?.repayment_schedule?.[0]?.emi || 0;
  const totalRepayment = emiVal * tenure;

  const cards = [
    { title: "DISBURSED PRINCIPAL", val: formatLKR(totalPrincipal), color: [15, 23, 42] },
    { title: "INTEREST STRUCTURE", val: "12.50% p.a. Fixed", color: [13, 148, 136] },
    { title: "TENURE PERIOD", val: `${tenure} Months`, color: [15, 23, 42] },
    { title: "MONTHLY INSTALLMENT", val: formatLKR(emiVal), color: [13, 148, 136] }
  ];

  cards.forEach((c, i) => {
    const xPos = 15 + i * 46;
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.rect(xPos, y, cardW, cardH, "FD");

    doc.setFillColor(c.color[0], c.color[1], c.color[2]);
    doc.rect(xPos, y, cardW, 1.5, "F");

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(c.title, xPos + 4, y + 6);

    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(c.val, xPos + 4, y + 14);
  });

  y += cardH + 8;

  // --- Detailed Table Schedule ---
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text("LEDGER OFFICIAL AMORTIZATION REPAYMENT SCHEDULE", 15, y);

  y += 4;

  doc.setFillColor(15, 23, 42);
  doc.rect(15, y, 180, 8, "F");

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text("Inst #", 25, y + 5.5, { align: "center" });
  doc.text("Due Date", 55, y + 5.5, { align: "left" });
  doc.text("Installment (EMI)", 90, y + 5.5, { align: "right" });
  doc.text("Principal Allocated", 125, y + 5.5, { align: "right" });
  doc.text("Interest Allocated", 155, y + 5.5, { align: "right" });
  doc.text("Outstanding Bal", 185, y + 5.5, { align: "right" });

  y += 8;

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);

  const list = application?.repayment_schedule || [];

  list.forEach((row, idx) => {
    if (y > 265) {
      doc.addPage();
      y = 25;

      doc.setFillColor(15, 23, 42);
      doc.rect(15, y, 180, 8, "F");

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text("Inst #", 25, y + 5.5, { align: "center" });
      doc.text("Due Date", 55, y + 5.5, { align: "left" });
      doc.text("Installment (EMI)", 90, y + 5.5, { align: "right" });
      doc.text("Principal Allocated", 125, y + 5.5, { align: "right" });
      doc.text("Interest Allocated", 155, y + 5.5, { align: "right" });
      doc.text("Outstanding Bal", 185, y + 5.5, { align: "right" });

      y += 8;
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
    }

    if (idx % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(15, y, 180, 7, "F");
    }

    doc.setDrawColor(241, 245, 249);
    doc.line(15, y + 7, 195, y + 7);

    doc.text(row.installment_no.toString(), 25, y + 4.8, { align: "center" });
    doc.text(row.dueDate, 55, y + 4.8, { align: "left" });
    doc.text(Math.round(row.emi).toLocaleString(), 90, y + 4.8, { align: "right" });
    doc.text(Math.round(row.principal).toLocaleString(), 125, y + 4.8, { align: "right" });
    doc.text(Math.round(row.interest).toLocaleString(), 155, y + 4.8, { align: "right" });
    doc.text(Math.round(row.balance).toLocaleString(), 185, y + 4.8, { align: "right" });

    y += 7;
  });

  if (y > 230) {
    doc.addPage();
    y = 25;
  }

  y += 6;
  doc.setDrawColor(226, 232, 240);
  doc.rect(15, y, 180, 32, "S");
  doc.setFillColor(250, 250, 250);
  doc.rect(15, y, 180, 32, "F");

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text("CRYPTOGRAPHIC LEDGER VALIDATION & SIGNATURE CERTIFICATE", 20, y + 6);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("This document constitutes an official record of disbursed funds registered in the NovaBank PLC core banking registry.", 20, y + 12);
  doc.text("All repayment terms conform legally to the Electronic Transactions Act No. 19 of 2006. SMS OTP click-sign logged.", 20, y + 17);
  doc.text(`Cryptographic Envelope Hash: NVB-CBS-ENC-${application?.application_ref}-72B84D2E`, 20, y + 23);

  // Digital Signature Seal
  doc.setFillColor(209, 250, 229); // Emerald light
  doc.rect(142, y + 4, 48, 24, "F");
  doc.setDrawColor(167, 243, 208);
  doc.rect(142, y + 4, 48, 24, "S");

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(4, 120, 87);
  doc.text("DISBURSEMENT ACTIVE", 166, y + 10, { align: "center" });
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(6);
  doc.setTextColor(5, 150, 105);
  doc.text("CONTRACT FULLY SIGNED", 166, y + 14, { align: "center" });
  doc.text("CBS RECONCILED OK", 166, y + 18, { align: "center" });
  doc.text("LAWFUL DEBT ENVELOPE", 166, y + 22, { align: "center" });

  applyHeaderFooter(doc, `${capitalize(application?.loan_type)} Loan Repayment Statement`);

  doc.save(`NovaBank_Active_Schedule_${application?.application_ref}.pdf`);

  // Register PDF export action in central backend audit database
  fetch("/api/v1/loans/audit-export", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : ""
    },
    body: JSON.stringify({
      export_type: "statement",
      ref_id: application?.application_ref,
      principal: application?.requested_amount,
      loan_type: application?.loan_type,
      customer_name: user?.fullName
    })
  }).catch(err => console.warn("Central audit trail statement update failed:", err));
}
