const readline = require('readline');
const config = require("./core").loadConfig();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query) => {
    return new Promise((resolve) => rl.question(query, resolve));
};

const closeInterface = () => {
    rl.close();
};

const selectGeolocation = async () => {
    const geolocations = config.GEOLOCATIONS;

    console.log('SELECT A GEOLOCATION:');

    geolocations.forEach((geo, index) => {
        console.log(`${index + 1}. ${geo.name}`);
    });

    let answer = await askQuestion(`ENTER THE NUMBER (DEFAULT: ${geolocations[0].name}): `);
    const selectedIndex = parseInt(answer.toString()) - 1;

    if (selectedIndex >= 0 && selectedIndex < geolocations.length) {
        console.log(`SELECTED: ${geolocations[selectedIndex].name}.`);
        console.log('------');
        return geolocations[selectedIndex].location;
    } else {
        console.log(`SELECTED DEFAULTING: ${geolocations[0].name}.`);
        console.log('------');
        return geolocations[0].location;
    }

};

const selectRunMode = async () => {

    const runModes = config.RUN_MODES;

    console.log('SELECT RUN MODE:');
    runModes.forEach((mode, index) => {
        console.log(`${index + 1}. ${mode.name}`);
    });

    const answer = await askQuestion(`ENTER THE NUMBER (DEFAULT: ${runModes[0].name}): `);
    const selectedIndex = parseInt(answer.toString()) - 1;

    if (selectedIndex >= 0 && selectedIndex < runModes.length) {
        console.log(`SELECTED: ${runModes[selectedIndex].name}.`);
        console.log('------');
        return runModes[selectedIndex].value;
    } else {
        console.log(`SELECTED DEFAULTING: ${runModes[0].name}.`);
        console.log('------');
        return runModes[0].value;
    }

};

const selectHeadlessMode = async () => {

    const headlessModes = config.HEADLESS_MODES;

    console.log('SELECT HEADLESS MODE:');
    headlessModes.forEach((mode, index) => {
        console.log(`${index + 1}. ${mode.name}`);
    });

    const answer = await askQuestion(`ENTER THE NUMBER (DEFAULT: ${headlessModes[0].name}): `);
    const selectedIndex = parseInt(answer.toString()) - 1;

    if (selectedIndex >= 0 && selectedIndex < headlessModes.length) {
        console.log(`SELECTED: ${headlessModes[selectedIndex].name}.`);
        console.log('------');
        return headlessModes[selectedIndex].value;
    } else {
        console.log(`SELECTED DEFAULTING: ${headlessModes[0].name}.`);
        console.log('------');
        return headlessModes[0].value;
    }
};

module.exports = {
    askQuestion,
    closeInterface,
    selectGeolocation,
    selectHeadlessMode,
    selectRunMode
};