import { cn } from '@/lib/utils/cn'

type BadgeVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  default:  'bg-indigo-50 text-indigo-700',
  success:  'bg-emerald-50 text-emerald-700',
  warning:  'bg-amber-50 text-amber-700',
  error:    'bg-red-50 text-red-700',
  info:     'bg-blue-50 text-blue-700',
  neutral:  'bg-gray-100 text-gray-600',
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-medium',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  )
}

// ─── Status-spezifische Badge-Helfer ─────────────────────────────────────────

import type { CustomerStatus, CareBoxStatus, QuoteStatus, ShipmentStatus } from '@/types'
import {
  customerStatusLabel,
  careBoxStatusLabel,
  quoteStatusLabel,
  shipmentStatusLabel,
} from '@/lib/utils/format'

const customerStatusVariant: Record<CustomerStatus, BadgeVariant> = {
  active: 'success',
  inactive: 'neutral',
  pending: 'warning',
}

export function CustomerStatusBadge({ status }: { status: CustomerStatus }) {
  return <Badge variant={customerStatusVariant[status]}>{customerStatusLabel[status]}</Badge>
}

const careBoxStatusVariant: Record<CareBoxStatus, BadgeVariant> = {
  draft: 'neutral',
  pending_approval: 'warning',
  approved: 'success',
  in_fulfillment: 'info',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'error',
}

export function CareBoxStatusBadge({ status }: { status: CareBoxStatus }) {
  return <Badge variant={careBoxStatusVariant[status]}>{careBoxStatusLabel[status]}</Badge>
}

const quoteStatusVariant: Record<QuoteStatus, BadgeVariant> = {
  draft: 'neutral',
  submitted: 'info',
  approved: 'success',
  rejected: 'error',
  expired: 'neutral',
  error: 'error',
}

export function QuoteStatusBadge({ status }: { status: QuoteStatus }) {
  return <Badge variant={quoteStatusVariant[status]}>{quoteStatusLabel[status]}</Badge>
}

const shipmentStatusVariant: Record<ShipmentStatus, BadgeVariant> = {
  waiting_order: 'neutral',
  waiting_shipment: 'warning',
  waiting_confirmation: 'warning',
  shipped: 'info',
  delivered: 'success',
  returned: 'error',
}

export function ShipmentStatusBadge({ status }: { status: ShipmentStatus }) {
  return <Badge variant={shipmentStatusVariant[status]}>{shipmentStatusLabel[status]}</Badge>
}
