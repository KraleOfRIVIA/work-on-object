import type { FormEvent, Ref } from "react";

import { Field } from "./field";
import type { EntryErrors, EntryFormState, WorkType } from "./journal-types";

type EntryFormProps = {
  editingId: string | null;
  errors: EntryErrors;
  form: EntryFormState;
  formRef: Ref<HTMLFormElement>;
  isSubmitting: boolean;
  onFormChange: (form: EntryFormState) => void;
  onReset: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  units: string[];
  volumeInputRef: Ref<HTMLInputElement>;
  workTypes: WorkType[];
};

export function EntryForm({
  editingId,
  errors,
  form,
  formRef,
  isSubmitting,
  onFormChange,
  onReset,
  onSubmit,
  units,
  volumeInputRef,
  workTypes,
}: EntryFormProps) {
  function updateForm(nextForm: Partial<EntryFormState>) {
    onFormChange({ ...form, ...nextForm });
  }

  return (
    <form
      className="h-fit rounded-md border border-[#d6d0c4] bg-white p-4 shadow-sm lg:sticky lg:top-5"
      onSubmit={onSubmit}
      ref={formRef}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">
          {editingId ? "Редактирование" : "Новая запись"}
        </h2>
        {editingId ? (
          <button className="secondary-button" type="button" onClick={onReset}>
            Отмена
          </button>
        ) : null}
      </div>

      {errors.form ? <p className="form-error mb-3">{errors.form}</p> : null}

      <Field label="Дата выполнения" error={errors.performedAt}>
        <input
          className="field-input"
          type="date"
          value={form.performedAt}
          onChange={(event) => updateForm({ performedAt: event.target.value })}
        />
      </Field>

      <Field label="Вид работ" error={errors.workTypeId}>
        <select
          className="field-input"
          value={form.workTypeId}
          onChange={(event) => updateForm({ workTypeId: event.target.value })}
        >
          {workTypes.map((workType) => (
            <option key={workType.id} value={workType.id}>
              {workType.name}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid grid-cols-[1fr_112px] gap-3">
        <Field label="Объём" error={errors.volume}>
          <input
            className="field-input"
            inputMode="decimal"
            placeholder="24"
            ref={volumeInputRef}
            value={form.volume}
            onChange={(event) => updateForm({ volume: event.target.value })}
          />
        </Field>
        <Field label="Ед." error={errors.unit}>
          <select
            className="field-input"
            value={form.unit}
            onChange={(event) => updateForm({ unit: event.target.value })}
          >
            {units.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="ФИО исполнителя" error={errors.executorName}>
        <input
          className="field-input"
          placeholder="Иванов И.И."
          value={form.executorName}
          onChange={(event) => updateForm({ executorName: event.target.value })}
        />
      </Field>

      <button className="primary-button mt-2 w-full" disabled={isSubmitting}>
        {isSubmitting
          ? "Сохранение..."
          : editingId
            ? "Сохранить изменения"
            : "Добавить запись"}
      </button>
    </form>
  );
}
