"use client";
import * as React from "react";
import { useDroppable } from "@dnd-kit/core";

export function DropSlot({ parentId, index }: { parentId: string; index: number }) {
  const { isOver, setNodeRef } = useDroppable({
    id: `drop:${parentId}:${index}`,
    data: { parentId, index }
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        minHeight: 16,
        border: "2px dashed",
        borderColor: isOver ? "#3b82f6" : "#e5e7eb",
        background: isOver ? "#eff6ff" : "transparent",
        borderRadius: 8,
        margin: "6px 0"
      }}
      aria-label="Drop here"
    />
  );
}
