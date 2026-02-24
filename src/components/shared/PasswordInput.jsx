'use client';

import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';

export function PasswordInput(props) {
  const {
    id,
    label = 'Password',
    name = 'password',
    form,
    disabled,
  } = props;

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);

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

            <div className="relative">
              <Input
                id={id || name}
                type={showPassword ? 'text' : 'password'}
                disabled={disabled}
                aria-invalid={hasError ? 'true' : 'false'}
                {...field}
                className={`${hasError ? 'border-destructive focus-visible:ring-destructive' : ''} pr-10`}
              />

              <button
                type="button"
                onClick={togglePassword}
                className="absolute inset-y-0 right-2 grid place-items-center px-1 text-muted-foreground"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1} /* don’t steal tab focus */
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

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
