'use client'

import { usePathname } from 'next/navigation'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/kunden': 'Kunden',
  '/pflegeboxen': 'Pflegeboxen',
  '/kostenvoranschlaege': 'Kostenvoranschläge',
  '/abrechnung': 'Abrechnung',
  '/kostentraeger': 'Kostenträger',
  '/vermittler': 'Vermittler',
  '/aufgaben': 'Aufgaben',
  '/dokumente': 'Dokumente',
  '/auswertungen': 'Auswertungen',
  '/einstellungen': 'Einstellungen',
  '/import': 'Import & Migration',
  '/fulfillment': 'Fulfillment',
}

export function Header() {
  const pathname = usePathname()
  const segment = '/' + (pathname.split('/')[1] ?? '')
  const title = pageTitles[segment] ?? 'TONA'

  return (
    <header className="h-12 border-b border-gray-200 bg-white flex items-center justify-between px-5 flex-shrink-0">
      <h1 className="text-sm font-medium text-gray-900">{title}</h1>
      <div className="flex items-center gap-2">
        {/* Placeholder: Suche, Benachrichtigungen */}
        <button className="text-xs text-gray-400 hover:text-gray-600 border border-gray-200 rounded-md px-2.5 py-1 flex items-center gap-1.5 transition-colors">
          <span>⌘</span>
          <span>Suche …</span>
          <kbd className="ml-1 text-[10px]">K</kbd>
        </button>
        <button className="text-gray-400 hover:text-gray-600 transition-colors text-sm">
          🔔
        </button>
      </div>
    </header>
  )
}
