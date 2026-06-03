import { PageHeader, Card, EmptyState, Button } from '@/components/ui'

function ComingSoonPage({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div>
      <PageHeader title={title} />
      <Card>
        <EmptyState
          icon={icon}
          title={`${title} — wird vorbereitet`}
          description={description}
        />
      </Card>
    </div>
  )
}

// Jede Seite als eigener Export für App Router
export function PflegeboxenPage() {
  return <ComingSoonPage
    title="Pflegeboxen"
    icon="📦"
    description="Verwaltung aller Pflegebox-Konfigurationen, Erstellmodi und Validierungen."
  />
}

export function KostenvoranschlaegePage() {
  return <ComingSoonPage
    title="Kostenvoranschläge"
    icon="📋"
    description="KV-Workflow mit Status, Fehlermarkierung und automatischer E-Mail-Benachrichtigung."
  />
}

export function AbrechnungPage() {
  return <ComingSoonPage
    title="Abrechnung"
    icon="💶"
    description="Brutto-Preise je Konfiguration, Sammelabrechnung und DATEV-Export."
  />
}

export function KostentraegerPage() {
  return <ComingSoonPage
    title="Kostenträger"
    icon="🏛"
    description="Verwaltung aller Kostenträger mit IK-Nummer, Kontakten und Genehmigungshistorie."
  />
}

export function VermittlerPage() {
  return <ComingSoonPage
    title="Vermittler"
    icon="🤝"
    description="Vermittler-Suche, Provisionsrate und Kundenzuordnung."
  />
}

export function DokumentePage() {
  return <ComingSoonPage
    title="Dokumente"
    icon="📁"
    description="Typisierte Dokumente pro Kunde, Versionen und sichere Vorschau im Browser."
  />
}

export function AuswertungenPage() {
  return <ComingSoonPage
    title="Auswertungen"
    icon="📊"
    description="Dashboards, KPI-Reports und DATEV-Exportfunktionen."
  />
}

export function FulfillmentPage() {
  return <ComingSoonPage
    title="Fulfillment"
    icon="🚚"
    description="Lieferscheine, Sammellieferscheine, Versanddienstleister und Trackingnummern."
  />
}

export function EinstellungenPage() {
  return <ComingSoonPage
    title="Einstellungen"
    icon="⚙"
    description="Mandanten-Einstellungen, Benutzer, Rollen und Integrationen."
  />
}
