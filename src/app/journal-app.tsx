"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { EntriesTable } from "./_components/journal/entries-table";
import { EntryFilters } from "./_components/journal/entry-filters";
import { EntryForm } from "./_components/journal/entry-form";
import { createEmptyForm, units } from "./_components/journal/journal-constants";
import { formatDate } from "./_components/journal/journal-format";
import { JournalHeader } from "./_components/journal/journal-header";
import type {
  EntryErrors,
  EntryFormState,
  JournalEntry,
  SortOrder,
  WorkType,
} from "./_components/journal/journal-types";
import { StatusBanner } from "./_components/journal/status-banner";

export function JournalApp() {
  const formRef = useRef<HTMLFormElement>(null);
  const volumeInputRef = useRef<HTMLInputElement>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [workTypes, setWorkTypes] = useState<WorkType[]>([]);
  const [form, setForm] = useState<EntryFormState>(() => createEmptyForm());
  const [errors, setErrors] = useState<EntryErrors>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sort, setSort] = useState<SortOrder>("desc");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  const query = useMemo(() => {
    const params = new URLSearchParams({ sort });

    if (from) {
      params.set("from", from);
    }

    if (to) {
      params.set("to", to);
    }

    return params.toString();
  }, [from, sort, to]);

  const loadEntries = useCallback(async () => {
    setIsLoading(true);
    setStatus("");

    try {
      const response = await fetch(`/api/journal-entries?${query}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.errors?.form ?? "Не удалось загрузить журнал.");
      }

      setEntries(data.entries);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Ошибка загрузки.");
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const response = await fetch("/api/work-types");
        const data = await response.json();

        if (!response.ok) {
          throw new Error("Не удалось загрузить справочник работ.");
        }

        setWorkTypes(data.workTypes);
        setForm((currentForm) => ({
          ...currentForm,
          workTypeId: currentForm.workTypeId || data.workTypes[0]?.id || "",
        }));
      } catch (error) {
        setStatus(
          error instanceof Error ? error.message : "Ошибка загрузки справочника.",
        );
      }
    }

    loadInitialData();
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadEntries();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadEntries]);

  function resetForm() {
    setForm(createEmptyForm(workTypes[0]?.id ?? ""));
    setErrors({});
    setEditingId(null);
  }

  function resetFilters() {
    setFrom("");
    setTo("");
    setSort("desc");
  }

  function editEntry(entry: JournalEntry) {
    setEditingId(entry.id);
    setErrors({});
    setStatus("");
    setForm({
      performedAt: entry.performedAt.slice(0, 10),
      workTypeId: entry.workTypeId,
      volume: String(entry.volume),
      unit: entry.unit,
      executorName: entry.executorName,
    });

    window.requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      volumeInputRef.current?.focus();
      volumeInputRef.current?.select();
    });
  }

  async function submitEntry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setStatus("");

    const endpoint = editingId
      ? `/api/journal-entries/${editingId}`
      : "/api/journal-entries";

    try {
      const response = await fetch(endpoint, {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        setErrors(data.errors ?? { form: "Проверьте данные формы." });
        return;
      }

      resetForm();
      await loadEntries();
      setStatus(editingId ? "Запись обновлена." : "Запись добавлена.");
    } catch {
      setErrors({ form: "Не удалось сохранить запись." });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function deleteEntry(entry: JournalEntry) {
    const confirmed = window.confirm(
      `Удалить запись от ${formatDate(entry.performedAt)}: ${entry.workType.name}?`,
    );

    if (!confirmed) {
      return;
    }

    setStatus("");

    try {
      const response = await fetch(`/api/journal-entries/${entry.id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.errors?.form ?? "Не удалось удалить запись.");
      }

      if (editingId === entry.id) {
        resetForm();
      }

      await loadEntries();
      setStatus("Запись удалена.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Ошибка удаления.");
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f3ee] text-[#171a17]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <JournalHeader
          entriesCount={entries.length}
          sort={sort}
          workTypesCount={workTypes.length}
        />

        <section className="grid gap-5 lg:grid-cols-[360px_1fr]">
          <EntryForm
            editingId={editingId}
            errors={errors}
            form={form}
            formRef={formRef}
            isSubmitting={isSubmitting}
            onFormChange={setForm}
            onReset={resetForm}
            onSubmit={submitEntry}
            units={units}
            volumeInputRef={volumeInputRef}
            workTypes={workTypes}
          />

          <div className="min-w-0 rounded-md border border-[#d6d0c4] bg-white shadow-sm">
            <EntryFilters
              from={from}
              onFromChange={setFrom}
              onReset={resetFilters}
              onSortChange={setSort}
              onToChange={setTo}
              sort={sort}
              to={to}
            />
            <StatusBanner status={status} />
            <EntriesTable
              editingId={editingId}
              entries={entries}
              isLoading={isLoading}
              onDeleteEntry={deleteEntry}
              onEditEntry={editEntry}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
