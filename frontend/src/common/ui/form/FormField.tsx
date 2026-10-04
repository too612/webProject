import { useId, type ReactNode } from "react";
import { Label } from "../label";

export interface FormControlProps {
  readonly id: string;
  readonly "aria-invalid": boolean;
  readonly "aria-required": boolean;
  readonly "aria-describedby"?: string;
}

export interface FormFieldProps {
  readonly label: string;
  readonly required?: boolean;
  readonly error?: string;
  readonly children: (props: FormControlProps) => ReactNode;
}

export function FormField({ label, required = false, error, children }: FormFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className="min-w-0 space-y-2">
      <div className="flex items-center gap-1">
        <Label htmlFor={id}>{label}</Label>
        {required && <span aria-hidden="true" className="text-red-600">*</span>}
      </div>
      {children({ id, "aria-invalid": Boolean(error), "aria-required": required, "aria-describedby": error ? errorId : undefined })}
      {error && <p id={errorId} className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
