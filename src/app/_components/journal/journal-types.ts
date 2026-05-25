export type WorkType = {
  id: string;
  name: string;
};

export type JournalEntry = {
  id: string;
  performedAt: string;
  workTypeId: string;
  workType: WorkType;
  volume: number;
  unit: string;
  executorName: string;
  createdAt: string;
  updatedAt: string;
};

export type EntryFormState = {
  performedAt: string;
  workTypeId: string;
  volume: string;
  unit: string;
  executorName: string;
};

export type EntryErrors = Partial<Record<keyof EntryFormState | "form", string>>;

export type SortOrder = "asc" | "desc";
