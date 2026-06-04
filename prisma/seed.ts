import "dotenv/config";
import { PrismaClient, QuoteStatus } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Roles, Permissions } from "../src/lib/rbac/constants";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
    const hashedPassword = await bcrypt.hash("admin1234", 12);

    // ─── 1. PERMISSIONS ───────────────────────────────────────────
    const permissionKeys = Object.values(Permissions);

    for (const key of permissionKeys) {
        await prisma.permission.upsert({
            where: {key},
            update: {},
            create: {key, description: key},
        });
    }

    console.log("✅ Permissions erstellt");

    // ─── 2. ROLLEN ────────────────────────────────────────────────
    const superAdminRole = await prisma.role.upsert({
        where: {name: Roles.SUPER_ADMIN},
        update: {},
        create: {
            name: Roles.SUPER_ADMIN,
            description: "Hat alle Rechte",
        },
    });

    const adminRole = await prisma.role.upsert({
        where: {name: Roles.ADMIN},
        update: {},
        create: {
            name: Roles.ADMIN,
            description: "Zugriff auf die meisten Bereiche",
        },
    });

    const employeeRole = await prisma.role.upsert({
        where: {name: Roles.EMPLOYEE},
        update: {},
        create: {
            name: Roles.EMPLOYEE,
            description: "Eingeschränkter Zugriff",
        },
    });

    console.log("✅ Rollen erstellt");

    // ─── 3. PERMISSIONS PRO ROLLE ─────────────────────────────────
    const allPermissions = await prisma.permission.findMany();

    const adminPermissionKeys = [
        Permissions.USER_VIEW,
        Permissions.USER_CREATE,
        Permissions.USER_UPDATE,
        Permissions.CUSTOMER_VIEW,
        Permissions.CUSTOMER_CREATE,
        Permissions.CUSTOMER_UPDATE,
        Permissions.ROLE_VIEW,
        Permissions.AUDIT_LOG_VIEW,
    ];

    const employeePermissionKeys = [
        Permissions.CUSTOMER_VIEW,
        Permissions.USER_VIEW,
    ];

    // super_admin → alle Permissions
    for (const permission of allPermissions) {
        await prisma.rolePermission.upsert({
            where: {
                roleId_permissionId: {
                    roleId: superAdminRole.id,
                    permissionId: permission.id,
                },
            },
            update: {},
            create: {
                roleId: superAdminRole.id,
                permissionId: permission.id,
            },
        });
    }

    // admin → ausgewählte Permissions
    for (const key of adminPermissionKeys) {
        const permission = allPermissions.find((p) => p.key === key);
        if (!permission) continue;

        await prisma.rolePermission.upsert({
            where: {
                roleId_permissionId: {
                    roleId: adminRole.id,
                    permissionId: permission.id,
                },
            },
            update: {},
            create: {
                roleId: adminRole.id,
                permissionId: permission.id,
            },
        });
    }

    // employee → eingeschränkte Permissions
    for (const key of employeePermissionKeys) {
        const permission = allPermissions.find((p) => p.key === key);
        if (!permission) continue;

        await prisma.rolePermission.upsert({
            where: {
                roleId_permissionId: {
                    roleId: employeeRole.id,
                    permissionId: permission.id,
                },
            },
            update: {},
            create: {
                roleId: employeeRole.id,
                permissionId: permission.id,
            },
        });
    }

    console.log("✅ Rollen mit Permissions verknüpft");

    // ─── 4. DEMO TENANT ───────────────────────────────────────────
    const tenant = await prisma.tenant.upsert({
        where: {slug: "demo-pflegebox"},
        update: {},
        create: {
            name: "Demo Pflegebox GmbH",
            slug: "demo-pflegebox",
            status: "active",
        },
    });

    await prisma.tenantSetting.upsert({
        where: {
            tenantId_key: {
                tenantId: tenant.id,
                key: "shipping_provider",
            },
        },
        update: {
            value: "DHL",
        },
        create: {
            tenantId: tenant.id,
            key: "shipping_provider",
            value: "DHL",
        },
    });

    console.log("✅ Demo Tenant erstellt");

    // ─── 5. DEMO USER ─────────────────────────────────────────────
    const demoUser = await prisma.user.upsert({
        where: {email: "toygar@demo-pflegebox.de"},
        update: {
            password: hashedPassword,
            name: "Toygar",
        },
        create: {
            email: "toygar@demo-pflegebox.de",
            password: hashedPassword,
            name: "Toygar",
        },
    });

    await prisma.userRole.upsert({
        where: {
            userId_roleId: {
                userId: demoUser.id,
                roleId: superAdminRole.id,
            },
        },
        update: {},
        create: {
            userId: demoUser.id,
            roleId: superAdminRole.id,
        },
    });

    await prisma.tenantUser.upsert({
        where: {
            tenantId_userId: {
                tenantId: tenant.id,
                userId: demoUser.id,
            },
        },
        update: {},
        create: {
            tenantId: tenant.id,
            userId: demoUser.id,
            status: "active",
        },
    });

    console.log("✅ Demo User erstellt");

    // ─── 6. ALTE DEMO KUNDEN + QUOTES LÖSCHEN ─────────────────────

    const existingDemoCustomers = await prisma.customer.findMany({
        where: {
            tenantId: tenant.id,
            source: "manual",
        },
        select: {
            id: true,
        },
    });

    if (existingDemoCustomers.length > 0) {
        await prisma.quote.deleteMany({
            where: {
                customerId: {
                    in: existingDemoCustomers.map((customer) => customer.id),
                },
            },
        });
    }

    await prisma.customer.deleteMany({
        where: {
            tenantId: tenant.id,
            source: "manual",
        },
    });

    console.log("✅ Alte Demo Kunden und Kostenvoranschläge gelöscht");

    // ─── 7. DEMO KUNDEN ───────────────────────────────────────────

    const demoCustomers = [
        {
            firstName: "Luigi",
            lastName: "Hinz",
            status: "PENDING_APPROVAL",
            insuranceNumber: "R268299611",
            birthDate: new Date("1974-01-01"),
            phone: "015110100054",
            email: "luigi.hinz@example.de",
            source: "manual",
            tags: ["PG51", "PG54"],
            notes: "Warten auf Genehmigung",

            street: "Junostraße",
            houseNumber: "27",
            zip: "35745",
            city: "Herborn",
            country: "DE",

            careLevel: 2,
            insuranceType: "gesetzlich",
            insuranceName: "Techniker",
            insuranceIk: "182171012",

            brokerName: "Fatih Deniz",
            brokerNumber: "2",
            brokerShop: "IT-Labs",

            pg51Status: "genehmigt",
            pg54Status: "genehmigt",
        },
        {
            firstName: "Kayla",
            lastName: "Yürür",
            status: "ACTIVE",
            insuranceNumber: "A713471064",
            birthDate: new Date("1952-11-04"),
            phone: "017636331333",
            email: "kayla.yueruer@example.de",
            source: "manual",
            tags: ["PG51", "PG54"],
            notes: "Aktiver Kunde",

            street: "Konrad-Adenauer-Straße",
            houseNumber: "3",
            zip: "35745",
            city: "Herborn",
            country: "DE",

            careLevel: 3,
            insuranceType: "gesetzlich",
            insuranceName: "BKK Pfalz",
            insuranceIk: "105313145",

            brokerName: "Fatih Deniz",
            brokerNumber: "2",
            brokerShop: "IT-Labs",

            pg51Status: "genehmigt",
            pg54Status: "genehmigt",
        },
        {
            firstName: "Fatma",
            lastName: "Tetrilik",
            status: "PENDING_APPROVAL",
            insuranceNumber: "T956048860",
            birthDate: new Date("1959-06-08"),
            phone: null,
            email: "fatma.tetrilik@example.de",
            source: "manual",
            tags: ["PG51", "PG54"],
            notes: "Warten auf Genehmigung",

            street: "Lempstraße",
            houseNumber: "40",
            zip: "35630",
            city: "Ehringshausen",
            country: "DE",

            careLevel: 2,
            insuranceType: "gesetzlich",
            insuranceName: "AOK Hessen",
            insuranceIk: "105313145",

            brokerName: "Fatih Deniz",
            brokerNumber: "2",
            brokerShop: "IT-Labs",

            pg51Status: "offen",
            pg54Status: "offen",
        },
    ];

    for (const customer of demoCustomers) {
        await prisma.customer.create({
            data: {
                tenantId: tenant.id,
                ...customer,
            },
        });
    }

    console.log("✅ Demo Kunden erstellt");
    // ─── 8. DEMO KOSTENTRÄGER ───────────────────────────────────────

    const rawCostCarriers = `
BKK EVM	106331593
BKK TUI	182137985
Knappschaft	109905003
AOK NordWest	103411401
Landkreis Peine	111111429
BKK Stadt Augsburg	109132678
BKK Pronova	106492393
BKK Karl Mayer	105330431
Hanseatische Ersatzkasse	101570104
BKK KBA	108833674
AOK Baden-Württemberg	108018007
Vivida BKK	107536262
BKK Securvita	181320032
BKK Deutsche Bank	104224634
BKK Gildemeister/ Seidensticker	103724272
BKK EWE	102429648
VIACTIV	104526376
BKK Pfalz	106431652
BKK Braun	105530422
BKK Wirtschaft & Finanzen	105734543
IKK Brandenburg / Berlin	109500297
HKK	103170002
BKK Bertelsmann	103725342
IKK gesund plus Ost	101202961
BKK Pfaff	106431572
LKK Baden-Württemberg	108008880
Postbeamtenkrankenkasse	103600182
BKK Public	101931440
AOK Bayern	108310400
BKK Euregio	104125509
BKK Achenbach Buschhütten	103525909
BKK Scheufelen	108035576
BKK Diakonie Bielefeld	103724294
Barmer	104940005
BKK exklusiv	102122557
BKK VDN	103526615
BKK Firmus	183121137
BKK Faber Castell & Partner	109033393
BKK mhplus	188035612
BKK Werra-Meissner Varity GmbH	105530126
BKK Merck	105230076
BKK 24	102122660
BKK Textilgruppe Hof	108632900
BKK ZF u. Partner	107829563
BKK Novitas	104491707
Amt für Wohnen und Grundsicherung	111111130
BIG direkt	184127692
BKK BMW	109034270
BKK ProVita	188591499
Sozialamt Krefeld	111111237
BG Verwaltung Mainz	120791212
DKV Privatversicherung - Ändern auf Privat!	168140448
BGW Berufsgenossenschaft für Gesundheitsdienst und Wohlfahrtspflege	111111312
BKK PwC	105723301
Bezirksamt Wandsbek	111111337
AOK Bremen	103119199
AOK Rheinland-Pfalz/Saarland	107310373
AOK Sachsen-Anhalt	101097008
BKK Dürkopp Adler	103724249
BKK Debeka	106329225
BKK Freudenberg	107036370
BKK SBK	188433248
BKK Technoform	102031410
Continentale Betriebskrankenkasse	183523440
IKK classic/Sachsen	107202793
Kreisverwaltung Landau	111111430
KKH	182171012
AOK Hessen	105313145
AOK Rheinland / Hamburg	104212505
BKK Bahn	189938331
BKK Audi Ingolstadt	108534160
BKK Herkules	105530331
Stadt Geesthacht	111111359
BKK Voralb	108031424
Mobil Krankenkasse	101520078
Heimat Krankenkasse	103724238
Techniker	181575519
LKK Schleswig-Holstein	101308719
LKK Mittel- u. Ostdeutschland	180609049
LKK Franken u.Oberbayern	108608820
BKK Melitta HMR	103726081
Bezirk Oberbayern	111111260
Stadt Neumünster	111111319
Landkreis Wesermarsch	132880112
Stadt Frankfurt am Main Jugend- und Sozialamt	111111352
Sozialamt Hamburg Mitte	111111363
Bezirksamt Bergedorf	111111362
Test	999999999
BKK Südzucker	106936311
Sozialamt Wandsbek	111111401
Sozialamt Schwerin	111111404
Sozial Landratsamt Lörrach	111111240
Main-Kinzig-Kreis Amt für soziale Förderung und Teilhabe	111111409
Dummy	123456789
Bezirksamt Wandsbek Soziales Dienstleistungszentrum Rahlstedt	111111131
Sozialamt Stadt Kassel	111111189
Amt für Soziales Hofheim am Taunus	111111353
Stadt Frankfurt am Main Jugend- und Sozialamt	111111397
Hansestadt Lübeck	111111134
Sozialrathaus Nord	111111423
Sozialamt Landkreis Nordwestmecklenburg	111111432
Sozialamt Köln	111111261
Amt für Soziales Erfurt	111111439
Amt für Teilhabe und Soziales Oldenburg	111111288
Sozialrathaus Dornbusch	111111129
AOK Plus Thüringen	105998018
IKK Schleswig-Holstein	101300129
Kreis Offenbach	111111447
Heilfürsorge LBV Baden-Württemberg	103600923
BKK Ernst Young	105732324
Amt für Soziales und Wohnen Bonn	111111454
Kreis Stormarn	111111452
Landeshauptstadt Dresden Sozialamt Abteilung Soziale Leistungen SG Sozialeleistungen OST	111111459
Sozialamt Landeswohlfahrtsverband Hessen	111111462
Kreis Rendsburg-Eckernförde	111111464
Magistrat Sozialleistungs- und Jobcenter Wiesbaden	111111466
BKK Miele	183725364
BKK Metzinger	107835743
Städteregion Aachen	111111431
LKK BaWü	106908874
BKK Groz-Beckert	107835071
Fachamt Grundsicherung und Soziales Hamburg	100000255
Amt für Soziale Dienste	111111426
AOK Nordost/Berlin	109519005
BKK AKZO NOBEL BAYERN	108833355
BKK Continentale	103523440
Mercedes-Benz BKK	108030775
BKK Linde	105830517
BKK SKD	108833505
BKK mkk – meine krankenkasse	109723913
Die Bergische Krankenkasse	104926702
LKK Nordrhein-Westfalen	103708773
IKK - Die Innovationskasse	101300129
`;

    const costCarrierMap = new Map<string, { name: string; ikNumber: string }>();

    for (const line of rawCostCarriers.trim().split("\n")) {
        const match = line.trim().match(/^(.*)\s+(\d{9})$/);

        if (!match) {
            console.warn("⚠️ Ungültige Kostenträger-Zeile übersprungen:", line);
            continue;
        }

        const name = match[1].trim();
        const ikNumber = match[2].trim();

        if (!costCarrierMap.has(ikNumber)) {
            costCarrierMap.set(ikNumber, { name, ikNumber });
        }
    }

    const costCarriers = Array.from(costCarrierMap.values());

    for (const carrier of costCarriers) {
        await prisma.costCarrier.upsert({
            where: {
                ikNumber: carrier.ikNumber,
            },
            update: {
                name: carrier.name,
            },
            create: carrier,
        });
    }

    console.log(`✅ ${costCarriers.length} Kostenträger erstellt/aktualisiert`);

    // ─── 9. DEMO KOSTENVORANSCHLÄGE ───────────────────────────────

    const customers = await prisma.customer.findMany({
        where: {
            tenantId: tenant.id,
            source: "manual",
        },
    });

    if (customers.length === 0) {
        throw new Error("Keine Demo-Kunden gefunden. Quotes können nicht erstellt werden.");
    }

    const brokers = [
        "Fatih Deniz",
        "Toygar Danaci",
        "Namaz Davrishov",
        "IT-Labs",
    ];

    const statuses = [
        QuoteStatus.OPEN,
        QuoteStatus.APPROVED,
        QuoteStatus.REJECTED,
        QuoteStatus.NO_RESPONSE,
        QuoteStatus.FAILED,
    ];

    const quoteData = Array.from({length: 25}).map((_, index) => {
        const customer = customers[index % customers.length];
        const status = statuses[index % statuses.length];
        const type = index % 2 === 0 ? "PG51" : "PG54";
        const carrier = costCarriers[index % costCarriers.length];

        const createdAt = new Date();
        createdAt.setDate(createdAt.getDate() - index);

        const approvedFrom =
            status === QuoteStatus.APPROVED ? new Date() : null;

        const approvedUntil =
            status === QuoteStatus.APPROVED
                ? new Date(new Date().setMonth(new Date().getMonth() + 12))
                : null;

        return {
            customerId: customer.id,
            customerNumber: `KD-${10000 + index}`,
            type,
            status,
            insuranceName: carrier.name,
            processNumber: `KV-2026-${1000 + index}`,
            approvalNumber:
                status === QuoteStatus.APPROVED ? `GEN-${5000 + index}` : null,
            approvalDate:
                status === QuoteStatus.APPROVED ? new Date() : null,
            approvedFrom,
            approvedUntil,
            copaymentFree: index % 3 === 0,
            rejectionReason:
                status === QuoteStatus.REJECTED
                    ? "Unterlagen unvollständig"
                    : null,
            pdfUrl: "/demo/kostenvoranschlag.pdf",
            brokerName: brokers[index % brokers.length],
            createdAt,
        };
    });

    await prisma.quote.createMany({
        data: quoteData,
    });

    console.log("✅ Demo Kostenvoranschläge erstellt");

    console.log("🎉 Seed fertig.");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (error) => {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    });