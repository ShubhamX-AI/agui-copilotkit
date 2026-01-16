"use client";

import { UniversalCard, UniversalCardData } from "@/components/universal-card";
import { WidgetWrapper } from "@/components/widget-wrapper";
import { WIDGET_REGISTRY } from "@/config/widget-registry";
import { useCoAgent, useFrontendTool, useCopilotChat } from "@copilotkit/react-core";
import { Role, TextMessage } from "@copilotkit/runtime-client-gql";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ProgressBar } from "@/components/progress-bar";

interface Widget {
  id: string;
  type: "dynamic_card";
  title: string;
  data: any;
  zIndex: number;
  position: { x: number; y: number };
  initialSize?: { width: number; height: number | "auto" };
}

export default function CopilotKitPage() {
  // --- STATE MANAGEMENT ---
  const [themeColor, setThemeColor] = useState("#2563EB");
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const constraintsRef = useRef<HTMLDivElement>(null);

  // Search State
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Z-Index Management (Highest starts at 10)
  const [highestZ, setHighestZ] = useState(10);

  const bringToFront = (id: string) => {
    setHighestZ(prev => prev + 1);
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, zIndex: highestZ + 1 } : w));
  };

  const closeWidget = (id: string) => {
    setWidgets(prev => prev.filter(w => w.id !== id));
  };

  const addWidget = (type: Widget["type"], title: string, data: any, id?: string, shouldClear: boolean = false, initialSize?: { width: number; height: number | "auto" }) => {
    const newId = id || Math.random().toString(36).substring(7);

    // In search mode, we want new cards to appear nicely. 
    // If clearing history, we reset.
    // Improved Placement: simple tiling to avoid overlap.
    let position = { x: 0, y: 0 };

    if (shouldClear) {
      position = { x: 0, y: 0 };
    } else {
      // Find a spot that doesn't perfectly overlap with the last few widgets
      // Simple cascade is okay but maybe vary it more.
      const index = widgets.length;
      position = {
        x: (index * 50) % 400,
        y: index * 50
      };
    }

    const newWidget: Widget = {
      id: newId,
      type,
      title,
      data,
      zIndex: highestZ + 1,
      position,
      initialSize
    };

    if (shouldClear) {
      setHighestZ(prev => prev + 1);
      setWidgets([newWidget]);
      return;
    }

    const existingIndex = widgets.findIndex(w => (id && w.id === id) || (type === "dynamic_card" && w.title === title));

    if (existingIndex !== -1) {
      // UPSERT
      setWidgets(prev => {
        const newWidgets = [...prev];
        const existing = newWidgets[existingIndex];
        newWidgets[existingIndex] = {
          ...existing,
          title,
          data: { ...existing.data, ...data },
          zIndex: highestZ + 1,
          // Update size only if explicitly provided, otherwise keep existing
          initialSize: initialSize || existing.initialSize
        };
        return newWidgets;
      });
      setHighestZ(prev => prev + 1);
      return;
    }

    // CREATE NEW
    setHighestZ(prev => prev + 1);
    setWidgets(prev => [...prev, newWidget]);
  };

  // --- AGENT CONNECTION ---
  const { state, setState } = useCoAgent({
    name: "sample_agent",
    initialState: {}
  });

  // --- FRONTEND TOOLS ---
  useFrontendTool({
    name: "setThemeColor",
    parameters: [{ name: "themeColor", type: "string", required: true }],
    handler({ themeColor }) {
      setThemeColor(themeColor);
    },
  });

  useFrontendTool({
    name: "render_ui",
    description: "Displays a flexible card with mixed content. ",
    parameters: [
      { name: "id", type: "string", required: false },
      { name: "title", type: "string", required: true },
      { name: "content", type: "object[]", required: true },
      { name: "design", type: "object", required: false },
      { name: "layout", type: "string", required: false },
      { name: "clearHistory", type: "boolean", required: false },
      { name: "dimensions", type: "object", required: false, description: "{ width: number, height: number | 'auto' } - Optional size suggestions." }
    ],
    handler({ id, title, content, design, clearHistory, dimensions }) {
      addWidget("dynamic_card", title, { title, content, design }, id, clearHistory, dimensions as any);
    }
  });

  useFrontendTool({
    name: "show_dynamic_card",
    description: "Alias for render_ui",
    parameters: [
      { name: "id", type: "string", required: false },
      { name: "title", type: "string", required: true },
      { name: "content", type: "object[]", required: true },
      { name: "design", type: "object", required: false }
    ],
    handler({ id, title, content, design }) {
      addWidget("dynamic_card", title, { title, content, design }, id, false);
    }
  });

  const { appendMessage, isLoading } = useCopilotChat({
    id: "main-chat"
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleAguiAction = (e: any) => {
      const { action, payload, cardTitle } = e.detail;
      appendMessage(
        new TextMessage({
          role: Role.User,
          content: `[Form Submitted: ${cardTitle}]\nAction: ${action}\nData: ${JSON.stringify(payload, null, 2)}`
        })
      );
    };
    window.addEventListener("agui:action", handleAguiAction);
    return () => window.removeEventListener("agui:action", handleAguiAction);
  }, [appendMessage]);

  useFrontendTool({
    name: "delete_card",
    description: "Deletes a card/widget.",
    parameters: [
      { name: "id", type: "string", required: false },
      { name: "title", type: "string", required: false }
    ],
    handler({ id, title }) {
      if (id) {
        closeWidget(id);
      } else if (title) {
        const target = widgets.find(w => w.title.toLowerCase().includes(title.toLowerCase()));
        if (target) {
          closeWidget(target.id);
        }
      }
    }
  });

  // --- SEARCH HANDLER ---
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);

    await appendMessage(
      new TextMessage({
        role: Role.User,
        content: searchQuery
      })
    );

    inputRef.current?.blur();
  };

  return (
    <main
      className="flex flex-col h-screen relative overflow-hidden transition-colors duration-500 bg-gradient-to-br from-indigo-50 via-white to-cyan-50"
      style={{
        "--copilot-kit-primary-color": themeColor,
      } as any}
    >
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-soft-light"></div>

      {/* 
        SEARCH INTERFACE
        Moves from Center to Top using LayoutId for smooth shared element transition
      */}
      <div
        className={`fixed inset-0 pointer-events-none z-50 transition-all duration-700 ease-in-out flex flex-col items-center ${isSearching ? "justify-start pt-8 pb-4" : "justify-center"}`}
      >
        <div className="pointer-events-auto flex flex-col items-center gap-8 w-full max-w-2xl px-6">

          {/* Logo / Title */}
          <motion.div
            layoutId="logo"
            className={`font-extrabold tracking-tighter transition-all duration-700 ${isSearching ? "text-3xl" : "text-7xl mb-8"}`}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 drop-shadow-sm">INT</span>
            <span className="text-slate-800 drop-shadow-sm"> Intelligence</span>
          </motion.div>

          {/* Search Bar */}
          <motion.form
            layoutId="search-bar"
            onSubmit={handleSearch}
            className={`relative w-full transition-all duration-500 ${isSearching ? "max-w-3xl" : "max-w-xl scale-100"}`}
          >
            <div className={`
              relative group rounded-full overflow-hidden transition-all duration-500
              ${isSearching ? "shadow-lg bg-white/40" : "shadow-2xl bg-white/20"}
              backdrop-blur-xl border border-white/50 ring-1 ring-black/5
              ${isLoading ? "ring-2 ring-blue-500/30" : ""}
            `}>
              <div className={`absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur opacity-0 group-hover:opacity-10 transition duration-1000 ${isSearching ? "hidden" : "block"}`}></div>
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask anything..."
                disabled={isLoading}
                className="relative w-full bg-white/60 text-slate-800 border-0 rounded-full pl-8 pr-16 py-5 focus:ring-4 focus:ring-blue-500/5 focus:outline-none transition-all text-lg placeholder:text-slate-400 font-medium disabled:bg-white/90 disabled:text-slate-500"
              />
              <button
                type="submit"
                disabled={isLoading}
                className={`absolute right-2.5 top-2.5 p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md ${isLoading ? "opacity-80 scale-95 cursor-wait" : ""}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              </button>

              <ProgressBar isLoading={isLoading} themeColor={themeColor} />
            </div>
          </motion.form>

        </div>
      </div>

      {/* 
        RESULTS AREA
        Occupies the space below the top bar when searching
      */}
      <div ref={constraintsRef} className={`flex-1 relative transition-opacity duration-500 ${isSearching ? "opacity-100 pointer-events-auto mt-32" : "opacity-0 pointer-events-none"}`}>
        <div className="w-full h-full flex items-start justify-center p-8 overflow-y-auto">
          {widgets.map((widget) => {
            const designColor = (widget.data as UniversalCardData).design?.themeColor;
            return (
              <WidgetWrapper
                key={widget.id}
                id={widget.id}
                title={widget.title}
                zIndex={widget.zIndex}
                initialPosition={widget.position}
                initialSize={widget.initialSize}
                onClose={closeWidget}
                onFocus={bringToFront}
                dragConstraintsRef={constraintsRef}
                themeColor={designColor || themeColor}
                resizable={WIDGET_REGISTRY[widget.type as keyof typeof WIDGET_REGISTRY]?.resizable}
              >
                <UniversalCard data={widget.data} />
              </WidgetWrapper>
            );
          })}
        </div>
      </div>

    </main>
  );
}