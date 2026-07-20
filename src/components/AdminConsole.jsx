import React, { useState, useEffect } from "react";
import { ShieldAlert, Server, Settings2, ShieldCheck, Download, Search, RefreshCw, Landmark } from "lucide-react";

export default function AdminConsole({ user }) {
  const [health, setHealth] = useState(null);
  const [audits, setAudits] = useState([]);
  const [products, setProducts] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);

  // Edit fields
  const [editRate, setEditRate] = useState("");
  const [editMin, setEditMin] = useState("");
  const [editMax, setEditMax] = useState("");
  const [editTenure, setEditTenure] = useState("");

  const fetchHealthAndAudits = () => {
    fetch("/api/v1/admin/health")
      .then(res => res.json())
      .then(data => setHealth(data));

    fetch("/api/v1/admin/audits")
      .then(res => res.json())
      .then(data => setAudits(data));

    fetch("/api/v1/products")
      .then(res => res.json())
      .then(data => setProducts(data));
  };

  useEffect(() => {
    fetchHealthAndAudits();
  }, []);

  const handleEditProductClick = (prod, type) => {
    setEditingProduct({ ...prod, categoryType: type });
    setEditRate(prod.interestRate);
    setEditMin(prod.minAmount || "");
    setEditMax(prod.maxAmount || "");
    setEditTenure(prod.defaultTenure || "");
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/v1/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: editingProduct.categoryType,
          id: editingProduct.id,
          name: editingProduct.name,
          interestRate: editRate,
          minAmount: editMin,
          maxAmount: editMax,
          defaultTenure: editTenure
        })
      });
      const data = await response.json();
      if (data.success) {
        alert("Product specification updated successfully!");
        setEditingProduct(null);
        fetchHealthAndAudits();
      }
    } catch (err) {
      alert("Error saving product config.");
    }
  };

  const handleSimulateExport = () => {
    alert("Audit Trail Export Dispatched!\nFormat: CSV (Comma-Separated Values)\nFile saved: novabank_audit_trail_export.csv\nEncryption: AES-256 Checksum Verified.");
  };

  const filteredAudits = audits.filter(log => 
    log.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      
      {/* Admin stats */}
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">System Integrity</span>
          <p className="text-sm font-bold text-emerald-600 flex items-center gap-1.5 mt-1">
            <ShieldCheck className="h-4.5 w-4.5" /> Core Active
          </p>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">Connected Stubs</span>
          <p className="text-sm font-bold text-slate-700 mt-1">5/5 APIs Online</p>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">Active DB Driver</span>
          <p className="text-sm font-bold text-blue-600 font-mono mt-1">MySQL 8.x</p>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">Server Uptime</span>
          <p className="text-sm font-bold text-slate-700 font-mono mt-1">{health?.uptimeSeconds || 240}s</p>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        
        {/* Left Side: Product Configuration Manager */}
        <div className="md:col-span-4 space-y-4">
          <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">Rate & Limit Editor</h3>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
            
            {/* Savings section */}
            <div>
              <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-1.5 uppercase font-mono text-[10px] tracking-wider">Deposit Products</h4>
              <div className="divide-y divide-slate-100">
                {products?.savings?.map(prod => (
                  <div key={prod.id} className="py-2.5 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-800">{prod.name}</p>
                      <span className="text-[9px] text-slate-400">Rate: {prod.interestRate}</span>
                    </div>
                    <button
                      id={`edit-sav-${prod.id}`}
                      onClick={() => handleEditProductClick(prod, "savings")}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded font-bold uppercase text-[9px] cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Loans section */}
            <div>
              <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-1.5 uppercase font-mono text-[10px] tracking-wider">Lending Products</h4>
              <div className="divide-y divide-slate-100">
                {products?.loans?.map(prod => (
                  <div key={prod.id} className="py-2.5 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-800">{prod.name}</p>
                      <span className="text-[9px] text-slate-400">Rate: {prod.interestRate}% | Limit: {prod.maxAmount.toLocaleString()} LKR</span>
                    </div>
                    <button
                      id={`edit-loan-${prod.id}`}
                      onClick={() => handleEditProductClick(prod, "loans")}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded font-bold uppercase text-[9px] cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Product Editor Modal Form */}
          {editingProduct && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-md space-y-3 animate-fade-in">
              <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-1.5 flex items-center gap-1">
                <Settings2 className="h-4 w-4 text-blue-600" /> Editing: {editingProduct.name}
              </h4>

              <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">INTEREST RATE</label>
                  <input
                    id="edit-prod-rate"
                    type="text"
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg"
                    value={editRate}
                    onChange={(e) => setEditRate(e.target.value)}
                  />
                </div>

                {editingProduct.categoryType === "loans" && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">MIN AMOUNT (LKR)</label>
                        <input
                          id="edit-prod-min"
                          type="number"
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg font-mono text-[10px]"
                          value={editMin}
                          onChange={(e) => setEditMin(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">MAX AMOUNT (LKR)</label>
                        <input
                          id="edit-prod-max"
                          type="number"
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg font-mono text-[10px]"
                          value={editMax}
                          onChange={(e) => setEditMax(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">DEFAULT TENURE (MONTHS)</label>
                      <input
                        id="edit-prod-tenure"
                        type="number"
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg"
                        value={editTenure}
                        onChange={(e) => setEditTenure(e.target.value)}
                      />
                    </div>
                  </>
                )}

                <div className="flex gap-2">
                  <button
                    id="btn-edit-cancel"
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="w-1/2 py-1.5 border rounded-lg hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    id="btn-edit-save"
                    type="submit"
                    className="w-1/2 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold"
                  >
                    Save Specifications
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

        {/* Right Side: Immutable Audit Logs Monitor */}
        <div className="md:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">Security Audit Logs</h3>
            <button
              id="btn-audit-export"
              onClick={handleSimulateExport}
              className="px-3 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-lg flex items-center gap-1 transition font-bold text-[10px]"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export Audit Trail (CSV)</span>
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-4 space-y-4">
            
            {/* Search filtering bar */}
            <div className="relative">
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
              <input
                id="audit-search"
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl"
                placeholder="Search audit actions, user ID, details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Audits table logs */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[10px]">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-mono font-bold uppercase bg-slate-50">
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3">User ID</th>
                    <th className="py-2 px-3">Action Type</th>
                    <th className="py-2 px-3">Entity Reference</th>
                    <th className="py-2 px-3">Details Summary</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {filteredAudits.length > 0 ? (
                    filteredAudits.map(log => (
                      <tr key={log.id} className="hover:bg-slate-50/60">
                        <td className="py-2 px-3 text-slate-400 whitespace-nowrap">{new Date(log.timestamp).toLocaleTimeString()}</td>
                        <td className="py-2 px-3 font-bold text-slate-700">{log.userId}</td>
                        <td className="py-2 px-3 font-bold text-brand-primary">{log.action_type}</td>
                        <td className="py-2 px-3 text-slate-500 whitespace-nowrap">{log.entity_reference}</td>
                        <td className="py-2 px-3 text-slate-600 min-w-[200px]">{log.details}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-slate-400">No logs found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
