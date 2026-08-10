"use client";

import * as React from "react";
import { useAppStore } from "@/lib/store/useAppStore";
import { selectProgressText } from "@/lib/store/selectors";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { WhatsAppIcon } from "@/components/whatsapp/WhatsAppIcon";
import { generateTeamLink } from "@/lib/services/auth";
import { buildCapsuleShareUrl } from "@/lib/services/whatsapp";
import { WHATSAPP } from "@/lib/data/content";
import { TeamMemberRow } from "./TeamMemberRow";
import { InviteRow } from "./InviteRow";

export function TeamStep() {
  const org = useAppStore((s) => s.org);
  const team = useAppStore((s) => s.team);
  const inviteMember = useAppStore((s) => s.inviteMember);
  const setStep = useAppStore((s) => s.setStep);
  const progressText = useAppStore(selectProgressText);

  // One cápsula link per visit — generateTeamLink appends a random code, so it
  // must not be recomputed on every render.
  const capsuleLink = React.useMemo(
    () => generateTeamLink(org.nombre),
    [org.nombre]
  );

  return (
    <div
      className="flex flex-col items-center w-full"
      style={{ padding: "64px 24px 64px", minHeight: "100vh" }}
    >
      <div className="w-full" style={{ maxWidth: 560 }}>
        {/* Kicker */}
        <p
          className="font-mono uppercase tracking-widest mb-4"
          style={{ fontSize: "11px", color: "var(--accent-dk)" }}
        >
          Paso 1 · sin configuración
        </p>

        {/* H1 */}
        <h1
          className="font-medium mb-4"
          style={{
            fontFamily: "Newsreader, Georgia, serif",
            fontSize: "36px",
            lineHeight: "1.15",
            color: "#1A1D1B",
          }}
        >
          Empecemos por tu equipo.
        </h1>

        {/* Paragraph */}
        <p
          className="mb-8"
          style={{ fontSize: "15px", lineHeight: "1.6", color: "#4A4E4C" }}
        >
          Invita a las personas que hacen el trabajo. Cada una responde 3–4
          preguntas en menos de 5 minutos, cuando quiera, desde el móvil. El
          mapa se dibuja solo con sus respuestas.
        </p>

        {/* Card */}
        <div
          className="w-full mb-8"
          style={{
            backgroundColor: "#ffffff",
            borderRadius: 16,
            border: "1px solid #E7EAE8",
            overflow: "hidden",
          }}
        >
          <div className="p-6 flex flex-col gap-4">
            {/* Organización read-only field */}
            <div>
              <label
                className="block font-mono uppercase tracking-widest mb-1"
                style={{ fontSize: "10px", color: "#8A908D" }}
              >
                Organización
              </label>
              <div
                className="h-10 px-3 rounded-lg flex items-center text-sm"
                style={{
                  backgroundColor: "#FBFCFB",
                  border: "1px solid #E7EAE8",
                  color: "#1A1D1B",
                }}
              >
                {org.nombre}
              </div>
            </div>

            {/* Sector read-only field */}
            <div>
              <label
                className="block font-mono uppercase tracking-widest mb-1"
                style={{ fontSize: "10px", color: "#8A908D" }}
              >
                Sector
              </label>
              <div
                className="h-10 px-3 rounded-lg flex items-center text-sm"
                style={{
                  backgroundColor: "#FBFCFB",
                  border: "1px solid #E7EAE8",
                  color: "#1A1D1B",
                }}
              >
                {org.sector}
              </div>
            </div>

            {/* Equipo invitado row */}
            <div className="flex items-center justify-between pt-2 pb-1">
              <span
                className="font-mono uppercase tracking-widest"
                style={{ fontSize: "10px", color: "#8A908D" }}
              >
                Equipo invitado
              </span>
              <Pill data-testid="progress-pill">{progressText}</Pill>
            </div>

            {/* Divider */}
            <div style={{ borderTop: "1px solid #E7EAE8" }} />

            {/* Team member rows */}
            <div className="flex flex-col">
              {team.map((member) => (
                <TeamMemberRow
                  key={member.id}
                  member={member}
                  capsuleLink={capsuleLink}
                  company={org.nombre}
                />
              ))}
            </div>

            {/* Invite row */}
            <InviteRow onInvite={inviteMember} />
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-3 mb-6">
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => setStep("mapa")}
          >
            Ver el mapa vivo →
          </Button>

          {/* Distribution lives here, one rung below the flow's own CTA. */}
          <a
            href={buildCapsuleShareUrl({ link: capsuleLink, company: org.nombre })}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="team-whatsapp-share"
            className="inline-flex items-center justify-center gap-2 h-11 px-4 text-sm font-semibold rounded-lg transition-all hover:brightness-95"
            style={{ backgroundColor: "#25D366", color: "#0B2E1C" }}
          >
            <WhatsAppIcon size={17} color="#0B2E1C" />
            {WHATSAPP.share.button}
            <span
              className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-mono leading-none"
              style={{ backgroundColor: "rgba(255,255,255,.65)", color: "#0B2E1C" }}
            >
              {WHATSAPP.badge}
            </span>
          </a>

          <Button
            variant="ghost"
            size="md"
            className="w-full"
            onClick={() => setStep("entrevista")}
          >
            Previsualizar la entrevista
          </Button>
        </div>

        {/* Footnote */}
        <p
          className="text-center"
          style={{ fontSize: "12px", color: "#A8AEAA", lineHeight: "1.6" }}
        >
          Nadie configura nada. Tu equipo solo recibe un enlace y responde.
          Antes de empezar, cada persona ve exactamente qué se guarda y quién lo
          verá.
        </p>
      </div>
    </div>
  );
}
