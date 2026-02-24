'use client'

import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SpecialInput(props) {
  const { id, label, name, form, multiline, type = "text", disabled } = props;

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
              multiline={multiline ? true : false}
              id={id || name}
              type={type}
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
