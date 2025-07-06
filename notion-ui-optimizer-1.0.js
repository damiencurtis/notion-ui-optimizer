// ==UserScript==
// @name         notion-ui-optimizer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Last modified: 2025-07-06
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
        'svg.templates',
        'svg.inviteMember',
        'svg.mail',
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
    const forceReloadSharedSection = () => {
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

    // Function: Continuously checks if the Shared section has loaded; when loaded, runs hideElements to clean up UI
    const monitorSharedSection = () => {
        requestAnimationFrame(() => {
            if (areSharedSectionAndPagesLoaded()) {
                log('✅ Shared section and pages detected.');
                hideElements();
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

    // When window resizes, debounce calling hideElements so it doesn't run too often
    window.addEventListener('resize', debounce(() => {
        log('📐 Resize detected.');
        hideElements();
    }, 400));

})();
