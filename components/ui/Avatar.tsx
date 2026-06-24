"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

export interface AvatarProps {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  variant?: "tint" | "accent";
  className?: string;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const sizeClasses = {
  sm: "w-7 h-7 text-xs",
  md: "w-9 h-9 text-sm",
  lg: "w-11 h-11 text-base",
};

export function Avatar({
  name,
  src,
  size = "md",
  variant = "tint",
  className = "",
}: AvatarProps) {
  const initials = getInitials(name);
  const isTint = variant === "tint";

  const fallbackStyle: React.CSSProperties = isTint
    ? { backgroundColor: "var(--accent-tint)", color: "var(--accent-dk)" }
    : { backgroundColor: "var(--accent)", color: "#ffffff" };

  return (
    <AvatarPrimitive.Root
      className={`inline-flex items-center justify-center rounded-full overflow-hidden font-medium select-none ${sizeClasses[size]} ${className}`}
      style={fallbackStyle}
    >
      {src && (
        <AvatarPrimitive.Image
          src={src}
          alt={name}
          className="w-full h-full object-cover"
        />
      )}
      <AvatarPrimitive.Fallback
        className="w-full h-full flex items-center justify-center font-mono font-medium"
        asChild
      >
        <span>{initials}</span>
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}
