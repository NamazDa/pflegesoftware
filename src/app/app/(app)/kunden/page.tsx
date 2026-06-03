import { PageHeader, Button } from '@/components/ui'
import { CustomerList } from '@/components/features/kunden/CustomerList'
import type { Customer } from '@/types'

// Temporäre Mock-Daten — später durch API-Call ersetzen
const mockCustomers: Customer[] = [
  {
    id: '1',
    tenantId: 'tenant-1',
    firstName: 'Klaus',
    lastName: 'Müller',
    birthDate: '1948-03-12',
    insuranceNumber: 'A123456789',
    address: { street: 'Hauptstraße', houseNumber: '12', zip: '35037', city: 'Marburg', country: 'DE' },
    status: 'active',
    tags: ['Stammkunde', 'Priorität'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    tenantId: 'tenant-1',
    firstName: 'Helga',
    lastName: 'Schmidt',
    birthDate: '1952-07-24',
    insuranceNumber: 'B987654321',
    address: { street: 'Gartenweg', houseNumber: '4', zip: '35037', city: 'Marburg', country: 'DE' },
    status: 'pending',
    tags: ['Neu'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export default function KundenPage() {
  return (
    <div>
      <PageHeader
        title="Kunden"
        description={`${mockCustomers.length} Kunden gesamt`}
        action={
          <Button size="sm">
            + Neuer Kunde
          </Button>
        }
      />
      <CustomerList customers={mockCustomers} />
    </div>
  )
}
