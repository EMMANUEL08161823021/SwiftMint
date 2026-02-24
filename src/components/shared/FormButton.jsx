'use client';

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react"; 
import React from "react";

export function FormButton({
  children,
  loading = false,
  disabled = false,
  fullWidth = true,
  size = "default",
  type = "button",
  ...rest
}) {
  const isDisabled = disabled || loading;

  return (
    <Button
      type={type}
      size={size}
      disabled={isDisabled}
      className={`
        font-semibold
        ${fullWidth ? "w-full" : ""}
        relative
        flex items-center justify-center
        ${isDisabled ? "opacity-75" : ""}
      `}
      {...rest}
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        children
      )}
    </Button>
  );
}
