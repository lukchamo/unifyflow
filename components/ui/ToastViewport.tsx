"use client";

import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ToastData {
  id: string;
  title: string;
  description?: string;
  duration?: number;
}

// ── Context / hook ─────────────────────────────────────────────────────────────

interface ToastContextValue {
  showToast: (opts: Omit<ToastData, "id">) => void;
}

const ToastContext = React.createContext<ToastContextValue>({
  showToast: () => {},
});

export function useToast(): ToastContextValue {
  return React.useContext(ToastContext);
}

// ── Provider (root) ──────────────────────────────────────────────────────────

export function ToastViewport({ children }: { children?: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastData[]>([]);

  const showToast = React.useCallback(
    (opts: Omit<ToastData, "id">) => {
      const id = `toast-${Date.now()}`;
      setToasts((prev) => [...prev, { ...opts, id }]);
    },
    []
  );

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      <ToastPrimitive.Provider swipeDirection="right">
        {children}

        {toasts.map((toast) => (
          <ToastPrimitive.Root
            key={toast.id}
            duration={toast.duration ?? 4000}
            onOpenChange={(open) => {
              if (!open) dismiss(toast.id);
            }}
            className="flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg"
            style={{
              backgroundColor: "#15201C",
              color: "#FBFCFB",
              animation: "uf-rise 200ms ease-out",
              maxWidth: "360px",
            }}
          >
            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
              <ToastPrimitive.Title className="text-sm font-medium leading-snug">
                {toast.title}
              </ToastPrimitive.Title>
              {toast.description && (
                <ToastPrimitive.Description className="text-xs opacity-70 leading-snug">
                  {toast.description}
                </ToastPrimitive.Description>
              )}
            </div>
            <ToastPrimitive.Close
              className="text-xs opacity-50 hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5"
              aria-label="Cerrar"
            >
              ✕
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        ))}

        <ToastPrimitive.Viewport
          className="fixed bottom-4 right-4 flex flex-col gap-2 z-[9999] outline-none"
          style={{ maxWidth: "360px" }}
        />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}
