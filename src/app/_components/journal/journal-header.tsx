import { Metric } from "./metric";
import type { SortOrder } from "./journal-types";

type JournalHeaderProps = {
  entriesCount: number;
  sort: SortOrder;
  workTypesCount: number;
};

export function JournalHeader({
  entriesCount,
  sort,
  workTypesCount,
}: JournalHeaderProps) {
  return (
    <header className="flex flex-col gap-3 border-b border-[#d8d2c6] pb-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6f6a60]">
          Производственный журнал
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal text-[#11130f] sm:text-4xl">
          Журнал строительных работ
        </h1>
      </div>
      <div className="grid grid-cols-3 gap-2 rounded-md border border-[#d8d2c6] bg-white/70 p-2 text-sm shadow-sm">
        <Metric label="Записей" value={String(entriesCount)} />
        <Metric label="Видов работ" value={String(workTypesCount)} />
        <Metric
          label="Сортировка"
          value={sort === "desc" ? "Новые" : "Старые"}
        />
      </div>
    </header>
  );
}
