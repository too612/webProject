import { useId } from "react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "./select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

export interface CodeOption {
  readonly code: string;
  readonly name: string;
}

export interface CodeSelectProps {
  readonly id?: string;
  readonly value: string;
  readonly options: readonly CodeOption[];
  readonly onChange: (value: string) => void;
  readonly placeholder: string;
  readonly allLabel?: string;
  readonly allowEmpty?: boolean;
  readonly disabled?: boolean;
  readonly "aria-invalid"?: boolean;
  readonly "aria-required"?: boolean;
  readonly "aria-describedby"?: string;
}

export function CodeSelect({
  id, value, options, onChange, placeholder,
  allLabel = `${placeholder} 전체`,
  allowEmpty = true,
  disabled = false,
  ...accessibility
}: CodeSelectProps) {
  const emptyValue = useId();
  const selectedName = options.find((option) => option.code === value)?.name ?? (value || allLabel);

  return (
    <Select value={value || (allowEmpty ? emptyValue : "")} disabled={disabled}
      onValueChange={(next) => onChange(next === emptyValue ? "" : next)}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <SelectTrigger id={id} title={selectedName} className="w-full min-w-0"
              aria-label={id ? undefined : placeholder} {...accessibility}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
          </TooltipTrigger>
          <TooltipContent>{selectedName}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <SelectContent>
        {allowEmpty && <SelectItem value={emptyValue}>{allLabel}</SelectItem>}
        {options.map((option) => <SelectItem key={option.code} value={option.code}>{option.name}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}
