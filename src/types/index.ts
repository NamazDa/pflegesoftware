// ─── Basis ────────────────────────────────────────────────────────────────────

export type UUID = string

export interface BaseEntity {
  id: UUID
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
}

// ─── Mandant ──────────────────────────────────────────────────────────────────

export interface Tenant extends BaseEntity {
  slug: string
  name: string
  plan: 'starter' | 'professional' | 'enterprise'
  settings: TenantSettings
}

export interface TenantSettings {
  logoUrl?: string
  primaryColor?: string
  defaultCarrier?: ShipmentCarrier
  fulfillmentEnabled: boolean
}

// ─── Benutzer & Rollen ────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'manager' | 'dispatcher' | 'viewer'

export interface User extends BaseEntity {
  tenantId: UUID
  email: string
  firstName: string
  lastName: string
  role: UserRole
  isActive: boolean
}

// ─── Kunde ────────────────────────────────────────────────────────────────────

export type CustomerStatus = 'active' | 'inactive' | 'pending'

export interface Customer extends BaseEntity {
  tenantId: UUID
  firstName: string
  lastName: string
  birthDate: string
  insuranceNumber: string
  insuranceProvider?: string
  address: Address
  phone?: string
  email?: string
  status: CustomerStatus
  tags: string[]
  notes?: string
  brokerId?: UUID
  sourceSystem?: string   // z.B. "koala", "excel", "manual"
  externalId?: string     // ID im Quellsystem für Dublettencheck
}

// ─── Adressen ─────────────────────────────────────────────────────────────────

export interface Address {
  street: string
  houseNumber: string
  zip: string
  city: string
  country: string
}

// ─── Pflegebox ────────────────────────────────────────────────────────────────

export type CareBoxStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'in_fulfillment'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export type CareBoxCreationMode = 'manual' | 'api' | 'automatic'

export interface CareBox extends BaseEntity {
  tenantId: UUID
  customerId: UUID
  status: CareBoxStatus
  creationMode: CareBoxCreationMode
  config: CareBoxConfig
  validatedAt?: string
  quoteId?: UUID
  shipmentId?: UUID
}

export interface CareBoxConfig {
  items: CareBoxItem[]
  notes?: string
  deliveryInterval?: 'monthly' | 'quarterly'
}

export interface CareBoxItem {
  productId: UUID
  productName: string
  quantity: number
  unitPrice?: number
}

// ─── Kostenvoranschlag ────────────────────────────────────────────────────────

export type QuoteStatus =
  | 'draft'
  | 'submitted'
  | 'approved'
  | 'rejected'
  | 'expired'
  | 'error'

export interface Quote extends BaseEntity {
  tenantId: UUID
  customerId: UUID
  status: QuoteStatus
  errorFlags?: QuoteErrorFlag[]
  totalGross?: number
  currency: string
  validUntil?: string
  approvedAt?: string
  rejectedAt?: string
  rejectionReason?: string
  costCarrierId?: UUID
}

export interface QuoteErrorFlag {
  field: string
  code: string
  message: string
}

// ─── Kostenträger ─────────────────────────────────────────────────────────────

export interface CostCarrier extends BaseEntity {
  tenantId: UUID
  name: string
  ik: string           // Institutionskennzeichen
  contactEmail?: string
  contactPhone?: string
  address?: Address
  isActive: boolean
}

// ─── Vermittler ───────────────────────────────────────────────────────────────

export interface Broker extends BaseEntity {
  tenantId: UUID
  name: string
  contactPerson?: string
  email?: string
  phone?: string
  commissionRate?: number
  isActive: boolean
}

// ─── Versand / Fulfillment ────────────────────────────────────────────────────

export type ShipmentStatus =
  | 'waiting_order'
  | 'waiting_shipment'
  | 'waiting_confirmation'
  | 'shipped'
  | 'delivered'
  | 'returned'

export type ShipmentCarrier = 'dhl' | 'dpd' | 'gls' | 'hermes' | 'ups' | 'other'

export interface Shipment extends BaseEntity {
  tenantId: UUID
  careBoxId: UUID
  customerId: UUID
  status: ShipmentStatus
  carrier: ShipmentCarrier
  trackingNumber?: string
  shippedAt?: string
  deliveredAt?: string
  deliveryNoteId?: UUID
}

// ─── Lieferschein ─────────────────────────────────────────────────────────────

export type DeliveryNoteType = 'single' | 'bulk'

export interface DeliveryNote extends BaseEntity {
  tenantId: UUID
  type: DeliveryNoteType
  shipmentIds: UUID[]
  pdfUrl?: string
  generatedAt?: string
}

// ─── Aufgaben ─────────────────────────────────────────────────────────────────

export type TaskStatus = 'open' | 'in_progress' | 'done' | 'cancelled'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Task extends BaseEntity {
  tenantId: UUID
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  assigneeId?: UUID
  dueDate?: string
  relatedEntityType?: 'customer' | 'care_box' | 'quote' | 'shipment'
  relatedEntityId?: UUID
}

// ─── Dokumente ────────────────────────────────────────────────────────────────

export type DocumentType =
  | 'prescription'
  | 'insurance_approval'
  | 'quote_pdf'
  | 'delivery_note'
  | 'invoice'
  | 'other'

export interface Document extends BaseEntity {
  tenantId: UUID
  customerId?: UUID
  type: DocumentType
  fileName: string
  fileUrl: string
  fileSize: number
  mimeType: string
  version: number
  uploadedBy: UUID
}

// ─── Import / Migration ───────────────────────────────────────────────────────

export type ImportSource = 'koala' | 'excel' | 'csv' | 'api' | 'manual'
export type ImportStatus = 'pending' | 'previewing' | 'importing' | 'done' | 'failed' | 'rolled_back'
export type ImportEntityType = 'customers' | 'care_boxes' | 'quotes'

export interface ImportJob extends BaseEntity {
  tenantId: UUID
  source: ImportSource
  entityType: ImportEntityType
  status: ImportStatus
  fileName?: string
  totalRows: number
  successRows: number
  errorRows: number
  duplicateRows: number
  errorLog: ImportError[]
  mapping?: Record<string, string>   // sourceColumn -> targetField
  rollbackAvailable: boolean
  completedAt?: string
}

export interface ImportError {
  row: number
  field?: string
  code: string
  message: string
  rawValue?: string
}

export interface ImportPreviewRow {
  rowIndex: number
  data: Record<string, unknown>
  isDuplicate: boolean
  errors: ImportError[]
  action: 'create' | 'update' | 'skip'
}

// ─── Audit Log ────────────────────────────────────────────────────────────────

export type AuditAction = 'create' | 'update' | 'delete' | 'restore' | 'login' | 'export' | 'import'

export interface AuditLog extends BaseEntity {
  tenantId: UUID
  userId: UUID
  entityType: string
  entityId: UUID
  action: AuditAction
  diff?: {
    before: Record<string, unknown>
    after: Record<string, unknown>
  }
  ipAddress?: string
  userAgent?: string
}

// ─── API Response Wrapper ─────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  meta?: PaginationMeta
  error?: ApiError
}

export interface PaginationMeta {
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, string[]>
}

// ─── Filter & Suche ───────────────────────────────────────────────────────────

export interface PaginationParams {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: string
  sortDir?: 'asc' | 'desc'
}

export interface CustomerFilters extends PaginationParams {
  status?: CustomerStatus
  tags?: string[]
  brokerId?: UUID
}

export interface CareBoxFilters extends PaginationParams {
  status?: CareBoxStatus
  customerId?: UUID
  creationMode?: CareBoxCreationMode
}

export interface QuoteFilters extends PaginationParams {
  status?: QuoteStatus
  customerId?: UUID
  costCarrierId?: UUID
  hasErrors?: boolean
}
