"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastViewport";
import { generateTeamLink } from "@/lib/services/auth";
import { MODAL_COPY } from "@/lib/data/content";

// ── Schema ────────────────────────────────────────────────────────────────────

const schema = z.object({
  company: z.string().min(1),
  email: z.string().email(),
});

type FormValues = z.infer<typeof schema>;

// ── StartStep ─────────────────────────────────────────────────────────────────

interface StartStepProps {
  onSubmit: (company: string) => void;
}

function StartStep({ onSubmit }: StartStepProps) {
  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onValid = (data: FormValues) => {
    onSubmit(data.company);
  };

  return (
    <form onSubmit={handleSubmit(onValid)} className="flex flex-col gap-5">
      <div>
        <h3
          className="font-[family-name:var(--font-newsreader)] text-xl text-foreground mb-2"
        >
          {MODAL_COPY.start.h3}
        </h3>
        <p className="text-sm text-foreground/60 leading-relaxed">
          {MODAL_COPY.start.paragraph}
        </p>
      </div>

      <Field
        label={MODAL_COPY.start.fieldCompany.label}
        placeholder={MODAL_COPY.start.fieldCompany.placeholder}
        error={errors.company?.message}
        autoComplete="organization"
        {...register("company")}
      />

      <Field
        label={MODAL_COPY.start.fieldEmail.label}
        placeholder={MODAL_COPY.start.fieldEmail.placeholder}
        type="email"
        error={errors.email?.message}
        autoComplete="email"
        {...register("email")}
      />

      <Button
        type="submit"
        disabled={!isValid}
        size="lg"
        className="w-full rounded-full"
      >
        {MODAL_COPY.start.button}
      </Button>

      <p className="text-center text-xs text-foreground/40">
        {MODAL_COPY.start.micro}
      </p>
    </form>
  );
}

// ── LinkStep ──────────────────────────────────────────────────────────────────

interface LinkStepProps {
  genLink: string;
  onClose: () => void;
}

function LinkStep({ genLink, onClose }: LinkStepProps) {
  const { showToast } = useToast();
  const router = useRouter();

  const fullLink = `https://${genLink}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullLink);
    } catch {
      // Fallback: create a temporary textarea for environments without clipboard API
      const textarea = document.createElement("textarea");
      textarea.value = fullLink;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    showToast({ title: "Enlace copiado" });
  };

  const mailtoHref = `mailto:?subject=${encodeURIComponent(
    MODAL_COPY.mailtoSubject
  )}&body=${encodeURIComponent(
    MODAL_COPY.mailtoBody.replace("{link}", genLink)
  )}`;

  const handleDone = () => {
    onClose();
  };

  const handleGoToPanel = () => {
    onClose();
    router.push("/app");
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3
          className="font-[family-name:var(--font-newsreader)] text-xl text-foreground mb-2"
        >
          {MODAL_COPY.link.h3}
        </h3>
        <p className="text-sm text-foreground/60 leading-relaxed">
          {MODAL_COPY.link.paragraph}
        </p>
      </div>

      {/* Generated link display */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="generated-link"
          className="text-[10px] font-mono font-medium uppercase tracking-widest"
          style={{ color: "#8A908D" }}
        >
          Enlace
        </label>
        <input
          id="generated-link"
          readOnly
          value={genLink}
          className="w-full h-10 px-3 rounded-lg border text-sm font-mono bg-[var(--accent-tint)] select-all"
          style={{ borderColor: "#D1D5D3", color: "var(--accent-dk)" }}
          onClick={(e) => (e.target as HTMLInputElement).select()}
          aria-label="Enlace generado"
        />
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          type="button"
          variant="primary"
          size="md"
          className="flex-1 rounded-full"
          onClick={handleCopy}
        >
          {MODAL_COPY.link.copyButton}
        </Button>

        <a
          href={mailtoHref}
          className="flex-1 inline-flex items-center justify-center h-10 px-4 text-sm font-medium rounded-full border transition-colors"
          style={{ borderColor: "var(--accent)", color: "var(--accent-dk)" }}
        >
          {MODAL_COPY.link.emailButton}
        </a>
      </div>

      <Button
        type="button"
        variant="secondary"
        size="md"
        className="w-full rounded-full"
        onClick={handleDone}
      >
        {MODAL_COPY.link.doneButton}
      </Button>

      {/* Go to panel subtle link */}
      <button
        type="button"
        onClick={handleGoToPanel}
        className="text-center text-xs font-medium transition-colors"
        style={{ color: "var(--accent)" }}
      >
        Ir al panel →
      </button>

      <p className="text-center text-xs text-foreground/40">
        {MODAL_COPY.link.micro}
      </p>
    </div>
  );
}

// ── QuickStartModal ───────────────────────────────────────────────────────────

export interface QuickStartModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function QuickStartModal({
  open,
  onOpenChange,
}: QuickStartModalProps) {
  const [step, setStep] = React.useState<"start" | "link">("start");
  const [genLink, setGenLink] = React.useState<string>("");

  // Reset to start step when modal closes
  React.useEffect(() => {
    if (!open) {
      setStep("start");
      setGenLink("");
    }
  }, [open]);

  const handleStart = (company: string) => {
    const link = generateTeamLink(company);
    setGenLink(link);
    setStep("link");
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        />

        {/* Content */}
        <Dialog.Content
          className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[452px] rounded-2xl bg-background p-6 shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 mx-4"
          style={{ maxWidth: "min(452px, calc(100vw - 2rem))" }}
          aria-describedby={undefined}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            {/* Accent icon */}
            <div className="flex items-center gap-2">
              {step === "start" ? (
                <span
                  className="block h-4 w-4 rotate-45 rounded-sm"
                  style={{ backgroundColor: "var(--accent)" }}
                  aria-hidden
                />
              ) : (
                <span
                  className="h-5 w-5 rounded-full text-white text-xs flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "var(--accent)" }}
                  aria-hidden
                >
                  ✓
                </span>
              )}
              <Dialog.Title className="sr-only">
                Crea el espejo de tu empresa
              </Dialog.Title>
            </div>

            {/* Close button */}
            <Dialog.Close asChild>
              <button
                className="rounded-full h-8 w-8 flex items-center justify-center text-foreground/40 hover:text-foreground hover:bg-black/5 transition-colors text-sm"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </Dialog.Close>
          </div>

          {/* Body */}
          {step === "start" ? (
            <StartStep onSubmit={handleStart} />
          ) : (
            <LinkStep genLink={genLink} onClose={handleClose} />
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
