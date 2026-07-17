"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const features = [
  {
    title: "AI Career Recommendations",
    description:
      "Get personalized career paths tailored to your skills, experience, and interests. Our AI analyzes thousands of data points to find your perfect match.",
    href: "/career",
    gradient: "from-blue-500 to-blue-600",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    stats: "94% match accuracy",
  },
  {
    title: "Resume Generator",
    description:
      "Create ATS-optimized resumes in minutes. Choose from professional templates and let AI craft compelling content that lands interviews.",
    href: "/resume",
    gradient: "from-purple-500 to-purple-600",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    stats: "500+ templates",
  },
  {
    title: "AI Chat",
    description:
      "Have a conversation with our career AI. Ask about job search strategies, interview prep, salary negotiations, or any career question.",
    href: "/chat",
    gradient: "from-emerald-500 to-emerald-600",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
    stats: "24/7 available",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function FeaturesCards() {
  return (
    <section className="relative overflow-hidden px-4 pt-16 pb-24 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-600/5 via-transparent to-transparent dark:from-blue-600/10" />

      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Level Up Your Career
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            AI-powered tools designed to help you discover, prepare, and land your dream job.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={cardVariants}>
              <Link
                href={feature.href}
                className="group relative block h-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 dark:border-gray-800 dark:bg-gray-900"
              >
                <div
                  className={`mb-4 inline-flex rounded-lg bg-gradient-to-br ${feature.gradient} p-2.5 text-white shadow-md`}
                >
                  {feature.icon}
                </div>

                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>

                <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>

                <div className="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-500">
                    {feature.stats}
                  </span>
                  <span className="text-sm font-medium text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                    Learn more &rarr;
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
