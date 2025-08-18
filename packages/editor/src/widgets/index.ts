export * from "./registry";
export { registerSectionWidget } from "./section";
export { registerColumnWidget } from "./column";
export { registerHeadingWidget } from "./heading";
export { registerTextWidget } from "./text";
export { registerButtonWidget } from "./button";
export { registerImageWidget } from "./image";
export { registerDividerWidget } from "./divider";
export { registerSpacerWidget } from "./spacer";

export function registerDefaultWidgets() {
  registerSectionWidget();
  registerColumnWidget();
  registerHeadingWidget();
  registerTextWidget();
  registerButtonWidget();
  registerImageWidget();
  registerDividerWidget();
  registerSpacerWidget();
}
