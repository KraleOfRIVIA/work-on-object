import {
  parseDateFilter,
  parseDateFilterEnd,
  serializeJournalEntry,
  validateJournalEntryPayload,
} from "@/lib/journal";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = parseDateFilter(searchParams.get("from"));
  const to = parseDateFilterEnd(searchParams.get("to"));
  const sort = searchParams.get("sort") === "asc" ? "asc" : "desc";

  const entries = await prisma.journalEntry.findMany({
    where: {
      performedAt: {
        ...(from ? { gte: from } : {}),
        ...(to ? { lte: to } : {}),
      },
    },
    include: { workType: true },
    orderBy: { performedAt: sort },
  });

  return Response.json({ entries: entries.map(serializeJournalEntry) });
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (!payload || typeof payload !== "object") {
    return Response.json(
      { errors: { form: "Передайте данные записи в формате JSON." } },
      { status: 400 },
    );
  }

  const validation = await validateJournalEntryPayload(payload);

  if (!validation.ok) {
    return Response.json({ errors: validation.errors }, { status: 400 });
  }

  const entry = await prisma.journalEntry.create({
    data: validation.data,
    include: { workType: true },
  });

  return Response.json({ entry: serializeJournalEntry(entry) }, { status: 201 });
}
