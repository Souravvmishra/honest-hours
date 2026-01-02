# Contributing to HonestHours

Thank you for your interest in contributing to HonestHours! This document provides guidelines and instructions for contributing.

🌐 **Live Site**: [https://honest-hours.vercel.app/](https://honest-hours.vercel.app/)

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/Souravvmishra/honest-hours/issues)
2. If not, create a new issue with:
   - A clear, descriptive title
   - Steps to reproduce the bug
   - Expected vs actual behavior
   - Browser and OS information
   - Screenshots if applicable

### Suggesting Features

1. Check existing feature requests in [Issues](https://github.com/Souravvmishra/honest-hours/issues)
2. Create a new issue with:
   - A clear description of the feature
   - Use cases and benefits
   - Any mockups or examples if applicable

### Pull Requests

1. **Fork the repository** and clone your fork
2. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```
3. **Make your changes** following our coding standards
4. **Test your changes** thoroughly
5. **Commit your changes** with clear, descriptive messages:
   ```bash
   git commit -m "Add feature: description of what you did"
   ```
6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open a Pull Request** on GitHub with:
   - A clear title and description
   - Reference to any related issues
   - Screenshots if UI changes are involved

## Development Setup

1. Fork and clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Make your changes
5. Run linting:
   ```bash
   npm run lint
   ```

## Coding Standards

### Code Style

- Follow the existing code style and patterns
- Use TypeScript for all new code
- Use functional components with hooks (no class components)
- Follow React best practices and hooks rules
- Use descriptive variable and function names
- Add comments for complex logic

### File Structure

- Keep components modular and focused
- Place related files in appropriate directories
- Follow the existing project structure
- Use lowercase with dashes for directory names

### Styling

- Use Tailwind CSS utility classes
- Follow Shadcn UI patterns and conventions
- Ensure responsive design (mobile-first)
- Maintain accessibility standards

### Git Commit Messages

- Use clear, descriptive commit messages
- Start with a verb (Add, Fix, Update, Remove, etc.)
- Reference issue numbers when applicable: `Fix #123: description`

## Testing

- Test your changes in multiple browsers (Chrome, Firefox, Safari, Edge)
- Test on different screen sizes (mobile, tablet, desktop)
- Verify that existing functionality still works
- Test edge cases and error scenarios

## Review Process

1. All pull requests will be reviewed by maintainers
2. Address any feedback or requested changes
3. Once approved, your PR will be merged
4. Thank you for contributing! 🎉

## Questions?

If you have questions about contributing, feel free to:
- Visit the [live site](https://honest-hours.vercel.app/)
- Open an issue with the `question` label
- Check existing discussions in Issues

## Recognition

Contributors will be recognized in:
- The project's README (if applicable)
- Release notes for significant contributions

Thank you for helping make HonestHours better!
