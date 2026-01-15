"use client";

import React from "react";
import { motion, useDragControls } from "framer-motion";

interface WidgetWrapperProps {
    id: string;
    title: string;
    onClose: (id: string) => void;
    onFocus: (id: string) => void;
    zIndex: number;
    initialPosition?: { x: number; y: number };
    themeColor?: string;
    children: React.ReactNode;
    dragConstraintsRef?: React.RefObject<HTMLDivElement | null>;
}

export const WidgetWrapper = ({
    id,
    title,
    onClose,
    onFocus,
    zIndex,
    initialPosition = { x: 0, y: 0 },
    themeColor = "#2563EB",
    children,
    dragConstraintsRef,
}: WidgetWrapperProps) => {
    const dragControls = useDragControls();

    return (
        <motion.div
            drag
            dragControls={dragControls}
            dragListener={false} // Only drag from the header
            dragConstraints={dragConstraintsRef}
            dragElastic={0.1}
            whileDrag={{ scale: 1.02 }}
            initial={{ opacity: 0, scale: 0.9, ...initialPosition }}
            animate={{ opacity: 1, scale: 1, x: initialPosition.x, y: initialPosition.y }}
            className="absolute flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
            style={{
                zIndex,
                minWidth: "320px",
                maxWidth: "90vw",
                boxShadow: "0 20px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
            onPointerDown={() => onFocus(id)}
        >
            {/* Header / Drag Handle */}
            <div
                onPointerDown={(e) => dragControls.start(e)}
                className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100 cursor-grab active:cursor-grabbing select-none"
            >
                <div className="flex items-center gap-3">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: themeColor }}
                    />
                    <span className="text-sm font-semibold text-gray-700 tracking-wide">
                        {title}
                    </span>
                </div>

                {/* Close Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose(id);
                    }}
                    className="p-1.5 rounded-full hover:bg-gray-200 text-gray-400 hover:text-red-500 transition-colors"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                    </svg>
                </button>
            </div>

            {/* Widget Content */}
            <div className="p-0 relative bg-white/50 backdrop-blur-sm">
                {children}
            </div>
        </motion.div>
    );
};
