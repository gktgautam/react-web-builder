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
  React.useEffect(() => {
    if (!(window as any).__widgets_registered__) {
      registerDefaultWidgets();
      (window as any).__widgets_registered__ = true;
    }
  }, []);

  const moveNode = useEditorStore((s) => s.moveNode);
  const addChild = useEditorStore((s) => s.addChild);
  const getPage = () => useEditorStore.getState().page;
  const onDragEnd = makeOnDragEnd({ moveNode, addChild, createFromWidget, getPage });

  // 👇 read selection from store
  const selectedId = useEditorStore((s) => s.selectedId);

  // Panels state
  const [panels, setPanels] = React.useState<Record<PanelKey, boolean>>({
    WidgetPalette: true,
    PropertyPanel: false,
    LayersPanel: true,
  });

  // 🔁 Auto-switch based on selection:
  // - when something is selected => show PropertyPanel, hide WidgetPalette
  // - when selection is cleared    => show WidgetPalette, hide PropertyPanel
  React.useEffect(() => {
    setPanels((prev) => ({
      ...prev,
      PropertyPanel: Boolean(selectedId),
      WidgetPalette: !selectedId,
    }));
  }, [selectedId]);

  // Mutually-exclusive logic for Palette vs Properties.
  // Layers stays independent.
  const ShowPanel = (key: PanelKey, action: "" | "show" | "hide" = "") => {
    setPanels((prev) => {
      const next = { ...prev };

      const resolve = (current: boolean) =>
        action === "show" ? true : action === "hide" ? false : !current;

      if (key === "WidgetPalette") {
        const val = resolve(prev.WidgetPalette);
        next.WidgetPalette = val;
        if (val) next.PropertyPanel = false; // exclusivity
        return next;
      }

      if (key === "PropertyPanel") {
        const val = resolve(prev.PropertyPanel);
        next.PropertyPanel = val;
        if (val) next.WidgetPalette = false; // exclusivity
        return next;
      }

      // LayersPanel is independent
      next.LayersPanel = resolve(prev.LayersPanel);
      return next;
    });
  };

  return (
    <>
      <header className="text-white flex items-center px-4 bg-[#0c0d0e] h-[48px] gap-6">
        <div className="font-bold text-xl">Builder</div>

        <div className="flex items-center gap-4">
          {/* Clicking this always prefers WidgetPalette and hides PropertyPanel */}
          <button
            title="Toggle Widget Palette"
            onClick={() => ShowPanel("WidgetPalette")}
            className={`p-2 rounded ${panels.WidgetPalette ? "bg-white/10" : "bg-transparent"}`}
          >
            <Plus />
          </button>

          <button
            title="Toggle Layers Panel"
            onClick={() => ShowPanel("LayersPanel")}
            className={`p-2 rounded ${panels.LayersPanel ? "bg-white/10" : "bg-transparent"}`}
          >
            <Layers />
          </button>

          <button
            title="Toggle Property Panel"
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
            <div className="px-3 py-2 font-semibold border-b">Layers</div>
            <div className="h-[calc(100%-40px)] overflow-auto">
              <LayersPanel />
            </div>
          </aside>
        </DraggableResizable>
      )}
    </>
  );
}
