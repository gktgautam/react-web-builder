export * from "./registry";
import { registerSectionWidget } from "./section";
import { registerColumnWidget } from "./column";
import { registerHeadingWidget } from "./heading";
import { registerTextWidget } from "./text";
import { registerButtonWidget } from "./button";
import { registerImageWidget } from "./image";
import { registerDividerWidget } from "./divider";
import { registerSpacerWidget } from "./spacer";


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
