# Contributing to Custom Reminders

Thank you for your interest in contributing! This guide explains how to
propose changes, report issues, and get your work merged.

## Code of Conduct

By participating, you agree to uphold our [Code of Conduct](CODE_OF_CONDUCT.md).
Please read it before contributing.

## How to Contribute

### Reporting Bugs

Before opening a new issue:

1. Search existing issues to avoid duplicates.
2. Use the **Bug report** issue template and include:
   - Device model and Zepp OS version
   - Steps to reproduce
   - Expected vs. actual behavior
   - Screenshots or logs if helpful

### Suggesting Features

Use the **Feature request** template. Clearly describe:

- The problem you're trying to solve
- Your proposed solution
- Any alternatives you've considered

### Pull Requests

1. Fork the repo and create a feature branch from \`main\`.
2. Keep PRs focused and reasonably sized.
3. Match existing code style (Prettier is configured).
4. Update docs (README, inline comments) when behavior changes.
5. Reference related issues in the PR description.

### Development Workflow

\`\`\`bash

# Install deps

npm install

# Preview in simulator

zeus dev

# Build distributable

zeus build
\`\`\`

## Style Guidelines

- Use the existing Prettier config (\`.prettierrc.js\`).
- Prefer small, well-named functions.
- Keep UI strings in \`page/i18n/en-US.po\` (or add new \`.po\` files for locales).
- Avoid device-specific assumptions; use values from \`app.json\` targets.

## Questions?

Open a **Question** issue or start a discussion. We're happy to help.

Thank you for helping make Custom Reminders better! 🎉
