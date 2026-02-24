'use client';

import React, { useRef } from 'react';
import { Input } from "@/components/ui/input";

export function OTPInput({ value = '', onChange, length = 6 }) {
  const inputsRef = useRef([]);

  const otpArray = Array.from({ length }, (_, i) => value?.[i] || '');

  const focusAt = (idx) => inputsRef.current[idx]?.focus();

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/\D/, '');
    if (!val) return;

    const newOtp = [...otpArray];
    newOtp[idx] = val[0];

    onChange(newOtp.join(''));

    // Move focus to next input
    if (idx < length - 1) focusAt(idx + 1);
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otpArray];

      if (otpArray[idx]) {
        newOtp[idx] = '';
        onChange(newOtp.join(''));
      } else if (idx > 0) {
        newOtp[idx - 1] = '';
        onChange(newOtp.join(''));
        focusAt(idx - 1);
      }
    }

    // Optional: arrow navigation
    if (e.key === 'ArrowLeft' && idx > 0) focusAt(idx - 1);
    if (e.key === 'ArrowRight' && idx < length - 1) focusAt(idx + 1);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').slice(0, length).split('');
    if (paste.every((ch) => /^\d$/.test(ch))) {
      const newOtp = Array(length).fill('');
      paste.forEach((char, i) => (newOtp[i] = char));
      onChange(newOtp.join(''));
      focusAt(Math.min(paste.length - 1, length - 1));
    }
  };

  const handleFocus = (e) => {
    // select existing content for quick overwrite
    e.target.select?.();
  };

  return (
    <div
      className="flex justify-center gap-2"
      onPaste={handlePaste}
      role="group"
      aria-label="One-time password input"
    >
      {otpArray.map((digit, idx) => (
        <Input
          key={idx}
          ref={(el) => (inputsRef.current[idx] = el)}
          value={digit}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          onFocus={handleFocus}
          aria-label={`Digit ${idx + 1}`}
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          className="h-12 w-10 text-center text-xl tracking-widest"
        />
      ))}
    </div>
  );
}
