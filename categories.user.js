// ==UserScript==
// @name         YouTube Category Display
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Adds video category to description
// @author       akavi
// @match        *://www.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const BADGE_ID = 'yt-safe-category-badge';

    // We use a simple interval to avoid freezing the browser with MutationObservers
    setInterval(() => {
        // 1. Only run on watch pages
        if (!window.location.href.includes('/watch')) return;

        // 2. Try to get the category
        const player = document.getElementById('movie_player');
        let category = null;
        if (player && player.getPlayerResponse) {
            try {
                category = player.getPlayerResponse().microformat.playerMicroformatRenderer.category;
            } catch (e) {
                // Category data not ready yet, just wait for next interval
                return;
            }
        }

        if (!category) return;

        // 3. Find the Description container (based on your XPath)
        // We target the parent of the text expander to sit nicely at the bottom
        const descriptionTarget = document.querySelector('#description-inner');

        if (!descriptionTarget) return;

        // 4. Check if our badge already exists
        let badge = document.getElementById(BADGE_ID);

        // 5. If it doesn't exist, create it. If it does, just update text.
        if (!badge) {
            badge = document.createElement('div');
            badge.id = BADGE_ID;

            // Style it to look native
            badge.style.marginTop = '15px';
            badge.style.paddingTop = '10px';
            badge.style.borderTop = '1px solid rgba(255, 255, 255, 0.2)';
            badge.style.color = '#AAAAAA'; // Light gray for visibility
            badge.style.fontSize = '14px';
            badge.style.fontFamily = 'Roboto, Arial, sans-serif';
            badge.style.fontWeight = '500';

            // Insert at the VERY END of the description box
            descriptionTarget.appendChild(badge);
        }

        // Always ensure the text is current (handling video changes)
        if (badge.textContent !== `Category: ${category}`) {
            badge.textContent = `Category: ${category}`;
        }

    }, 1000); // Checks every 1 second (Safe and low CPU usage)
})();
