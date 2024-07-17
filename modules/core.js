const fs = require('fs');
const path = require('path');

const loadConfig = () => {
    const configPath = path.join(__dirname, '..', 'config.json');
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
}

const createDirectory = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, {recursive: true});
    }
};

const getCurrentTime = () => {
    const currentDate = new Date();
    return currentDate.toISOString()
        .replace(/T/, '_')
        .replace(/\..+/, '')
        .replace(/:/g, '_')
        .replace(/-/g, '_');
}

module.exports = {
    loadConfig,
    getCurrentTime,
    createDirectory
};