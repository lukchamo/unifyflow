"use client";

import * as React from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  let variantStyle: React.CSSProperties = {};
  let variantClass = "";

  if (variant === "primary") {
    variantStyle = {
      backgroundColor: "var(--accent)",
      color: "#ffffff",
    };
    variantClass =
      "shadow-sm hover:brightness-90 active:brightness-75 focus-visible:outline-[var(--accent)]";
  } else if (variant === "secondary") {
    variantStyle = {
      backgroundColor: "var(--accent-tint)",
      color: "var(--accent-dk)",
    };
    variantClass =
      "hover:brightness-95 active:brightness-90 focus-visible:outline-[var(--accent-dk)]";
  } else {
    // ghost
    variantStyle = { color: "var(--accent-dk)" };
    variantClass =
      "bg-transparent hover:bg-[var(--accent-tint)] active:brightness-90 focus-visible:outline-[var(--accent-dk)]";
  }

  return (
    <button
      className={`${base} ${sizeClasses[size]} ${variantClass} ${className}`}
      style={variantStyle}
      {...props}
    >
      {children}
    </button>
  );
}
