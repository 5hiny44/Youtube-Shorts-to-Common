// ==UserScript==
// @name         Youtube Shorts to Common
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Youtube Short to Common UI.
// @author       You
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// ==/UserScript==

// 1.打開shorts頁面時，能自動跳轉至一般頁面。
// 2.觀看完後，上一頁回到shorts頁面，能避免反覆跳轉。(利用 localStorage 來記住最後一次瀏覽的影片ID是什麼。)

(function() {
    'use strict';

    window.addEventListener('load', function(event) {
        shortsToCommon();
    })

    document.addEventListener('yt-navigate-finish', function(event) {
        shortsToCommon();
    });

    function shortsToCommon() {
        const currentURL = window.location.href;
        const urlWithoutQueryString = currentURL.split("?")[0];
        const queryString = currentURL.split("?")[1];

        if(urlWithoutQueryString.match("/watch")) {
            localStorage.setItem("previousVideoID", queryString.match(/v=[^?&#/]*/g)[0].split("=")[1]);
            return 0;
        };

        if(urlWithoutQueryString.match("/shorts")) {
            const urlElements = urlWithoutQueryString.split("/");
            const shortsID = urlElements[urlElements.length - 1];

            if(shortsID == localStorage.getItem("previousVideoID")) {
                // 如果前次預覽過這支影片，則回到 shorts 就不要再次跳轉。
                return 0;
            };

            const youtubeURL = "https://www.youtube.com";
            const uri = "/watch?v=" + shortsID;
            location.assign(youtubeURL + uri);
        }
    }

})();