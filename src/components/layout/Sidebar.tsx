'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'

interface NavItem {
  label: string
  href: string
  icon: string
  badge?: number
}

interface NavGroup {
  label: string
  items: NavItem[]
}

const navigation: NavGroup[] = [
  {
    label: 'Übersicht',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: '⊞' },
      { label: 'Aufgaben', href: '/aufgaben', icon: '✓' },
    ],
  },
  {
    label: 'Verwaltung',
    items: [
      { label: 'Kunden', href: '/kunden', icon: '👤' },
      { label: 'Pflegeboxen', href: '/pflegeboxen', icon: '📦' },
      { label: 'Kostenvoranschläge', href: '/kostenvoranschlaege', icon: '📋' },
      { label: 'Abrechnung', href: '/abrechnung', icon: '💶' },
    ],
  },
  {
    label: 'Organisation',
    items: [
      { label: 'Kostenträger', href: '/kostentraeger', icon: '🏛' },
      { label: 'Vermittler', href: '/vermittler', icon: '🤝' },
      { label: 'Dokumente', href: '/dokumente', icon: '📁' },
    ],
  },
  {
    label: 'Fulfillment',
    items: [
      { label: 'Versand', href: '/fulfillment', icon: '🚚' },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Import', href: '/import', icon: '⬆' },
      { label: 'Auswertungen', href: '/auswertungen', icon: '📊' },
      { label: 'Einstellungen', href: '/einstellungen', icon: '⚙' },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-52 flex-shrink-0 border-r border-gray-200 bg-white flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-gray-100">
        {/* Orbit-Knoten Symbol */}
        <svg width="26" height="26" viewBox="0 0 80 80" aria-label="TONA Logo">
          <rect width="80" height="80" rx="14" fill="#4F46E5" />
          <circle cx="40" cy="40" r="11" fill="none" stroke="white" strokeWidth="2.5" />
          <circle cx="40" cy="40" r="3" fill="#2DD4BF" />
          <line x1="40" y1="13" x2="40" y2="27" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="40" y1="53" x2="40" y2="67" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="13" y1="40" x2="27" y2="40" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="53" y1="40" x2="67" y2="40" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="40" cy="13" r="4" fill="#2DD4BF" />
          <circle cx="67" cy="40" r="4" fill="#2DD4BF" />
          <circle cx="40" cy="67" r="4" fill="white" fillOpacity={0.4} />
          <circle cx="13" cy="40" r="4" fill="white" fillOpacity={0.4} />
        </svg>
        <span className="text-[16px] font-semibold text-indigo-600 tracking-tight">
          TONA
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {navigation.map((group) => (
          <div key={group.label} className="mb-4">
            <p className="px-2 mb-1 text-[10px] font-medium uppercase tracking-widest text-gray-400">
              {group.label}
            </p>
            {group.items.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-2 py-1.5 rounded-md text-sm mb-0.5 transition-colors',
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <span className="text-sm w-4 text-center">{item.icon}</span>
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="text-[10px] font-medium bg-indigo-100 text-indigo-600 rounded-full px-1.5 py-0.5">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-100 p-3">
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-50 cursor-pointer">
          <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[11px] font-medium text-indigo-600">
            M
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-700 truncate">Max Muster</p>
            <p className="text-[10px] text-gray-400 truncate">Admin</p>
          </div>
          <span className="text-gray-400 text-xs">⚙</span>
        </div>
      </div>
    </aside>
  )
}
