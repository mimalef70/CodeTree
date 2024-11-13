const fs = require('fs').promises;
const path = require('path');
const minimatch = require('minimatch'); 

/**
 * Check if a file is a text file
 * @param {string} filePath - Path to file
 * @param {number} maxSize - Maximum file size in MB
 * @returns {Promise<boolean>}
 */
async function isTextFile(filePath, maxSize) {
    try {
        const stats = await fs.stat(filePath);
        if (stats.size > maxSize * 1024 * 1024) {
            return false;
        }

        const buffer = Buffer.alloc(4100);
        const fileHandle = await fs.open(filePath, 'r');
        
        try {
            const { bytesRead } = await fileHandle.read(buffer, 0, 4100, 0);
            
            for (let i = 0; i < Math.min(bytesRead, 1024); i++) {
                const byte = buffer[i];
                if (byte < 32 && ![9, 10, 13].includes(byte)) {
                    return false;
                }
            }
            return true;
        } finally {
            await fileHandle.close();
        }
    } catch (error) {
        console.debug(`Error checking if file is text: ${filePath}`, error);
        return false;
    }
}

/**
 * Check if a file should be included based on configuration
 * @param {string} filePath - File path
 * @param {Object} config - Configuration object
 * @returns {boolean}
 */
function shouldIncludeFile(filePath, config) {
    const fileName = path.basename(filePath);
    const ext = path.extname(filePath).toLowerCase();

    // Check exclude files
    if (config.excludeFiles.includes(fileName)) {
        return false;
    }

    // Check exclude patterns
    if (config.patterns.exclude.some(pattern => 
        minimatch(filePath, pattern)
    )) {
        return false;
    }

    // Check include patterns
    if (config.patterns.include.length > 0 &&
        !config.patterns.include.some(pattern => 
            minimatch(filePath, pattern)
        )) {
        return false;
    }

    return config.extensions.includes(ext);
}

/**
 * Check if a path should be ignored
 * @param {string} itemPath - Path to check
 * @param {Object} config - Configuration object
 * @returns {boolean}
 */
function shouldIgnorePath(itemPath, config) {
    const normalizedPath = itemPath.toLowerCase();
    
    // Check ignored directories
    if (config.ignoredDirectories.some(dir => {
        const pattern = dir.replace(/\*/g, '.*');
        const regex = new RegExp(pattern, 'i');
        return regex.test(normalizedPath);
    })) {
        return true;
    }

    // Check ignore patterns
    return config.patterns.ignore.some(pattern => 
        minimatch(normalizedPath, pattern)
    );
}

module.exports = {
    isTextFile,
    shouldIncludeFile,
    shouldIgnorePath
};