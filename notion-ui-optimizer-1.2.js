// ==UserScript==
// @name         notion-ui-optimizer 1.2
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Last modified: 2025-11-03
// @author       damienc
// @match        *://www.notion.so/*
// @license      MIT
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // === Utility Functions ===

    // Function: Prints messages to the console if logging is enabled
    const ENABLE_LOGGING = true;
    const log = (...args) => {
        if (ENABLE_LOGGING) {
            console.log('[Notion UI Optimizer]', ...args);
        }
    };

    // Function: Returns a debounced version of a function that delays execution until no calls happen for "delay" milliseconds
    const debounce = (func, delay) => {
        let timeout;
        return function (...args) {
            clearTimeout(timeout); // Clear any previously scheduled call
            timeout = setTimeout(() => func.apply(this, args), delay); // Schedule new call after delay
        };
    };

    // === UI Manipulation Functions ===

    // List of SVG icon CSS selectors for buttons to hide
    const svgClassTargets = [
        'svg.lockFill',
        'svg.commentFilled',
        'svg.star',
        'svg.home',
        'svg.inbox',
        'svg.aiFace',
        'svg.templates',
        'svg.inviteMember',
        'svg.mail',
        'svg.notionTintable',
        'svg.calendarDate03',
        'svg.boxOpenSparkle',
        'svg.questionMarkCircle'
    ];

    // Function: Hide specific buttons by finding their icons and hiding their parent containers
    const hideElements = () => {
        log('🔍 Hiding unwanted buttons...');
        svgClassTargets.forEach(selector => {
            log('Looking for: ' + selector);
            const elements = document.querySelectorAll(selector);
            if (elements.length === 0) {
                log('⚠️ No elements found for: ' + selector);
            }
            elements.forEach(svg => {
                const button = svg.closest('div[role="button"]') || svg.closest('a') || svg.closest('div');
                if (button) {
                    button.style.display = 'none';
                    log('✅ Hiding: ' + selector);
                } else {
                    log('❌ No container found for: ' + selector);
                }
            });
        });

        // Hide Notion AI button
        const aiButtons = document.querySelectorAll('div[role="button"][aria-label="ai"]');
        aiButtons.forEach(btn => {
            btn.style.display = 'none';
            log('✅ Hiding Notion AI button by aria-label');
        });

        // Function: Hide any span elements containing the text "Edited"
        const editedTextElements = document.querySelectorAll('span');
        log('Scanning ' + editedTextElements.length + ' spans for "Edited"...');
        editedTextElements.forEach(el => {
            if (el.innerText.includes('Edited')) {
                el.style.display = 'none';
                log('✅ Hiding "Edited" text: ' + el.innerText);
            }
        });
    };

    /**
     * Compact header, remove all vertical space, and align "Add cover" button perfectly with the icon.
     * Also moves the page heading (e.g. "Home") up to minimize wasted space.
     */
    const compactHeaderAndMoveAddCover = () => {
        const editable = document.querySelector('.whenContentEditable');
        if (!editable) return;

        // Detect cover image
        const coverImg = editable.querySelector(
            'div[style*="position: relative"][style*="max-height: 280px;"] img'
        );

        // Find the page icon and "Add cover" button
        const pageIcon = editable.querySelector('.notion-record-icon');
        const addCoverBtn = Array.from(editable.querySelectorAll('div[role="button"]'))
            .find(btn => btn.textContent.trim().toLowerCase() === 'add cover');

        // Find the heading (page title)
        const pageHeading = editable.querySelector('.notion-page-block h1');
        // Find the container that wraps the icon and heading
        const iconHeadingContainer = pageIcon ? pageIcon.parentElement?.parentElement : null;

        if (!pageIcon || !addCoverBtn || !pageHeading) return;

        if (!coverImg) {
            // --- Icon & Add Cover Button (already handled previously) ---
            pageIcon.style.marginTop = '0';
            pageIcon.style.marginBottom = '0';
            pageIcon.style.display = 'inline-flex';
            pageIcon.style.verticalAlign = 'middle';

            addCoverBtn.style.display = 'inline-flex';
            addCoverBtn.style.marginLeft = '12px';
            addCoverBtn.style.marginTop = '0';
            addCoverBtn.style.marginBottom = '0';
            addCoverBtn.style.verticalAlign = 'middle';

            // Move "Add cover" button next to icon if not already there
            if (addCoverBtn.parentElement !== pageIcon.parentElement || addCoverBtn.previousSibling !== pageIcon) {
                pageIcon.parentElement.insertBefore(addCoverBtn, pageIcon.nextSibling);
            }

            // Make parent a flex row and center items
            const parent = pageIcon.parentElement;
            parent.style.display = 'flex';
            parent.style.flexDirection = 'row';
            parent.style.alignItems = 'center';
            parent.style.marginTop = '0';
            parent.style.marginBottom = '0';
            parent.style.paddingTop = '0';
            parent.style.paddingBottom = '0';

            // --- Move Heading Up (minimize space below icon/button) ---
            // Remove margin from the heading itself
            pageHeading.style.marginTop = '0';
            pageHeading.style.marginBottom = '0.25em'; // Small gap, tweak as needed
            // Remove padding/margin from the heading's parent container
            if (iconHeadingContainer) {
                iconHeadingContainer.style.marginBottom = '0';
                iconHeadingContainer.style.paddingBottom = '0';
            }

            // Remove extra vertical space from layout containers
            const layoutWide = editable.querySelector('.layout.layout-wide');
            if (layoutWide) {
                layoutWide.style.paddingTop = '0';
                layoutWide.style.paddingBottom = '0';
                layoutWide.style.marginTop = '0';
                layoutWide.style.marginBottom = '0';
            }
            const layoutFull = editable.querySelector('.layout-full');
            if (layoutFull) {
                layoutFull.style.marginTop = '0';
                layoutFull.style.marginBottom = '0';
                layoutFull.style.paddingTop = '0';
                layoutFull.style.paddingBottom = '0';
            }

            // Remove extra space above the whole header area
            const stickyPortal = editable.querySelector('.sticky-portal-target');
            if (stickyPortal) {
                stickyPortal.style.marginBottom = '0';
                stickyPortal.style.height = '0';
            }
        } else {
            // Restore default styles if cover is present
            pageIcon.style.marginTop = '';
            pageIcon.style.marginBottom = '';
            pageIcon.style.display = '';
            pageIcon.style.verticalAlign = '';
            addCoverBtn.style.display = '';
            addCoverBtn.style.marginLeft = '';
            addCoverBtn.style.marginTop = '';
            addCoverBtn.style.marginBottom = '';
            addCoverBtn.style.verticalAlign = '';
            const parent = pageIcon.parentElement;
            parent.style.display = '';
            parent.style.flexDirection = '';
            parent.style.alignItems = '';
            parent.style.marginTop = '';
            parent.style.marginBottom = '';
            parent.style.paddingTop = '';
            parent.style.paddingBottom = '';
            if (pageHeading) {
                pageHeading.style.marginTop = '';
                pageHeading.style.marginBottom = '';
            }
            if (iconHeadingContainer) {
                iconHeadingContainer.style.marginBottom = '';
                iconHeadingContainer.style.paddingBottom = '';
            }
            const layoutWide = editable.querySelector('.layout.layout-wide');
            if (layoutWide) {
                layoutWide.style.paddingTop = '';
                layoutWide.style.paddingBottom = '';
                layoutWide.style.marginTop = '';
                layoutWide.style.marginBottom = '';
            }
            const layoutFull = editable.querySelector('.layout-full');
            if (layoutFull) {
                layoutFull.style.marginTop = '';
                layoutFull.style.marginBottom = '';
                layoutFull.style.paddingTop = '';
                layoutFull.style.paddingBottom = '';
            }
            const stickyPortal = editable.querySelector('.sticky-portal-target');
            if (stickyPortal) {
                stickyPortal.style.marginBottom = '';
                stickyPortal.style.height = '';
            }
        }
    };

    // Function: Remove top space when no cover is present (legacy, kept for completeness)
    const adjustTopSpaceForNoCover = () => {
        // Now handled by compactHeaderAndMoveAddCover
    };

    // Function: Change sidebar label "Private" to "Personal"
    const renamePrivateToPersonal = () => {
        const privateTextElement = document.querySelector('.notion-outliner-private-header span');
        if (privateTextElement?.textContent === 'Private') {
            requestAnimationFrame(() => {
                privateTextElement.textContent = 'Personal';
                log('✅ Renamed "Private" to "Personal"');
            });
            return true;
        } else {
            log('❌ Could not rename "Private" — element not found or text mismatch.');
        }
        return false;
    };

    // Function: Repeatedly attempts to rename the sidebar label "Private" to "Personal" in case the element isn't available immediately following the page load
    const tryRename = (attempts = 0, maxAttempts = 10) => {
        if (attempts < maxAttempts) {
            if (!renamePrivateToPersonal()) {
                setTimeout(() => tryRename(attempts + 1, maxAttempts), 500);
            }
        } else {
            console.warn('⚠️ Max rename attempts reached.');
        }
    };

    // === Shared Section Handling ===

    // Function: Checks if the Shared section and subpages have loaded
    const areSharedSectionAndPagesLoaded = () => {
        const sharedSection = document.querySelector('.notion-outliner-shared');
        return sharedSection && sharedSection.querySelectorAll('.notion-page-block').length > 0;
    };

    // Function: Forces the Shared section to re-render by momentarily hiding it and then restoring it
    const forceReloadSharedSection = () =>{
        const sharedSection = document.querySelector('.notion-outliner-shared');
        if (sharedSection) {
            log('🔁 Forcing reload of Shared section...');
            sharedSection.style.display = 'none';
            setTimeout(() => {
                sharedSection.style.display = '';
                log('✅ Shared section restored.');
            }, 50);
        }
    };

    // Function: Run all UI tweaks (hide elements, adjust top space, etc.)
    const runAllUiTweaks = () => {
        hideElements();
        compactHeaderAndMoveAddCover();
    };

    // Function: Continuously checks if the Shared section has loaded; when loaded, runs UI tweaks to clean up UI
    const monitorSharedSection = () => {
        requestAnimationFrame(() => {
            if (areSharedSectionAndPagesLoaded()) {
                log('✅ Shared section and pages detected.');
                runAllUiTweaks();
            } else {
                log('⏳ Waiting for Shared section to load...');
                monitorSharedSection();
            }
        });
    };

    // === Initialization ===

    // Max attempts and interval for waiting for UI to be ready before initializing script
    const MAX_INIT_ATTEMPTS = 20;
    const INIT_RETRY_INTERVAL = 500;

    // Function: Waits for essential Notion UI elements to exist before starting the script
    const initWhenReady = (attempts = 0) => {
        const sidebarLoaded = document.querySelector('.notion-sidebar-container');
        const sharedSection = document.querySelector('.notion-outliner-shared');

        if (sidebarLoaded && sharedSection) {
            log('✅ Notion UI ready. Initializing...');
            forceReloadSharedSection();
            monitorSharedSection();
            tryRename();
        } else if (attempts < MAX_INIT_ATTEMPTS) {
            log('⏳ Waiting for Notion UI... attempt ' + (attempts + 1));
            setTimeout(() => initWhenReady(attempts + 1), INIT_RETRY_INTERVAL);
        } else {
            console.warn('⚠️ UI not ready after max attempts.');
        }
    };

    // Observe mutations to know when sidebar loads, then start the init process
    const initObserver = new MutationObserver(() => {
        const sidebar = document.querySelector('.notion-sidebar-container');
        if (sidebar) {
            initObserver.disconnect();
            initWhenReady();
        }
    });

    // Start observing the document body for changes (like sidebar loading)
    initObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    // When window resizes, debounce calling runAllUiTweaks so it doesn't run too often
    window.addEventListener('resize', debounce(() => {
        log('📐 Resize detected.');
        runAllUiTweaks();
    }, 400));

    // Observe DOM changes to re-run UI tweaks (for dynamic Notion UI)
    const pageObserver = new MutationObserver(runAllUiTweaks);
    pageObserver.observe(document.body, { childList: true, subtree: true });

})();
