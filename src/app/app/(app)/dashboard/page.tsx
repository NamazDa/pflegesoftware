import { Card, CardHeader, CardTitle, PageHeader } from '@/components/ui'
import { formatDate, formatRelative, quoteStatusLabel, shipmentStatusLabel } from '@/lib/utils/format'
import { QuoteStatusBadge, ShipmentStatusBadge } from '@/components/ui/Badge'

// Mock-Daten — später per API
const kpis = [
  { label: 'Aktive Kunden', value: '1.284', delta: '+12 diese Woche', positive: true },
  { label: 'Offene KVs', value: '47', delta: '3 mit Fehlern', positive: false },
  { label: 'Versandbereit', value: '23', delta: 'Heute zu versenden', positive: true },
  { label: 'Versorgungsquote', value: '97 %', delta: '+2 % vs. Vormonat', positive: true },
]

const recentQuotes = [
  { id: 'q1', customer: 'Müller, Klaus', status: 'approved' as const, date: new Date(Date.now() - 600000).toISOString() },
  { id: 'q2', customer: 'Schmidt, Helga', status: 'error' as const, date: new Date(Date.now() - 3600000).toISOString() },
  { id: 'q3', customer: 'Weber, Renate', status: 'submitted' as const, date: new Date(Date.now() - 7200000).toISOString() },
]

const recentShipments = [
  { id: 's1', customer: 'Fischer, Hans', status: 'shipped' as const, tracking: 'DHL-1234567890' },
  { id: 's2', customer: 'Braun, Ilse', status: 'waiting_shipment' as const, tracking: undefined },
  { id: 's3', customer: 'Klein, Werner', status: 'delivered' as const, tracking: 'DPD-0987654321' },
]

export default function DashboardPage() {
  return (
    <div>
      <PageHeader title="Dashboard" description={`Heute, ${formatDate(new Date().toISOString())}`} />

      {/* KPI-Karten */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <p className="text-xs text-gray-400 mb-1">{kpi.label}</p>
            <p className="text-2xl font-medium text-gray-900 mb-1">{kpi.value}</p>
            <p className={`text-xs ${kpi.positive ? 'text-emerald-600' : 'text-red-500'}`}>
              {kpi.delta}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Letzte Kostenvoranschläge */}
        <Card>
          <CardHeader>
            <CardTitle>Kostenvoranschläge</CardTitle>
            <a href="/kostenvoranschlaege" className="text-xs text-indigo-600 hover:underline">Alle →</a>
          </CardHeader>
          <div className="space-y-2">
            {recentQuotes.map((q) => (
              <div key={q.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-800">{q.customer}</p>
                  <p className="text-xs text-gray-400">{formatRelative(q.date)}</p>
                </div>
                <QuoteStatusBadge status={q.status} />
              </div>
            ))}
          </div>
        </Card>

        {/* Versandstatus */}
        <Card>
          <CardHeader>
            <CardTitle>Versand</CardTitle>
            <a href="/fulfillment" className="text-xs text-indigo-600 hover:underline">Alle →</a>
          </CardHeader>
          <div className="space-y-2">
            {recentShipments.map((s) => (
              <div key={s.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-800">{s.customer}</p>
                  {s.tracking && (
                    <p className="text-xs text-gray-400 font-mono">{s.tracking}</p>
                  )}
                </div>
                <ShipmentStatusBadge status={s.status} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
