const {initializeBrowser, configurePage} = require("./modules/playwright");
const {getCurrentTime} = require("./modules/core");
const {
    selectGeolocation,
    closeInterface,
    selectRunMode,
    selectHeadlessMode
} = require("./modules/questions");

(async () => {

    // CLEAR MISC CONSOLE LOGS OF PUNYCODE AND OTHER STUFF
    await new Promise(r => setTimeout(r, 10)).then(() => console.clear());

    const runMode = await selectRunMode();
    const headless = await selectHeadlessMode();
    const geolocation = await selectGeolocation();

    const browser = await initializeBrowser(headless, geolocation);
    const page = await browser.newPage();
    await configurePage(page);
    const url = 'https://music.youtube.com';
    await page.goto(url);

    closeInterface();
    console.clear();

    try {

        if (runMode === 'debug') {

            await page.evaluate(() => {
                document.addEventListener('mousemove', (event) => {
                    console.log('Mouse X:', event.clientX, 'Mouse Y:', event.clientY);
                });
            });

            await page.pause();

        } else if (runMode === 'messenger') {

        } else if (runMode === 'swipe') {
            /**
             * Example Swipe profiles
             * await swipeProfiles(page);
             */
        }

    } catch (error) {
        console.error('An error occurred app.js: ', error);
        await page.screenshot({path: `errors/${getCurrentTime()}.png`});
        closeInterface();
    }

})();