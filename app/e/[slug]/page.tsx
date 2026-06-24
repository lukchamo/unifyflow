"use client";

/**
 * app/e/[slug]/page.tsx — Interviewee micro-interview page.
 *
 * Route: /e/[slug]
 * The [slug] param is the invitation token — decorative in this demo,
 * rendered as part of the page identity but not validated.
 *
 * Mobile-first full-screen layout. On desktop the content column is
 * constrained to max-w-lg and centered.
 */

import { use } from "react";
import { InterviewPage } from "@/components/interview/InterviewPage";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function IntervieweePage({ params }: PageProps) {
  const { slug } = use(params);
  return <InterviewPage slug={slug} />;
}
