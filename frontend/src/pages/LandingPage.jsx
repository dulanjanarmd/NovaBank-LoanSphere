import { Link } from 'react-router-dom'
import { ShieldCheck, Clock, Smartphone, ArrowRight, CheckCircle, Star, Users, TrendingUp, Award, Quote } from 'lucide-react'
import Logo, { TrustBar } from '../components/Logo'
import { loanProducts, formatLKR } from '../data/mockData'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <nav className="hidden items-center gap-6 md:flex">
            <a href="#products" className="text-sm font-medium text-ink-600 hover:text-navy-700">Loans</a>
            <a href="#why" className="text-sm font-medium text-ink-600 hover:text-navy-700">Why NovaBank</a>
            <a href="#testimonials" className="text-sm font-medium text-ink-600 hover:text-navy-700">Reviews</a>
            <a href="#faq" className="text-sm font-medium text-ink-600 hover:text-navy-700">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login" className="btn-ghost">Sign In</Link>
            <Link to="/login" className="btn-primary">Open Account</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-800 via-navy-700 to-accent-700">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div className="flex flex-col justify-center text-white">
            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur">
              <span className="flex h-2 w-2 rounded-full bg-success-400" /> Now accepting online loan applications
            </div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Banking that moves at the speed of your life.
            </h1>
            <p className="mt-4 max-w-lg text-lg text-navy-100">
              Open accounts, apply for loans and track every step online — from Colombo to Jaffna. NovaBank LoanSphere brings the branch to your pocket.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/portal/apply" className="btn-accent group">
                Apply for a Loan
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link to="/login" className="btn border border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/20">
                Open an Account
              </Link>
            </div>
            <div className="mt-8"><TrustBar /></div>
          </div>
          {/* Hero card */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md rotate-1 rounded-2xl bg-white p-6 shadow-2xl transition-transform hover:rotate-0">
              <div className="flex items-center justify-between">
                <Logo />
                <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">Digital Loan</div>
              </div>
              <div className="mt-5 rounded-xl bg-gradient-to-br from-navy-700 to-accent-600 p-5 text-white">
                <div className="text-xs font-medium text-navy-100">Approved amount</div>
                <div className="mt-1 text-3xl font-bold">Rs. 4,200,000</div>
                <div className="mt-4 flex justify-between text-xs">
                  <div><div className="text-navy-100">EMI</div><div className="font-semibold">Rs. 92,180</div></div>
                  <div><div className="text-navy-100">Tenure</div><div className="font-semibold">60 months</div></div>
                  <div><div className="text-navy-100">Rate</div><div className="font-semibold">11.0% p.a.</div></div>
                </div>
              </div>
              <div className="mt-4 space-y-2.5">
                {['Submitted online in 8 minutes', 'Approved by Galle branch', 'Funds released to account'].map((s, i) => (
                  <div key={s} className="flex items-center gap-2.5 text-sm text-ink-700">
                    <CheckCircle className="h-4.5 w-4.5 text-success-500" /> {s}
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-ink-100 pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-700 text-xs font-bold text-white">RF</div>
                  <span className="text-xs font-medium text-ink-700">Ruwan F., Galle</span>
                </div>
                <div className="flex items-center gap-0.5 text-warning-500">
                  {[1,2,3,4,5].map((i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b border-ink-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4">
          {[
            { icon: Users, value: '1.2M+', label: 'Customers served' },
            { icon: TrendingUp, value: 'Rs. 48 B', label: 'Loans disbursed (2024)' },
            { icon: Clock, value: '4.2 days', label: 'Avg. processing time' },
            { icon: Award, value: '8', label: 'Island-wide branches' },
          ].map((s) => {
            const Icon = s.icon
            return (
              <div key={s.label} className="text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-navy-50 text-navy-700"><Icon className="h-5 w-5" /></div>
                <div className="text-2xl font-bold text-navy-800">{s.value}</div>
                <div className="text-xs font-medium text-ink-500">{s.label}</div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Loan products */}
      <section id="products" className="bg-ink-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-navy-800">Loans for every milestone</h2>
            <p className="mt-2 text-ink-500">Competitive rates, transparent fees, no hidden surprises.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {loanProducts.map((p) => (
              <div key={p.id} className="card p-6 transition-all hover:-translate-y-1 hover:shadow-cardHover">
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-700 text-white">
                    <TrendingUp className="h-5.5 w-5.5" />
                  </div>
                  <div className="chip bg-accent-50 text-accent-700">{p.rate}% p.a.</div>
                </div>
                <h3 className="mt-4 text-lg font-bold text-navy-800">{p.name}</h3>
                <p className="mt-1 text-sm text-ink-500">{p.purpose}</p>
                <div className="mt-4 space-y-1.5 border-t border-ink-100 pt-4 text-sm">
                  <div className="flex justify-between"><span className="text-ink-500">Amount</span><span className="font-semibold text-ink-700">{formatLKR(p.minAmount)} – {formatLKR(p.maxAmount)}</span></div>
                  <div className="flex justify-between"><span className="text-ink-500">Max tenure</span><span className="font-semibold text-ink-700">{p.maxTenure} months</span></div>
                </div>
                <Link to="/portal/apply" className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-lg border border-navy-200 py-2.5 text-sm font-semibold text-navy-700 transition-colors hover:bg-navy-50">
                  Apply now <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section id="why" className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-navy-800">Why customers choose NovaBank</h2>
            <p className="mt-2 text-ink-500">Built for trust, designed for speed.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: ShieldCheck, title: 'Bank-grade security', body: '256-bit encryption, two-factor authentication and CBSL-regulated operations keep your money and data safe.' },
              { icon: Clock, title: 'Apply in minutes', body: 'A guided online wizard turns a 45-minute branch visit into an 8-minute application you can finish from home.' },
              { icon: Smartphone, title: 'Track on the go', body: 'Real-time status updates, document requests and e-signature — all from your phone, tablet or laptop.' },
            ].map((f) => {
              const Icon = f.icon
              return (
                <div key={f.title} className="card p-7">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-50 text-accent-600"><Icon className="h-6 w-6" /></div>
                  <h3 className="mt-4 text-lg font-bold text-navy-800">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">{f.body}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-navy-800 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-white">Trusted by thousands across the island</h2>
            <p className="mt-2 text-navy-200">Real stories from real customers.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { name: 'Kavindya P.', city: 'Colombo', text: 'My housing loan was approved in under a week. The online tracker meant I always knew what stage it was at.' },
              { name: 'Saman B.', city: 'Galle', text: 'As a small business owner, the business loan helped me expand. The staff were responsive and professional.' },
              { name: 'Dilani K.', city: 'Kandy', text: 'The gold loan process was so quick. I applied in the morning and had the cash by afternoon.' },
            ].map((t) => (
              <div key={t.name} className="rounded-2xl bg-white/5 p-6 backdrop-blur">
                <Quote className="h-7 w-7 text-accent-400" />
                <p className="mt-3 text-sm leading-relaxed text-navy-100">{t.text}</p>
                <div className="mt-4 flex items-center gap-3 border-t border-white/10 pt-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-500 text-sm font-bold text-white">{t.name[0]}</div>
                  <div><div className="text-sm font-semibold text-white">{t.name}</div><div className="text-xs text-navy-200">{t.city}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-ink-50 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="mb-8 text-center text-3xl font-bold text-navy-800">Frequently asked questions</h2>
          <div className="space-y-3">
            {[
              { q: 'How long does loan approval take?', a: 'Most personal and auto loans are approved within 3–5 business days. Housing loans may take 7–10 days due to property valuation.' },
              { q: 'What documents do I need?', a: 'Typically your NIC, latest 3 payslips, 6 months of bank statements and a utility bill for address proof. Additional documents may be required based on the loan type.' },
              { q: 'Can I apply if I am self-employed?', a: 'Yes. Self-employed applicants should provide business registration documents and audited financial statements for the last 2 years.' },
              { q: 'Is my data secure?', a: 'Absolutely. We use 256-bit encryption, two-factor authentication and are regulated by the Central Bank of Sri Lanka. Your data is never shared with third parties.' },
            ].map((f, i) => (
              <details key={i} className="card group p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-navy-800">
                  {f.q}
                  <span className="text-ink-400 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-500">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="rounded-2xl bg-gradient-to-br from-navy-700 to-accent-600 p-10 text-center text-white shadow-cardHover">
            <h2 className="text-3xl font-bold">Ready to get started?</h2>
            <p className="mx-auto mt-2 max-w-md text-navy-100">Open an account or apply for a loan in minutes. No paperwork, no branch visit required.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/login" className="btn bg-white text-navy-800 hover:bg-navy-50">Open an Account</Link>
              <Link to="/portal/apply" className="btn border border-white/30 bg-white/10 text-white hover:bg-white/20">Apply for a Loan</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-ink-100 bg-ink-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <Logo />
              <p className="mt-3 text-sm text-ink-500">Your trusted digital banking partner across Sri Lanka.</p>
              <div className="mt-4"><TrustBar /></div>
            </div>
            {[
              { title: 'Products', links: ['Personal Loan', 'Housing Loan', 'Auto Loan', 'Savings Account'] },
              { title: 'Company', links: ['About us', 'Branches', 'Careers', 'Newsroom'] },
              { title: 'Support', links: ['Help center', 'Contact us', 'Security', 'Complaints'] },
            ].map((col) => (
              <div key={col.title}>
                <div className="mb-3 text-sm font-semibold text-navy-800">{col.title}</div>
                <ul className="space-y-2">
                  {col.links.map((l) => <li key={l}><a href="#" className="text-sm text-ink-500 hover:text-navy-700">{l}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-ink-200 pt-6 text-xs text-ink-500 sm:flex-row">
            <div>© 2024 NovaBank PLC. Regulated by the Central Bank of Sri Lanka.</div>
            <div className="flex gap-4"><a href="#" className="hover:text-navy-700">Privacy</a><a href="#" className="hover:text-navy-700">Terms</a><a href="#" className="hover:text-navy-700">Cookies</a></div>
          </div>
        </div>
      </footer>
    </div>
  )
}
