import React from "react";
import { DynamicBlockProps } from "../registry";

export const ImageBlock: React.FC<DynamicBlockProps> = ({ data }) => {
    const { url, caption } = data || {};

    if (!url) return null;

    return (
        <div className="mb-4 last:mb-0">
            <div className="rounded-lg overflow-hidden border border-gray-100 shadow-sm relative aspect-video bg-gray-100">
                <img src={url} alt={caption || "Card image"} className="object-cover w-full h-full" />
            </div>
            {caption && <p className="text-xs text-gray-500 mt-1 italic">{caption}</p>}
        </div>
    );
};
