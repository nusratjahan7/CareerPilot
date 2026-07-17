"use client";

import { motion } from "framer-motion";

const reviews = [
  {
    name: "Sarah Chen",
    role: "Software Engineer at Google",
    avatar: "SC",
    color: "bg-blue-500",
    text: "CareerPilot helped me transition from marketing to tech. The AI matched me with software engineering roles I never considered.",
    rating: 5,
  },
  {
    name: "James Okonkwo",
    role: "Product Manager at Stripe",
    avatar: "JO",
    color: "bg-purple-500",
    text: "The resume generator is incredible. My interview callbacks increased by 3x after using the ATS-optimized template.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Data Scientist at Netflix",
    avatar: "PS",
    color: "bg-emerald-500",
    text: "I was stuck in my career until CareerPilot showed me paths I hadn't thought of. Now I'm in my dream role.",
    rating: 5,
  },
  {
    name: "Alex Martinez",
    role: "UX Designer at Figma",
    avatar: "AM",
    color: "bg-orange-500",
    text: "The AI chat feature gave me real-time interview practice. I felt completely prepared and confident walking in.",
    rating: 4,
  },
  {
    name: "Emily Thompson",
    role: "DevOps Engineer at AWS",
    avatar: "ET",
    color: "bg-rose-500",
    text: "Finally, a tool that actually understands the job market. The live match percentages were scarily accurate.",
    rating: 5,
  },
  {
    name: "Raj Patel",
    role: "Frontend Lead at Meta",
    avatar: "RP",
    color: "bg-cyan-500",
    text: "I've recommended CareerPilot to my entire network. The career analysis alone is worth its weight in gold.",
    rating: 5,
  },
  {
    name: "Lisa Wang",
    role: "AI Engineer at OpenAI",
    avatar: "LW",
    color: "bg-indigo-500",
    text: "The personalized career roadmap feature is a game-changer. It gave me a clear 6-month plan to upskill.",
    rating: 5,
  },
  {
    name: "Michael Brown",
    role: "CTO at Fintech Startup",
    avatar: "MB",
    color: "bg-teal-500",
    text: "As someone who hires, I can see why CareerPilot works. It matches the right people to the right roles.",
    rating: 4,
  },
];

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${i < rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({ review }) {
  return (
    <div className="w-80 flex-shrink-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-3 flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white ${review.color}`}
        >
          {review.avatar}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
            {review.name}
          </p>
          <p className="truncate text-xs text-gray-500 dark:text-gray-400">
            {review.role}
          </p>
        </div>
      </div>
      <p className="mb-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        &ldquo;{review.text}&rdquo;
      </p>
      <StarRating rating={review.rating} />
    </div>
  );
}

function ReviewRow({ reviews, duration, reverse }) {
  const duplicated = [...reviews, ...reviews, ...reviews];

  return (
    <div className="relative flex overflow-hidden">
      <motion.div
        animate={{ x: reverse ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
        className="flex gap-4"
      >
        {duplicated.map((review, i) => (
          <ReviewCard key={`${review.name}-${i}`} review={review} />
        ))}
      </motion.div>
    </div>
  );
}

export default function Reviews() {
  const mid = Math.ceil(reviews.length / 2);
  const row1 = reviews.slice(0, mid);
  const row2 = reviews.slice(mid);

  return (
    <section className="relative overflow-hidden px-4 py-10 sm:py-20 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-600/5 via-transparent to-blue-600/5 dark:from-blue-600/10 dark:to-blue-600/10" />

      <div className="mx-auto mb-14 max-w-7xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white"
        >
          What Our Users Say
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-3 text-lg text-gray-600 dark:text-gray-400"
        >
          Join thousands of professionals who transformed their careers with CareerPilot.
        </motion.p>
      </div>

      <div className="space-y-6">
        <ReviewRow reviews={row1} duration={40} reverse={false} />
        <ReviewRow reviews={row2} duration={45} reverse={true} />
      </div>
    </section>
  );
}
