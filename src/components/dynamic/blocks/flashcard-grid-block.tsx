"use client";

import React from "react";
import { motion } from "framer-motion";
import { DynamicBlockProps } from "../registry";

interface FlashcardItem {
    title: string;
    description: string;
    url?: string;
    label?: string;
    icon?: string;
}

export const FlashcardGridBlock: React.FC<DynamicBlockProps> = ({ data, design }) => {
    const items: FlashcardItem[] = data?.items || [];
    const themeColor = design?.themeColor || "#2563EB";

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemAnim: any = {
        hidden: { opacity: 0, scale: 0.8, y: 20 },
        show: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 260,
                damping: 20
            }
        },
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2"
        >
            {items.map((item, idx) => (
                <motion.div
                    key={idx}
                    variants={itemAnim}
                    whileHover={{
                        scale: 1.03,
                        boxShadow: `0 10px 25px -5px ${themeColor}20`,
                    }}
                    className="group relative flex flex-col p-5 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-blue-100"
                >
                    <div className="flex items-center gap-3 mb-3">
                        {item.icon && (
                            <span className="text-xl">{item.icon}</span>
                        )}
                        <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                            {item.title}
                        </h4>
                    </div>

                    <p className="text-sm text-slate-600 leading-relaxed flex-1">
                        {item.description}
                    </p>

                    {item.url && (
                        <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-all hover:translate-x-1"
                            style={{ color: themeColor }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {item.label || "Learn More"}
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                        </a>
                    )}
                </motion.div>
            ))}
        </motion.div>
    );
};
