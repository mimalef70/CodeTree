# 🌳 CodeTree
> A powerful CLI tool that packs your entire repository into a single, AI-friendly file for seamless integration with Large Language Models (LLMs) like Claude, ChatGPT, and Gemini.

<p align="center">
<a href="https://www.npmjs.com/package/@mimalef70/codetree"><img src="https://img.shields.io/npm/v/@mimalef70/codetree.svg" alt="npm version"></a>
<a href="https://www.npmjs.com/package/@mimalef70/codetree"><img src="https://img.shields.io/npm/dm/@mimalef70/codetree.svg" alt="npm downloads"></a>
<a href="https://github.com/mimalef70/codetree/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@mimalef70/codetree.svg" alt="license"></a>
<a href="https://github.com/mimalef70/codetree"><img src="https://img.shields.io/github/stars/mimalef70/codetree.svg?style=social" alt="GitHub Stars"></a>
</p>

## 📚 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Usage](#-usage)
- [Configuration](#-configuration)
- [Output Formats](#-output-formats)
- [AI Integration Guide](#-ai-integration-guide)
- [Updating](#-updating)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

- **🤖 AI-Optimized Output**: Creates LLM-friendly file formats with clear structure and context
- **📊 Token Analytics**: Tracks token usage per file and repository-wide for LLM context management
- **🎯 Smart File Selection**: Intelligent file filtering with extensive ignore patterns support
- **🔄 Remote Repository Support**: Direct processing of GitHub repositories without manual cloning
- **⚙️ Highly Configurable**: Flexible configuration through CLI options or config files
- **📝 Multiple Output Formats**: Supports Plain Text, XML, and Markdown output styles
- **🧹 Code Processing**: Optional comment removal and line number addition
- **📋 Clipboard Integration**: Direct copying to system clipboard for quick AI tool usage

## 🚀 Installation

### Global Installation (Recommended)
```bash
npm install -g @mimalef70/codetree
```

### Per-Project Installation
```bash
npm install --save-dev @mimalef70/codetree
```

### No Installation Required
```bash
npx @mimalef70/codetree
```

## 🔄 Updating

To update to the latest version:
```bash
npm update -g @mimalef70/codetree
```

To check your current version:
```bash
codetree --version
```

To see if you have the latest version:
```bash
npm view @mimalef70/codetree version
```

## 🎯 Quick Start

1. Navigate to your project directory
2. Run CodeTree:
```bash
codetree
```
3. Find your packed code in `codetree.txt`

## 💻 Usage

### Basic Commands
```bash
# Pack current directory
codetree

# Pack specific directory
codetree path/to/directory

# Pack with specific output format
codetree --style markdown

# Pack with specific include patterns
codetree --include "src/**/*.ts,**/*.md"

# Pack remote repository
codetree --remote username/repository

# Initialize configuration
codetree --init
```

### Advanced Options
```bash
# Remove comments and empty lines
codetree --removeComments --removeEmptyLines

# Show line numbers and copy to clipboard
codetree --output-show-line-numbers --copy

# Custom output file
codetree --output custom-output.md

# Process with custom config file
codetree -c ./custom-config.json

# Show verbose output
codetree --verbose
```

### Command Line Options
```bash
Options:
  -v, --version                   show version information
  -o, --output <file>            specify the output file name
  --include <patterns>           list of include patterns (comma-separated)
  -i, --ignore <patterns>        additional ignore patterns (comma-separated)
  -c, --config <path>           path to a custom config file
  --copy                         copy generated output to system clipboard
  --top-files-len <number>       specify the number of top files to display
  --output-show-line-numbers     add line numbers to each line in the output
  --style <type>                specify the output style (plain, xml, markdown)
  --verbose                      enable verbose logging for detailed output
  --init                         initialize a new codetree.config.json file
  --global                       use global configuration (only with --init)
  --remote <url>                process a remote Git repository
  -h, --help                    display help for command
```

## ⚙️ Configuration

### Config File Structure
```json
{
  "output": {
    "filePath": "codetree.txt",
    "style": "plain",
    "showLineNumbers": false,
    "removeComments": false,
    "removeEmptyLines": false,
    "topFilesLength": 5,
    "copyToClipboard": false,
    "headerText": "",
    "instructionFilePath": ""
  },
  "include": ["**/*"],
  "ignore": {
    "useGitignore": true,
    "useDefaultPatterns": true,
    "customPatterns": []
  }
}
```

### Global vs Local Config
- Local: `./codetree.config.json`
- Global: 
  - Windows: `%LOCALAPPDATA%\CodeTree\codetree.config.json`
  - macOS: `~/.config/codetree/codetree.config.json`
  - Linux: `~/.config/codetree/codetree.config.json`

To create a config file:
```bash
codetree --init
# For global config
codetree --init --global
```

## 📄 Output Formats

### Plain Text (Default)
```text
================================================================
Repository Structure
================================================================
src/
  index.ts
  utils/
    helper.ts

===============
File: src/index.ts
===============
// File content here
```

### XML
```xml
<repository_structure>
src/
  index.ts
  utils/
    helper.ts
</repository_structure>

<file path="src/index.ts">
// File content here
</file>
```

### Markdown
```markdown
# Repository Structure
```
src/
  index.ts
  utils/
    helper.ts
```

## File: src/index.ts
```typescript
// File content here
```
```

## 🤖 AI Integration Guide

### Best Practices
1. Choose appropriate output format based on your LLM:
   - Claude: Use XML format (`--style xml`)
   - GPT-4/3.5: Any format works well, but Markdown (`--style markdown`) is recommended
   - Gemini: Plain text or Markdown format works best

2. Consider token limits:
   - Monitor the token count summary
   - Use `--top-files-len` to identify large files
   - Remove comments with `--removeComments` if needed
   - Remove empty lines with `--removeEmptyLines` for more compact output

### Example Prompts
```plaintext
I have exported my codebase using CodeTree. Please:
1. Analyze the overall architecture
2. Identify potential improvements
3. Review code quality and suggest optimizations
4. Check for security concerns
```

### Making Large Codebases LLM-Friendly
1. Use include patterns to focus on specific parts:
   ```bash
   codetree --include "src/**/*.ts,src/**/*.tsx"
   ```

2. Exclude unnecessary files:
   ```bash
   codetree --ignore "**/*.test.ts,**/*.spec.ts"
   ```

3. Remove unnecessary content:
   ```bash
   codetree --removeComments --removeEmptyLines
   ```

## 🐛 Troubleshooting

### Common Issues

1. **Permission Errors**
   ```bash
   sudo npm install -g @mimalef70/codetree
   ```
   Or fix npm permissions following [npm's guide](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally)

2. **File Path Issues**
   - Use quotes around paths with spaces
   - Use forward slashes (/) even on Windows

3. **Out of Memory**
   - Process specific directories: `codetree ./src`
   - Use include patterns: `codetree --include "src/**/*.js"`

### Debug Mode
```bash
codetree --verbose
```

## 🤝 Contributing

Contributions are welcome! See our [Contributing Guide](CONTRIBUTING.md) for details on:
- Development Setup
- Pull Request Process
- Coding Standards

### Development Setup
```bash
# Clone the repository
git clone https://github.com/mimalef70/codetree.git
cd codetree

# Install dependencies
npm install

# Build
npm run build

# Link for local development
npm link
```

## 📝 License

[MIT](LICENSE) 
---

<p align="center">
Made with ❤️ by <a href="https://github.com/mimalef70">Mostafa Alahyari</a>
</p>

<p align="center">
If you find CodeTree helpful, please consider giving it a ⭐️ on <a href="https://github.com/mimalef70/codetree">GitHub</a>
</p>