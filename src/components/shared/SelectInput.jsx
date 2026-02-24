'use client';

import { Controller } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function SelectInput(props) {
  const {
    id,
    name,
    form,
    label,
    options = [],
    defaultValue = "",
    fullWidth = true,
  } = props;

  return (
    <Controller
      name={name}
      control={form.control}
      defaultValue={defaultValue}
      render={({ field, fieldState }) => {
        const hasError = !!fieldState.error;

        return (
          <div className={`${fullWidth ? "w-full" : ""}`}>
            {label ? (
              <Label htmlFor={id} className="mb-1 block">
                {label}
              </Label>
            ) : null}

            <Select
              onValueChange={field.onChange}
              value={field.value}
            >
              <SelectTrigger
                id={id}
                className={`${hasError ? "border-destructive py-4 focus:ring-destructive" : "py-3"}`}
              >
                <SelectValue placeholder={`Select ${label || ""}`} />
              </SelectTrigger>

              <SelectContent>
                {options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasError && (
              <p className="mt-1 text-xs text-destructive">
                {fieldState.error.message}
              </p>
            )}
          </div>
        );
      }}
    />
  );
}
