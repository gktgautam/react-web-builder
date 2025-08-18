// packages/editor/src/components/EditorLayout.tsx
"use client";
import React from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { useEditorStore } from "../store/createEditorStore";
import { makeOnDragEnd } from "../dnd/handlers";
import { createFromWidget } from "../lib/createFromWidget";
import { Sidebar } from "./Sidebar";
import { EditorCanvas } from "./EditorCanvas";
import { LayersPanel } from "./LayersPanel";
import { PropertyPanel } from "./PropertyPanel";
import { registerDefaultWidgets } from "../widgets";

export default function EditorLayout() {
React.useEffect(() => {
  if (!(window as any).__widgets_registered__) {
    registerDefaultWidgets();
    (window as any).__widgets_registered__ = true;
  }
}, []);
  

  const moveNode = useEditorStore((s) => s.moveNode);
  const addChild = useEditorStore((s) => s.addChild);
  const getPage  = () => useEditorStore.getState().page;

  const onDragEnd = makeOnDragEnd({ moveNode, addChild, createFromWidget, getPage });

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <div className="flex h-screen">
        <Sidebar />
        <EditorCanvas />
        <LayersPanel />
        <PropertyPanel />
      </div>
    </DndContext>
  );
}
