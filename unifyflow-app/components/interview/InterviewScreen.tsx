"use client";

import * as React from "react";
import { useRef, useEffect } from "react";
import { ProgressSegments } from "@/components/ui/ProgressSegments";
import { AgentBubble } from "./AgentBubble";
import { UserBubble } from "./UserBubble";
import { TypingIndicator } from "./TypingIndicator";
import { Composer } from "./Composer";
import type { AnswerEntry } from "./useInterview";
import type { Question } from "@/lib/data/questions";

export interface InterviewScreenProps {
  currentIndex: number;
  questions: Question[];
  answers: AnswerEntry[];
  isTyping: boolean;
  onSubmitAnswer: (text: string) => void;
}

/**
 * InterviewScreen — shows the conversation area with progress, bubbles,
 * typing indicator, and composer input.
 */
export function InterviewScreen({
  currentIndex,
  questions,
  answers,
  isTyping,
  onSubmitAnswer,
}: InterviewScreenProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [answers, isTyping, currentIndex]);

  const totalQuestions = questions.length;

  return (
    <div className="flex flex-col h-full max-w-lg mx-auto w-full">
      {/* Header */}
      <div
        className="flex items-center gap-2 px-5 py-3 border-b flex-shrink-0"
        style={{ borderColor: "#E2E6E4" }}
      >
        {/* Rombo / diamond logo */}
        <div
          className="w-5 h-5 flex-shrink-0"
          style={{
            backgroundColor: "var(--accent)",
            transform: "rotate(45deg)",
            borderRadius: "3px",
          }}
          aria-hidden="true"
        />
        <span className="text-sm font-semibold" style={{ color: "#1C201E" }}>
          UnifyFlow
        </span>
        <span className="text-sm" style={{ color: "#6B7B75" }}>
          · Distribuciones Robledo
        </span>
      </div>

      {/* Progress area */}
      <div className="px-5 py-3 flex-shrink-0 flex flex-col gap-2">
        <p
          className="text-xs font-mono"
          style={{ color: "#6B7B75", fontFamily: "var(--font-mono), monospace" }}
        >
          Pregunta {currentIndex + 1} de {totalQuestions}
        </p>
        <ProgressSegments total={totalQuestions} active={currentIndex + 1} />
      </div>

      {/* Conversation area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 py-3 flex flex-col gap-3"
      >
        {/* Greeting bubble */}
        <AgentBubble text="Hola, Andrés. Empecemos." />

        {/* Render past Q&A pairs */}
        {answers.map((entry, idx) => (
          <React.Fragment key={idx}>
            <AgentBubble text={questions[idx]?.text ?? entry.pregunta} />
            <UserBubble text={entry.respuesta} />
          </React.Fragment>
        ))}

        {/* Current question (only if we haven't answered all yet) */}
        {currentIndex < totalQuestions && !isTyping && answers.length <= currentIndex && (
          <AgentBubble text={questions[currentIndex]?.text ?? ""} />
        )}

        {/* Typing indicator */}
        {isTyping && <TypingIndicator />}
      </div>

      {/* Composer */}
      <div className="flex-shrink-0">
        <Composer onSubmit={onSubmitAnswer} disabled={isTyping} />
        <p
          className="text-xs text-center pb-3 px-5"
          style={{ color: "#8A9C95" }}
        >
          Responde con tus palabras. La IA repreguntará si algo queda ambiguo.
        </p>
      </div>
    </div>
  );
}
