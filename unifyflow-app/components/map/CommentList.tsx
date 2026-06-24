"use client";

import * as React from "react";
import { Avatar } from "@/components/ui/Avatar";
import type { Comment } from "@/lib/data/mockData";

export interface CommentListProps {
  comments: Comment[];
}

export function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) return null;

  return (
    <ul className="flex flex-col gap-3">
      {comments.map((c) => (
        <li key={c.id} className="flex gap-2.5 items-start">
          <Avatar name={c.author} size="sm" />
          <div className="flex flex-col gap-0.5 min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-medium leading-snug text-[#15201C]">
                {c.author}
              </span>
              <span
                className="text-xs font-mono shrink-0"
                style={{ color: "#7A807C" }}
              >
                {c.time}
              </span>
            </div>
            <p className="text-sm leading-snug" style={{ color: "#3B4840" }}>
              {c.text}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
