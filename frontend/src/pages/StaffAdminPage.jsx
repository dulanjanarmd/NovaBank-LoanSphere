import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Save } from 'lucide-react'
import StaffShell from '../components/StaffShell'
import { loanProductsAdmin, formatLKR } from '../data/mockData'
import { api } from '../services/api'

export default function StaffAdminPage() {
  const [products, setProducts] = useState([])
  const [editing, setEditing] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await api.getAdminProducts()
      if (res.data && res.data.length > 0) {
        setProducts(res.data.map(mapApiProduct))
      } else {
        setProducts(loanProductsAdmin)
      }
    } catch (e) {
      setProducts(loanProductsAdmin)
    } finally {
      setLoading(false)
    }
  }

  const mapApiProduct = (p) => ({
    id: p.id,
    name: p.name,
    min: p.minAmount,
    max: p.maxAmount,
    rate: p.interestRate,
    maxTenure: p.defaultTenure,
    active: p.active
  })

  const toggleActive = async (id) => {
    const p = products.find((x) => x.id === id)
    if (!p) return
    const updated = { ...p, active: !p.active }
    setProducts((prev) => prev.map((x) => (x.id === id ? updated : x)))
    try {
      await api.updateAdminProduct(id, {
        name: updated.name,
        minAmount: updated.min,
        maxAmount: updated.max,
        interestRate: updated.rate,
        defaultTenure: updated.maxTenure,
        active: updated.active
      })
    } catch (e) {}
  }

  const startEdit = (p) => {
    setEditing(p.id)
    setEditForm({ ...p })
  }

  const handleSave = async (id) => {
    try {
      const updated = {
        name: editForm.name,
        minAmount: Number(editForm.min),
        maxAmount: Number(editForm.max),
        interestRate: Number(editForm.rate),
        defaultTenure: Number(editForm.maxTenure),
        active: editForm.active
      }
      await api.updateAdminProduct(id, updated)
      setProducts((prev) => prev.map((x) => (x.id === id ? { ...x, ...editForm } : x)))
      setEditing(null)
    } catch (e) {
      setError('Failed to save product')
    }
  }

  return (
    <StaffShell active="Product & Rates">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-800">Product & Rate Management</h1>
          <p className="text-sm text-ink-500">Configure loan products, interest rates and limits.</p>
        </div>
        <button className="btn-primary"><Plus className="h-4 w-4" /> Add Product</button>
      </div>

      {error && <div className="mb-4 rounded-lg bg-danger-50 p-3 text-sm text-danger-700">{error}</div>}
      {loading ? (
        <div className="flex justify-center p-8"><div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-500 border-t-transparent" /></div>
      ) : (
      <div className="grid gap-4">
        {products.map((p) => (
          <div key={p.id} className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-700 text-white text-sm font-bold">{p.name[0]}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-navy-800">{p.name}</h3>
                    <span className={`chip ${p.active ? 'bg-success-50 text-success-700' : 'bg-ink-100 text-ink-500'}`}>{p.active ? 'Active' : 'Inactive'}</span>
                  </div>
                  <div className="mt-0.5 text-xs text-ink-500">{formatLKR(p.min)} – {formatLKR(p.max)} · Max {p.maxTenure} months</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs text-ink-500">Interest rate</div>
                  <div className="text-lg font-bold text-navy-800">{p.rate}%<span className="text-xs font-medium text-ink-500"> p.a.</span></div>
                </div>
                <button onClick={() => toggleActive(p.id)} className={`p-1 ${p.active ? 'text-success-600' : 'text-ink-300'}`}>
                  {p.active ? <ToggleRight className="h-7 w-7" /> : <ToggleLeft className="h-7 w-7" />}
                </button>
                <button onClick={() => startEdit(p)} className="btn-ghost p-2"><Edit className="h-4 w-4" /></button>
                <button className="btn-ghost p-2 text-danger-500"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
            {editing === p.id && (
              <div className="mt-4 rounded-xl bg-ink-50 p-4">
                <div className="grid gap-4 sm:grid-cols-4">
                  <div><label className="label">Rate (% p.a.)</label><input className="input" type="number" step="0.1" value={editForm.rate} onChange={(e) => setEditForm({...editForm, rate: e.target.value})} /></div>
                  <div><label className="label">Min amount</label><input className="input" type="number" value={editForm.min} onChange={(e) => setEditForm({...editForm, min: e.target.value})} /></div>
                  <div><label className="label">Max amount</label><input className="input" type="number" value={editForm.max} onChange={(e) => setEditForm({...editForm, max: e.target.value})} /></div>
                  <div><label className="label">Max tenure (mo)</label><input className="input" type="number" value={editForm.maxTenure} onChange={(e) => setEditForm({...editForm, maxTenure: e.target.value})} /></div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => handleSave(p.id)} className="btn-primary"><Save className="h-4 w-4" /> Save changes</button>
                  <button onClick={() => setEditing(null)} className="btn-outline">Cancel</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      )}

      {/* User management preview */}
      <div className="mt-8 card p-6">
        <h2 className="mb-4 font-bold text-navy-800">Staff Members</h2>
        <div className="space-y-2">
          {[
            { name: 'Nimal Silva', role: 'Loan Officer', branch: 'Colombo 01', email: 'nimal.silva@novabank.lk' },
            { name: 'Ruwan Fernando', role: 'Loan Officer', branch: 'Galle', email: 'ruwan.fernando@novabank.lk' },
            { name: 'Tharaka Jayasuriya', role: 'Branch Manager', branch: 'Kandy', email: 'tharaka.j@novabank.lk' },
            { name: 'Anusha Perera', role: 'Compliance Officer', branch: 'Head Office', email: 'anusha.p@novabank.lk' },
          ].map((u) => (
            <div key={u.email} className="flex items-center justify-between rounded-lg border border-ink-100 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-500 text-sm font-bold text-white">{u.name[0]}</div>
                <div><div className="text-sm font-semibold text-navy-800">{u.name}</div><div className="text-xs text-ink-500">{u.email}</div></div>
              </div>
              <div className="flex items-center gap-3">
                <span className="chip bg-ink-100 text-ink-600">{u.role}</span>
                <span className="text-xs text-ink-500">{u.branch}</span>
                <button className="btn-ghost p-1.5"><Edit className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </StaffShell>
  )
}
