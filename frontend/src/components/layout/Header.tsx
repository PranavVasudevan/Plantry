/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Moon, Sun } from "lucide-react";
import type { PageView } from "../../types";

interface HeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  onNavigate: (page: PageView) => void;
}

export const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleTheme, onNavigate }) => (
  <header className="fixed top-0 left-0 right-0 z-40 px-6 py-4 flex justify-between items-center glass-panel">
    <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate("dashboard")}>
      <div className="w-8 h-8 rounded-full overflow-hidden">
        <img src="/logo.png" alt="Plantry" className="w-full h-full object-cover" />
      </div>
      <span className="font-serif font-bold text-xl tracking-tight text-plantry-sageDark dark:text-plantry-cream">
        Plantry
      </span>
    </div>

    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-plantry-textLight hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors"
      aria-label="Toggle Theme"
    >
      {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  </header>
);
