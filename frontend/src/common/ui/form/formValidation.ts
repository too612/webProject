export type FieldErrors<T> = Partial<Record<keyof T, string>>;
export type FieldValidator<T> = (value: T) => string | undefined;
export type FormRules<T> = { readonly [K in keyof T]?: readonly FieldValidator<T[K]>[] };

export function validateForm<T extends object>(values: T, rules: FormRules<T>): FieldErrors<T> {
  const errors: FieldErrors<T> = {};
  for (const key of Object.keys(rules) as (keyof T)[]) {
    for (const validate of rules[key] ?? []) {
      const error = validate(values[key]);
      if (error) {
        errors[key] = error;
        break;
      }
    }
  }
  return errors;
}

export function requiredText(label: string): FieldValidator<string | undefined> {
  return (value) => !value?.trim() ? `${label}을(를) 입력하세요.` : undefined;
}

export function maxTextLength(label: string, max: number): FieldValidator<string | undefined> {
  return (value) => value && Array.from(value.trim()).length > max
    ? `${label}은(는) ${max}자 이내로 입력하세요.` : undefined;
}

export function isIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith("0000")) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function optionalDate(label: string): FieldValidator<string | undefined> {
  return (value) => value && !isIsoDate(value) ? `${label}에 올바른 날짜를 입력하세요.` : undefined;
}

export function focusFirstInvalid(form: HTMLFormElement) {
  form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
}
