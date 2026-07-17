"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "How does the AI career analysis work?",
    a: "Our AI analyzes your resume, skills, experience, and preferences against thousands of real-time job market data points. It identifies patterns and matches you with careers where your profile aligns best, showing live match percentages for each recommendation.",
  },
  {
    q: "Is CareerPilot really free?",
    a: "Yes! The basic career analysis, AI chat, and resume generator are completely free. We offer premium features like advanced analytics and personalized coaching for users who want deeper insights.",
  },
  {
    q: "How accurate are the match percentages?",
    a: "Our match algorithm has been trained on millions of career transitions and job placements, achieving 94% accuracy in predicting career satisfaction. The percentages are updated in real-time as you refine your profile.",
  },
  {
    q: "Can I use the resume generator for any industry?",
    a: "Absolutely. Our templates are optimized for all industries — from tech and finance to healthcare and creative roles. Each template is ATS-compatible and tailored to your target industry's standards.",
  },
  {
    q: "How long does a career analysis take?",
    a: "The initial analysis takes about 2-3 minutes. Once complete, you'll get instant recommendations with match scores. You can then refine your results by answering a few more questions for even better matches.",
  },
  {
    q: "Is my data secure and private?",
    a: "We take privacy seriously. Your resume and personal data are encrypted at rest and in transit. We never share your information with third parties without your explicit consent, and you can delete your data at any time.",
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="relative overflow-hidden px-4 py-20 sm:py-28 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-600/5 via-transparent to-blue-600/5 dark:from-blue-600/10 dark:to-blue-600/10" />

      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
            Everything you need to know about CareerPilot.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-gray-200 bg-white shadow-sm transition-all dark:border-gray-800 dark:bg-gray-900"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                className="flex w-full items-center justify-between px-6 py-4 text-left"
              >
                <span className="text-sm font-semibold text-gray-900 sm:text-base dark:text-white">
                  {faq.q}
                </span>
                <motion.svg
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="h-5 w-5 flex-shrink-0 text-gray-500 dark:text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </motion.svg>
              </button>

              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="border-t border-gray-100 px-6 pb-4 pt-3 text-sm leading-relaxed text-gray-600 dark:border-gray-800 dark:text-gray-400">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
