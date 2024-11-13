/**
 * Default configuration for CodeTree
 */
module.exports = {
  // Output settings
  output: {
    filename: 'code_structure_analysis.txt',
    maxFileSize: 5, // MB
    showContent: true,
    showSize: true,
    showLineCount: true
  },

  // Extension groups
  groups: {
    // Programming Languages
    programming: {
      enabled: true,
      extensions: [
        // JavaScript & TypeScript
        '.js', '.mjs', '.cjs', '.jsx', '.ts', '.tsx',
        // Python
        '.py', '.pyw', '.pyx', '.pxd', '.pxi',
        // Java
        '.java', '.class', '.jar',
        // C/C++
        '.c', '.h', '.cpp', '.hpp', '.cc', '.cxx',
        // C# & .NET
        '.cs', '.csx', '.vb',
        // Other languages
        '.go', '.rb', '.php', '.swift', '.kt', 
        '.rs', '.dart', '.scala', '.lua', '.pl',
        '.groovy', '.r', '.elm', '.erl', '.ex',
        '.fs', '.fsx', '.clj', '.cljs'
      ]
    },

    // Web Development
    web: {
      enabled: true,
      extensions: [
        // Core web
        '.html', '.htm', '.xhtml', '.css',
        // Style processors
        '.scss', '.sass', '.less', '.styl',
        // Templates
        '.ejs', '.hbs', '.pug', '.jade',
        // Modern frameworks
        '.vue', '.svelte', '.astro',
        '.jsx', '.tsx'
      ]
    },

    // Configuration Files
    config: {
      enabled: true,
      extensions: [
        // Common configs
        '.json', '.yaml', '.yml', '.toml', '.ini',
        '.env', '.conf', '.config',
        // Project specific
        '.babelrc', '.eslintrc', '.prettierrc',
        // Build & Package
        'package.json', 'composer.json',
        'Gemfile', 'requirements.txt',
        // Docker
        'Dockerfile', 'docker-compose.yml',
        // Git
        '.gitignore', '.gitattributes'
      ]
    },

    // Documentation
    docs: {
      enabled: true,
      extensions: [
        '.md', '.markdown', '.txt',
        '.rst', '.adoc', '.asciidoc',
        '.pdf', '.doc', '.docx',
        '.rtf', '.tex'
      ]
    },

    // Shell & Scripts
    scripts: {
      enabled: true,
      extensions: [
        '.sh', '.bash', '.zsh', '.fish',
        '.bat', '.cmd', '.ps1',
        '.awk', '.sed'
      ]
    },

    // Data Files
    data: {
      enabled: true,
      extensions: [
        '.csv', '.tsv', '.json', '.xml',
        '.sqlite', '.sql', '.db'
      ]
    }
  },

  // Custom includes
  include: {
    extensions: [],    // Additional extensions
    files: [],        // Specific files
    patterns: []      // Glob patterns
  },

  // Custom excludes
  exclude: {
    extensions: [],    // Extensions to exclude
    files: [          // Common files to exclude
      'package-lock.json',
      'yarn.lock',
      'Thumbs.db',
      '.DS_Store'
    ],
    patterns: []      // Glob patterns to exclude
  },

  // Directory ignore patterns
  ignore: {
    defaults: true,    // Use default ignore list
    custom: [],        // Additional directories to ignore
    patterns: [],      // Glob patterns for directories

    // Default ignore list
    defaultList: [
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
      // System
      '__pycache__', '.DS_Store'
    ]
  }
};