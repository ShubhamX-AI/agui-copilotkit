"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
    isLoading: boolean;
    themeColor?: string;
}

export function ProgressBar({ isLoading, themeColor = "#2563EB" }: ProgressBarProps) {
    if (!isLoading) return null;

    return (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden z-10">
            <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "linear",
                }}
                className="w-full h-full"
                style={{
                    background: `linear-gradient(90deg, transparent 0%, ${themeColor} 50%, transparent 100%)`,
                    opacity: 1,
                }}
            />
        </div>
    );
}
