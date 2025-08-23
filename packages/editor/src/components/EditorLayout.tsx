// packages/editor/src/components/EditorLayout.tsx
"use client";
import React from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { useEditorStore } from "../store/createEditorStore";
import { makeOnDragEnd } from "../dnd/handlers";
import { createFromWidget } from "../lib/createFromWidget";

import { WidgetPalette } from "../palette/WidgetPalette";
import { EditorCanvas } from "./EditorCanvas";
import { LayersPanel } from "./LayersPanel";
import { PropertyPanel } from "./PropertyPanel";
import { registerDefaultWidgets } from "../widgets";

import DraggableResizable from "../dnd/DraggableWindow";
import { Layers, Plus } from "lucide-react";

type PanelKey = "WidgetPalette" | "PropertyPanel" | "LayersPanel";

export default function EditorLayout() {
  // Ensure widgets registered once
  React.useEffect(() => {
    if (!(window as any).__widgets_registered__) {
      registerDefaultWidgets();
      (window as any).__widgets_registered__ = true;
    }
  }, []);

  // DnD handlers
  const moveNode = useEditorStore((s) => s.moveNode);
  const addChild = useEditorStore((s) => s.addChild);
  const getPage = () => useEditorStore.getState().page;
  const onDragEnd = makeOnDragEnd({ moveNode, addChild, createFromWidget, getPage });

  // selection-driven toggling
  const selectedId = useEditorStore((s) => s.selectedId);

  const [panels, setPanels] = React.useState<Record<PanelKey, boolean>>({
    WidgetPalette: true,
    PropertyPanel: false,
    LayersPanel: true,
  });

  const lastSelected = React.useRef<string | null>(null);
  React.useEffect(() => {
    if (lastSelected.current !== selectedId) {
      setPanels((p) => ({ ...p, PropertyPanel: !!selectedId, WidgetPalette: !selectedId }));
      lastSelected.current = selectedId ?? null;
    }
  }, [selectedId]);

  const ShowPanel = (key: PanelKey, action: "" | "show" | "hide" = "") => {
    setPanels((prev) => {
      const next = { ...prev };
      const resolve = (cur: boolean) => (action === "show" ? true : action === "hide" ? false : !cur);
      if (key === "WidgetPalette") {
        const val = resolve(prev.WidgetPalette);
        next.WidgetPalette = val;
        if (val) next.PropertyPanel = false;
      } else if (key === "PropertyPanel") {
        const val = resolve(prev.PropertyPanel);
        next.PropertyPanel = val;
        if (val) next.WidgetPalette = false;
      } else {
        next.LayersPanel = resolve(prev.LayersPanel);
      }
      return next;
    });
  };

  // autosave
  const page = useEditorStore((s) => s.page);
  React.useEffect(() => {
    try { localStorage.setItem("rpb-doc", JSON.stringify({ tree: page })); } catch {}
  }, [page]);

  return (
    <>
      <header className="text-white flex items-center px-4 bg-[#0c0d0e] h-[48px] gap-6">
        <div className="font-bold text-xl">Builder</div>

        <div className="flex items-center gap-4">
          <button
            title="Toggle Widget Palette"
            aria-label="Toggle Widget Palette"
            onClick={() => ShowPanel("WidgetPalette")}
            className={`p-2 rounded ${panels.WidgetPalette ? "bg-white/10" : "bg-transparent"}`}
          >
            <Plus />
          </button>

          <button
            title="Toggle Layers Panel"
            aria-label="Toggle Layers Panel"
            onClick={() => ShowPanel("LayersPanel")}
            className={`p-2 rounded ${panels.LayersPanel ? "bg-white/10" : "bg-transparent"}`}
          >
            <Layers />
          </button>

          <button
            title="Toggle Property Panel"
            aria-label="Toggle Property Panel"
            onClick={() => ShowPanel("PropertyPanel")}
            className={`p-2 rounded ${panels.PropertyPanel ? "bg-white/10" : "bg-transparent"}`}
          >
            P
          </button>
        </div>
      </header>

      <div className="grid grid-cols-4 h-[calc(100vh-48px)]">
        <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <div className="col-span-1 flex flex-col gap-3 p-2 overflow-auto">
            {panels.WidgetPalette && (
              <section className="bg-white rounded-xl shadow p-2">
                <div style={{ fontWeight: 700, marginBottom: 8 }}>Widgets</div>
                <WidgetPalette />
              </section>
            )}

            {panels.PropertyPanel && (
              <section className="bg-white rounded-xl shadow p-2">
                <div style={{ fontWeight: 700, marginBottom: 8 }}>Properties</div>
                <PropertyPanel />
              </section>
            )}
          </div>

          <div className="col-span-3 overflow-hidden">
            <EditorCanvas />
          </div>
        </DndContext>
      </div>

      {panels.LayersPanel && (
        <DraggableResizable
          handle=".layers-header"
          defaultPosition={{ x: 150, y: 100 }}
          defaultSize={{ width: 400, height: 300 }}
          minWidth={200}
          minHeight={150}
          maxWidth={800}
          maxHeight={600}
          style={{
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            overflow: "hidden",
            zIndex: 50,
          }}
        >
          <aside className="border-gray-300 bg-gray-50 w-full h-full">
            <div className="layers-header px-3 py-2 font-semibold border-b cursor-move select-none">Layers</div>
            <div className="h-[calc(100%-40px)] overflow-auto">
              <LayersPanel />
            </div>
          </aside>
        </DraggableResizable>
      )}
    </>
  );
}
