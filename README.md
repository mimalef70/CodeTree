# CodeTree 🌳

CodeTree is a powerful Node.js tool that creates a detailed tree visualization of your codebase with smart configuration and customization options. It recursively scans your project directory, identifies code files, and generates a comprehensive analysis while respecting user-defined patterns and preferences.

## 🌟 Features

- 📁 Generates tree-style directory visualization
- 📊 Includes line count and file size analysis
- 📝 Shows file contents for supported code files
- ⚡ Smart binary/text file detection
- 🎯 Supports 40+ programming languages and config files
- 🚫 Smart file and directory filtering
- 🔧 Highly configurable through JSON config files
- 🌍 Global and project-specific configurations
- 🎨 Built-in extension groups for easy management
- 🔍 Debug mode for troubleshooting

## 🚀 Installation

### Prerequisites
- Node.js (v12.0.0 or higher)
- npm (v6.0.0 or higher)
- Git (for installation from source)

### System Requirements

#### Linux & macOS
- Write permission for `/usr/local/bin` (or use sudo)
- Bash shell (pre-installed on most systems)

### Quick Install
```bash
# Clone the repository
git clone https://github.com/mimalef70/codetree.git

# Navigate to the codetree directory
cd codetree

# Make the installation script executable
chmod +x install.sh

# Run the installation script (might need sudo)
./install.sh
```

### NPM Installation
```bash
npm install -g codetree-cli
```

## 📖 Usage

### Basic Usage
```bash
# Analyze current directory
codetree .

# Analyze specific directory
codetree /path/to/project

# Create local configuration
codetree init

# Create global configuration
codetree init --global

# Enable debug output
DEBUG=true codetree .
```

### Configuration

CodeTree can be customized using configuration files in multiple locations:

1. Global configuration: `~/.codetreerc`
2. Project configuration: `.codetreerc` or `codetree.config.json`
3. Package.json: `"codetree"` field

#### Configuration File Example
```json
{
  "output": {
    "filename": "custom-analysis.txt",
    "maxFileSize": 10,
    "showContent": true,
    "showSize": true,
    "showLineCount": true
  },
  
  "groups": {
    "programming": {
      "enabled": true,
      "extensions": [".custom", ".specific"]
    },
    "web": {
      "enabled": false
    }
  },

  "include": {
    "extensions": [".myext"],
    "files": ["specific-file.txt"],
    "patterns": ["**/*.custom"]
  },

  "exclude": {
    "extensions": [".test.js"],
    "files": ["debug.log"],
    "patterns": ["**/*.min.js"]
  },

  "ignore": {
    "defaults": true,
    "custom": ["my-temp-dir"],
    "patterns": ["**/build-*/**"]
  }
}
```

#### Extension Groups
CodeTree organizes file extensions into groups that can be enabled/disabled:

- `programming`: General programming languages
- `web`: Web development files
- `config`: Configuration files
- `docs`: Documentation files
- `scripts`: Shell and script files
- `data`: Data and database files

Each group can be customized or disabled in your configuration.

#### Pattern Matching
CodeTree supports glob patterns for flexible file matching:

```json
{
  "include": {
    "patterns": [
      "src/**/*.js",
      "lib/*.{js,ts}"
    ]
  },
  "exclude": {
    "patterns": [
      "**/*.test.js",
      "**/*.spec.js"
    ]
  }
}
```

### Output Format
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
```

## 🛠️ Advanced Usage

### Debug Mode
Enable detailed logging:
```bash
DEBUG=true codetree .
```

### Custom Extension Groups
Create your own extension group in `.codetreerc`:
```json
{
  "groups": {
    "myCustomGroup": {
      "enabled": true,
      "extensions": [".custom", ".specific"]
    }
  }
}
```

### Configuration Priority
1. Command-line arguments
2. Project-specific config
3. Global config
4. Default settings

## 🔧 Troubleshooting

### Common Issues

1. **Permission Denied**
   ```bash
   sudo ./install.sh
   ```

2. **Command Not Found**
   ```bash
   source ~/.bashrc  # For Bash
   source ~/.zshrc   # For Zsh
   ```

3. **File Size Limits**
   - Default limit: 5MB
   - Customize in config:
   ```json
   {
     "output": {
       "maxFileSize": 10
     }
   }
   ```

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create your branch: `git checkout -b feature/AmazingFeature`
3. Make changes and commit: `git commit -m 'Add AmazingFeature'`
4. Push to your branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

### Development Setup
```bash
# Install dependencies
npm install

# Run tests
npm test

# Run linter
npm run lint

# Format code
npm run format
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔄 Changelog

### Version 1.0.0
- Initial release
- Smart configuration system
- Extension group management
- Glob pattern support
- Advanced file filtering
- Size and line count analysis
- Debug mode
- Global and local configs

---
Made with ❤️ by Mostafa Alahyari