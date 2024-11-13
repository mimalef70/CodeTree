# Contributing to CodeTree

First off, thank you for considering contributing to CodeTree! It's people like you that make CodeTree such a great tool.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct, which is to treat all contributors with respect and foster an open and welcoming environment.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* Use a clear and descriptive title
* Describe the exact steps which reproduce the problem
* Provide specific examples to demonstrate the steps
* Describe the behavior you observed after following the steps
* Explain which behavior you expected to see instead and why
* Include any error messages

### Suggesting Enhancements

If you have a suggestion for a new feature or enhancement, first check the issue list to see if it's already been proposed. If it hasn't, you can create a new issue. Please include:

* A clear and descriptive title
* A detailed description of the proposed feature
* An explanation of why this enhancement would be useful
* Possible implementation details if you have them

### Pull Requests

Here's the process for submitting code changes:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run the test suite
5. Commit your changes (`git commit -m 'feat: add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

#### Development Process

1. Install dependencies:
```bash
npm install
```

2. Make your changes

3. Run tests:
```bash
npm test
```

4. Run linter:
```bash
npm run lint
```

5. Format code:
```bash
npm run format
```

#### Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. Each commit message should have:

* A type (feat, fix, docs, style, refactor, test, chore)
* A scope (optional)
* A description

Examples:
```
feat: add support for TypeScript files
fix(parser): handle empty files correctly
docs: update installation instructions
```

### Development Setup

1. Clone your fork
2. Install dependencies:
```bash
npm install
```

3. Create a branch for your changes:
```bash
git checkout -b feat/my-feature
```

4. Make your changes and commit them using the conventional commit format

5. Update or add tests as needed

6. Run the full test suite:
```bash
npm test
```

### File Structure

```
codetree/
├── src/                    # Source files
│   ├── utils/             # Utility functions
│   ├── config-loader.js   # Configuration handling
│   └── default-config.js  # Default configuration
├── tests/                 # Test files
├── docs/                  # Documentation
└── examples/             # Example files
```

### Testing

Please write tests for any new features or bug fixes. We use Jest as our testing framework.

* To run tests: `npm test`
* To run tests in watch mode: `npm test -- --watch`
* To run tests with coverage: `npm test -- --coverage`

### Documentation

* Update the README.md if you change any user-facing functionality
* Comment your code where appropriate
* Write clear commit messages

## Questions?

Feel free to open an issue with any questions you have. We're here to help!

## License

By contributing to CodeTree, you agree that your contributions will be licensed under its MIT License.