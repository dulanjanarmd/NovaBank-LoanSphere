import { Link } from 'react-router-dom'
import { ShieldCheck, Globe2 } from 'lucide-react'

export default function Logo({ compact = false, light = false }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg overflow-hidden shadow-sm transition-transform group-hover:scale-105">
        <img src="/novabank_logo.jpg" alt="NovaBank Logo" className="h-full w-full object-cover" />
      </div>
      {!compact && (
        <div className="leading-tight">
          <div className={`text-base font-bold tracking-tight ${light ? 'text-white' : 'text-navy-800'}`}>
            NovaBank
          </div>
          <div className={`text-[11px] font-medium ${light ? 'text-navy-200' : 'text-accent-600'}`}>
            LoanSphere
          </div>
        </div>
      )}
    </Link>
  )
}

export function TrustBar() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[11px] font-medium text-ink-500">
      <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-success-600" /> CBSL Regulated</span>
      <span className="inline-flex items-center gap-1"><Globe2 className="h-3.5 w-3.5 text-accent-500" /> ISO 27001 Certified</span>
      <span className="hidden sm:inline">Deposits insured up to Rs. 1,100,000</span>
    </div>
  )
}
