const menuItems = [
    "Dashboard",
    "Kunden",
    "Pflegeboxen",
    "Kostenvoranschläge",
    "Abrechnung",
    "Kostenträger",
    "Vermittler",
    "Aufgaben",
    "Dokumente",
    "Auswertungen",
    "Einstellungen",
];

const stats = [
    ["Aktive Kunden", "1.248", "+12 diesen Monat"],
    ["Offene Vorgänge", "37", "8 kritisch"],
    ["Heute versendet", "126", "94% erledigt"],
    ["Offene Abrechnung", "18", "54.230 €"],
];

export default function Home() {
    return (
        <main className="min-h-screen bg-[#F6F7FB] text-slate-950">
            <div className="flex min-h-screen">
                <aside className="w-72 border-r border-slate-200 bg-white px-5 py-6">
                    <div className="mb-10 flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-lg font-bold text-white shadow-sm">
                            T
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">TONA</h1>
                            <p className="text-sm text-slate-500">Care Operating System</p>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        {menuItems.map((item, index) => (
                            <div
                                key={item}
                                className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                                    index === 0
                                        ? "bg-indigo-50 text-indigo-700"
                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                                }`}
                            >
                                {item}
                            </div>
                        ))}
                    </nav>
                </aside>

                <section className="flex-1 px-8 py-7">
                    <header className="mb-8 flex items-center justify-between">
                        <div>
                            <p className="mb-1 text-sm font-medium text-indigo-600">
                                Willkommen zurück
                            </p>
                            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                            <p className="mt-1 text-slate-500">
                                Deine zentrale Übersicht für Kunden, Pflegeboxen und Abrechnung.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                placeholder="Suchen..."
                                className="w-72 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500"
                            />
                            <button className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700">
                                Neuer Kunde
                            </button>
                        </div>
                    </header>

                    <div className="grid grid-cols-4 gap-5">
                        {stats.map(([label, value, info]) => (
                            <div
                                key={label}
                                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                            >
                                <p className="text-sm font-medium text-slate-500">{label}</p>
                                <p className="mt-3 text-3xl font-bold tracking-tight">{value}</p>
                                <p className="mt-2 text-sm text-slate-400">{info}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 grid grid-cols-3 gap-5">
                        <div className="col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="mb-5 flex items-center justify-between">
                                <h3 className="text-lg font-bold">Letzte Aktivitäten</h3>
                                <span className="text-sm font-medium text-indigo-600">
                  Alle anzeigen
                </span>
                            </div>

                            {[
                                "Kostenvoranschlag für Maria Schneider erstellt",
                                "Pflegebox Namaz Davrishov geändert",
                                "Abrechnung S637 wurde vorbereitet",
                                "Neuer Vermittler wurde hinzugefügt",
                                "Dokument für Kostenträger hochgeladen",
                            ].map((activity) => (
                                <div
                                    key={activity}
                                    className="flex items-center justify-between border-b border-slate-100 py-4 text-sm last:border-0"
                                >
                                    <span className="font-medium text-slate-700">{activity}</span>
                                    <span className="text-slate-400">gerade eben</span>
                                </div>
                            ))}
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h3 className="mb-5 text-lg font-bold">Aufgaben</h3>

                            {[
                                "12 Genehmigungen prüfen",
                                "8 Kunden ohne Kostenträger",
                                "5 Rückfragen offen",
                                "3 Abrechnungen freigeben",
                            ].map((task) => (
                                <div
                                    key={task}
                                    className="mb-3 rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"
                                >
                                    {task}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}