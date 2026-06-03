'use client'

import { useState } from 'react'
import { PageHeader, Card, CardHeader, CardTitle, Button } from '@/components/ui'
import type { ImportSource } from '@/types'

type WizardStep = 'source' | 'upload' | 'mapping' | 'preview' | 'import' | 'done'

const steps: { id: WizardStep; label: string }[] = [
  { id: 'source', label: 'Quelle' },
  { id: 'upload', label: 'Datei' },
  { id: 'mapping', label: 'Mapping' },
  { id: 'preview', label: 'Vorschau' },
  { id: 'import', label: 'Import' },
  { id: 'done', label: 'Fertig' },
]

const sourceOptions: { id: ImportSource; label: string; description: string; icon: string }[] = [
  { id: 'koala', label: 'Koala', description: 'Direkter Import aus Koala-Softwareexport', icon: '🐨' },
  { id: 'excel', label: 'Excel (.xlsx)', description: 'Microsoft Excel Tabellen importieren', icon: '📊' },
  { id: 'csv', label: 'CSV-Datei', description: 'Komma- oder semikolongetrennte Textdatei', icon: '📄' },
]

export default function ImportPage() {
  const [currentStep, setCurrentStep] = useState<WizardStep>('source')
  const [selectedSource, setSelectedSource] = useState<ImportSource | null>(null)

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep)

  function goNext() {
    const next = steps[currentStepIndex + 1]
    if (next) setCurrentStep(next.id)
  }

  function goPrev() {
    const prev = steps[currentStepIndex - 1]
    if (prev) setCurrentStep(prev.id)
  }

  return (
    <div>
      <PageHeader
        title="Import & Migration"
        description="Importieren Sie Ihre Daten aus Koala, Excel oder CSV"
      />

      {/* Fortschrittsanzeige */}
      <div className="flex items-center gap-0 mb-8">
        {steps.map((step, index) => {
          const isDone = index < currentStepIndex
          const isActive = step.id === currentStep
          return (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : isDone
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-gray-100 text-gray-400'
              }`}>
                {isDone ? '✓' : index + 1}
                <span className="hidden sm:inline">{step.label}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`h-px w-6 mx-1 ${isDone ? 'bg-emerald-300' : 'bg-gray-200'}`} />
              )}
            </div>
          )
        })}
      </div>

      {/* Schritt: Quelle wählen */}
      {currentStep === 'source' && (
        <Card>
          <CardHeader>
            <CardTitle>Datenquelle wählen</CardTitle>
          </CardHeader>
          <div className="grid grid-cols-3 gap-3">
            {sourceOptions.map((src) => (
              <button
                key={src.id}
                onClick={() => setSelectedSource(src.id)}
                className={`p-4 rounded-xl border-2 text-left transition-colors ${
                  selectedSource === src.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-2">{src.icon}</div>
                <div className="font-medium text-sm text-gray-900 mb-1">{src.label}</div>
                <div className="text-xs text-gray-500">{src.description}</div>
              </button>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={goNext} disabled={!selectedSource}>
              Weiter →
            </Button>
          </div>
        </Card>
      )}

      {/* Schritt: Datei-Upload */}
      {currentStep === 'upload' && (
        <Card>
          <CardHeader>
            <CardTitle>Datei hochladen</CardTitle>
          </CardHeader>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center">
            <div className="text-3xl mb-3">📂</div>
            <p className="text-sm font-medium text-gray-700 mb-1">
              Datei hierher ziehen oder klicken
            </p>
            <p className="text-xs text-gray-400 mb-4">
              Unterstützt: .xlsx, .csv, .xls · Max. 50 MB
            </p>
            <Button variant="secondary" size="sm">Datei auswählen</Button>
          </div>
          <div className="mt-6 flex justify-between">
            <Button variant="ghost" onClick={goPrev}>← Zurück</Button>
            <Button onClick={goNext}>Weiter →</Button>
          </div>
        </Card>
      )}

      {/* Schritt: Mapping */}
      {currentStep === 'mapping' && (
        <Card>
          <CardHeader>
            <CardTitle>Spalten zuordnen</CardTitle>
          </CardHeader>
          <p className="text-sm text-gray-500 mb-4">
            Ordnen Sie die Spalten aus Ihrer Datei den TONA-Feldern zu.
            Felder mit ✓ wurden automatisch erkannt.
          </p>
          <div className="space-y-2">
            {[
              { source: 'Vorname', target: 'firstName', auto: true },
              { source: 'Nachname', target: 'lastName', auto: true },
              { source: 'Vers.-Nr.', target: 'insuranceNumber', auto: false },
              { source: 'Geburtsdatum', target: 'birthDate', auto: true },
              { source: 'PLZ', target: 'address.zip', auto: false },
              { source: 'Ort', target: 'address.city', auto: true },
            ].map((row) => (
              <div key={row.source} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-xs font-mono text-gray-600 w-32">{row.source}</span>
                <span className="text-gray-300">→</span>
                <span className="text-xs text-gray-700 flex-1">{row.target}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                  row.auto ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {row.auto ? '✓ Auto' : '? Prüfen'}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-between">
            <Button variant="ghost" onClick={goPrev}>← Zurück</Button>
            <Button onClick={goNext}>Vorschau anzeigen →</Button>
          </div>
        </Card>
      )}

      {/* Schritt: Vorschau */}
      {currentStep === 'preview' && (
        <Card padding={false}>
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-900">Vorschau</h2>
              <p className="text-xs text-gray-400 mt-0.5">247 Zeilen · 3 Fehler · 5 Duplikate</p>
            </div>
            <div className="flex gap-2">
              <span className="text-[11px] bg-red-50 text-red-700 rounded px-2 py-1">3 Fehler</span>
              <span className="text-[11px] bg-amber-50 text-amber-700 rounded px-2 py-1">5 Duplikate</span>
              <span className="text-[11px] bg-emerald-50 text-emerald-700 rounded px-2 py-1">239 OK</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-[10px] font-medium text-gray-400 uppercase px-4 py-2">#</th>
                  <th className="text-left text-[10px] font-medium text-gray-400 uppercase px-4 py-2">Name</th>
                  <th className="text-left text-[10px] font-medium text-gray-400 uppercase px-4 py-2">Vers.-Nr.</th>
                  <th className="text-left text-[10px] font-medium text-gray-400 uppercase px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[
                  { row: 1, name: 'Müller, Klaus', ins: 'A123456789', status: 'OK' },
                  { row: 2, name: 'Schmidt, Helga', ins: '', status: 'Fehler' },
                  { row: 3, name: 'Weber, Renate', ins: 'C555555555', status: 'Duplikat' },
                ].map((r) => (
                  <tr key={r.row} className={r.status !== 'OK' ? 'bg-red-50' : ''}>
                    <td className="px-4 py-2 text-gray-400">{r.row}</td>
                    <td className="px-4 py-2 text-gray-900">{r.name}</td>
                    <td className="px-4 py-2 font-mono text-gray-500">{r.ins || '—'}</td>
                    <td className="px-4 py-2">
                      <span className={`text-[10px] rounded px-1.5 py-0.5 font-medium ${
                        r.status === 'OK' ? 'bg-emerald-100 text-emerald-700' :
                        r.status === 'Fehler' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>{r.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-4 border-t border-gray-100 flex justify-between">
            <Button variant="ghost" onClick={goPrev}>← Zurück</Button>
            <Button onClick={goNext}>239 Kunden importieren →</Button>
          </div>
        </Card>
      )}

      {/* Schritt: Import läuft */}
      {currentStep === 'import' && (
        <Card>
          <div className="text-center py-8">
            <div className="text-3xl mb-4">⏳</div>
            <h2 className="text-sm font-medium text-gray-900 mb-2">Import läuft …</h2>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-3 max-w-xs mx-auto">
              <div className="bg-indigo-600 h-2 rounded-full w-2/3 transition-all" />
            </div>
            <p className="text-xs text-gray-400">163 von 239 Kunden importiert</p>
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={goNext} variant="secondary" size="sm">Simulieren: Fertig</Button>
          </div>
        </Card>
      )}

      {/* Schritt: Fertig */}
      {currentStep === 'done' && (
        <Card>
          <div className="text-center py-8">
            <div className="text-4xl mb-4">✅</div>
            <h2 className="text-sm font-medium text-gray-900 mb-2">Import abgeschlossen</h2>
            <p className="text-xs text-gray-400 mb-6">239 Kunden erfolgreich importiert · 3 Fehler übersprungen</p>
            <div className="flex gap-2 justify-center">
              <Button variant="secondary" size="sm">Import-Protokoll herunterladen</Button>
              <Button size="sm">Zu den Kunden →</Button>
            </div>
          </div>
          <div className="mt-4 p-3 bg-amber-50 rounded-lg text-xs text-amber-700">
            <strong>Rollback möglich:</strong> Dieser Import kann innerhalb von 24 Stunden rückgängig gemacht werden.
          </div>
        </Card>
      )}
    </div>
  )
}
