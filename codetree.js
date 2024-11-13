#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const process = require('process');

// Constants
const MAX_FILE_SIZE = 5; // MB
const DEBUG = process.env.DEBUG === 'true';

// File extensions to include in the analysis
const CODE_FILE_EXTENSIONS = [
    // Programming Languages
    '.js', '.py', '.java', '.c', '.cpp', '.cs', '.go', '.rb', '.php',
    '.swift', '.kt', '.ts', '.jsx', '.tsx', '.vue',
    '.pl', '.pm', '.r', '.scala', '.groovy', '.lua', '.tcl', '.perl',

    // Web & Markup
    '.html', '.css', '.scss', '.sass', '.less', '.xml',
    '.json', '.yaml', '.yml', '.md', '.markdown',

    // Configuration
    '.ini', '.cfg', '.conf', '.properties', '.toml', '.env',
    '.gitignore', '.dockerignore', 'Dockerfile', 'docker-compose.yml',

    // CMS & Framework Specific
    '.module', '.install', '.theme', '.inc', '.profile',
    '.info.yml', '.libraries.yml', '.routing.yml', '.services.yml',
    '.permissions.yml', '.links.menu.yml', '.links.task.yml',
    '.links.action.yml', '.html.twig', '.twig',
    '.schema.yml', '.post_update.php', '.settings.yml',

    // Shell Scripts
    '.sh', '.bash', '.zsh', '.bat', '.cmd', '.ps1',

    // Database
    '.sql', '.psql', '.mysql',

    // Documentation
    '.txt', '.rst', '.adoc', '.asciidoc',

    // Other
    '.log', '.csv', '.tsv'
].map(ext => ext.toLowerCase());

// Directories to ignore
const IGNORED_DIRECTORIES = [
    // Version Control
    '.git', '.svn', '.hg',

    // Dependencies
    'node_modules', 'vendor', 'bower_components',
    'packages', 'composer', 'pip', 'env',

    // Build & Output
    'build', 'dist', 'out', 'release',
    'target', 'bin', 'obj',

    // IDE & Editor
    '.idea', '.vscode', '.sublime',

    // Temporary & Cache
    'temp', 'tmp', 'cache',
    'logs', 'coverage',

    // CMS Specific
    'sites/*/files',
    'sites/*/private',
    'sites/*/translations',

    // System
    '__pycache__', '.DS_Store'
];

/**
 * Debug logger
 * @param {string} message - Debug message
 * @param {...any} args - Additional arguments
 */
function debug(message, ...args) {
    if (DEBUG) {
        console.log(`🔍 Debug: ${message}`, ...args);
    }
}

/**
 * Checks if a file is a text file by examining its content
 * @param {string} filePath - Path to the file
 * @returns {Promise<boolean>} - True if the file is text, false otherwise
 */
async function isTextFile(filePath) {
    try {
        const stats = await fs.stat(filePath);
        if (stats.size > MAX_FILE_SIZE * 1024 * 1024) {
            debug(`File too large: ${filePath} (${stats.size} bytes)`);
            return false;
        }

        const buffer = Buffer.alloc(4100);
        const fileHandle = await fs.open(filePath, 'r');
        
        try {
            const { bytesRead } = await fileHandle.read(buffer, 0, 4100, 0);
            
            // Check for binary characters
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
        debug(`Error checking file type: ${filePath}`, error);
        return false;
    }
}

/**
 * Checks if a path should be ignored
 * @param {string} itemPath - Path to check
 * @returns {boolean} - True if path should be ignored
 */
function shouldIgnorePath(itemPath) {
    const normalizedPath = itemPath.toLowerCase();
    return IGNORED_DIRECTORIES.some(dir => {
        const pattern = dir.replace(/\*/g, '.*');
        const regex = new RegExp(pattern, 'i');
        return regex.test(normalizedPath);
    });
}

/**
 * Formats file size in a human-readable format
 * @param {number} bytes - Size in bytes
 * @returns {string} - Formatted size
 */
function formatFileSize(bytes) {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
}

/**
 * Generates a tree structure of the directory
 * @param {string} dir - Directory path to analyze
 * @param {string} prefix - Prefix for tree visualization
 * @returns {Promise<string>} - Formatted tree structure
 */
async function getDirectoryStructure(dir, prefix = '') {
    let result = '';
    
    try {
        const items = await fs.readdir(dir);
        const filteredItems = items.filter(item => !item.startsWith('.'));
        
        for (let i = 0; i < filteredItems.length; i++) {
            const item = filteredItems[i];
            const itemPath = path.join(dir, item);
            
            if (shouldIgnorePath(itemPath)) {
                debug(`Ignoring path: ${itemPath}`);
                continue;
            }
            
            const isLast = i === filteredItems.length - 1;
            const marker = isLast ? '└── ' : '├── ';
            
            try {
                const stats = await fs.stat(itemPath);
                
                if (stats.isDirectory()) {
                    result += `${prefix}${marker}${item}/ (${formatFileSize(stats.size)})\n`;
                    result += await getDirectoryStructure(itemPath, prefix + (isLast ? '    ' : '│   '));
                } else {
                    const ext = path.extname(item).toLowerCase();
                    const isSpecialFile = CODE_FILE_EXTENSIONS.includes(ext) || 
                                        CODE_FILE_EXTENSIONS.some(e => item.toLowerCase().endsWith(e));
                    
                    if (isSpecialFile && await isTextFile(itemPath)) {
                        const content = await fs.readFile(itemPath, 'utf8');
                        const lines = content.split('\n');
                        result += `${prefix}${marker}${item} (${lines.length} lines, ${formatFileSize(stats.size)})\n`;
                        result += `${prefix}${isLast ? '    ' : '│   '}Content:\n`;
                        result += lines.map(line => 
                            `${prefix}${isLast ? '    ' : '│   '}    ${line}`
                        ).join('\n') + '\n';
                    }
                }
            } catch (error) {
                debug(`Error processing: ${itemPath}`, error);
                result += `${prefix}${marker}${item} (Error: ${error.message})\n`;
            }
        }
    } catch (error) {
        debug(`Error reading directory: ${dir}`, error);
        throw new Error(`Failed to read directory: ${dir}`);
    }
    
    return result;
}

/**
 * Writes the directory structure to a file
 * @param {string} folderPath - Path to analyze
 * @returns {Promise<void>}
 */
async function writeStructureToFile(folderPath) {
    const outputPath = path.join(folderPath, 'code_structure_analysis.txt');
    
    try {
        // Remove previous file if exists
        await fs.unlink(outputPath).catch(() => {});
        
        console.log('🔍 Analyzing directory structure...');
        const startTime = Date.now();
        
        const structure = await getDirectoryStructure(folderPath);
        await fs.writeFile(outputPath, structure);
        
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`✨ Analysis complete in ${duration}s!`);
        console.log(`📁 Results saved to: ${outputPath}`);
    } catch (error) {
        console.error('❌ Error writing structure to file:', error.message);
        if (DEBUG) {
            console.error(error.stack);
        }
        process.exit(1);
    }
}

/**
 * Validates the input path
 * @param {string} inputPath - Path to validate
 * @throws {Error} - If path is invalid
 */
async function validatePath(inputPath) {
    try {
        const stats = await fs.stat(inputPath);
        if (!stats.isDirectory()) {
            throw new Error('Path must be a directory');
        }
    } catch (error) {
        if (error.code === 'ENOENT') {
            throw new Error('Directory does not exist');
        }
        throw error;
    }
}

/**
 * Main function
 */
async function main() {
    try {
        const folderPath = process.argv[2];

        if (!folderPath) {
            console.log('⚠️  Usage: codetree <folder_path>');
            console.log('Example: codetree .');
            process.exit(1);
        }

        const absolutePath = path.resolve(folderPath);
        await validatePath(absolutePath);
        await writeStructureToFile(absolutePath);
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (DEBUG) {
            console.error(error.stack);
        }
        process.exit(1);
    }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('💥 Fatal error:', error.message);
    if (DEBUG) {
        console.error(error.stack);
    }
    process.exit(1);
});

// Start the program
main().catch(console.error);