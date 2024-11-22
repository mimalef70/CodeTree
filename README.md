
# 🌳 CodeTree
> A powerful CLI tool that packs your entire repository into a single, AI-friendly file for seamless integration with Large Language Models (LLMs) like Claude, ChatGPT, and Gemini.

## 📚 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Usage](#-usage)
- [Configuration](#-configuration)
- [Output Formats](#-output-formats)
- [AI Integration Guide](#-ai-integration-guide)
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
npm install -g codetree
```

### Per-Project Installation
```bash
npm install --save-dev codetree
```

### No Installation Required
```bash
npx codetree
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

# Pack with specific include patterns
codetree --include "src/**/*.ts,**/*.md"

# Pack remote repository
codetree --remote mimalef70/codetree

# Initialize configuration
codetree --init
```

### Advanced Options
```bash
# Custom output format
codetree --style xml

# Remove comments and show line numbers
codetree --output-show-line-numbers --copy

# Process with custom config file
codetree -c ./custom-config.json
```

[View all CLI options](#command-line-options)

## ⚙️ Configuration

### Config File Structure
```json
{
  "output": {
    "filePath": "codetree.txt",
    "style": "plain",
    "showLineNumbers": false,
    "removeComments": false,
    "topFilesLength": 5
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
  - Unix: `~/.config/codetree/codetree.config.json`

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
```

### XML
```xml
<repository_structure>
src/
  index.ts
  utils/
    helper.ts
</repository_structure>
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
```

## 🤖 AI Integration Guide

### Best Practices
1. Choose appropriate output format based on your LLM:
   - Claude: Use XML format (`--style xml`)
   - GPT/Gemini: Any format works well

2. Consider token limits:
   - Monitor the token count summary
   - Use `--top-files-len` to identify large files

### Example Prompts
```plaintext
Please analyze this codebase and:
1. Review the overall architecture
2. Identify potential improvements
3. Suggest optimizations for performance
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:

- Code of Conduct
- Development Setup
- Pull Request Process
- Coding Standards

## 📝 License

[MIT](LICENSE) © Mostafa Alahyari

---

<p align="center">
Made with ❤️ by <a href="https://github.com/mimalef70">Mostafa Alahyari</a>
</p>
