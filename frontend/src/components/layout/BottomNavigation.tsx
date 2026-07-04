/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "framer-motion";
import { Home, Calendar, BarChart2, User } from "lucide-react";
import type { PageView } from "../../types";

interface BottomNavigationProps {
  activePage: PageView;
  onNavigate: (page: PageView) => void;
}

const navItems: { id: PageView; icon: typeof Home; label: string }[] = [
  { id: "dashboard", icon: Home, label: "Home" },
  { id: "history", icon: Calendar, label: "History" },
  { id: "insights", icon: BarChart2, label: "Insights" },
  { id: "settings", icon: User, label: "Profile" }
];

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ activePage, onNavigate }) => (
  <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-lg border-t border-stone-200 dark:border-zinc-800 pb-safe pt-2 z-50">
    <div className="flex justify-around items-center h-16 max-w-md mx-auto">
      {navItems.map(item => {
        const isActive = activePage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center gap-1 transition-colors w-16 ${
              isActive ? "text-plantry-sageDark dark:text-plantry-cream" : "text-stone-400 dark:text-zinc-600"
            }`}
          >
            <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
            {isActive && <motion.div layoutId="nav-indicator" className="w-1 h-1 bg-plantry-sage rounded-full mt-1" />}
          </button>
        );
      })}
    </div>
  </nav>
);