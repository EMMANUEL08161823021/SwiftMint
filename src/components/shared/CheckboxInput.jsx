'use client';

import { Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function CheckboxInput(props) {
  const { name, form, label, rules = {}, defaultValue = false, id } = props;

  return (
    <div className="flex flex-col">
      <Controller
        name={name}
        control={form.control}
        defaultValue={defaultValue}
        rules={rules}
        render={({ field, fieldState }) => {
          const hasError = !!fieldState.error;

          return (
            <>
              <div className="flex items-center gap-2">
                <Checkbox
                  id={id || name}
                  checked={!!field.value}
                  onCheckedChange={(val) => field.onChange(!!val)}
                  onBlur={field.onBlur}
                  ref={field.ref}
                />
                <Label htmlFor={id || name} className="text-sm">
                  {label}
                </Label>
              </div>

              {hasError && (
                <p className="mt-1 text-xs text-destructive">
                  {fieldState.error.message}
                </p>
              )}
            </>
          );
        }}
      />
    </div>
  );
}
