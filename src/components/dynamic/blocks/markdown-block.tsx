import React from "react";
import ReactMarkdown from "react-markdown";
import { DynamicBlockProps } from "../registry";

export const MarkdownBlock: React.FC<DynamicBlockProps> = ({ data, design }) => {
    // data.content is the markdown string
    const content = data?.content || "";

    return (
        <div className="prose prose-sm max-w-none mb-4 last:mb-0 text-gray-700 leading-relaxed" style={{ color: design?.themeColor ? undefined : '#374151' }}>
            {/* We apply some custom styling for links to respect the theme */}
            <style jsx global>{`
                .markdown-content a {
                    color: ${design?.themeColor || '#2563EB'};
                    text-decoration: underline;
                }
                .markdown-content strong {
                    color: ${design?.themeColor || '#111827'}; 
                }
            `}</style>
            <div className="markdown-content">
                <ReactMarkdown>{content}</ReactMarkdown>
            </div>
        </div>
    );
};
