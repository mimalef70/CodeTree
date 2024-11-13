# CodeTree 🌳

CodeTree is a powerful Node.js tool that creates a detailed tree visualization of your codebase. It recursively scans your project directory, identifies code files, and generates a comprehensive analysis including file contents and line counts, all while respecting common ignore patterns.

## 🌟 Features

- 📁 Generates tree-style directory visualization
- 📊 Includes line count and file size for each item
- 📝 Shows file contents for supported code files
- ⚡ Smart binary/text file detection
- 🎯 Supports 40+ programming languages and config files
- 🚫 Automatically ignores common directories
- 🔄 Handles both binary and text files intelligently
- 🐛 Debug mode for troubleshooting
- ⏱️ Performance metrics for analysis
- 🎨 Supports multiple file formats including:
  - Programming languages (.js, .py, .java, .php, etc.)
  - Web technologies (.html, .css, .jsx, .vue, etc.)
  - Configuration files (.yml, .json, .env, etc.)
  - Documentation files (.md, .txt, etc.)

## 🚀 Installation

### Prerequisites
- Node.js (v12.0.0 or higher)
- npm (v6.0.0 or higher)
- Git

### System Requirements

#### Linux & macOS
- Bash shell (usually pre-installed)
- Write permission for `/usr/local/bin` (or use sudo)

#### Windows
- Currently not supported (Windows support coming soon)

### Quick Install (Linux & macOS)

```bash
# Clone the repository
git clone https://github.com/yourusername/codetree.git

# Navigate to the codetree directory
cd codetree

# Make the installation script executable
chmod +x install.sh

# Install (you might need sudo)
./install.sh
```

If you get a permission error, run with sudo:
```bash
sudo ./install.sh
```

### Manual Installation

If you prefer to install manually or if the quick install doesn't work:

```bash
# Clone the repository
git clone https://github.com/yourusername/codetree.git

# Navigate to the codetree directory
cd codetree

# Install dependencies
npm install

# Make it globally accessible
npm link

# Make the script executable
chmod +x codetree.js
```

## 📖 Usage

### Basic Usage

Navigate to any directory you want to analyze and run:
```bash
codetree .
```

Or specify a different directory:
```bash
codetree /path/to/your/project
```

### Debug Mode

To run with debug output:
```bash
DEBUG=true codetree .
```

### Output Format

The tool generates a tree structure with the following information:
```
project/
├── src/ (1.2 MB)
│   ├── index.js (100 lines, 2.5 KB)
│   │   Content:
│   │       // File contents here
│   └── utils/
│       └── helper.js (50 lines, 1.1 KB)
│           Content:
│               // File contents here
└── package.json (30 lines, 750 B)
    Content:
        // File contents here
```

## 🛠️ Configuration

### File Size Limits
- Maximum file size for analysis: 5 MB
- Files larger than this will be skipped

### Ignored Directories
By default, CodeTree ignores:
- Version Control: `.git`, `.svn`, `.hg`
- Dependencies: `node_modules`, `vendor`, `bower_components`
- Build & Output: `build`, `dist`, `out`, `release`
- IDE & Editor: `.idea`, `.vscode`, `.sublime`
- Temporary & Cache: `temp`, `tmp`, `cache`
- System Files: `__pycache__`, `.DS_Store`

### Supported File Extensions
CodeTree supports various file types, organized by category:
- Programming Languages
  - JavaScript: `.js`, `.jsx`, `.ts`, `.tsx`
  - Python: `.py`
  - PHP: `.php`, `.module`, `.inc`
  - Java: `.java`
  - And many more...
- Web & Markup
  - HTML: `.html`, `.twig`
  - CSS: `.css`, `.scss`, `.sass`, `.less`
  - XML: `.xml`
- Configuration
  - `.json`, `.yml`, `.yaml`, `.toml`
  - `.env`, `.ini`, `.cfg`
- Documentation
  - `.md`, `.txt`, `.rst`
  - `.adoc`, `.asciidoc`

## 🗑️ Uninstallation

To remove CodeTree from your system:

```bash
# Using the uninstall script (might need sudo)
./uninstall.sh

# Or manually
rm -rf ~/.codetree
rm /usr/local/bin/codetree
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

### Development Setup
```bash
# Install dev dependencies
npm install

# Run tests
npm test

# Run linter
npm run lint
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔧 Troubleshooting

### Common Issues

1. **Permission Denied**
   ```bash
   sudo ./install.sh
   ```

2. **Command Not Found After Installation**
   ```bash
   source ~/.bashrc  # For Bash
   source ~/.zshrc   # For Zsh
   ```

3. **Debug Mode**
   ```bash
   DEBUG=true codetree .
   ```

### Known Limitations
- Maximum file size: 5 MB
- Windows not yet supported
- Binary files are excluded

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Enable debug mode and share the output
- Include your OS version and Node.js version

## 🔄 Changelog

### Version 1.0.0
- Initial release
- Tree visualization with file sizes
- Content display with line counts
- Binary file detection
- Debug mode
- Performance metrics
- Cross-platform testing (Linux & macOS)

---
Made with ❤️ by Mostafa Alahyari