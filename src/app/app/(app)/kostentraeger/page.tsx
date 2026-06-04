import { prisma } from "@/lib/prisma"

export default async function KostentraegerPage({
                                                    searchParams,
                                                }: {
    searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
    const params = searchParams ? await searchParams : {}

    const search =
        typeof params.search === "string" && params.search.trim() !== ""
            ? params.search.trim()
            : undefined

    const costCarriers = await prisma.costCarrier.findMany({
        where: search
            ? {
                OR: [
                    {
                        name: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        ikNumber: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                ],
            }
            : undefined,
        orderBy: {
            name: "asc",
        },
    })

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-indigo-700 px-6 py-4">
                <h1 className="text-xl font-semibold text-white">
                    Kostenträger
                </h1>
            </div>

            <div className="p-6">
                <form method="get" className="mb-5">
                    <input
                        type="text"
                        name="search"
                        defaultValue={search}
                        placeholder="Suchen"
                        className="w-full border-0 border-b border-gray-400 bg-transparent px-2 py-3 text-sm outline-none focus:border-indigo-700"
                    />
                </form>

                <div className="overflow-hidden rounded bg-white shadow-sm">
                    <table className="w-full text-sm">
                        <thead>
                        <tr className="border-b bg-white text-left text-gray-600">
                            <th className="px-4 py-4 font-medium">
                                Name
                            </th>
                            <th className="px-4 py-4 font-medium">
                                IK Nummer
                            </th>
                        </tr>
                        </thead>

                        <tbody>
                        {costCarriers.map((carrier) => (
                            <tr
                                key={carrier.id}
                                className="border-b last:border-b-0 hover:bg-gray-50"
                            >
                                <td className="px-4 py-4">
                                    {carrier.name}
                                </td>
                                <td className="px-4 py-4">
                                    {carrier.ikNumber}
                                </td>
                            </tr>
                        ))}

                        {costCarriers.length === 0 && (
                            <tr>
                                <td
                                    colSpan={2}
                                    className="px-4 py-8 text-center text-gray-500"
                                >
                                    Keine Kostenträger gefunden.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}