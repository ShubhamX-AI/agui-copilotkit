import React, { useState } from "react";
import { DynamicBlockProps } from "../registry";

// Define the field schema
interface FormField {
    name: string;
    label: string;
    type: "text" | "number" | "email" | "password" | "select" | "textarea";
    placeholder?: string;
    options?: { label: string; value: string }[]; // For select
    required?: boolean;
}

interface FormBlockData {
    id: string; // Unique ID for this form instance
    fields: FormField[];
    submitLabel?: string;
    action: string; // The tool/action to trigger on submit
}

export const FormBlock: React.FC<DynamicBlockProps> = ({ data, design, onAction }) => {
    const formData = data as FormBlockData;
    const [values, setValues] = useState<Record<string, any>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (name: string, value: any) => {
        setValues(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!onAction) return;

        setIsSubmitting(true);

        // Simulate a small delay for better UX
        setTimeout(() => {
            // Trigger the action
            onAction(formData.action, values);
            setIsSubmitting(false);
            setSubmitted(true);
        }, 600);
    };

    if (submitted) {
        return (
            <div className="p-6 text-center bg-green-50 rounded-lg border border-green-100 animate-in fade-in zoom-in">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                </div>
                <h3 className="text-gray-900 font-medium">Submitted Successfully</h3>
                <p className="text-sm text-gray-500 mt-1">The agent has received your input.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100 my-4">
            {formData.fields.map((field) => (
                <div key={field.name} className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>

                    {field.type === "select" ? (
                        <select
                            required={field.required}
                            value={values[field.name] || ""}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all font-medium text-sm text-gray-800"
                            style={{ focusRingColor: design?.themeColor || "#2563EB" } as any}
                        >
                            <option value="" disabled>Select an option</option>
                            {field.options?.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    ) : field.type === "textarea" ? (
                        <textarea
                            required={field.required}
                            placeholder={field.placeholder}
                            value={values[field.name] || ""}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all font-medium text-sm text-gray-800"
                            style={{ "--ring-color": design?.themeColor || "#2563EB" } as any}
                        />
                    ) : (
                        <input
                            type={field.type}
                            required={field.required}
                            placeholder={field.placeholder}
                            value={values[field.name] || ""}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all font-medium text-sm text-gray-800"
                            style={{ "--ring-color": design?.themeColor || "#2563EB" } as any}
                        />
                    )}
                </div>
            ))}

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-lg font-semibold text-white shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                style={{ backgroundColor: design?.themeColor || "#2563EB" }}
            >
                {isSubmitting ? (
                    <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Processing...</span>
                    </>
                ) : (
                    <span>{formData.submitLabel || "Submit"}</span>
                )}
            </button>
        </form>
    );
};
