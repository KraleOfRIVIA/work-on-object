import {
  serializeJournalEntry,
  validateJournalEntryPayload,
} from "@/lib/journal";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  context: RouteContext<"/api/journal-entries/[id]">,
) {
  const { id } = await context.params;
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

  const existingEntry = await prisma.journalEntry.count({ where: { id } });

  if (!existingEntry) {
    return Response.json(
      { errors: { form: "Запись журнала не найдена." } },
      { status: 404 },
    );
  }

  const entry = await prisma.journalEntry.update({
    where: { id },
    data: validation.data,
    include: { workType: true },
  });

  return Response.json({ entry: serializeJournalEntry(entry) });
}

export async function DELETE(
  _request: Request,
  context: RouteContext<"/api/journal-entries/[id]">,
) {
  const { id } = await context.params;
  const existingEntry = await prisma.journalEntry.count({ where: { id } });

  if (!existingEntry) {
    return Response.json(
      { errors: { form: "Запись журнала не найдена." } },
      { status: 404 },
    );
  }

  await prisma.journalEntry.delete({ where: { id } });

  return Response.json({ ok: true });
}
