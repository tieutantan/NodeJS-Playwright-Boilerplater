const { chromium } = require('playwright-extra');
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
        permissions: ['geolocation']
    };

    // if config.BROWSER_USER_AGENT is empty or not set, then remove userAgent from options
    if (!config.BROWSER_USER_AGENT) {
        delete options.userAgent;
    }

    // if geolocation.latitude is 1111, use default geolocation
    if (geolocation.latitude === 1111) {
        delete options.geolocation;
    }

    // Applies various techniques to make detection of headless puppeteer harder
    chromium.use(stealth);

    return chromium.launchPersistentContext(userDataDir, options);
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