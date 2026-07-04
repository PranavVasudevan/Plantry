/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { pageVariants } from "../components/ui/animations";
import { SectionHeader } from "../components/ui/SectionHeader";
import { api } from "../services/api";
import type { PageView, ShoppingHistoryEvent } from "../types";

interface HistoryPageProps {
  onNavigate: (page: PageView, params?: { shoppingEventId?: string }) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onNavigate }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [historyData, setHistoryData] = useState<ShoppingHistoryEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getHistory()
      .then(data => {
        const sorted = (data.events || []).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setHistoryData(sorted);
      })
      .catch(err => {
        console.error("Failed to fetch history", err);
        setHistoryData([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="max-w-xl mx-auto p-6 text-stone-400">Loading shopping history…</div>;
  }

  if (historyData.length === 0) {
    return <div className="max-w-xl mx-auto p-6 text-stone-400">No shopping history yet.</div>;
  }

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-xl mx-auto pb-24">
      <SectionHeader title="Shopping History" subtitle="A timeline of your household planning." />

      <div className="space-y-4 relative">
        <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-stone-200 dark:bg-zinc-800 z-0"></div>

        {historyData.map(session => {
          const dateObj = new Date(session.date);
          const dateLabel = dateObj.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

          return (
            <div key={session.id} className="relative z-10">
              <div
                onClick={() => setExpandedId(expandedId === session.id ? null : session.id)}
                className="glass-card p-5 ml-2 cursor-pointer transition-all hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-plantry-sage/10 text-plantry-sage flex items-center justify-center font-bold text-xs ring-4 ring-white dark:ring-zinc-900">
                      {dateObj.getDate()}
                    </div>
                    <div>
                      <h4 className="font-serif text-lg text-plantry-sageDark dark:text-white">{dateLabel}</h4>
                    </div>
                  </div>

                  {expandedId === session.id ? (
                    <ChevronUp size={20} className="text-stone-400" />
                  ) : (
                    <ChevronDown size={20} className="text-stone-400" />
                  )}
                </div>

                <AnimatePresence>
                  {expandedId === session.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-4 pt-4 border-t border-stone-100 dark:border-zinc-800 overflow-hidden"
                    >
                      <div className="space-y-3">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-green-600 mb-2 block">
                            Planned & Bought
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {session.items.map((item, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs rounded-md border border-green-100 dark:border-green-900/30"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>

                        {session.forgotten.length > 0 && (
                          <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-red-500 mb-2 block flex items-center gap-1">
                              <AlertCircle size={10} /> Forgotten
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {session.forgotten.map((item, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs rounded-md border border-red-100 dark:border-red-900/30"
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <button
                          onClick={e => {
                            e.stopPropagation();
                            onNavigate("add-forgotten", { shoppingEventId: session.id });
                          }}
                          className="mt-3 text-xs font-medium text-plantry-sage hover:underline"
                        >
                          + Add forgotten items
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};