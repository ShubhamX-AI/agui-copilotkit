import React from "react";
import { UniversalCardData } from "../universal-card";

// --- Types ---

export interface DynamicBlockProps {
    data: any; // The specific data for this block (e.g., Markdown content, form fields)
    design?: UniversalCardData["design"]; // Shared design tokens
    onAction?: (action: string, payload: any) => void; // Callback for interactivity
}

export type DynamicBlockComponent = React.FC<DynamicBlockProps>;

// We will import these as we create them
import { MarkdownBlock } from "./blocks/markdown-block";
import { KeyValueBlock } from "./blocks/key-value-block";
import { ImageBlock } from "./blocks/image-block";
import { LinkBlock } from "./blocks/link-block";
import { FormBlock } from "./blocks/form-block";
import { FlashcardGridBlock } from "./blocks/flashcard-grid-block";

// --- Registry ---

export const ComponentRegistry: Record<string, DynamicBlockComponent> = {
    // Basic Content
    "markdown": MarkdownBlock,
    "key_value": KeyValueBlock,
    "image": ImageBlock,
    "link": LinkBlock,

    // Interactivity
    "form": FormBlock,
    "flashcards": FlashcardGridBlock,

    // Future expansion:
    // "chart": ChartBlock,
    // "map": MapBlock, 
};
