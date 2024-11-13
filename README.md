# CodeTree 🌳

CodeTree is a powerful Node.js tool that creates a detailed tree visualization of your codebase. It recursively scans your project directory, identifies code files, and generates a comprehensive analysis including file contents and line counts, all while respecting common ignore patterns.

## 🌟 Features

- 📁 Generates tree-style directory visualization
- 📊 Includes line count for each code file
- 📝 Shows file contents for supported code files
- ⚡ Smart binary/text file detection
- 🎯 Supports 40+ programming languages and config files
- 🚫 Automatically ignores common directories (node_modules, .git, etc.)
- 🔄 Handles both binary and text files intelligently
- 🎨 Supports multiple file formats including:
  - Programming languages (.js, .py, .java, .php, etc.)
  - Web technologies (.html, .css, .jsx, .vue, etc.)
  - Configuration files (.yml, .json, .env, etc.)
  - Documentation files (.md, .txt, etc.)

## 🚀 Installation

### Prerequisites
- Node.js (v12.0.0 or higher)
- npm (v6.0.0 or higher)

### Quick Install
```bash
# Clone the repository
git clone https://github.com/yourusername/codetree.git

# Navigate to the codetree directory
cd codetree

# Make the installation script executable
chmod +x install.sh

# Run the installation script
./install.sh
```

### Manual Installation
If you prefer to install manually:

```bash
# Clone the repository
git clone https://github.com/yourusername/codetree.git

# Navigate to the codetree directory
cd codetree

# Install dependencies
npm install

# Make it globally accessible
npm link
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

The analysis will be saved as `code_structure_analysis.txt` in the current directory.

### Output Format
The tool generates a tree structure with the following information:
```
project/
├── src/
│   ├── index.js (100 lines)
│   │   Content:
│   │       // File contents here
│   └── utils/
│       └── helper.js (50 lines)
│           Content:
│               // File contents here
└── package.json (30 lines)
    Content:
        // File contents here
```

## 🛠️ Configuration

### Ignored Directories
By default, CodeTree ignores common directories such as:
- .git
- node_modules
- .idea
- .vscode
- vendor
- build
- dist

### Supported File Extensions
CodeTree supports a wide range of file extensions, including but not limited to:
- JavaScript: .js, .jsx, .ts, .tsx
- PHP: .php, .module, .inc
- Python: .py
- Java: .java
- Web: .html, .css, .scss
- Config: .json, .yml, .yaml
- Documentation: .md, .txt

## 🗑️ Uninstallation

To remove CodeTree from your system:

```bash
# Using npm
npm uninstall -g codetree

# Or manually
rm -rf ~/.codetree
rm /usr/local/bin/codetree
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the need for better code documentation
- Built with Node.js
- Uses various open-source packages

## 📞 Support

If you have any questions or run into issues, please open an issue in the GitHub repository.

## 🔄 Changelog

### Version 1.0.0
- Initial release
- Basic directory tree visualization
- File content display
- Line counting
- Binary file detection

---
Made with ❤️ by [Your Name]
