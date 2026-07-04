/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle }) => (
  <div className="mb-8">
    <h2 className="font-serif text-3xl text-plantry-sageDark dark:text-plantry-cream mb-2">{title}</h2>
    {subtitle && <p className="text-plantry-textLight dark:text-stone-400 leading-relaxed">{subtitle}</p>}
  </div>
);