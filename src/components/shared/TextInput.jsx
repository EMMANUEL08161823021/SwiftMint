'use client'

import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function TextInput(props) {
  const { id, label, name, form, type = "text", disabled } = props;

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => {
        const hasError = !!fieldState.error;
        return (
          <div className="w-full">
            {label ? (
              <Label htmlFor={id || name} className="mb-1 block">
                {label}
              </Label>
            ) : null}

            <Input
              id={id || name}
              type={type}
              name={name}
              disabled={disabled}
              aria-invalid={hasError ? "true" : "false"}
              // keep RHF bindings
              {...field}
              // shadcn input styling + error state
              className={`${hasError ? "border-destructive focus-visible:ring-destructive" : ""}`}
            />

            {hasError ? (
              <p className="mt-1 text-xs text-destructive">
                {fieldState.error?.message}
              </p>
            ) : null}
          </div>
        );
      }}
    />
  );
}
