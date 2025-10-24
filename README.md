<p align="center">
  <!-- Logo (Optional) -->
  <!-- <img src="https://your-logo-url.png" alt="Logo" width="100"/> -->

  <img src="./notion-ui-optimizer.svg?refresh=4" alt="Notion UI Optimizer Logo" width="120">
  
  ![Notion UI Optimizer Logo](./notion-ui-optimizer.svg)

</p>
<h1 align="center">notion-ui-optimizer</h1>
<p align="center"><i>Streamline Notion’s interface. Hide distractions, unlock productivity.</i></p>
<p align="center">
  <img src="https://img.shields.io/badge/Made%20for-Notion-blue?style=flat-square"/>
  <img src="https://img.shields.io/badge/Version-1.0.0-blue?style=flat-square"/>
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square"/>
  <img src="https://img.shields.io/badge/Support-Tampermonkey-yellow?style=flat-square"/>
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square"/>
</p>

A custom userscript for [Tampermonkey](https://www.tampermonkey.net/) that streamlines [Notion.so’s](https://www.notion.so/) web UI, minimizing distractions and maximizing space for a crisp user experience.

Runs automatically in Tampermonkey ([Chrome](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en), [Edge](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd), [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/), [Opera](https://addons.opera.com/en/extensions/details/tampermonkey-beta/))

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Known Limitations](#known-limitations)
- [Roadmap](#roadmap)
- [License](#license)
- [Contact](#contact)

---

## Features

- Hides specific UI buttons (for example — lock, comment, star, mail icons, notion ai)
- Renames the sidebar label "Private" to "Personal"
- Optimizes header spacing and layout
- Continuously adapts to page updates for seamless performance
- Uses debounced event handling for efficient window resizing
- Provides toggleable console logging for debugging

---

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) browser extension
2. Create a new userscript and add the latest _notion-ui-optimizer_ code
3. Save and reload [Notion](https://www.notion.so)
4. Enable user scripts in browser extension settings
5. To view debugging logs, open the browser console (F12 or Ctrl+Shift+I)

---

## Usage

- Runs automatically on all Notion pages
- Waits for UI elements to load and reliably applies changes with retries if needed
- Monitors page updates in real time
- Uses debounced event handling to keep performance smooth on resize
- Customize:
  - Change which buttons are hidden by editing svgClassTargets in the script
  - Toggle console logging via const ENABLE_LOGGING = true; (set to false to disable)

---

## Known Limitations

- May break if Notion updates their DOM
- English UI labels only
- Some changes might be delayed if Notion changes loading behavior

---

## Roadmap
Planned improvements:

 - [ ]  Optimize header spacing
 - [ ]  Remove Notion AI sidebar option
 - [ ]  Disable comments feature by default
 - [ ]  Enable “Full width” setting by default

Feedback and contributions are welcome—open an issue or pull request!
      
---

## License
<small>MIT License © Damien Curtis<small>

## Contact
Reach out or follow for updates!

<sub>Last modified: 2025-10-23</sub>
