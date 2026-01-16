import React from "react";
import { DynamicBlockProps } from "../registry";

export const LinkBlock: React.FC<DynamicBlockProps> = ({ data, design }) => {
    const { url, label } = data || {};

    if (!url) return null;

    return (
        <div className="mt-4 pt-3 border-t border-gray-100">
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium hover:underline transition-all"
                style={{ color: design?.themeColor || "#2563EB" }}
            >
                {label || url}
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
            </a>
        </div>
    );
};
