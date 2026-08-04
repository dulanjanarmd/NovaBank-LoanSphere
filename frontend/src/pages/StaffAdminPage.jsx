import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Save, X, Settings, Shield, Download } from 'lucide-react'
import StaffShell from '../components/StaffShell'
import { api } from '../services/api'

function formatLKR(amount) {
  return 'LKR ' + new Intl.NumberFormat('en-LK').format(amount)
}

export default function StaffAdminPage() {
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])
  const [auditLogs, setAuditLogs] = useState([])
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sysConfig, setSysConfig] = useState({})
  const [configSaving, setConfigSaving] = useState(false)
  const [configSaved, setConfigSaved] = useState(false)

  // Modals state
  const [showProductModal, setShowProductModal] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  
  const [editingProduct, setEditingProduct] = useState(null)
  const [productForm, setProductForm] = useState({ name: '', min: '', max: '', rate: '', maxTenure: '', active: true })
  
  const [editingUser, setEditingUser] = useState(null)
  const [userForm, setUserForm] = useState({ username: '', password: '', fullName: '', role: 'ROLE_CREDIT_OFFICER', branch: 'Main Branch', active: true })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    await Promise.all([fetchProducts(), fetchUsers(), fetchAuditLogs(), fetchConfig()])
    setLoading(false)
  }

  const fetchConfig = async () => {
    try {
      const res = await api.getSystemConfig()
      if (res?.data) {
        const map = {}
        res.data.forEach(c => { map[c.configKey] = c.configValue })
        setSysConfig(map)
      }
    } catch (_) {}
  }

  const fetchUsers = async () => {
    try {
      const res = await api.getAdminUsers()
      if (res.data) setUsers(res.data)
    } catch (e) {
      console.error('Failed to load users', e)
    }
  }

  const fetchAuditLogs = async () => {
    try {
      const res = await api.getAdminAuditLogs()
      if (res.data) setAuditLogs(res.data)
    } catch (e) {
      console.error('Failed to load audit logs', e)
    }
  }

  const fetchProducts = async () => {
    try {
      const res = await api.getAdminProducts()
      if (res.data && res.data.length > 0) {
        setProducts(res.data.map(mapApiProduct))
      } else {
        setProducts([])
      }
    } catch (e) {
      setProducts([])
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

  // ---- PRODUCT ACTIONS ----

  const toggleProductActive = async (id) => {
    const p = products.find((x) => x.id === id)
    if (!p) return
    const updated = { ...p, active: !p.active }
    setProducts((prev) => prev.map((x) => (x.id === id ? updated : x)))
    try {
      await api.updateAdminProduct(id, {
        name: updated.name, minAmount: updated.min, maxAmount: updated.max,
        interestRate: updated.rate, defaultTenure: updated.maxTenure, active: updated.active
      })
    } catch (e) {
      setError('Failed to toggle product status')
    }
  }

  const openProductModal = (p = null) => {
    if (p) {
      setEditingProduct(p.id)
      setProductForm({ ...p })
    } else {
      setEditingProduct(null)
      setProductForm({ name: '', min: '', max: '', rate: '', maxTenure: '', active: true })
    }
    setShowProductModal(true)
  }

  const saveProduct = async () => {
    try {
      const payload = {
        name: productForm.name,
        minAmount: Number(productForm.min),
        maxAmount: Number(productForm.max),
        interestRate: Number(productForm.rate),
        defaultTenure: Number(productForm.maxTenure),
        active: productForm.active
      }

      if (editingProduct) {
        await api.updateAdminProduct(editingProduct, payload)
      } else {
        await api.createAdminProduct(payload)
      }
      setShowProductModal(false)
      fetchProducts()
    } catch (e) {
      setError('Failed to save product')
    }
  }

  const deleteProduct = async (id) => {
    try {
      await api.deleteAdminProduct(id)
      fetchProducts()
    } catch (e) {
      setError('Failed to deactivate product')
    }
  }

  // ---- USER ACTIONS ----

  const openUserModal = (u = null) => {
    if (u) {
      setEditingUser(u.userId)
      setUserForm({ username: u.username, password: '', fullName: u.fullName, role: u.role, branch: u.branch, active: u.active })
    } else {
      setEditingUser(null)
      setUserForm({ username: '', password: '', fullName: '', role: 'ROLE_CREDIT_OFFICER', branch: 'Main Branch', active: true })
    }
    setShowUserModal(true)
  }

  const saveUser = async () => {
    try {
      if (editingUser) {
        await api.updateAdminUser(editingUser, userForm)
      } else {
        await api.createAdminUser(userForm)
      }
      setShowUserModal(false)
      fetchUsers()
    } catch (e) {
      setError(e.message || 'Failed to save user')
    }
  }

  const deactivateUser = async (id) => {
    try {
      await api.deleteAdminUser(id)
      fetchUsers()
    } catch (e) {
      setError('Failed to deactivate user')
    }
  }

  return (
    <StaffShell active="Product & Rates">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-800">Admin Dashboard</h1>
          <p className="text-sm text-ink-500">Manage products, staff members, and system configurations.</p>
        </div>
      </div>

      {error && <div className="mb-4 flex items-center justify-between rounded-lg bg-danger-50 p-3 text-sm text-danger-700">
        <span>{error}</span>
        <button onClick={() => setError(null)}><X className="h-4 w-4" /></button>
      </div>}

      {loading ? (
        <div className="flex justify-center p-8"><div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-500 border-t-transparent" /></div>
      ) : (
        <>
          {/* Products Section */}
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-navy-800">Loan Products</h2>
              <button onClick={() => openProductModal()} className="btn-primary py-1.5 px-3 text-sm"><Plus className="h-4 w-4 mr-1" /> Add Product</button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
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
                      <div className="text-right mr-2">
                        <div className="text-xs text-ink-500">Interest rate</div>
                        <div className="text-lg font-bold text-navy-800">{p.rate}%<span className="text-xs font-medium text-ink-500"> p.a.</span></div>
                      </div>
                      <button onClick={() => toggleProductActive(p.id)} className={`p-1 ${p.active ? 'text-success-600' : 'text-ink-300'}`}>
                        {p.active ? <ToggleRight className="h-7 w-7" /> : <ToggleLeft className="h-7 w-7" />}
                      </button>
                      <button onClick={() => openProductModal(p)} className="btn-ghost p-1.5"><Edit className="h-4 w-4" /></button>
                      <button onClick={() => deleteProduct(p.id)} className="btn-ghost p-1.5 text-danger-500"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Users Section */}
          <div className="mb-8 card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-navy-800">Staff Members</h2>
              <button onClick={() => openUserModal()} className="btn-primary py-1.5 px-3 text-sm"><Plus className="h-4 w-4 mr-1" /> Add Staff</button>
            </div>
            <div className="space-y-2">
              {users.length > 0 ? users.map((u) => (
                <div key={u.userId} className="flex items-center justify-between rounded-lg border border-ink-100 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-500 text-sm font-bold text-white">{u.fullName?.[0] || 'U'}</div>
                    <div><div className="text-sm font-semibold text-navy-800">{u.fullName}</div><div className="text-xs text-ink-500">{u.username}</div></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="chip bg-ink-100 text-ink-600">{u.role.replace('ROLE_', '')}</span>
                    <span className="text-xs text-ink-500 w-24 truncate">{u.branch}</span>
                    <span className={`chip ${u.active ? 'bg-success-50 text-success-700' : 'bg-danger-50 text-danger-700'}`}>{u.active ? 'Active' : 'Disabled'}</span>
                    <button onClick={() => openUserModal(u)} className="btn-ghost p-1.5"><Edit className="h-4 w-4" /></button>
                    <button onClick={() => deactivateUser(u.userId)} className="btn-ghost p-1.5 text-danger-500"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              )) : <div className="text-sm text-ink-500">No staff members found.</div>}
            </div>
          </div>

          {/* System Configuration (FR-ADM-03) */}
          <div className="card p-6 mb-8">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-accent-600" />
                <h2 className="text-xl font-bold text-navy-800">System Configuration</h2>
              </div>
              <span className="chip bg-accent-50 text-accent-700">FR-ADM-03</span>
            </div>
            <p className="mb-5 text-sm text-ink-500">Admin-configurable thresholds for credit scoring, SLA, and risk management.</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { key: 'AUTO_APPROVE_SCORE_MIN', label: 'Auto-Approve Min Score', hint: '0–1000 CRIB score' },
                { key: 'AUTO_DECLINE_SCORE_MAX', label: 'Auto-Decline Max Score', hint: '0–1000 CRIB score' },
                { key: 'DTI_THRESHOLD_PCT', label: 'Max DTI Ratio (%)', hint: 'Debt-to-income ceiling' },
                { key: 'SLA_REVIEW_DAYS', label: 'SLA Review Days', hint: 'Business days before breach' },
                { key: 'MAX_LOGIN_ATTEMPTS', label: 'Max Login Attempts', hint: 'Before account lockout' },
                { key: 'LOCKOUT_MINUTES', label: 'Lockout Duration (min)', hint: 'After failed attempts' },
                { key: 'DRAFT_EXPIRY_DAYS', label: 'Draft Expiry Days', hint: 'Before draft auto-expires' },
                { key: 'OFFER_VALIDITY_DAYS', label: 'Offer Validity Days', hint: 'Days to sign after approval' },
                { key: 'LIVENESS_MATCH_THRESHOLD', label: 'Liveness Match Threshold', hint: '% minimum for auto-pass' },
              ].map(({ key, label, hint }) => (
                <div key={key}>
                  <label className="label">{label}</label>
                  <p className="text-xs text-ink-400 mb-1">{hint}</p>
                  <input
                    id={`config-${key}`}
                    className="input"
                    type="number"
                    value={sysConfig[key] || ''}
                    onChange={e => setSysConfig(prev => ({ ...prev, [key]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-3">
              <button
                id="save-config-btn"
                disabled={configSaving}
                onClick={async () => {
                  setConfigSaving(true)
                  try {
                    await api.bulkUpdateSystemConfig(sysConfig)
                    setConfigSaved(true)
                    setTimeout(() => setConfigSaved(false), 3000)
                  } catch (e) { setError('Failed to save config: ' + e.message) }
                  finally { setConfigSaving(false) }
                }}
                className="btn-primary"
              >
                <Save className="h-4 w-4" />
                {configSaving ? 'Saving...' : configSaved ? '✓ Saved!' : 'Save Configuration'}
              </button>
            </div>
          </div>

          {/* Audit Logs with Export */}
          <div className="card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-navy-800">System Audit Logs</h2>
              <button 
                onClick={() => {
                  const csv = [
                    ['Timestamp', 'User', 'Action', 'Entity Reference', 'Details'].join(','),
                    ...auditLogs.map(l => [
                      new Date(l.timestamp).toISOString(),
                      l.userId,
                      l.actionType,
                      l.entityReference,
                      `"${(l.details || '').replace(/"/g, '""')}"`
                    ].join(','))
                  ].join('\n')
                  
                  const blob = new Blob([csv], { type: 'text/csv' })
                  const url = window.URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `Audit_Logs_${new Date().toISOString().split('T')[0]}.csv`
                  a.click()
                }}
                className="btn-outline py-1.5 px-3 text-sm"
              >
                <Download className="h-4 w-4 mr-1" /> Export CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-ink-100 text-xs font-semibold text-ink-500">
                  <tr>
                    <th className="pb-3 pr-4">Timestamp</th>
                    <th className="pb-3 pr-4">User</th>
                    <th className="pb-3 pr-4">Action</th>
                    <th className="pb-3 pr-4">Entity Ref</th>
                    <th className="pb-3">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100 text-navy-800">
                  {auditLogs.length > 0 ? auditLogs.map((log) => (
                    <tr key={log.auditId} className="hover:bg-ink-50">
                      <td className="py-3 pr-4 whitespace-nowrap text-xs text-ink-500">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="py-3 pr-4 font-medium">{log.userId}</td>
                      <td className="py-3 pr-4"><span className="chip bg-accent-50 text-accent-700">{log.actionType}</span></td>
                      <td className="py-3 pr-4 font-mono text-xs text-ink-500">{log.entityReference}</td>
                      <td className="py-3 text-xs">{log.details}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="py-4 text-center text-ink-500">No audit logs available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-bold text-navy-800">{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
            <div className="space-y-4">
              <div><label className="label">Product Name</label><input className="input" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Min Amount (LKR)</label><input className="input" type="number" value={productForm.min} onChange={e => setProductForm({...productForm, min: e.target.value})} /></div>
                <div><label className="label">Max Amount (LKR)</label><input className="input" type="number" value={productForm.max} onChange={e => setProductForm({...productForm, max: e.target.value})} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Interest Rate (%)</label><input className="input" type="number" step="0.1" value={productForm.rate} onChange={e => setProductForm({...productForm, rate: e.target.value})} /></div>
                <div><label className="label">Max Tenure (months)</label><input className="input" type="number" value={productForm.maxTenure} onChange={e => setProductForm({...productForm, maxTenure: e.target.value})} /></div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowProductModal(false)} className="btn-outline">Cancel</button>
              <button onClick={saveProduct} className="btn-primary">Save Product</button>
            </div>
          </div>
        </div>
      )}

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-bold text-navy-800">{editingUser ? 'Edit Staff Member' : 'Add Staff Member'}</h3>
            <div className="space-y-4">
              <div><label className="label">Username</label><input className="input" value={userForm.username} onChange={e => setUserForm({...userForm, username: e.target.value})} disabled={!!editingUser} /></div>
              <div><label className="label">{editingUser ? 'New Password (leave blank to keep current)' : 'Password'}</label><input className="input" type="password" value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} /></div>
              <div><label className="label">Full Name</label><input className="input" value={userForm.fullName} onChange={e => setUserForm({...userForm, fullName: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Role</label>
                  <select className="input" value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value})}>
                    <option value="ROLE_CREDIT_OFFICER">Credit Officer</option>
                    <option value="ROLE_BRANCH_MANAGER">Branch Manager</option>
                    <option value="ROLE_ADMIN">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="label">Branch</label>
                  <select className="input" value={userForm.branch} onChange={e => setUserForm({...userForm, branch: e.target.value})}>
                    <option value="Main Branch">Main Branch</option>
                    <option value="Digital Branch">Digital Branch</option>
                    <option value="Kandy Branch">Kandy Branch</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowUserModal(false)} className="btn-outline">Cancel</button>
              <button onClick={saveUser} className="btn-primary">Save Staff Member</button>
            </div>
          </div>
        </div>
      )}
    </StaffShell>
  )
}
