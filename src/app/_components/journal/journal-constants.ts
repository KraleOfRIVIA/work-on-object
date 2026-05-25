import type { EntryFormState } from "./journal-types";

export const units = ["м³", "м²", "м.п.", "шт.", "т", "смена"];

export function createEmptyForm(workTypeId = ""): EntryFormState {
  return {
    performedAt: new Date().toISOString().slice(0, 10),
    workTypeId,
    volume: "",
    unit: "м³",
    executorName: "",
  };
}
