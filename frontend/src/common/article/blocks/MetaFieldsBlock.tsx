import type { FieldConfig } from "../config";

const fieldCls =
  "w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white";

interface MetaFieldsBlockProps {
  fields: FieldConfig[];
  metadata: Record<string, any>;
  updateMetadata: (key: string, value: any) => void;
}

function getLayoutClass(layout: FieldConfig["layout"]): string {
  if (layout === "full") return "col-span-2";
  if (layout === "third") return "col-span-1";
  return "";
}

function formatDateValue(value: unknown): string {
  if (value == null || value === "") return "";
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string" || typeof value === "number") {
    return String(value).slice(0, 10);
  }
  return "";
}

function formatDateTimeValue(value: unknown): string {
  if (value == null || value === "") return "";
  if (value instanceof Date) {
    return value.toISOString().slice(0, 16).replace("T", " ");
  }
  if (typeof value === "string" || typeof value === "number") {
    return String(value).slice(0, 16).replace(" ", "T");
  }
  return "";
}

function FieldInput({
  field,
  value,
  fieldId,
  onChange,
}: Readonly<{
  field: FieldConfig;
  value: unknown;
  fieldId: string;
  onChange: (value: string) => void;
}>) {
  if (field.type === "select") {
    return (
      <select
        id={fieldId}
        className={fieldCls}
        value={value as string}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">선택</option>
        {field.options?.map((opt: { label: string; value: string }) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "date") {
    return (
      <input
        id={fieldId}
        type="date"
        className={fieldCls}
        value={formatDateValue(value)}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  if (field.type === "datetime") {
    return (
      <input
        id={fieldId}
        type="datetime-local"
        className={fieldCls}
        value={formatDateTimeValue(value)}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  if (field.type === "textarea") {
    return (
      <textarea
        id={fieldId}
        className={fieldCls}
        rows={field.rows || 3}
        maxLength={field.maxLength}
        placeholder={field.placeholder}
        value={value as string}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  return (
    <input
      id={fieldId}
      className={fieldCls}
      type="text"
      value={value as string}
      maxLength={field.maxLength}
      placeholder={field.placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function MetaFieldsBlock({
  fields,
  metadata,
  updateMetadata,
}: Readonly<MetaFieldsBlockProps>) {
  if (!fields || fields.length === 0) return null;

  const renderField = (field: FieldConfig) => {
    const value = metadata?.[field.key] ?? field.defaultValue ?? "";
    const layoutClass = getLayoutClass(field.layout);
    const fieldId = `field-${field.key}`;

    if (field.hidden) return null;

    return (
      <div key={field.key} className={layoutClass}>
        <label
          htmlFor={fieldId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>

        <FieldInput
          field={field}
          value={value}
          fieldId={fieldId}
          onChange={(nextValue) => updateMetadata(field.key, nextValue)}
        />

        {field.description && (
          <p className="mt-1 text-xs text-gray-400">{field.description}</p>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {fields.map(renderField)}
    </div>
  );
}
