/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface PrimaryButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ onClick, children, className, disabled, type = "button" }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`w-full py-4 px-6 bg-plantry-sageDark text-white rounded-2xl font-medium tracking-wide shadow-lg shadow-plantry-sage/20 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${className ?? ""}`}
  >
    {children}
  </button>
);