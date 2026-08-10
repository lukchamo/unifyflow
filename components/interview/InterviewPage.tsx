"use client";

import * as React from "react";
import { useInterview } from "./useInterview";
import { WelcomeScreen } from "./WelcomeScreen";
import { InterviewScreen } from "./InterviewScreen";
import { ThanksScreen } from "./ThanksScreen";

export interface InterviewPageProps {
  /** The [slug] route param — identifies the cápsula in the WhatsApp hand-off. */
  slug: string;
}

/**
 * InterviewPage — mobile-first full-screen interview flow.
 * Switches between WelcomeScreen / InterviewScreen / ThanksScreen
 * based on the useInterview state machine phase.
 *
 * On desktop the content is centered in a max-width column.
 */
export function InterviewPage({ slug }: InterviewPageProps) {
  const { phase, currentIndex, answers, isTyping, questions, start, submitAnswer } =
    useInterview();

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#FBFCFB" }}
    >
      {/* Center column for desktop */}
      <div className="w-full max-w-lg mx-auto flex-1 flex flex-col">
        {phase === "welcome" && <WelcomeScreen onStart={start} slug={slug} />}
        {phase === "question" && (
          <InterviewScreen
            currentIndex={currentIndex}
            questions={questions}
            answers={answers}
            isTyping={isTyping}
            onSubmitAnswer={submitAnswer}
          />
        )}
        {phase === "thanks" && <ThanksScreen />}
      </div>
    </div>
  );
}
