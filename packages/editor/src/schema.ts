import type * as React from "react";

export type Node = {
  id: string;
  type: string;          // "Page" or widget type
  props?: any;           // widget content props
  style?: React.CSSProperties; // inline styles
  children?: Node[];
};
