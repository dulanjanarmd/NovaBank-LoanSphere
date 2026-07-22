import React, { useState, useMemo } from "react";
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  Clock, 
  X, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  HelpCircle,
  ChevronRight,
  User,
  FileText,
  Search,
  ChevronDown,
  ChevronUp
} from "lucide-react";

const FAQ_DATA = [
  {
    id: "faq-1",
    category: "onboarding",
    question: "How long does the digital savings account opening take?",
    answer: "With our new Express Quick Open module, your savings account is provisioned instantly! The standard 5-step onboarding workflow usually takes up to 1 business day for full manual compliance review and registration with the Department of Persons."
  },
  {
    id: "faq-2",
    category: "loans",
    question: "What documents are required to apply for a loan?",
    answer: "Generally, you need: 1) A clear photo of your National Identity Card (NIC). 2) Last 3 months' salary payslips or audited accounts (for SME). 3) Last 3 months' bank statements showing your primary salary/income routing."
  },
  {
    id: "faq-3",
    category: "loans",
    question: "What is CRIB and how does it affect my score?",
    answer: "The Credit Information Bureau of Sri Lanka keeps track of your repayment histories. Our automated decision-engine connects to a mock CRIB gateway to compute your Debt-to-Income (DTI) and loan eligibility metrics instantly."
  },
  {
    id: "faq-4",
    category: "e-sign",
    question: "Is the e-signature legally binding on the loan agreement?",
    answer: "Absolutely. NovaBank uses consent-based multi-factor SMS OTP authentication to stamp your electronic signature, which is fully recognized and legally binding under the Electronic Transactions Act No. 19 of 2006."
  },
  {
    id: "faq-5",
    category: "loans",
    question: "What is the maximum Debt-to-Income (DTI) ratio allowed?",
    answer: "To comply with Central Bank risk criteria, the standard threshold is capped at 40%. Any application with a DTI higher than 40% is automatically flagged for manual credit underwriting appraisal."
  }
];

export default function SupportContactWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [ticketName, setTicketName] = useState("");
  const [ticketPhone, setTicketPhone] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // FAQ States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedFaqId, setExpandedFaqId] = useState(null);

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((faq) => {
      const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
      const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    if (!ticketName || !ticketPhone || !ticketMessage) {
      alert("Please fill in all details before transmitting your support request.");
      return;
    }

    setIsSubmitting(true);
    // Simulate API callback ticket creation
    setTimeout(() => {
      setIsSubmitting(false);
      setTicketSubmitted(true);
      setTicketName("");
      setTicketPhone("");
      setTicketMessage("");
    }, 1000);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        id="floating-support-btn"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 btn-premium rounded-xl text-white p-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center gap-2 group cursor-pointer border border-primary-500/15"
        title="Get Help & Loan Assistance"
      >
        <div className="relative">
          <MessageSquare className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success-500"></span>
          </span>
        </div>
        <span className="max-w-0 overflow-hidden group-hover:max-w-32 transition-all duration-500 ease-out text-xs font-bold whitespace-nowrap tracking-tight">
          Help Desk
        </span>
      </button>

      {/* Backdrop & Support Contact Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="relative w-full max-w-lg bg-neutral-900/50 rounded-3xl shadow-2xl border border-neutral-700/50 overflow-hidden transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
            id="support-modal-container"
          >
            
            {/* Header banner */}
            <div className="bg-neutral-900 text-white p-5 sm:p-6 flex items-center justify-between border-b border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="bg-primary-600/25 text-primary-400 p-2 rounded-xl border border-primary-500/25">
                  <Sparkles className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold tracking-tight">NovaBank Assistance</h4>
                  <p className="text-[10px] text-neutral-400">Official Credit Assistance & Live Underwriting Desk</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setIsOpen(false);
                  setTicketSubmitted(false);
                }}
                className="text-neutral-400 hover:text-white p-1 rounded-xl hover:bg-neutral-800 transition cursor-pointer"
                id="support-modal-close-btn"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-6 text-xs text-neutral-200">
              
              {/* Hotlines and Emails Grid */}
              <div className="space-y-3">
                <h5 className="font-mono font-bold text-[10px] text-neutral-400 uppercase tracking-wider">
                  Contact Channels
                </h5>

                <div className="grid sm:grid-cols-2 gap-3">
                  
                  {/* Phone Hotline Option */}
                  <div className="bg-neutral-900/30 border border-neutral-700/50/80 p-3.5 rounded-2xl space-y-2 flex flex-col justify-between">
                    <div className="flex items-start gap-2.5">
                      <span className="bg-primary-100 text-primary-800 p-1.5 rounded-xl inline-block">
                        <Phone className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="font-bold text-neutral-50">Loan Hotline</p>
                        <p className="text-[10px] text-neutral-500 font-mono">+94 11 234 5678</p>
                      </div>
                    </div>
                    <a 
                      href="tel:+94112345678" 
                      className="text-[10px] font-bold text-primary-600 hover:underline inline-flex items-center gap-1 self-start mt-2 transition-all duration-200"
                    >
                      Dial Directly <ChevronRight className="h-3 w-3" />
                    </a>
                  </div>

                  {/* Email Support Option */}
                  <div className="bg-neutral-900/30 border border-neutral-700/50/80 p-3.5 rounded-2xl space-y-2 flex flex-col justify-between">
                    <div className="flex items-start gap-2.5">
                      <span className="bg-success-100 text-success-800 p-1.5 rounded-xl inline-block">
                        <Mail className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="font-bold text-neutral-50">Email Support</p>
                        <p className="text-[10px] text-neutral-500 font-mono">loansupport@novabank.lk</p>
                      </div>
                    </div>
                    <a 
                      href="mailto:loansupport@novabank.lk" 
                      className="text-[10px] font-bold text-success-600 hover:underline inline-flex items-center gap-1 self-start mt-2 transition-all duration-200"
                    >
                      Draft Email <ChevronRight className="h-3 w-3" />
                    </a>
                  </div>

                </div>
              </div>

              {/* Operating Hours Banner */}
              <div className="bg-primary-900/20/50 border border-primary-100/80 rounded-2xl p-4 flex gap-3">
                <span className="bg-primary-100 text-primary-800 p-1.5 rounded-xl self-start">
                  <Clock className="h-4.5 w-4.5" />
                </span>
                <div className="space-y-1">
                  <p className="font-bold text-neutral-50">Live Chat & Telephone Service Hours</p>
                  <p className="text-neutral-300 leading-normal">
                    Our dedicated credit officers and loan desk underwriters are online to help you:
                  </p>
                  <div className="grid grid-cols-2 gap-x-4 pt-1 text-[11px] font-mono">
                    <div>
                      <span className="text-neutral-400 text-[9px] block">WEEKDAYS</span>
                      <span className="font-bold text-neutral-200">8:00 AM - 8:00 PM</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 text-[9px] block">WEEKENDS</span>
                      <span className="font-bold text-neutral-200">9:00 AM - 5:00 PM</span>
                    </div>
                  </div>
                  <p className="text-[9px] text-neutral-400 italic pt-1">*All hours are indicated in Sri Lankan Standard Time (UTC+05:30).</p>
                </div>
              </div>

              {/* Dynamic Customer Support FAQs Section */}
              <div className="border-t border-neutral-700/30 pt-5 space-y-4" id="faq-interactive-section">
                <div className="flex items-center justify-between">
                  <h5 className="font-mono font-bold text-[10px] text-neutral-400 uppercase tracking-wider">
                    Frequently Asked Questions
                  </h5>
                  <span className="text-[9px] font-mono text-teal-600 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                    Self-Service Assistance
                  </span>
                </div>

                {/* FAQ Search and Filter inputs */}
                <div className="space-y-3">
                  {/* Search box */}
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-neutral-400" />
                    <input
                      id="faq-search-input"
                      type="text"
                      className="w-full pl-9 pr-3 py-1.5 border border-neutral-700/50 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      placeholder="Search common answers (e.g., NIC, CRIB, e-sign)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  {/* Category Filter Badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: "all", label: "All Topics" },
                      { id: "onboarding", label: "Onboarding" },
                      { id: "loans", label: "Loans" },
                      { id: "e-sign", label: "E-Sign" }
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          setExpandedFaqId(null);
                        }}
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer border ${
                          selectedCategory === cat.id
                            ? "bg-teal-600 text-white border-teal-600 shadow-md shadow-primary/5"
                            : "bg-neutral-900/30 text-neutral-300 border-neutral-700/50 hover:bg-neutral-800/50"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Accordion Questions List */}
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {filteredFaqs.length > 0 ? (
                    filteredFaqs.map((faq) => {
                      const isExpanded = expandedFaqId === faq.id;
                      return (
                        <div
                          key={faq.id}
                          className="border border-neutral-700/50 rounded-xl overflow-hidden bg-neutral-900/30/50 hover:bg-neutral-900/30 transition-colors"
                        >
                          <button
                            type="button"
                            onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                            className="w-full px-3.5 py-2.5 text-left flex items-center justify-between gap-3 text-[11px] font-bold text-neutral-200 hover:text-neutral-900 focus:outline-none transition-all duration-200"
                          >
                            <span>{faq.question}</span>
                            {isExpanded ? (
                              <ChevronUp className="h-3.5 w-3.5 text-neutral-500 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5 text-neutral-500 flex-shrink-0" />
                            )}
                          </button>

                          {isExpanded && (
                            <div className="px-3.5 pb-3 pt-0.5 text-[11px] text-neutral-500 border-t border-neutral-700/30 bg-neutral-900/50 leading-relaxed animate-fade-in">
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-6 text-center text-neutral-400 bg-neutral-900/30 border border-neutral-700/50/50 rounded-xl">
                      <HelpCircle className="h-5 w-5 mx-auto text-neutral-300 mb-1" />
                      <p className="font-bold">No matches found</p>
                      <p className="text-[10px]">Try searching for other keywords.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Instant Callback Form */}
              <div className="border-t border-neutral-700/30 pt-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="font-mono font-bold text-[10px] text-neutral-400 uppercase tracking-wider">
                    Leave a Message / Request Callback
                  </h5>
                  <span className="text-[9px] font-mono text-success-600 font-bold bg-success-900/20 px-2 py-0.5 rounded border border-success-100 flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" /> SLA: &lt; 15 Mins
                  </span>
                </div>

                {ticketSubmitted ? (
                  <div className="bg-success-900/20/50 border border-success-100 p-5 rounded-2xl text-center space-y-2 animate-fade-in">
                    <div className="mx-auto bg-success-100 text-success-800 p-2.5 rounded-full w-fit">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <h6 className="font-bold text-neutral-50">Support Ticket Created Successfully</h6>
                    <p className="text-[11px] text-neutral-300 max-w-sm mx-auto leading-relaxed">
                      A loan specialist has received your callback request. We will contact you at your provided telephone number shortly.
                    </p>
                    <button
                      type="button"
                      onClick={() => setTicketSubmitted(false)}
                      className="text-[10px] font-bold text-primary-600 hover:underline mt-2 inline-block cursor-pointer transition-all duration-200"
                    >
                      Submit Another Query
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitTicket} className="space-y-3">
                    
                    <div className="grid sm:grid-cols-2 gap-3">
                      
                      {/* Name input */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-neutral-500 uppercase">Your Full Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-3.5 w-3.5 text-neutral-400" />
                          <input
                            type="text"
                            required
                            className="w-full pl-9 pr-3 py-1.5 border border-neutral-700/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none"
                            placeholder="Kamal Bandara"
                            value={ticketName}
                            onChange={(e) => setTicketName(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Phone input */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-neutral-500 uppercase">Callback Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-2.5 h-3.5 w-3.5 text-neutral-400" />
                          <input
                            type="text"
                            required
                            className="w-full pl-9 pr-3 py-1.5 border border-neutral-700/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none font-mono"
                            placeholder="+94 77 123 4567"
                            value={ticketPhone}
                            onChange={(e) => setTicketPhone(e.target.value)}
                          />
                        </div>
                      </div>

                    </div>

                    {/* Message input */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-neutral-500 uppercase">How can we assist you?</label>
                      <textarea
                        required
                        rows="2"
                        className="w-full px-3 py-2 border border-neutral-700/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none"
                        placeholder="E.g. I need help estimating the collateral requirements for an SME Growth Engine Loan."
                        value={ticketMessage}
                        onChange={(e) => setTicketMessage(e.target.value)}
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 px-6 rounded-xl text-xs font-bold text-white btn-premium rounded-xl transition flex items-center justify-center gap-1.5 shadow cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Transmitting Support Ticket...</span>
                      ) : (
                        <>
                          <span>Transmit Callback Ticket</span>
                          <Send className="h-3.5 w-3.5" />
                        </>
                      )}
                    </button>

                  </form>
                )}

              </div>

            </div>

            {/* Footer lock note */}
            <div className="bg-neutral-900/30 p-4 border-t border-neutral-700/30 flex items-center justify-center gap-1 text-[9px] font-mono text-neutral-400">
              <ShieldCheck className="h-3.5 w-3.5 text-success-600" />
              <span>Complies with CBSL digital security protocols and ISO/IEC 27001 standard.</span>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
