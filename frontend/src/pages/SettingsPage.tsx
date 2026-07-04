/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Clock, Moon, Sun, Shield, LogOut } from "lucide-react";
import { pageVariants } from "../components/ui/animations";
import { SectionHeader } from "../components/ui/SectionHeader";
import { useAuth } from "../context/AuthContext";

interface SettingsPageProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ isDarkMode, toggleTheme }) => {
  const { user, logOut } = useAuth();
  const [seasonalHints, setSeasonalHints] = useState(true);
  const [monthlyReminders, setMonthlyReminders] = useState(true);

  const displayName = user?.displayName || user?.email?.split("@")[0] || "Your Household";
  const avatarInitial = (user?.displayName || user?.email || "?").charAt(0).toUpperCase();

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-xl mx-auto pb-24">
      <SectionHeader title="Settings" />

      <div className="glass-card p-6 mb-8 flex items-center gap-4">
        <div className="w-16 h-16 bg-plantry-sage rounded-full flex items-center justify-center text-white font-serif font-bold text-2xl">
          {avatarInitial}
        </div>
        <div>
          <h3 className="font-serif text-2xl text-plantry-sageDark dark:text-white capitalize">{displayName}</h3>
          <p className="text-stone-500">{user?.email}</p>
        </div>
      </div>

      <div className="space-y-6">
        <section>
          <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4 ml-1">Preferences</h4>
          <div className="glass-card overflow-hidden">
            <div className="p-4 flex items-center justify-between border-b border-stone-100 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <Sparkles size={20} className="text-plantry-accent" />
                <div>
                  <p className="font-medium dark:text-stone-200">Seasonal Hints</p>
                  <p className="text-xs text-stone-500">Suggest mangoes in summer, etc.</p>
                </div>
              </div>
              <button
                onClick={() => setSeasonalHints(!seasonalHints)}
                className={`w-12 h-6 rounded-full transition-colors relative ${seasonalHints ? "bg-plantry-sage" : "bg-stone-300"}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${seasonalHints ? "left-7" : "left-1"}`}></div>
              </button>
            </div>

            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock size={20} className="text-blue-400" />
                <div>
                  <p className="font-medium dark:text-stone-200">Monthly Restock</p>
                  <p className="text-xs text-stone-500">Remind me of staples every 30 days.</p>
                </div>
              </div>
              <button
                onClick={() => setMonthlyReminders(!monthlyReminders)}
                className={`w-12 h-6 rounded-full transition-colors relative ${monthlyReminders ? "bg-plantry-sage" : "bg-stone-300"}`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${monthlyReminders ? "left-7" : "left-1"}`}
                ></div>
              </button>
            </div>
          </div>
        </section>

        <section>
          <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4 ml-1">Appearance</h4>
          <div className="glass-card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isDarkMode ? <Moon size={20} className="text-purple-400" /> : <Sun size={20} className="text-orange-400" />}
              <span className="font-medium dark:text-stone-200">Dark Mode</span>
            </div>
            <button
              onClick={toggleTheme}
              className={`w-12 h-6 rounded-full transition-colors relative ${isDarkMode ? "bg-plantry-sage" : "bg-stone-300"}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${isDarkMode ? "left-7" : "left-1"}`}></div>
            </button>
          </div>
        </section>

        <section>
          <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4 ml-1">Data & Privacy</h4>
          <div className="glass-card p-4">
            <div className="flex items-start gap-3">
              <Shield size={20} className="text-green-600 mt-1" />
              <div>
                <p className="font-medium dark:text-stone-200 mb-1">Local-First Learning</p>
                <p className="text-sm text-stone-500 leading-relaxed">
                  Plantry learns only from your household's data. We do not share your shopping habits with advertisers or third
                  parties.
                </p>
              </div>
            </div>
          </div>
        </section>

        <button
          onClick={() => logOut()}
          className="w-full py-4 text-red-500 font-medium hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </motion.div>
  );
};