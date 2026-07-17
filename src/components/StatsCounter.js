"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { value: 50, suffix: "K+", label: "Careers Analyzed", icon: "🎯" },
  { value: 185, suffix: "K+", label: "Active Users", icon: "👥" },
  { value: 2.4, suffix: "M+", label: "Recommendations", icon: "⭐" },
  { value: 94, suffix: "K+", label: "Success Stories", icon: "🏆" },
];

function AnimatedCounter({ target, suffix }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    const isDecimal = target % 1 !== 0;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(increment * step, target);
      setCount(isDecimal ? parseFloat(current.toFixed(1)) : Math.floor(current));

      if (step >= steps) {
        setCount(target);
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function StatsCounter() {
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:py-28 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-600/5 via-transparent to-blue-600/5 dark:from-blue-600/10 dark:to-blue-600/10" />

      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            Trusted by Thousands
          </h2>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
            Our AI-powered platform is helping professionals worldwide find their dream careers.
          </p>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="group relative rounded-2xl border border-gray-200 bg-white/60 p-6 text-center shadow-sm backdrop-blur-sm transition-all hover:shadow-lg hover:-translate-y-1 dark:border-gray-800 dark:bg-gray-900/60"
            >
              <span className="mb-3 block text-3xl">{stat.icon}</span>
              <div className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
