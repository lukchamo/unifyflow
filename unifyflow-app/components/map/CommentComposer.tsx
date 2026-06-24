"use client";

import * as React from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";

export interface CommentComposerProps {
  onSubmit: (text: string) => void;
}

export function CommentComposer({ onSubmit }: CommentComposerProps) {
  const [text, setText] = React.useState("");

  function handleSubmit() {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setText("");
  }

  return (
    <div className="flex gap-2.5 items-start">
      <Avatar
        name="Tú"
        size="sm"
        variant="accent"
      />
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe un comentario…"
          rows={2}
          className="w-full rounded-lg px-3 py-2 text-sm resize-none border focus:outline-none focus:ring-1"
          style={{
            borderColor: "#D1D8D4",
            backgroundColor: "#F7FAF8",
            color: "#15201C",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              handleSubmit();
            }
          }}
        />
        <div className="flex justify-end">
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            Comentar
          </Button>
        </div>
      </div>
    </div>
  );
}
