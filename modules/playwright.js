const {chromium} = require('playwright');
const path = require('path');
const {loadConfig, createDirectory} = require("./core");
const config = loadConfig();

const initializeBrowser = async (headless, geolocation) => {

    const userDataDir = path.join(__dirname, '..', 'browser');
    createDirectory(userDataDir);

    const errorPhotosDir = path.join(__dirname, '..', 'errors');
    createDirectory(errorPhotosDir);

    return chromium.launchPersistentContext(userDataDir, {
        headless: headless,
        channel: 'msedge',
        viewport: config.BROWSER_VIEWPORT_SIZE,
        userAgent: config.BROWSER_USER_AGENT,
        geolocation: geolocation,
        permissions: ['geolocation']
    });
};

const configurePage = async (page) => {
    // Blocking requests from specified domains
    await page.route('**/*', route => {
        const requestUrl = route.request().url();
        if (config.BLOCKED_URLS.some(domain => requestUrl.includes(domain))) {
            route.abort();
        } else {
            route.continue();
        }
    });

    /**
     * Intercepting requests
     */
    page.on('request', async request => {
        // request.url() - multiple urls loading in the browser
    });
};

module.exports = {
    initializeBrowser,
    configurePage
}