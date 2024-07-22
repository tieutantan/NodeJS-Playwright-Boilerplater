const {chromium} = require('playwright-extra');
const stealth = require('puppeteer-extra-plugin-stealth')();
const {loadConfig, createDirectory, getPath} = require("./core");
const config = loadConfig();

/**
 * Build extension arguments
 * @param extensionPaths
 * @returns {string[]}
 */
const buildExtensionArgs = (extensionPaths) => {
    const formattedArgs = ['--disable-notifications'];
    if (extensionPaths) {
        const paths = Array.isArray(extensionPaths) ? extensionPaths.join(',') : extensionPaths;
        formattedArgs.push(`--disable-extensions-except=${paths}`, `--load-extension=${paths}`);
    }
    return formattedArgs;
}

const initializeBrowser = async (headless, geolocation, isImportCookieMode) => {

    const userDataDir = getPath('browser');
    createDirectory(userDataDir);

    const errorPhotosDir = getPath('errors');
    createDirectory(errorPhotosDir);

    let extensionsPath = [];
    if (isImportCookieMode === 'cookie') {
        extensionsPath.push(getPath('extensions/j2team-cookies'));
    }

    let options = {
        headless: headless,
        args: buildExtensionArgs(extensionsPath),
        viewport: config.BROWSER_VIEWPORT_SIZE,
        userAgent: config.BROWSER_USER_AGENT,
        geolocation: geolocation,
        permissions: ['geolocation'],
        ignoreHTTPSErrors: true,
        locale: 'en-US',
        timezoneId: 'America/New_York',
        incognito: true,
    };

    // if config.BROWSER_USER_AGENT is empty or not set, then remove userAgent from options
    if (!config.BROWSER_USER_AGENT) {
        delete options.userAgent;
    }

    // if geolocation.latitude is 1111, use default geolocation
    if (geolocation.latitude === 1111) {
        delete options.geolocation;
        delete options.permissions;
    }

    // Applies various techniques to make detection of headless puppeteer harder
    chromium.use(stealth);

    const browser = await chromium.launchPersistentContext(userDataDir, options);

    // Remove navigator.webdriver property
    await browser.addInitScript(() => {
        Object.defineProperty(navigator, 'webdriver', {
            get: () => false,
        });
    });

    // Mock languages
    await browser.addInitScript(() => {
        Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
        Object.defineProperty(navigator, 'language', { get: () => 'en-US' });
        Object.defineProperty(navigator, 'platform', { get: () => 'Win32' });
    });

    // Mock permissions
    await browser.addInitScript(() => {
        const originalQuery = window.navigator.permissions.query;
        window.navigator.permissions.query = (parameters) => (
            parameters.name === 'notifications' ?
                Promise.resolve({ state: Notification.permission }) :
                originalQuery(parameters)
        );
    });

    // Bypass other detection methods
    await browser.addInitScript(() => {
        window.chrome = {
            runtime: {}
        };
        const originalQuery = window.navigator.permissions.query;
        window.navigator.permissions.query = (parameters) => (
            parameters.name === 'notifications' ?
                Promise.resolve({ state: Notification.permission }) :
                originalQuery(parameters)
        );
        Object.defineProperty(navigator, 'plugins', {
            get: () => [1, 2, 3, 4, 5],
        });
        Object.defineProperty(navigator, 'languages', {
            get: () => ['en-US', 'en'],
        });
    });

    return browser;

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