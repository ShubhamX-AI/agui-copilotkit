"use client";

import React from "react";

interface CompanyInfo {
    title: string;
    description: string;
}

interface CompanyInfoCardProps {
    info: CompanyInfo[];
    themeColor?: string;
}

export const CompanyInfoCard = ({ info, themeColor = "#2563EB" }: CompanyInfoCardProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl p-4">
            {info.map((item, index) => (
                <div
                    key={index}
                    className="group relative bg-white rounded-3xl p-8 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl overflow-hidden border border-gray-100"
                >
                    {/* Decorative Background Blob */}
                    <div
                        className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-10 transition-transform duration-700 group-hover:scale-150"
                        style={{ backgroundColor: themeColor }}
                    />

                    <div className="relative z-10">
                        <div
                            className="w-12 h-1 gap-1 mb-6 rounded-full"
                            style={{ backgroundColor: themeColor }}
                        />

                        <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">
                            {item.title}
                        </h3>

                        <p className="text-gray-600 leading-relaxed text-lg">
                            {item.description}
                        </p>
                    </div>

                    {/* Bottom highlight bar */}
                    <div
                        className="absolute bottom-0 left-0 w-full h-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                        style={{ backgroundColor: themeColor }}
                    />
                </div>
            ))}
        </div>
    );
};
