/**
 * Format file size in human readable format
 * @param {number} bytes - Size in bytes
 * @returns {string}
 */
function formatFileSize(bytes) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
}

/**
 * Format duration in human readable format
 * @param {number} ms - Duration in milliseconds
 * @returns {string}
 */
function formatDuration(ms) {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
}

/**
 * Format tree line with proper indentation and markers
 * @param {string} prefix - Line prefix
 * @param {boolean} isLast - Is this the last item
 * @param {string} content - Line content
 * @returns {string}
 */
function formatTreeLine(prefix, isLast, content) {
    const marker = isLast ? '└── ' : '├── ';
    return `${prefix}${marker}${content}`;
}

/**
 * Format file analysis result
 * @param {Object} fileInfo - File information
 * @param {Object} config - Output configuration
 * @returns {string}
 */
function formatFileAnalysis(fileInfo, config) {
    const parts = [];
    
    if (config.showLineCount) {
        parts.push(`${fileInfo.lines} lines`);
    }
    
    if (config.showSize) {
        parts.push(formatFileSize(fileInfo.size));
    }
    
    return parts.length > 0 ? `(${parts.join(', ')})` : '';
}

module.exports = {
    formatFileSize,
    formatDuration,
    formatTreeLine,
    formatFileAnalysis
};