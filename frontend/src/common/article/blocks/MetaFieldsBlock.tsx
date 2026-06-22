import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ko } from "date-fns/locale";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker as MuiDateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import type { FieldConfig } from "../config";

const fieldCls =
  "w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white";

interface MetaFieldsBlockProps {
  fields: FieldConfig[];
  metadata: Record<string, any>;
  updateMetadata: (key: string, value: any) => void;
}

export function MetaFieldsBlock({
  fields,
  metadata,
  updateMetadata,
}: Readonly<MetaFieldsBlockProps>) {
  if (!fields || fields.length === 0) return null;

  const renderField = (field: FieldConfig) => {
    const value = metadata?.[field.key] ?? field.defaultValue ?? "";
    const layoutClass =
      field.layout === "full"
        ? "col-span-2"
        : field.layout === "third"
          ? "col-span-1"
          : "";
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

        {field.type === "select" ? (
          <select
            id={fieldId}
            className={fieldCls}
            value={value}
            onChange={(e) => updateMetadata(field.key, e.target.value)}
          >
            <option value="">선택</option>
            {field.options?.map((opt: { label: string; value: string }) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : field.type === "date" ? (
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}>
            <MuiDatePicker
              value={value ? new Date(value) : null}
              onChange={(date) =>
                updateMetadata(
                  field.key,
                  date ? date.toISOString().split("T")[0] : "",
                )
              }
              format="yyyy-MM-dd"
              slotProps={{
                textField: {
                  id: fieldId,
                  size: "small",
                  fullWidth: true,
                  sx: {
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "6px",
                      fontSize: "0.875rem",
                      backgroundColor: "#fff",
                      "& fieldset": { borderColor: "#e2e8f0" },
                    },
                    "& .MuiInputBase-input": { padding: "8px 12px" },
                  },
                },
              }}
            />
          </LocalizationProvider>
        ) : field.type === "datetime" ? (
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}>
            <MuiDateTimePicker
              value={value ? new Date(value) : null}
              onChange={(date) =>
                updateMetadata(field.key, date ? date.toISOString() : "")
              }
              format="yyyy-MM-dd HH:mm"
              ampm={false}
              slotProps={{
                textField: {
                  id: fieldId,
                  size: "small",
                  fullWidth: true,
                  sx: {
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "6px",
                      fontSize: "0.875rem",
                      backgroundColor: "#fff",
                      "& fieldset": { borderColor: "#e2e8f0" },
                    },
                    "& .MuiInputBase-input": { padding: "8px 12px" },
                  },
                },
              }}
            />
          </LocalizationProvider>
        ) : field.type === "textarea" ? (
          <textarea
            id={fieldId}
            className={fieldCls}
            rows={field.rows || 3}
            maxLength={field.maxLength}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => updateMetadata(field.key, e.target.value)}
          />
        ) : (
          <input
            id={fieldId}
            className={fieldCls}
            type="text"
            value={value}
            maxLength={field.maxLength}
            placeholder={field.placeholder}
            onChange={(e) => updateMetadata(field.key, e.target.value)}
          />
        )}

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
