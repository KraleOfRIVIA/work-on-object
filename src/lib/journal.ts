import { prisma } from "@/lib/prisma";

export type JournalEntryPayload = {
  performedAt: string;
  workTypeId: string;
  volume: unknown;
  unit: string;
  executorName: string;
};

export type JournalValidationResult =
  | {
      ok: true;
      data: {
        performedAt: Date;
        workTypeId: string;
        volume: number;
        unit: string;
        executorName: string;
      };
    }
  | {
      ok: false;
      errors: Record<string, string>;
    };

export function serializeJournalEntry(entry: {
  id: string;
  performedAt: Date;
  workTypeId: string;
  workType: { id: string; name: string };
  volume: number;
  unit: string;
  executorName: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    ...entry,
    performedAt: entry.performedAt.toISOString(),
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
  };
}

export function parseDateFilter(value: string | null) {
  if (!value) {
    return undefined;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  return Number.isNaN(date.getTime()) ? undefined : date;
}

export function parseDateFilterEnd(value: string | null) {
  if (!value) {
    return undefined;
  }

  const date = new Date(`${value}T23:59:59.999Z`);

  return Number.isNaN(date.getTime()) ? undefined : date;
}

export async function validateJournalEntryPayload(
  payload: Partial<JournalEntryPayload>,
): Promise<JournalValidationResult> {
  const errors: Record<string, string> = {};
  const performedAtValue = payload.performedAt?.trim();
  const workTypeId = payload.workTypeId?.trim();
  const unit = payload.unit?.trim();
  const executorName = payload.executorName?.trim();
  const volume =
    typeof payload.volume === "number"
      ? payload.volume
      : Number(String(payload.volume ?? "").replace(",", "."));

  const performedAt = performedAtValue
    ? new Date(`${performedAtValue}T00:00:00.000Z`)
    : null;

  if (!performedAt || Number.isNaN(performedAt.getTime())) {
    errors.performedAt = "Укажите корректную дату выполнения.";
  }

  if (!workTypeId) {
    errors.workTypeId = "Выберите вид работ.";
  } else {
    const workTypeExists = await prisma.workType.count({
      where: { id: workTypeId },
    });

    if (!workTypeExists) {
      errors.workTypeId = "Выбранный вид работ не найден.";
    }
  }

  if (!Number.isFinite(volume) || volume <= 0) {
    errors.volume = "Укажите объём больше 0.";
  }

  if (!unit) {
    errors.unit = "Укажите единицу измерения.";
  }

  if (!executorName) {
    errors.executorName = "Укажите ФИО исполнителя.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      performedAt: performedAt as Date,
      workTypeId: workTypeId as string,
      volume,
      unit: unit as string,
      executorName: executorName as string,
    },
  };
}
