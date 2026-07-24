import { ChevronUp, ChevronDown } from 'lucide-react'
import { useState, useMemo } from 'react'

export default function DataTable({ columns, rows, emptyMessage = 'No records found' }) {
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc')

  const sortedRows = useMemo(() => {
    if (!sortKey) return rows
    const sorted = [...rows].sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]
      if (typeof aVal === 'number' && typeof bVal === 'number') return sortDir === 'asc' ? aVal - bVal : bVal - aVal
      return sortDir === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal))
    })
    return sorted
  }, [rows, sortKey, sortDir])

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-ink-100 bg-ink-50/50">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 font-semibold text-ink-600 ${col.sortable ? 'cursor-pointer select-none hover:text-navy-700' : ''} ${col.align === 'right' ? 'text-right' : ''}`}
                onClick={() => col.sortable && toggleSort(col.key)}
              >
                <span className="inline-flex items-center gap-1">
                  {col.label}
                  {col.sortable && sortKey === col.key && (
                    sortDir === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedRows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-ink-400">{emptyMessage}</td>
            </tr>
          ) : (
            sortedRows.map((row, idx) => (
              <tr key={row.id || idx} className="border-b border-ink-50 transition-colors hover:bg-navy-50/30">
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3 text-ink-700 ${col.align === 'right' ? 'text-right' : ''}`}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
