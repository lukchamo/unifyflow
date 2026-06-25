"use client";

/**
 * useInterview.ts — State machine hook for the micro-interview flow.
 *
 * Phases: 'welcome' → 'question' → 'thanks'
 *
 * Timer strategy: the typing delay between questions uses setTimeout.
 * In tests, use vi.useFakeTimers() + act(() => vi.runAllTimers()) to advance
 * through the delay synchronously.
 *
 * To make tests zero-delay: the hook reads INTERVIEW_TYPING_DELAY from
 * process.env at module evaluation time; in the test environment Vitest sets
 * NODE_ENV=test, so we default to 0ms when NODE_ENV === 'test'.
 */

import { useState, useCallback } from "react";
import { getQuestions } from "@/lib/data/questions";
import { useAppStore } from "@/lib/store/useAppStore";
import { useAuth } from "@/components/auth/AuthProvider";
import type { Answer } from "@/lib/schemas";

// ── Member constants for Andrés Pérez (m4) ────────────────────────────────────
export const MEMBER_ID = "m4";
export const MEMBER_NOMBRE = "Andrés Pérez";
export const MEMBER_CARGO = "Responsable de almacén";
export const MEMBER_AREA = "Operaciones";

const TYPING_DELAY =
  typeof process !== "undefined" && process.env.NODE_ENV === "test" ? 0 : 800;

// ── Types ─────────────────────────────────────────────────────────────────────

export type Phase = "welcome" | "question" | "thanks";

export interface AnswerEntry {
  pregunta: string;
  respuesta: string;
}

export interface UseInterviewReturn {
  phase: Phase;
  currentIndex: number;
  answers: AnswerEntry[];
  isTyping: boolean;
  questions: ReturnType<typeof getQuestions>;
  start: () => void;
  submitAnswer: (text: string) => void;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useInterview(): UseInterviewReturn {
  const submitInterview = useAppStore((s) => s.submitInterview);
  const team = useAppStore((s) => s.team);
  const { mode, memberId: authMemberId } = useAuth();

  // In firebase mode the interview is submitted by the signed-in member (so it
  // satisfies the per-member Firestore security rule). In mock mode (and tests)
  // it stays the fixed demo member m4.
  const memberId =
    mode === "firebase" && authMemberId ? authMemberId : MEMBER_ID;

  // Resolve member from store; fall back to constants if not found
  const member = team.find((m) => m.id === memberId) ?? {
    id: memberId,
    nombre: MEMBER_NOMBRE,
    cargo: MEMBER_CARGO,
    area: MEMBER_AREA,
  };

  const questions = getQuestions({
    nombre: member.nombre,
    cargo: member.cargo,
    area: member.area,
  });

  const [phase, setPhase] = useState<Phase>("welcome");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerEntry[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const start = useCallback(() => {
    setPhase("question");
    setCurrentIndex(0);
    setAnswers([]);
  }, []);

  const submitAnswer = useCallback(
    (text: string) => {
      const currentQuestion = questions[currentIndex];
      if (!currentQuestion) return;

      const newEntry: AnswerEntry = {
        pregunta: currentQuestion.text,
        respuesta: text,
      };

      const newAnswers = [...answers, newEntry];
      setAnswers(newAnswers);

      const isLast = currentIndex >= questions.length - 1;

      if (isLast) {
        // All questions answered — build Answer[] and call store
        const storeAnswers: Answer[] = newAnswers.map((a, i) => ({
          id: `a-${member.id}-${i + 1}-${Date.now()}`,
          interviewId: `i-${member.id}-interview`,
          pregunta: a.pregunta,
          respuesta: a.respuesta,
          modalidad: "texto" as const,
        }));
        submitInterview(member.id, storeAnswers);
        setPhase("thanks");
      } else {
        // Show typing indicator briefly, then advance to next question
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setCurrentIndex((idx) => idx + 1);
        }, TYPING_DELAY);
      }
    },
    [answers, currentIndex, questions, submitInterview, member.id]
  );

  return {
    phase,
    currentIndex,
    answers,
    isTyping,
    questions,
    start,
    submitAnswer,
  };
}
