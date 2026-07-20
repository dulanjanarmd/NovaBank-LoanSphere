import React, { useState } from "react";
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
  FileText
} from "lucide-react";

export default function SupportContactWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [ticketName, setTicketName] = useState("");
  const [ticketPhone, setTicketPhone] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        className="fixed bottom-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center gap-2 group cursor-pointer border border-blue-500/15"
        title="Get Help & Loan Assistance"
      >
        <div className="relative">
          <MessageSquare className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>
        <span className="max-w-0 overflow-hidden group-hover:max-w-32 transition-all duration-500 ease-out text-xs font-bold whitespace-nowrap tracking-tight">
          Help Desk
        </span>
      </button>

      {/* Backdrop & Support Contact Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
            id="support-modal-container"
          >
            
            {/* Header banner */}
            <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="bg-blue-600/25 text-blue-400 p-2 rounded-xl border border-blue-500/25">
                  <Sparkles className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold tracking-tight">NovaBank Assistance</h4>
                  <p className="text-[10px] text-slate-400">Official Credit Assistance & Live Underwriting Desk</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setIsOpen(false);
                  setTicketSubmitted(false);
                }}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
                id="support-modal-close-btn"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-6 text-xs text-slate-700">
              
              {/* Hotlines and Emails Grid */}
              <div className="space-y-3">
                <h5 className="font-mono font-bold text-[10px] text-slate-400 uppercase tracking-wider">
                  Contact Channels
                </h5>

                <div className="grid sm:grid-cols-2 gap-3">
                  
                  {/* Phone Hotline Option */}
                  <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl space-y-2 flex flex-col justify-between">
                    <div className="flex items-start gap-2.5">
                      <span className="bg-blue-100 text-blue-800 p-1.5 rounded-lg inline-block">
                        <Phone className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="font-bold text-slate-800">Loan Hotline</p>
                        <p className="text-[10px] text-slate-500 font-mono">+94 11 234 5678</p>
                      </div>
                    </div>
                    <a 
                      href="tel:+94112345678" 
                      className="text-[10px] font-bold text-blue-600 hover:underline inline-flex items-center gap-1 self-start mt-2"
                    >
                      Dial Directly <ChevronRight className="h-3 w-3" />
                    </a>
                  </div>

                  {/* Email Support Option */}
                  <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl space-y-2 flex flex-col justify-between">
                    <div className="flex items-start gap-2.5">
                      <span className="bg-emerald-100 text-emerald-800 p-1.5 rounded-lg inline-block">
                        <Mail className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="font-bold text-slate-800">Email Support</p>
                        <p className="text-[10px] text-slate-500 font-mono">loansupport@novabank.lk</p>
                      </div>
                    </div>
                    <a 
                      href="mailto:loansupport@novabank.lk" 
                      className="text-[10px] font-bold text-emerald-600 hover:underline inline-flex items-center gap-1 self-start mt-2"
                    >
                      Draft Email <ChevronRight className="h-3 w-3" />
                    </a>
                  </div>

                </div>
              </div>

              {/* Operating Hours Banner */}
              <div className="bg-blue-50/50 border border-blue-100/80 rounded-2xl p-4 flex gap-3">
                <span className="bg-blue-100 text-blue-800 p-1.5 rounded-lg self-start">
                  <Clock className="h-4.5 w-4.5" />
                </span>
                <div className="space-y-1">
                  <p className="font-bold text-slate-800">Live Chat & Telephone Service Hours</p>
                  <p className="text-slate-600 leading-normal">
                    Our dedicated credit officers and loan desk underwriters are online to help you:
                  </p>
                  <div className="grid grid-cols-2 gap-x-4 pt-1 text-[11px] font-mono">
                    <div>
                      <span className="text-slate-400 text-[9px] block">WEEKDAYS</span>
                      <span className="font-bold text-slate-700">8:00 AM - 8:00 PM</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[9px] block">WEEKENDS</span>
                      <span className="font-bold text-slate-700">9:00 AM - 5:00 PM</span>
                    </div>
                  </div>
                  <p className="text-[9px] text-slate-400 italic pt-1">*All hours are indicated in Sri Lankan Standard Time (UTC+05:30).</p>
                </div>
              </div>

              {/* Instant Callback Form */}
              <div className="border-t border-slate-100 pt-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="font-mono font-bold text-[10px] text-slate-400 uppercase tracking-wider">
                    Leave a Message / Request Callback
                  </h5>
                  <span className="text-[9px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" /> SLA: &lt; 15 Mins
                  </span>
                </div>

                {ticketSubmitted ? (
                  <div className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-2xl text-center space-y-2 animate-fade-in">
                    <div className="mx-auto bg-emerald-100 text-emerald-800 p-2.5 rounded-full w-fit">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <h6 className="font-bold text-slate-800">Support Ticket Created Successfully</h6>
                    <p className="text-[11px] text-slate-600 max-w-sm mx-auto leading-relaxed">
                      A loan specialist has received your callback request. We will contact you at your provided telephone number shortly.
                    </p>
                    <button
                      type="button"
                      onClick={() => setTicketSubmitted(false)}
                      className="text-[10px] font-bold text-blue-600 hover:underline mt-2 inline-block cursor-pointer"
                    >
                      Submit Another Query
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitTicket} className="space-y-3">
                    
                    <div className="grid sm:grid-cols-2 gap-3">
                      
                      {/* Name input */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-500 uppercase">Your Full Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                          <input
                            type="text"
                            required
                            className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Kamal Bandara"
                            value={ticketName}
                            onChange={(e) => setTicketName(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Phone input */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-500 uppercase">Callback Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                          <input
                            type="text"
                            required
                            className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                            placeholder="+94 77 123 4567"
                            value={ticketPhone}
                            onChange={(e) => setTicketPhone(e.target.value)}
                          />
                        </div>
                      </div>

                    </div>

                    {/* Message input */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase">How can we assist you?</label>
                      <textarea
                        required
                        rows="2"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="E.g. I need help estimating the collateral requirements for an SME Growth Engine Loan."
                        value={ticketMessage}
                        onChange={(e) => setTicketMessage(e.target.value)}
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition flex items-center justify-center gap-1.5 shadow cursor-pointer disabled:opacity-50"
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
            <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-center gap-1 text-[9px] font-mono text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Complies with CBSL digital security protocols and ISO/IEC 27001 standard.</span>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
