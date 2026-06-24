"use client";

import * as React from "react";

export interface FieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id?: string;
  error?: string;
}

export const Field = React.forwardRef<HTMLInputElement, FieldProps>(
  ({ label, id, error, className = "", ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5 w-full">
        <label
          htmlFor={inputId}
          className="text-[10px] font-mono font-medium uppercase tracking-widest"
          style={{ color: "#8A908D" }}
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={`w-full h-10 px-3 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 bg-white ${className}`}
          style={
            {
              borderColor: error ? "#E05A5A" : "#D1D5D3",
              "--tw-ring-color": "var(--accent)",
            } as React.CSSProperties
          }
          aria-invalid={error ? true : undefined}
          {...props}
        />
        {error && (
          <p className="text-[11px] text-[#E05A5A] font-mono">{error}</p>
        )}
      </div>
    );
  }
);

Field.displayName = "Field";
