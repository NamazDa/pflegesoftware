import type {
  CustomerStatus,
  CareBoxStatus,
  QuoteStatus,
  ShipmentStatus,
  TaskStatus,
  TaskPriority,
} from '@/types'

// ─── Datum ────────────────────────────────────────────────────────────────────

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateStr))
}

export function formatDateTime(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr))
}

export function formatRelative(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'gerade eben'
  if (minutes < 60) return `vor ${minutes} Min.`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `vor ${hours} Std.`
  const days = Math.floor(hours / 24)
  return `vor ${days} Tag${days !== 1 ? 'en' : ''}`
}

// ─── Währung ──────────────────────────────────────────────────────────────────

export function formatCurrency(amount: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency,
  }).format(amount)
}

// ─── Status Labels ────────────────────────────────────────────────────────────

export const customerStatusLabel: Record<CustomerStatus, string> = {
  active: 'Aktiv',
  inactive: 'Inaktiv',
  pending: 'Ausstehend',
}

export const careBoxStatusLabel: Record<CareBoxStatus, string> = {
  draft: 'Entwurf',
  pending_approval: 'Warte auf Genehmigung',
  approved: 'Genehmigt',
  in_fulfillment: 'Im Versand',
  shipped: 'Versandt',
  delivered: 'Zugestellt',
  cancelled: 'Storniert',
}

export const quoteStatusLabel: Record<QuoteStatus, string> = {
  draft: 'Entwurf',
  submitted: 'Eingereicht',
  approved: 'Genehmigt',
  rejected: 'Abgelehnt',
  expired: 'Abgelaufen',
  error: 'Fehler',
}

export const shipmentStatusLabel: Record<ShipmentStatus, string> = {
  waiting_order: 'Warte auf Bestellung',
  waiting_shipment: 'Warte auf Versand',
  waiting_confirmation: 'Warte auf Bestätigung',
  shipped: 'Versandt',
  delivered: 'Zugestellt',
  returned: 'Zurückgesendet',
}

export const taskStatusLabel: Record<TaskStatus, string> = {
  open: 'Offen',
  in_progress: 'In Bearbeitung',
  done: 'Erledigt',
  cancelled: 'Abgebrochen',
}

export const taskPriorityLabel: Record<TaskPriority, string> = {
  low: 'Niedrig',
  medium: 'Mittel',
  high: 'Hoch',
  urgent: 'Dringend',
}

// ─── Namen ────────────────────────────────────────────────────────────────────

export function fullName(firstName: string, lastName: string): string {
  return `${lastName}, ${firstName}`
}

export function initials(firstName: string, lastName: string): string {
  return `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase()
}
