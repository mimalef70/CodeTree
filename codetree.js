#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

// File extensions to include in the analysis
const CODE_FILE_EXTENSIONS = [
    // Drupal specific files
    '.module', '.install', '.theme', '.inc', '.profile',
    '.info.yml', '.libraries.yml', '.routing.yml', '.services.yml', '.permissions.yml',
    '.links.menu.yml', '.links.task.yml', '.links.action.yml',
    '.html.twig', '.twig',
    '.schema.yml', '.post_update.php', '.settings.yml',
    
    // General programming languages
    '.js', '.py', '.java', '.c', '.cpp', '.cs', '.go', '.rb', '.php', '.swift', '.kt', '.ts',
    
    // Scripts and markup languages
    '.html', '.css', '.scss', '.sass', '.less', '.xml', '.json', '.yaml', '.yml', '.md', '.markdown',
    
    // Frontend frameworks
    '.jsx', '.tsx', '.vue',
    
    // Shell and batch scripts
    '.sh', '.bash', '.zsh', '.bat', '.cmd', '.ps1',
    
    // Other programming languages
    '.pl', '.pm', '.r', '.scala', '.groovy', '.lua', '.tcl', '.perl',
    
    // Configuration and text files
    '.ini', '.cfg', '.conf', '.properties', '.toml', '.env', '.txt',
    
    // Database related files
    '.sql', '.psql', '.mysql',
    
    // Web related files
    '.php', '.asp', '.aspx', '.jsp', '.htaccess',
    
    // System and configuration files
    '.gitignore', '.dockerignore', 'Dockerfile', 'docker-compose.yml',
    
    // Project and dependency files
    'package.json', 'composer.json', 'requirements.txt', 'Gemfile', 'pom.xml', 'build.gradle',
    
    // Documentation files
    '.rst', '.adoc', '.asciidoc',
    
    // Other formats
    '.log', '.csv', '.tsv'
];

// Directories and files to ignore
const IGNORED_DIRECTORIES = [
    '.git', 'node_modules', '.idea', '.vscode',
    'vendor', 'build', 'dist',
    'coverage', 'tmp', 'temp',
    'logs', 'public/storage',
    '*/cache/*', '*/logs/*',
    '*/*.log', '*/uploads/*',
    'sites/*/files',
    'sites/*/private',
    'sites/*/translations'
];

// Maximum file size to process (in MB)
const MAX_FILE_SIZE = 5;

/**
 * Checks if a file is a text file by examining its content
 * @param {string} filePath - Path to the file
 * @returns {Promise<boolean>} - True if the file is text, false otherwise
 */
async function isTextFile(filePath) {
    try {
        const stats = await fs.stat(filePath);
        if (stats.size > MAX_FILE_SIZE * 1024 * 1024) {
            return false;
        }

        const buffer = Buffer.alloc(4100);
        const fileHandle = await fs.open(filePath, 'r');
        const { bytesRead } = await fileHandle.read(buffer, 0, 4100, 0);
        await fileHandle.close();

        // Check for binary characters
        for (let i = 0; i < Math.min(bytesRead, 1024); i++) {
            const byte = buffer[i];
            // If non-standard control character is found
            if (byte < 32 && ![9, 10, 13].includes(byte)) {
                return false;
            }
        }
        return true;
    } catch (error) {
        console.error(`Error checking if file is text: ${filePath}`, error);
        return false;
    }
}

/**
 * Checks if a path should be ignored based on ignore patterns
 * @param {string} itemPath - Path to check
 * @returns {boolean} - True if path should be ignored
 */
function shouldIgnorePath(itemPath) {
    return IGNORED_DIRECTORIES.some(dir => {
        const pattern = dir.replace('*', '.*');
        const regex = new RegExp(pattern);
        return regex.test(itemPath);
    });
}

/**
 * Generates a tree structure of the directory
 * @param {string} dir - Directory path to analyze
 * @param {string} prefix - Prefix for tree visualization
 * @returns {Promise<string>} - Formatted tree structure
 */
async function getDirectoryStructure(dir, prefix = '') {
    let result = '';
    const items = await fs.readdir(dir);

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const itemPath = path.join(dir, item);

        if (shouldIgnorePath(itemPath)) {
            continue;
        }

        const isLast = i === items.length - 1;
        const marker = isLast ? '└── ' : '├── ';

        try {
            const stats = await fs.stat(itemPath);
            if (stats.isDirectory()) {
                result += `${prefix}${marker}${item}/\n`;
                result += await getDirectoryStructure(itemPath, prefix + (isLast ? '    ' : '│   '));
            } else {
                const ext = path.extname(item);
                const isSpecialFile = CODE_FILE_EXTENSIONS.includes(ext) || 
                                    CODE_FILE_EXTENSIONS.some(e => item.endsWith(e));
                
                if (isSpecialFile && await isTextFile(itemPath)) {
                    const content = await fs.readFile(itemPath, 'utf8');
                    const lines = content.split('\n');
                    result += `${prefix}${marker}${item} (${lines.length} lines)\n`;
                    result += `${prefix}${isLast ? '    ' : '│   '}Content:\n`;
                    result += lines.map(line => `${prefix}${isLast ? '    ' : '│   '}    ${line}`).join('\n') + '\n';
                }
            }
        } catch (error) {
            console.error(`Error processing ${itemPath}:`, error);
        }
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

        const structure = await getDirectoryStructure(folderPath);
        await fs.writeFile(outputPath, structure);
        console.log(`✨ Analysis complete! Check ${outputPath} for results`);
    } catch (error) {
        console.error('❌ Error writing structure to file:', error);
    }
}

/**
 * Main function
 */
async function main() {
    const folderPath = process.argv[2];

    if (!folderPath) {
        console.log('⚠️  Please provide a folder path: codetree <folder_path>');
        return;
    }

    try {
        const stats = await fs.stat(folderPath);
        if (stats.isDirectory()) {
            console.log('🔍 Analyzing directory structure...');
            await writeStructureToFile(folderPath);
        } else {
            console.log('❌ Invalid folder path. Please make sure the folder exists and is a directory.');
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Start the program
main().catch(console.error);
