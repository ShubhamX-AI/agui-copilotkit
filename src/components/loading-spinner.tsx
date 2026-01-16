import { motion } from "framer-motion";

export function LoadingSpinner() {
    return (
        <div className="flex flex-col items-center justify-center space-y-6">
            <div className="relative w-16 h-16 flex items-center justify-center">
                {/* Central Pulse */}
                <motion.div
                    className="absolute w-full h-full bg-blue-500/10 rounded-full"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Rotating Gradient Ring */}
                <motion.div
                    className="w-12 h-12 rounded-full border-[3px] border-transparent border-t-blue-600 border-r-cyan-500"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />

                {/* Inner Dot */}
                <motion.div
                    className="absolute w-3 h-3 bg-indigo-600 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.5)]"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center space-x-1"
            >
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Processing</span>
                <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, times: [0, 0.5, 1] }}
                    className="text-xs font-semibold text-blue-500"
                >
                    .
                </motion.span>
                <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1.5, delay: 0.2, repeat: Infinity, times: [0, 0.5, 1] }}
                    className="text-xs font-semibold text-blue-500"
                >
                    .
                </motion.span>
                <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1.5, delay: 0.4, repeat: Infinity, times: [0, 0.5, 1] }}
                    className="text-xs font-semibold text-blue-500"
                >
                    .
                </motion.span>
            </motion.div>
        </div>
    );
}
