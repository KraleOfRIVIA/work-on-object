import { formatDate } from "./journal-format";
import type { JournalEntry } from "./journal-types";

type EntriesTableProps = {
  editingId: string | null;
  entries: JournalEntry[];
  isLoading: boolean;
  onDeleteEntry: (entry: JournalEntry) => void;
  onEditEntry: (entry: JournalEntry) => void;
};

export function EntriesTable({
  editingId,
  entries,
  isLoading,
  onDeleteEntry,
  onEditEntry,
}: EntriesTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[780px] border-collapse text-left text-sm">
        <thead className="bg-[#f0ede6] text-xs uppercase tracking-[0.08em] text-[#676157]">
          <tr>
            <th className="table-cell">Дата</th>
            <th className="table-cell">Вид работ</th>
            <th className="table-cell">Объём</th>
            <th className="table-cell">Исполнитель</th>
            <th className="table-cell text-right">Действия</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td className="table-empty" colSpan={5}>
                Загрузка записей...
              </td>
            </tr>
          ) : entries.length === 0 ? (
            <tr>
              <td className="table-empty" colSpan={5}>
                Записей за выбранный период нет.
              </td>
            </tr>
          ) : (
            entries.map((entry) => (
              <tr
                className={editingId === entry.id ? "bg-[#fff8e6]" : ""}
                key={entry.id}
              >
                <td className="table-cell font-medium">
                  {formatDate(entry.performedAt)}
                </td>
                <td className="table-cell">{entry.workType.name}</td>
                <td className="table-cell">
                  {entry.volume} {entry.unit}
                </td>
                <td className="table-cell">{entry.executorName}</td>
                <td className="table-cell">
                  <div className="flex justify-end gap-2">
                    <button
                      className="secondary-button"
                      type="button"
                      onClick={() => onEditEntry(entry)}
                    >
                      Править
                    </button>
                    <button
                      className="danger-button"
                      type="button"
                      onClick={() => onDeleteEntry(entry)}
                    >
                      Удалить
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
