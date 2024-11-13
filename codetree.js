#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const { loadConfig, createDefaultConfig } = require('./src/config-loader');
const { isTextFile, shouldIncludeFile, shouldIgnorePath } = require('./src/utils/file-utils');
const { formatFileSize, formatDuration, formatTreeLine, formatFileAnalysis } = require('./src/utils/format-utils');

// Constants
const DEBUG = process.env.DEBUG === 'true';
const ORANGE = '\x1b[38;5;214m';
const NC = '\x1b[0m'; // No Color

/**
 * Debug logger
 * @param {string} message - Message to log
 * @param {...any} args - Additional arguments
 */
function debug(message, ...args) {
    if (DEBUG) {
        console.log(`🔍 Debug: ${message}`, ...args);
    }
}

/**
 * Generate directory structure
 * @param {string} dir - Directory path
 * @param {string} prefix - Line prefix for formatting
 * @param {Object} config - Configuration object
 * @param {Object} skippedItems - Tracking skipped files and folders
 * @returns {Promise<string>}
 */
async function getDirectoryStructure(dir, prefix = '', config, skippedItems) {
    let result = '';
    
    try {
        const items = await fs.readdir(dir);
        const filteredItems = items.filter(item => !item.startsWith('.'));
        
        for (let i = 0; i < filteredItems.length; i++) {
            const item = filteredItems[i];
            const itemPath = path.join(dir, item);
            
            if (shouldIgnorePath(itemPath, config)) {
                try {
                    const stats = await fs.stat(itemPath);
                    if (stats.isDirectory()) {
                        skippedItems.folders.push(itemPath);
                    } else {
                        skippedItems.files.push(itemPath);
                    }
                } catch (err) {
                    debug(`Error checking skipped item: ${itemPath}`, err);
                }
                debug(`Ignoring path: ${itemPath}`);
                continue;
            }
            
            const isLast = i === filteredItems.length - 1;
            
            try {
                const stats = await fs.stat(itemPath);
                
                if (stats.isDirectory()) {
                    result += formatTreeLine(prefix, isLast, 
                        `${item}/ (${formatFileSize(stats.size)})\n`
                    );
                    result += await getDirectoryStructure(
                        itemPath, 
                        prefix + (isLast ? '    ' : '│   '), 
                        config,
                        skippedItems
                    );
                } else if (shouldIncludeFile(itemPath, config) && 
                          await isTextFile(itemPath, config.output.maxFileSize)) {
                    const content = await fs.readFile(itemPath, 'utf8');
                    const lines = content.split('\n');
                    const fileInfo = {
                        lines: lines.length,
                        size: stats.size
                    };
                    
                    result += formatTreeLine(prefix, isLast,
                        `${item} ${formatFileAnalysis(fileInfo, config.output)}\n`
                    );

                    if (config.output.showContent) {
                        result += `${prefix}${isLast ? '    ' : '│   '}Content:\n`;
                        result += lines.map(line => 
                            `${prefix}${isLast ? '    ' : '│   '}    ${line}`
                        ).join('\n') + '\n';
                    }
                } else {
                    skippedItems.files.push(itemPath);
                }
            } catch (error) {
                debug(`Error processing: ${itemPath}`, error);
                result += formatTreeLine(prefix, isLast,
                    `${item} (Error: ${error.message})\n`
                );
            }
        }
    } catch (error) {
        debug(`Error reading directory: ${dir}`, error);
        throw new Error(`Failed to read directory: ${dir}`);
    }
    
    return result;
}

/**
 * Write structure to file
 * @param {string} folderPath - Target folder path
 * @param {Object} config - Configuration object
 */
async function writeStructureToFile(folderPath, config) {
    const outputPath = path.join(folderPath, config.output.filename);
    const skippedItems = { files: [], folders: [] };
    
    try {
        await fs.unlink(outputPath).catch(() => {});
        
        console.log('🔍 Analyzing directory structure...');
        const startTime = Date.now();
        
        const structure = await getDirectoryStructure(folderPath, '', config, skippedItems);
        await fs.writeFile(outputPath, structure);
        
        const duration = formatDuration(Date.now() - startTime);
        console.log(`✨ Analysis complete in ${duration}!`);
        console.log(`📁 Results saved to: ${outputPath}`);

        // نمایش آیتم‌های نادیده گرفته شده
        if (skippedItems.folders.length > 0) {
            console.log(`\n${ORANGE}Excluded Folders:${NC}`);
            skippedItems.folders
                .sort() // مرتب‌سازی الفبایی
                .forEach(folder => {
                    console.log(`${ORANGE}  • ${folder}${NC}`);
                });
        }
        
        if (skippedItems.files.length > 0) {
            console.log(`\n${ORANGE}Excluded Files:${NC}`);
            skippedItems.files
                .sort() // مرتب‌سازی الفبایی
                .forEach(file => {
                    console.log(`${ORANGE}  • ${file}${NC}`);
                });
        }

        // نمایش تعداد کل
        if (skippedItems.folders.length > 0 || skippedItems.files.length > 0) {
            console.log(`\n${ORANGE}Total excluded: ${skippedItems.folders.length} folders, ${skippedItems.files.length} files${NC}`);
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (DEBUG) {
            console.error(error.stack);
        }
        process.exit(1);
    }
}

/**
 * Show usage information
 */
function showUsage() {
    console.log(`
Usage: codetree [options] <directory>

Options:
  init [--global]     Create default configuration file
  --help, -h         Show this help message
  --version, -v      Show version

Examples:
  codetree .                   # Analyze current directory
  codetree /path/to/project    # Analyze specific directory
  codetree init               # Create local config file
  codetree init --global      # Create global config file

Environment Variables:
  DEBUG=true         Enable debug output
    `);
}

/**
 * Main function
 */
async function main() {
    try {
        if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
            showUsage();
            return;
        }

        if (args.includes('--version') || args.includes('-v')) {
            const pkg = require('./package.json');
            console.log(`CodeTree v${pkg.version}`);
            return;
        }

        if (args[0] === 'init') {
            const location = args[1] === '--global' ? 'global' : 'local';
            await createDefaultConfig(location);
            return;
        }

        const folderPath = args[0];
        const absolutePath = path.resolve(folderPath);
        const config = await loadConfig(absolutePath);
        
        await writeStructureToFile(absolutePath, config);
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (DEBUG) {
            console.error(error.stack);
        }
        process.exit(1);
    }
}

// Process command line arguments
const args = process.argv.slice(2);

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