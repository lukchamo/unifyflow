"use client";

import * as React from "react";

export interface UserBubbleProps {
  text: string;
}

/**
 * UserBubble — chat bubble for user answers.
 * Right-aligned, dark background.
 */
export function UserBubble({ text }: UserBubbleProps) {
  return (
    <div className="flex justify-end w-full">
      <div
        className="px-4 py-3 text-sm leading-relaxed max-w-[85%]"
        style={{
          backgroundColor: "#15201C",
          color: "#F2F4F3",
          borderRadius: "16px 16px 5px 16px",
        }}
      >
        {text}
      </div>
    </div>
  );
}
