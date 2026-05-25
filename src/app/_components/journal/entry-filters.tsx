import { Field } from "./field";
import type { SortOrder } from "./journal-types";

type EntryFiltersProps = {
  from: string;
  onFromChange: (value: string) => void;
  onReset: () => void;
  onSortChange: (value: SortOrder) => void;
  onToChange: (value: string) => void;
  sort: SortOrder;
  to: string;
};

export function EntryFilters({
  from,
  onFromChange,
  onReset,
  onSortChange,
  onToChange,
  sort,
  to,
}: EntryFiltersProps) {
  return (
    <div className="grid gap-3 border-b border-[#e4ded2] bg-[#fbfaf6] p-4 sm:grid-cols-2 lg:grid-cols-[minmax(150px,1fr)_minmax(150px,1fr)_170px_118px] lg:items-end">
      <Field className="mb-0" label="С даты">
        <input
          className="field-input"
          type="date"
          value={from}
          onChange={(event) => onFromChange(event.target.value)}
        />
      </Field>
      <Field className="mb-0" label="По дату">
        <input
          className="field-input"
          type="date"
          value={to}
          onChange={(event) => onToChange(event.target.value)}
        />
      </Field>
      <Field className="mb-0" label="Порядок">
        <select
          className="field-input"
          value={sort}
          onChange={(event) => onSortChange(event.target.value as SortOrder)}
        >
          <option value="desc">Сначала новые</option>
          <option value="asc">Сначала старые</option>
        </select>
      </Field>
      <div className="flex flex-col lg:pt-[26px]">
        <button
          className="secondary-button h-10 w-full whitespace-nowrap"
          disabled={!from && !to && sort === "desc"}
          type="button"
          onClick={onReset}
        >
          Сбросить
        </button>
      </div>
    </div>
  );
}
