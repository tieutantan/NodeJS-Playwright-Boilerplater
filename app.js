const {initializeBrowser, configurePage} = require("./modules/playwright");
const {getCurrentTime} = require("./modules/core");
const {
    selectGeolocation,
    closeInterface,
    selectRunMode,
    selectHeadlessMode
} = require("./modules/questions");

(async () => {

    // Clear Misc Console Logs Of Punycode And Other Stuff
    await new Promise(r => setTimeout(r, 10)).then(() => console.clear());

    const runMode = await selectRunMode();
    const headless = await selectHeadlessMode();
    const geolocation = await selectGeolocation();

    const browser = await initializeBrowser(headless, geolocation, runMode);
    const page = await browser.newPage();
    await configurePage(page);
    const url = 'https://bot.sannysoft.com';
    await page.goto(url);

    closeInterface();
    console.clear();

    try {

        if (runMode === 'debug' || runMode === 'cookie') {

            await page.evaluate(() => {
                document.addEventListener('mousemove', (event) => {
                    console.log('Mouse X:', event.clientX, 'Mouse Y:', event.clientY);
                });
            });

            await page.pause();

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