import React from "react";
import ReactMarkdown from "react-markdown";
import { DynamicBlockProps } from "../registry";

export const MarkdownBlock: React.FC<DynamicBlockProps> = ({ data, design }) => {
    // data.content is the markdown string
    const content = data?.content || "";

    return (
        <div className="prose prose-sm max-w-none mb-4 last:mb-0 text-slate-700 leading-relaxed font-normal" style={{ color: design?.themeColor ? undefined : '#475569' }}>
            <style jsx global>{`
                .markdown-content a {
                    color: ${design?.themeColor || '#2563EB'};
                    text-decoration: none;
                    font-weight: 600;
                    border-bottom: 1px solid ${design?.themeColor || '#2563EB'}40;
                    word-break: break-all;
                    transition: all 0.2s;
                }
                .markdown-content a:hover {
                    border-bottom-color: ${design?.themeColor || '#2563EB'};
                    background-color: ${design?.themeColor || '#2563EB'}08;
                }
                .markdown-content strong {
                    color: ${design?.themeColor || '#1e293b'}; 
                }
                .markdown-content p {
                    margin-bottom: 0.75rem;
                }
                .markdown-content p:last-child {
                    margin-bottom: 0;
                }
            `}</style>
            <div className="markdown-content">
                <ReactMarkdown
                    components={{
                        a: ({ node, ...props }) => (
                            <a
                                {...props}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:opacity-80 transition-opacity"
                                style={{ pointerEvents: 'auto', display: 'inline' }}
                            />
                        )
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
        </div>
    );
};
