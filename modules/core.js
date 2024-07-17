const fs = require('fs');
const path = require('path');

/**
 * Get the full path of a file or directory from root
 * @example getPath('config.json')
 * @param pathFromRoot
 * @returns {string}
 */
const getPath = (pathFromRoot) => {
    return path.join(process.cwd(), pathFromRoot);
};

const loadConfig = () => {
    return JSON.parse(fs.readFileSync(getPath('config.json'), 'utf-8'));
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
    createDirectory,
    getPath
};