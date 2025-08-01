import { backButton, viewport, themeParams, miniApp, initData, $debug, init as initSDK, swipeBehavior } from "@telegram-apps/sdk-react";

/**
 * Initializes the application and configures its dependencies.
 */
export function init(debug: boolean): void {
  // Set @telegram-apps/sdk-react debug mode.
  $debug.set(debug);

  // Initialize special event handlers for Telegram Desktop, Android, iOS, etc.
  // Also, configure the package.
  initSDK();

  // Mount all components used in the project.
  backButton.isSupported() && backButton.mount();
  miniApp.mount();
  themeParams.mount();
  initData.restore();
  viewport
    .mount()
    .then(() => {
      console.log("!!!viewport.isCssVarsBound()", viewport.isCssVarsBound());
      if (!viewport.isCssVarsBound()) {
        viewport.bindCssVars();
      }
    })
    .catch((e) => {
      console.error("Something went wrong mounting the viewport", e);
    });

  // Define components-related CSS variables.
  miniApp.bindCssVars();
  themeParams.bindCssVars();

  // Additional
  viewport.expand();
  if (miniApp.headerColor()) {
    miniApp.setHeaderColor("#ffffff");
    miniApp.setBackgroundColor("#ffffff");
  }

  if (swipeBehavior.isSupported()) {
    swipeBehavior.mount();
    swipeBehavior.disableVertical();
  }

  // Add Eruda if needed.
  debug && import("eruda").then((lib) => lib.default.init()).catch(console.error);
}
