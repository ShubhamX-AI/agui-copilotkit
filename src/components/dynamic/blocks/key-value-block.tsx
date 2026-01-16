import React from "react";
import { DynamicBlockProps } from "../registry";

export const KeyValueBlock: React.FC<DynamicBlockProps> = ({ data, design }) => {
    // data.data is the Record<string, string>
    const items = data?.data || {};

    return (
        <div className="grid grid-cols-2 gap-3 mb-4 last:mb-0 p-3 bg-white/50 rounded-lg border border-gray-100">
            {Object.entries(items).map(([key, value]) => (
                <div key={key}>
                    <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">{key}</p>
                    <p className="text-sm font-medium text-gray-800" style={{ color: design?.themeColor }}>
                        {String(value)}
                    </p>
                </div>
            ))}
        </div>
    );
};
