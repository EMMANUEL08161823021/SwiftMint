'use client';

import { Controller, useWatch } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export function FileUpload(props) {
  const {
    id,
    label,
    name,
    form,
    disabled,
    accept = 'image/*',
    previewUrl,
    buttonText = 'Upload profile pic',
    buttonTextWhenPreview = 'Change profile pic',
    onFileChange,
  } = props;

  const inputRef = useRef(null);
  const [localPreview, setLocalPreview] = useState(null);

  const watchedValue = useWatch({ control: form.control, name });

  const fileValue = watchedValue instanceof File ? watchedValue : null;
  const stringValue = typeof watchedValue === 'string' ? watchedValue : null;

  useEffect(() => {
    if (!fileValue) {
      setLocalPreview(null);
      return;
    }

    const url = URL.createObjectURL(fileValue);
    setLocalPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [fileValue]);

  // IMPORTANT: prefer form value (string) first, then previewUrl prop
  const finalPreview = localPreview || stringValue || previewUrl || null;

  const finalButtonText = finalPreview ? buttonTextWhenPreview : buttonText;

  const openPicker = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => {
        const hasError = !!fieldState.error;

        const handlePick = (e) => {
          const file = e.target.files?.[0] || null;
          field.onChange(file);

          if (onFileChange) onFileChange(file);
          e.target.value = '';
        };

        return (
          <div className="w-full flex gap-3 items-end">
            {label ? (
              <Label htmlFor={id || name} className="mb-1 block">
                {label}
              </Label>
            ) : null}

            {finalPreview ? (
              <div className="">
                <img
                  src={finalPreview}
                  alt="Preview"
                  className="h-24 w-24 rounded-xl object-cover border"
                />
              </div>
            ) : null}

            <input
              ref={inputRef}
              id={id || name}
              name={name}
              type="file"
              accept={accept}
              disabled={disabled}
              onBlur={field.onBlur}
              onChange={handlePick}
              className="hidden"
              aria-invalid={hasError ? 'true' : 'false'}
            />

            <Button
              type="button"
              variant="outline"
              className={`gap-2 ${
                hasError
                  ? 'border-destructive focus-visible:ring-destructive'
                  : ''
              }`}
              disabled={disabled}
              onClick={openPicker}
            >
              <Upload className="h-4 w-4" />
              {finalButtonText}
            </Button>

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
