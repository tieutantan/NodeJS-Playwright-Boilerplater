const {chromium} = require('playwright');
const path = require('path');
const {loadConfig, createDirectory} = require("./core");
const config = loadConfig();

const buildExtensionArgs = (extensionPaths) => {
    if (!extensionPaths || (Array.isArray(extensionPaths) && extensionPaths.length === 0)) {
        return [];
    }

    let formattedArgs = [];
    if (Array.isArray(extensionPaths)) {
        // Multiple extensions
        const disableExtensionsExcept = `--disable-extensions-except=${extensionPaths.join(',')}`;
        const loadExtensions = `--load-extension=${extensionPaths.join(',')}`;
        formattedArgs.push(disableExtensionsExcept, loadExtensions);
    } else {
        // Single extension
        const disableExtensionsExcept = `--disable-extensions-except=${extensionPaths}`;
        const loadExtensions = `--load-extension=${extensionPaths}`;
        formattedArgs.push(disableExtensionsExcept, loadExtensions);
    }
    return formattedArgs;
}

const initializeBrowser = async (headless, geolocation, isImportCookieMode) => {

    const userDataDir = path.join(__dirname, '..', 'browser');
    createDirectory(userDataDir);

    const errorPhotosDir = path.join(__dirname, '..', 'errors');
    createDirectory(errorPhotosDir);

    let extensionsPath = [];
    if (isImportCookieMode === 'cookie') {
        extensionsPath = [
            path.join(__dirname, '..', 'extensions/j2team-cookies')
        ];
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