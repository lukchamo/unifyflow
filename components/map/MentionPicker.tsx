"use client";

import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { Avatar } from "@/components/ui/Avatar";
import type { Member } from "@/lib/schemas";

export interface MentionPickerProps {
  members: Member[];
  children: React.ReactNode;
  onSelect: (member: Member) => void;
}

export function MentionPicker({ members, children, onSelect }: MentionPickerProps) {
  const [open, setOpen] = React.useState(false);

  function handleSelect(member: Member) {
    onSelect(member);
    setOpen(false);
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>{children}</Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="start"
          sideOffset={8}
          className="z-50 rounded-xl shadow-xl border p-2 flex flex-col gap-0.5 w-56"
          style={{
            backgroundColor: "#FFFFFF",
            borderColor: "#E4EBE7",
          }}
        >
          <Popover.Arrow style={{ fill: "#E4EBE7" }} />
          {members.map((member) => (
            <button
              key={member.id}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-left w-full transition-colors hover:bg-[#F2F6F4] focus:outline-none"
              onClick={() => handleSelect(member)}
            >
              <Avatar name={member.nombre} size="sm" />
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-[#15201C] truncate">
                  {member.nombre}
                </span>
                <span className="text-xs truncate" style={{ color: "#7A807C" }}>
                  {member.area}
                </span>
              </div>
            </button>
          ))}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
