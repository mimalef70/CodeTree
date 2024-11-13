const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const defaultConfig = require('./default-config');

/**
 * Deep merge two objects
 * @param {Object} target
 * @param {Object} source
 * @returns {Object}
 */
function deepMerge(target, source) {
    for (const key in source) {
        if (source[key] instanceof Object && !Array.isArray(source[key])) {
            if (!target[key]) Object.assign(target, { [key]: {} });
            deepMerge(target[key], source[key]);
        } else {
            Object.assign(target, { [key]: source[key] });
        }
    }
    return target;
}

/**
 * Load configuration from various sources
 * @param {string} basePath - Base path to look for config files
 * @returns {Promise<Object>} - Processed configuration
 */
async function loadConfig(basePath) {
    const configFiles = [
        path.join(os.homedir(), '.codetreerc'),
        path.join(os.homedir(), '.config', 'codetree', 'config.json'),
        path.join(basePath, '.codetreerc'),
        path.join(basePath, 'codetree.config.json'),
        path.join(basePath, 'package.json')
    ];

    let config = { ...defaultConfig };

    for (const filePath of configFiles) {
        try {
            let fileConfig;
            
            if (filePath.endsWith('package.json')) {
                const pkg = JSON.parse(await fs.readFile(filePath, 'utf8'));
                fileConfig = pkg.codetree;
            } else {
                fileConfig = JSON.parse(await fs.readFile(filePath, 'utf8'));
            }

            if (fileConfig) {
                config = deepMerge(config, fileConfig);
                console.debug(`Loaded config from ${filePath}`);
            }
        } catch (error) {
            if (error.code !== 'ENOENT') {
                console.debug(`Error loading config from ${filePath}:`, error);
            }
        }
    }

    return processConfig(config);
}

/**
 * Process and validate configuration
 * @param {Object} config - Raw configuration
 * @returns {Object} - Processed configuration
 */
function processConfig(config) {
    const extensions = new Set();
    const ignoredDirs = new Set();

    // Process extension groups
    Object.entries(config.groups)
        .filter(([_, group]) => group.enabled)
        .forEach(([_, group]) => {
            group.extensions.forEach(ext => 
                extensions.add(ext.toLowerCase())
            );
        });

    // Add custom extensions
    config.include.extensions.forEach(ext => 
        extensions.add(ext.toLowerCase())
    );

    // Remove excluded extensions
    config.exclude.extensions.forEach(ext => 
        extensions.delete(ext.toLowerCase())
    );

    // Process ignored directories
    if (config.ignore.defaults) {
        config.ignore.defaultList.forEach(dir => 
            ignoredDirs.add(dir)
        );
    }
    
    config.ignore.custom.forEach(dir => 
        ignoredDirs.add(dir)
    );

    return {
        extensions: [...extensions],
        ignoredDirectories: [...ignoredDirs],
        output: config.output,
        patterns: {
            include: config.include.patterns,
            exclude: config.exclude.patterns,
            ignore: config.ignore.patterns
        },
        excludeFiles: config.exclude.files
    };
}

/**
 * Create default configuration file
 * @param {string} location - 'global' or 'local'
 */
async function createDefaultConfig(location = 'local') {
    const configPath = location === 'global' 
        ? path.join(os.homedir(), '.codetreerc')
        : '.codetreerc';

    try {
        await fs.writeFile(
            configPath, 
            JSON.stringify(defaultConfig, null, 2)
        );
        console.log(`✨ Created default config at: ${configPath}`);
    } catch (error) {
        console.error(`❌ Error creating config: ${error.message}`);
    }
}

module.exports = {
    loadConfig,
    createDefaultConfig
};