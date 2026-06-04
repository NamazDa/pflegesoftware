'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card, Input, EmptyState } from '@/components/ui'
import { CustomerStatusBadge } from '@/components/ui/Badge'
import { formatDate, fullName } from '@/lib/utils/format'
import type { Customer, CustomerFilters } from '@/types'

interface CustomerListProps {
  customers: Customer[]
  onNew?: () => void
  onSelect?: (customer: Customer) => void
}

export function CustomerList({ customers, onNew, onSelect }: CustomerListProps) {

    const router = useRouter()
  const [filters, setFilters] = useState<CustomerFilters>({ search: '' })

  const filtered = useMemo(() => {
    const q = filters.search?.toLowerCase() ?? ''
    return customers.filter((c) => {
      if (!q) return true
      return (
        c.firstName.toLowerCase().includes(q) ||
        c.lastName.toLowerCase().includes(q) ||
        c.insuranceNumber.includes(q) ||
        c.address.city.toLowerCase().includes(q)
      )
    })
  }, [customers, filters.search])

  return (
    <Card padding={false}>
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
        <Input
          placeholder="Suche nach Name, Versichertennr., Ort …"
          value={filters.search ?? ''}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          className="max-w-sm text-xs"
        />
        <div className="flex-1" />
        <span className="text-xs text-gray-400">{filtered.length} Einträge</span>
        {onNew && (
          <Button size="sm" onClick={onNew}>
            + Neuer Kunde
          </Button>
        )}
      </div>

      {/* Tabelle */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="👤"
          title="Keine Kunden gefunden"
          description="Passen Sie die Suche an oder legen Sie einen neuen Kunden an."
          action={onNew && <Button size="sm" onClick={onNew}>Ersten Kunden anlegen</Button>}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-[11px] font-medium text-gray-400 uppercase tracking-wide px-4 py-2.5">Name</th>
                <th className="text-left text-[11px] font-medium text-gray-400 uppercase tracking-wide px-4 py-2.5">Versichertennr.</th>
                <th className="text-left text-[11px] font-medium text-gray-400 uppercase tracking-wide px-4 py-2.5">Wohnort</th>
                <th className="text-left text-[11px] font-medium text-gray-400 uppercase tracking-wide px-4 py-2.5">Geb.-Datum</th>
                <th className="text-left text-[11px] font-medium text-gray-400 uppercase tracking-wide px-4 py-2.5">Status</th>
                <th className="text-left text-[11px] font-medium text-gray-400 uppercase tracking-wide px-4 py-2.5">Tags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => {
                      if (onSelect) {
                          onSelect(customer)
                          return
                      }

                      router.push(`/app/kunden/${customer.id}`)
                  }}
                >
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {fullName(customer.firstName, customer.lastName)}
                  </td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                    {customer.insuranceNumber}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {customer.address.zip} {customer.address.city}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {formatDate(customer.birthDate)}
                  </td>
                  <td className="px-4 py-3">
                    <CustomerStatusBadge status={customer.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {customer.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[10px] bg-gray-100 text-gray-500 rounded px-1.5 py-0.5">
                          {tag}
                        </span>
                      ))}
                      {customer.tags.length > 3 && (
                        <span className="text-[10px] text-gray-400">+{customer.tags.length - 3}</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}
