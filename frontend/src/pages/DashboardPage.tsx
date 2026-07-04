/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, ShoppingBag, Sparkles } from "lucide-react";
import { pageVariants } from "../components/ui/animations";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import type { PageView, RandomFact, RecentActivityEvent } from "../types";

interface DashboardPageProps {
  onNavigate: (page: PageView) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [fact, setFact] = useState<RandomFact | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivityEvent | null>(null);

  const displayName = user?.displayName?.split(" ")[0] || user?.email?.split("@")[0] || "there";

  useEffect(() => {
    api
      .getFact()
      .then(data => setFact(data.fact))
      .catch(err => console.error("Failed to fetch fact", err));
  }, []);

  useEffect(() => {
    api
      .getRecentActivity()
      .then(data => {
        if (data.events && data.events.length > 0) {
          setRecentActivity(data.events[0]);
        }
      })
      .catch(err => console.error("Failed to fetch activity", err));
  }, []);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-xl mx-auto">
      <div className="pt-4 mb-8">
        <h1 className="font-serif text-4xl text-plantry-sageDark dark:text-plantry-cream mb-2">
          Good morning, <br />
          <span className="italic text-plantry-sage capitalize">{displayName}.</span>
        </h1>
        <p className="text-plantry-textLight dark:text-stone-400 mt-4">
          Based on your habits, you usually shop around this time of the month.
        </p>
      </div>

      <div className="grid gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate("create-list")}
          className="bg-plantry-sageDark text-white p-8 rounded-3xl shadow-xl shadow-plantry-sage/20 cursor-pointer relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
              <Plus size={24} className="text-white" />
            </div>
            <h3 className="font-serif text-2xl mb-2">Plan New Trip</h3>
            <p className="text-white/70">Create a smart list with AI suggestions.</p>
          </div>
        </motion.div>

        <div className="glass-card p-6 cursor-pointer" onClick={() => onNavigate("history")}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-stone-900 dark:text-white">Recent Activity</h3>
            {recentActivity && (
              <span className="text-xs text-plantry-sage font-medium bg-plantry-sage/10 px-2 py-1 rounded-full">Completed</span>
            )}
          </div>

          {recentActivity ? (
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-stone-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-stone-400">
                <ShoppingBag size={20} />
              </div>
              <div>
                <p className="font-medium dark:text-stone-200">Weekly Groceries</p>
                <p className="text-sm text-stone-500">
                  {new Date(recentActivity.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-stone-400">No completed shopping sessions yet.</p>
          )}
        </div>

        {fact && (
          <div className="bg-plantry-accent/10 p-6 rounded-2xl border border-plantry-accent/20 flex items-start gap-4">
            <Sparkles className="text-plantry-accent shrink-0 mt-1" size={20} />
            <p className="text-plantry-sageDark dark:text-plantry-cream text-sm font-medium leading-relaxed">
              Did you know? <span className="text-plantry-accent font-bold">{fact.text}</span>
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};