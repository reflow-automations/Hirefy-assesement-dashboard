import ExcelJS from "exceljs";
import type { NextRequest } from "next/server";
import { hasAccess } from "@/lib/access";
import { getExportRows, type ExportRow } from "@/lib/queries/export";

// exceljs heeft de Node-runtime nodig (Buffer/streams). Niet cachen: leest cookies + DB.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Column {
  header: string;
  key: keyof ExportRow;
  width: number;
}

const COLUMNS: Column[] = [
  { header: "Beroep", key: "beroep", width: 26 },
  { header: "Skill", key: "skill", width: 30 },
  { header: "Variant", key: "variant", width: 8 },
  { header: "Vraag #", key: "vraagnr", width: 8 },
  { header: "Type", key: "type", width: 12 },
  { header: "Niveau", key: "niveau", width: 8 },
  { header: "Vraag", key: "vraag", width: 70 },
  { header: "Optie A", key: "optie_a", width: 40 },
  { header: "Optie B", key: "optie_b", width: 40 },
  { header: "Optie C", key: "optie_c", width: 40 },
  { header: "Optie D", key: "optie_d", width: 40 },
  { header: "Optie E", key: "optie_e", width: 40 },
  { header: "Juist (letter)", key: "juist_letter", width: 12 },
  { header: "Juist antwoord", key: "juist_antwoord", width: 50 },
  { header: "Toelichting", key: "toelichting", width: 60 },
  { header: "Review-status", key: "review_status", width: 18 },
  { header: "Audit-notities", key: "audit_notes", width: 50 },
];

function slug(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "export"
  );
}

export async function GET(request: NextRequest) {
  if (!(await hasAccess())) {
    return new Response("Geen toegang", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const skillParam = searchParams.get("skill");
  // `jobs` = meerdere (csv), `job` = enkel (backward compat). Geen van beide + geen skill = alle beroepen.
  const jobsParam = searchParams.get("jobs") ?? searchParams.get("job");

  const skillId = skillParam ? Number(skillParam) : undefined;
  if (skillParam && (skillId === undefined || Number.isNaN(skillId))) {
    return new Response("Ongeldige skill-id", { status: 400 });
  }

  let jobIds: number[] | undefined;
  if (skillId === undefined && jobsParam) {
    jobIds = jobsParam
      .split(",")
      .map((s) => Number(s.trim()))
      .filter((n) => Number.isInteger(n));
    if (jobIds.length === 0) {
      return new Response("Ongeldige beroep-id('s)", { status: 400 });
    }
  }

  let rows: ExportRow[];
  try {
    rows = await getExportRows({ jobIds, skillId });
  } catch (err) {
    console.error("Export query faalde:", err);
    return new Response("Export mislukt bij het ophalen van de data", {
      status: 500,
    });
  }

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Hirefy dashboard";
  const sheet = workbook.addWorksheet("Vragen", {
    views: [{ state: "frozen", ySplit: 1 }],
  });
  sheet.columns = COLUMNS.map((c) => ({
    header: c.header,
    key: c.key,
    width: c.width,
  }));

  for (const row of rows) {
    sheet.addRow(row);
  }

  // Headerstijl + filter + tekstterugloop op de lange tekstkolommen.
  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF2A211A" },
  };
  headerRow.alignment = { vertical: "middle" };
  sheet.autoFilter = { from: "A1", to: { row: 1, column: COLUMNS.length } };

  const wrapKeys: Array<keyof ExportRow> = [
    "vraag",
    "optie_a",
    "optie_b",
    "optie_c",
    "optie_d",
    "optie_e",
    "juist_antwoord",
    "toelichting",
    "audit_notes",
  ];
  for (const key of wrapKeys) {
    sheet.getColumn(key).alignment = { wrapText: true, vertical: "top" };
  }

  // Bestandsnaam afleiden uit de scope.
  let base = "alle-vragen";
  if (skillId) base = rows[0]?.skill ? `skill-${slug(rows[0].skill)}` : `skill-${skillId}`;
  else if (jobIds && jobIds.length === 1)
    base = rows[0]?.beroep ? slug(rows[0].beroep) : `beroep-${jobIds[0]}`;
  else if (jobIds && jobIds.length > 1) base = `${jobIds.length}-beroepen`;
  const filename = `hirefy-${base}.xlsx`;

  const buffer = await workbook.xlsx.writeBuffer();

  return new Response(buffer as unknown as ArrayBuffer, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
