# notion-ui-optimizer

A userscript that enhances the Notion.so web UI by hiding certain unwanted buttons, renaming sidebar labels, and ensuring the Shared section renders properly. It improves the Notion interface by cleaning up clutter and fixing some UI rendering quirks. Run inside Tampermonkey.

---

## Features

- Hides specific UI buttons by targeting their SVG icons (e.g., lock, comment, star, mail icons).  
- Renames the sidebar label "Private" to "Personal".  
- Forces the Shared section to re-render for proper display.  
- Continuously monitors the UI to apply changes as pages load dynamically.  
- Debounces UI updates during window resize to improve performance.  
- Detailed console logging for debugging (can be toggled).
- Compact header layout: reduces spacing when no cover image is present, aligns "Add cover" button with the page icon, restores default layout when a cover is added.
- Automatic hiding of Notion AI button.

---

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) browser extension (Chrome, Firefox, Edge, etc.).  
2. Create a new userscript and paste the entire `notion-ui-optimizer` script into it.  
3. Save the userscript and visit [https://www.notion.so](https://www.notion.so). The script will automatically activate.  
4. Open the browser console (F12 or Ctrl+Shift+I) to view logs if needed.

---

## Usage

- The script runs automatically on any Notion page (`*://www.notion.so/*`).  
- It waits for Notion’s sidebar and Shared section to load before applying UI optimizations.  
- UI elements are hidden and renamed dynamically as needed.  
- On window resize, UI cleanup functions run after a short delay (debounced).  
- Enable or disable logging by setting `ENABLE_LOGGING` to `true` or `false` in the script.

---

## Configuration

- To toggle console logging, edit the line:  
  ```js
  const ENABLE_LOGGING = true; // Set to false to disable logs

To modify which buttons are hidden, update the svgClassTargets array in the script.

Development Notes
The script uses MutationObserver to detect when Notion’s sidebar loads, then initializes itself.

Functions use retries with delays to handle dynamic content loading in Notion.

The script employs a debounced function wrapper to avoid performance issues during rapid events like window resizing.

Versioning follows semantic rules within the script metadata.

Known Limitations
UI element selectors rely on Notion’s current DOM structure, which may change and break the script.

The script currently only supports English UI labels.

Some UI updates might not be instant if Notion changes how sections load.

Contributing
Contributions, issues, and feature requests are welcome! Please open an issue or submit a pull request.

License
MIT License © Damien C

Contact
Feel free to reach out or follow me for updates!

Last modified: 2025-07-06