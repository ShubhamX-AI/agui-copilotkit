export type WidgetType =
    | "company"
    | "dynamic_card";

export interface WidgetConfig {
    label: string;
    resizable: boolean;
    minWidth?: number;
    minHeight?: number;
    defaultDimensions?: { width: number; height: number };
}

/**
 * WIDGET_REGISTRY
 * 
 * This is the central configuration source for all widgets in the application.
 * Define new widgets here to automatically enable their behavior in the main canvas.
 */
export const WIDGET_REGISTRY: Record<WidgetType, WidgetConfig> = {
    company: {
        label: "Company Info",
        resizable: true,
    },
    dynamic_card: {
        label: "Universal Card",
        resizable: true, // All universal cards are resizable by design
    }
};
