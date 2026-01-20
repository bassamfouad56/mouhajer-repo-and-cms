"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  Loader2,
  CheckCircle2,
  Palette,
  Share2,
  Phone,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { quizQuestions, calculateStyle, type DesignStyle } from "./quiz-data";

type QuizStep = "intro" | "questions" | "email" | "results";

interface StyleQuizProps {
  onComplete?: (style: DesignStyle, email: string) => void;
}

export function StyleQuiz({ onComplete }: StyleQuizProps) {
  const [step, setStep] = useState<QuizStep>("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<DesignStyle | null>(null);
  const [error, setError] = useState("");

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  const handleAnswer = useCallback(
    (questionId: string, optionId: string) => {
      setAnswers((prev) => ({ ...prev, [questionId]: optionId }));

      // Auto-advance after short delay
      setTimeout(() => {
        if (currentQuestion < quizQuestions.length - 1) {
          setCurrentQuestion((prev) => prev + 1);
        } else {
          setStep("email");
        }
      }, 300);
    },
    [currentQuestion]
  );

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    } else {
      setStep("intro");
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate result
      const styleResult = calculateStyle(answers);
      setResult(styleResult);

      // Save to newsletter/leads
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: "style_quiz",
          designStyle: styleResult.id,
          quizAnswers: answers,
        }),
      });

      onComplete?.(styleResult, email);
      setStep("results");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share && result) {
      try {
        await navigator.share({
          title: `My Design Style: ${result.name}`,
          text: `I just discovered my interior design style is "${result.name}" - ${result.tagline}. Take the quiz!`,
          url: window.location.href,
        });
      } catch {
        // User cancelled or share failed
      }
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <AnimatePresence mode="wait">
        {/* Intro Screen */}
        {step === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-[#c9a962]/10">
              <Palette className="h-10 w-10 text-[#c9a962]" />
            </div>

            <h2 className="mb-3 text-3xl font-light text-neutral-900">
              Discover Your Design Style
            </h2>

            <p className="mb-8 text-neutral-600">
              Answer 6 simple questions to uncover your unique interior design
              aesthetic. Get personalized recommendations from our award-winning
              team.
            </p>

            <div className="mb-8 flex items-center justify-center gap-6 text-sm text-neutral-500">
              <span>⏱️ 2 minutes</span>
              <span>🎯 6 questions</span>
              <span>🎁 Free results</span>
            </div>

            <button
              onClick={() => setStep("questions")}
              className="inline-flex items-center gap-2 rounded-lg bg-neutral-950 px-8 py-4 font-medium text-white transition-all hover:bg-neutral-800"
            >
              Start the Quiz
              <ArrowRight className="h-5 w-5" />
            </button>
          </motion.div>
        )}

        {/* Questions */}
        {step === "questions" && (
          <motion.div
            key={`question-${currentQuestion}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            {/* Progress bar */}
            <div className="mb-8">
              <div className="mb-2 flex items-center justify-between text-sm text-neutral-500">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-1 transition-colors hover:text-neutral-900"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
                <span>
                  {currentQuestion + 1} of {quizQuestions.length}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
                <motion.div
                  className="h-full bg-[#c9a962]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="mb-8 text-center">
              <h3 className="mb-2 text-2xl font-light text-neutral-900">
                {quizQuestions[currentQuestion].question}
              </h3>
              {quizQuestions[currentQuestion].description && (
                <p className="text-neutral-500">
                  {quizQuestions[currentQuestion].description}
                </p>
              )}
            </div>

            {/* Options */}
            <div className="grid gap-3 sm:grid-cols-2">
              {quizQuestions[currentQuestion].options.map((option) => {
                const isSelected =
                  answers[quizQuestions[currentQuestion].id] === option.id;

                return (
                  <button
                    key={option.id}
                    onClick={() =>
                      handleAnswer(quizQuestions[currentQuestion].id, option.id)
                    }
                    className={`group relative overflow-hidden rounded-xl border-2 p-5 text-left transition-all ${
                      isSelected
                        ? "border-[#c9a962] bg-[#c9a962]/5"
                        : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors ${
                          isSelected
                            ? "border-[#c9a962] bg-[#c9a962]"
                            : "border-neutral-300 group-hover:border-neutral-400"
                        }`}
                      >
                        {isSelected && (
                          <CheckCircle2 className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <span
                        className={`font-medium ${
                          isSelected ? "text-neutral-900" : "text-neutral-700"
                        }`}
                      >
                        {option.text}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Email Collection */}
        {step === "email" && (
          <motion.div
            key="email"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>

            <h3 className="mb-3 text-2xl font-light text-neutral-900">
              Your Results Are Ready!
            </h3>

            <p className="mb-8 text-neutral-600">
              Enter your email to reveal your unique design style and receive
              personalized recommendations from our team.
            </p>

            <form onSubmit={handleEmailSubmit} className="mx-auto max-w-sm">
              <div className="mb-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full rounded-lg border border-neutral-200 py-4 pl-12 pr-4 text-center outline-none transition-colors focus:border-[#c9a962] focus:ring-2 focus:ring-[#c9a962]/20"
                    disabled={isSubmitting}
                  />
                </div>
                {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-950 py-4 font-medium text-white transition-all hover:bg-neutral-800 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Reveal My Style
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-4 text-xs text-neutral-400">
              We&apos;ll also send you design tips tailored to your style.
            </p>
          </motion.div>
        )}

        {/* Results */}
        {step === "results" && result && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            {/* Result Header */}
            <div className="mb-8 text-center">
              <span className="mb-2 inline-block rounded-full bg-[#c9a962]/10 px-4 py-1.5 text-sm font-medium text-[#c9a962]">
                Your Design Style
              </span>
              <h2 className="mb-2 text-3xl font-light text-neutral-900">
                {result.name}
              </h2>
              <p className="text-lg text-neutral-600">{result.tagline}</p>
            </div>

            {/* Result Image */}
            <div className="relative mb-8 aspect-video overflow-hidden rounded-2xl">
              <Image
                src={result.image}
                alt={result.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            {/* Description */}
            <p className="mb-8 text-center text-neutral-600">
              {result.description}
            </p>

            {/* Characteristics */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-neutral-50 p-5">
                <h4 className="mb-3 font-medium text-neutral-900">
                  Key Characteristics
                </h4>
                <ul className="space-y-2">
                  {result.characteristics.map((char, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm text-neutral-600"
                    >
                      <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-[#c9a962]" />
                      {char}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl bg-neutral-50 p-5">
                <h4 className="mb-3 font-medium text-neutral-900">
                  Signature Materials
                </h4>
                <div className="mb-4 flex flex-wrap gap-2">
                  {result.materials.map((material, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-white px-3 py-1 text-sm text-neutral-600"
                    >
                      {material}
                    </span>
                  ))}
                </div>

                <h4 className="mb-2 font-medium text-neutral-900">
                  Color Palette
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.colors.map((color, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-white px-3 py-1 text-sm text-neutral-600"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact/book-consultation"
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-neutral-950 py-4 font-medium text-white transition-all hover:bg-neutral-800"
              >
                <Phone className="h-5 w-5" />
                Book Free Consultation
              </Link>

              <button
                onClick={handleShare}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white py-4 font-medium text-neutral-900 transition-all hover:bg-neutral-50"
              >
                <Share2 className="h-5 w-5" />
                Share My Result
              </button>
            </div>

            {/* Related Projects Link */}
            {result.serviceSlug && (
              <div className="mt-6 text-center">
                <Link
                  href={`/services/${result.serviceSlug}`}
                  className="text-sm text-[#c9a962] hover:underline"
                >
                  View {result.name} Projects →
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default StyleQuiz;
