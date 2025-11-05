// ==UserScript==
// @name         notion-ui-optimizer 1.2
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Last modified: 2025-11-05
// @author       damienc
// @match        *://www.notion.so/*
// @license      MIT
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // === Utility Functions ===
    const ENABLE_LOGGING = true;
    const log = (...args) => { if (ENABLE_LOGGING) { console.log('[Notion UI Optimizer]', ...args); } };
    const debounce = (func, delay) => {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    };

    // === UI Manipulation Functions ===
    const svgClassTargets = [
        'svg.lockFill', 'svg.commentFilled', 'svg.star', 'svg.home', 'svg.inbox', 'svg.aiFace',
        'svg.templates', 'svg.inviteMember', 'svg.mail', 'svg.notionTintable', 'svg.calendarDate03',
        'svg.boxOpenSparkle', 'svg.questionMarkCircle'
    ];

    const hideElements = () => {
        svgClassTargets.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(svg => {
                const button = svg.closest('div[role="button"]') || svg.closest('a') || svg.closest('div');
                if (button) {
                    button.style.display = 'none';
                }
            });
        });
        const aiButtons = document.querySelectorAll('div[role="button"][aria-label="ai"]');
        aiButtons.forEach(btn => { btn.style.display = 'none'; });
        const editedTextElements = document.querySelectorAll('span');
        editedTextElements.forEach(el => {
            if (el.innerText.includes('Edited')) { el.style.display = 'none'; }
        });
    };

    const compactHeaderAndMoveAddCover = () => {
        const editable = document.querySelector('.whenContentEditable');
        if (!editable) return;

        const coverImg = editable.querySelector(
            'div[style*="position: relative"][style*="max-height: 280px;"] img'
        );
        const pageIcon = editable.querySelector('.notion-record-icon');
        const addCoverBtn = Array.from(editable.querySelectorAll('div[role="button"]'))
            .find(btn => btn.textContent.trim().toLowerCase() === 'add cover');
        const pageHeading = editable.querySelector('.notion-page-block h1');
        const iconHeadingContainer = pageIcon ? pageIcon.parentElement?.parentElement : null;

        if (!pageIcon || !addCoverBtn || !pageHeading) return;

        if (!coverImg) {
            pageIcon.style.marginTop = '0';
            pageIcon.style.marginBottom = '0';
            pageIcon.style.display = 'inline-flex';
            pageIcon.style.verticalAlign = 'middle';

            addCoverBtn.style.display = 'inline-flex';
            addCoverBtn.style.marginLeft = '12px';
            addCoverBtn.style.marginTop = '0';
            addCoverBtn.style.marginBottom = '0';
            addCoverBtn.style.verticalAlign = 'middle';

            if (addCoverBtn.parentElement !== pageIcon.parentElement || addCoverBtn.previousSibling !== pageIcon) {
                pageIcon.parentElement.insertBefore(addCoverBtn, pageIcon.nextSibling);
            }

            const parent = pageIcon.parentElement;
            parent.style.display = 'flex';
            parent.style.flexDirection = 'row';
            parent.style.alignItems = 'center';
            parent.style.marginTop = '0';
            parent.style.marginBottom = '0';
            parent.style.paddingTop = '0';
            parent.style.paddingBottom = '0';

            pageHeading.style.marginTop = '0';
            pageHeading.style.marginBottom = '0.25em';
            if (iconHeadingContainer) {
                iconHeadingContainer.style.marginBottom = '0';
                iconHeadingContainer.style.paddingBottom = '0';
            }
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
            const stickyPortal = editable.querySelector('.sticky-portal-target');
            if (stickyPortal) {
                stickyPortal.style.marginBottom = '0';
                stickyPortal.style.height = '0';
            }
        } else {
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

    // === Set Wide Layout ===
    const enforceWideClass = () => {
    document.querySelectorAll('.layout').forEach(el => {
        if (!el.classList.contains('layout-wide')) el.classList.add('layout-wide');
        if (el.classList.contains('layout-full')) el.classList.remove('layout-full');
        // Ensure the custom properties match wide mode
        el.style.setProperty('--content-width', '1fr', 'important');
        el.style.setProperty('--margin-width', '96px', 'important');
        el.style.removeProperty('padding-bottom'); // optional, but matches your earlier sample
    });
};


    // === Sidebar Label Rename ===
    const renamePrivateToPersonal = () => {
        const privateTextElement = document.querySelector('.notion-outliner-private-header span');
        if (privateTextElement?.textContent === 'Private') {
            requestAnimationFrame(() => {
                privateTextElement.textContent = 'Personal';
            });
            return true;
        }
        return false;
    };

    const tryRename = (attempts = 0, maxAttempts = 10) => {
        if (attempts < maxAttempts) {
            if (!renamePrivateToPersonal()) {
                setTimeout(() => tryRename(attempts + 1, maxAttempts), 500);
            }
        }
    };

    // Shared section detection and force reload
    const areSharedSectionAndPagesLoaded = () => {
        const sharedSection = document.querySelector('.notion-outliner-shared');
        return sharedSection && sharedSection.querySelectorAll('.notion-page-block').length > 0;
    };

    const forceReloadSharedSection = () => {
        const sharedSection = document.querySelector('.notion-outliner-shared');
        if (sharedSection) {
            sharedSection.style.display = 'none';
            setTimeout(() => {
                sharedSection.style.display = '';
            }, 50);
        }
    };

    // === Tweaks Runner ===
    const runAllUiTweaks = () => {
        hideElements();
        compactHeaderAndMoveAddCover();
        enforceWideClass();
    };

    const monitorSharedSection = () => {
        requestAnimationFrame(() => {
            if (areSharedSectionAndPagesLoaded()) {
                runAllUiTweaks();
            } else {
                monitorSharedSection();
            }
        });
    };

    // === Initialization ===
    const MAX_INIT_ATTEMPTS = 20;
    const INIT_RETRY_INTERVAL = 500;

    const initWhenReady = (attempts = 0) => {
        const sidebarLoaded = document.querySelector('.notion-sidebar-container');
        const sharedSection = document.querySelector('.notion-outliner-shared');
        if (sidebarLoaded && sharedSection) {
            forceReloadSharedSection();
            monitorSharedSection();
            tryRename();
        } else if (attempts < MAX_INIT_ATTEMPTS) {
            setTimeout(() => initWhenReady(attempts + 1), INIT_RETRY_INTERVAL);
        }
    };

    const initObserver = new MutationObserver(() => {
        const sidebar = document.querySelector('.notion-sidebar-container');
        if (sidebar) {
            initObserver.disconnect();
            initWhenReady();
        }
    });

    initObserver.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('resize', debounce(() => {
        runAllUiTweaks();
    }, 400));

    const pageObserver = new MutationObserver(runAllUiTweaks);
    pageObserver.observe(document.body, { childList: true, subtree: true });

    setInterval(enforceWideClass, 1500);

})();
