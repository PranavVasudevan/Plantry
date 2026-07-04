/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BrainCircuit, AlertCircle, Zap } from "lucide-react";
import { pageVariants, fadeUpItem } from "../components/ui/animations";
import { SectionHeader } from "../components/ui/SectionHeader";
import { api } from "../services/api";
import type { HouseholdInsights } from "../types";

export const InsightsPage: React.FC = () => {
  const [insights, setInsights] = useState<HouseholdInsights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getInsights()
      .then(setInsights)
      .catch(err => console.error("Failed to fetch insights", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-center text-stone-400">Loading insights…</p>;
  }

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-xl mx-auto pb-24">
      <SectionHeader title="Household Insights" subtitle="Understanding your family's unique patterns." />

      <div className="grid gap-6">
        <div className="glass-card p-6 bg-gradient-to-br from-plantry-sage/5 to-transparent border-plantry-sage/20">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-plantry-sage rounded-xl text-white">
              <BrainCircuit size={24} />
            </div>
            <div>
              <h3 className="font-serif text-xl text-plantry-sageDark dark:text-white mb-2">Shopping Rhythm</h3>
              <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                Your household typically needs a refill every{" "}
                <span className="font-bold text-plantry-sage">{insights?.rhythm?.avgDaysBetweenTrips ?? "-"} days</span>. You are most
                efficient when you plan on{" "}
                <span className="font-bold text-plantry-sage">
                  {insights?.rhythm?.preferredDay ?? "-"} {insights?.rhythm?.preferredTime ?? ""}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="font-medium text-stone-900 dark:text-white mb-4 flex items-center gap-2">
            <AlertCircle size={18} className="text-orange-400" /> Frequently Forgotten
          </h3>
          <div className="space-y-3">
            {insights?.forgotten?.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-stone-50 dark:bg-zinc-800 rounded-lg">
                <span className="font-medium dark:text-stone-200">{item.name}</span>
                <span className="text-xs text-stone-500">Missed in {item.percent}% of trips</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="font-medium text-stone-900 dark:text-white mb-4 flex items-center gap-2">
            <Zap size={18} className="text-plantry-accent" /> Smart Pairs
          </h3>
          <p className="text-sm text-stone-500 mb-4">You almost always buy these together.</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {insights?.pairs?.map((pair, i) => (
              <div
                key={i}
                className="flex-shrink-0 px-4 py-3 bg-plantry-light dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-xl flex items-center gap-2"
              >
                <span className="font-serif dark:text-stone-200">{pair[0]}</span>
                <span className="text-stone-400">+</span>
                <span className="font-serif dark:text-stone-200">{pair[1]}</span>
              </div>
            ))}
          </div>
        </div>

        <motion.div variants={fadeUpItem} className="glass-card p-5 space-y-4 transition-shadow hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-serif text-lg text-plantry-sageDark dark:text-white flex items-center gap-2">Shopping Rhythm</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">Household shopping consistency over time</p>
            </div>
            <span className="text-xs font-medium uppercase tracking-wider text-plantry-sage bg-plantry-sage/10 px-2 py-1 rounded-full">
              Visualization
            </span>
          </div>

          <div className="relative w-full h-[420px] rounded-2xl overflow-hidden border border-stone-200/70 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-sm shadow-inner">
            <iframe
              title="Shopping Rhythm Analytics"
              src="https://lookerstudio.google.com/embed/reporting/aae25c4b-2245-4c54-961f-b36f72a8807f/page/So9jF"
              className="absolute inset-0 w-full h-full"
              frameBorder={0}
              allowFullScreen
            />
          </div>

          <div className="pt-2 border-t border-stone-200/60 dark:border-zinc-800">
            <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              This view provides insight into your household's shopping patterns, highlighting extended gaps between trips to help
              track overlooked essentials.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};