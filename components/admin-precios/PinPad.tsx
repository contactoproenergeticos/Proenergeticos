'use client';

import React, { useCallback, useEffect } from 'react';
import { Delete, Lock } from 'lucide-react';

const MAX_PIN = 4;

type PinPadProps = {
  value: string;
  onChange: (next: string) => void;
  onComplete?: (pin: string) => void;
  disabled?: boolean;
  error?: string | null;
};

export default function PinPad({
  value,
  onChange,
  onComplete,
  disabled = false,
  error = null,
}: PinPadProps) {
  const pushDigit = useCallback(
    (digit: string) => {
      if (disabled || value.length >= MAX_PIN) return;
      const next = value + digit;
      onChange(next);
      if (next.length === MAX_PIN) onComplete?.(next);
    },
    [disabled, onChange, onComplete, value]
  );

  const backspace = useCallback(() => {
    if (disabled) return;
    onChange(value.slice(0, -1));
  }, [disabled, onChange, value]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (disabled) return;
      if (/^\d$/.test(e.key) && value.length < MAX_PIN) {
        e.preventDefault();
        pushDigit(e.key);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        backspace();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [backspace, disabled, pushDigit, value.length]);

  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="flex justify-center gap-3 mb-8">
        {Array.from({ length: MAX_PIN }).map((_, i) => (
          <span
            key={i}
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 transition-all duration-200 ${
              i < value.length
                ? 'bg-[#FF0000] border-[#FF0000] scale-110'
                : 'bg-transparent border-white/30'
            }`}
          />
        ))}
      </div>

      {error ? (
        <p className="text-center text-[#FF0000] text-sm font-bold mb-4" role="alert">
          {error}
        </p>
      ) : null}

      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {digits.map((d) => (
          <button
            key={d}
            type="button"
            disabled={disabled}
            onClick={() => pushDigit(d)}
            className="h-14 sm:h-16 rounded-2xl bg-white/10 hover:bg-[#FF0000] active:scale-95 text-white text-2xl font-black transition-all disabled:opacity-40 border border-white/10"
          >
            {d}
          </button>
        ))}
        <button
          type="button"
          disabled={disabled}
          onClick={backspace}
          className="h-14 sm:h-16 rounded-2xl bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-all disabled:opacity-40 border border-white/10"
          aria-label="Borrar"
        >
          <Delete className="w-6 h-6" />
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => pushDigit('0')}
          className="h-14 sm:h-16 rounded-2xl bg-white/10 hover:bg-[#FF0000] active:scale-95 text-white text-2xl font-black transition-all disabled:opacity-40 border border-white/10"
        >
          0
        </button>
        <button
          type="button"
          disabled={disabled || value.length < MAX_PIN}
          onClick={() => value.length === MAX_PIN && onComplete?.(value)}
          className="h-14 sm:h-16 rounded-2xl bg-[#FF0000] hover:bg-red-700 text-white flex items-center justify-center transition-all disabled:opacity-40 shadow-lg shadow-red-600/30"
          aria-label="Confirmar PIN"
        >
          <Lock className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
