# Testing Guide

This document explains the test suite for the portfolio project.

## Overview

The project now has **comprehensive test coverage** with **43 passing tests** across 4 test suites:

- ✅ **Content Schema Validation** (10 tests)
- ✅ **Static Path Generation** (6 tests)
- ✅ **Data Integrity** (14 tests)
- ✅ **Client-Side JavaScript** (13 tests)

## Running Tests

### Quick Start

```bash
# Run all tests once
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with UI dashboard
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

## Test Suites

### 1. Content Schema Validation (`src/tests/content-schema.test.ts`)

**Purpose**: Validates that data conforms to Zod schemas defined in the content collections.

**Tests**:
- ✅ Validates correct work entries
- ✅ Rejects work entries with missing required fields
- ✅ Rejects work entries with wrong field types
- ✅ Validates optional technology categories
- ✅ Rejects invalid project arrays
- ✅ Validates correct project entries
- ✅ Validates projects without optional largeText
- ✅ Rejects projects missing required fields
- ✅ Rejects projects with wrong field types
- ✅ Validates projects with optional category in technologies

**Why it matters**: Catches data validation errors at build time, preventing runtime errors from malformed content.

### 2. Static Path Generation (`src/tests/static-paths.test.ts`)

**Purpose**: Ensures dynamic route generation works correctly for work detail pages.

**Tests**:
- ✅ Generates correct English paths (`0-en`, `1-en`, etc.)
- ✅ Generates correct Spanish paths (`0-es`, `1-es`, etc.)
- ✅ Ensures unique slugs across all languages
- ✅ Validates slug format (`{index}-{lang}`)
- ✅ Verifies at least one work entry per language
- ✅ Confirms matching number of entries across languages

**Why it matters**: Prevents broken links and ensures all work experience pages are properly generated at build time.

### 3. Data Integrity (`src/tests/data-integrity.test.ts`)

**Purpose**: Validates that all referenced assets exist and data is consistent across languages.

**Tests**:
- ✅ Verifies all work logos exist in `/public` directory
- ✅ Verifies all project logos exist in `/public` directory
- ✅ Verifies all technology logos exist in `/public` directory
- ✅ Validates GitHub URLs are properly formatted
- ✅ Ensures matching structure between English and Spanish works
- ✅ Ensures matching structure between English and Spanish projects
- ✅ Checks for duplicate work entries
- ✅ Checks for duplicate project entries
- ✅ Validates non-empty required text fields

**Why it matters**: Catches missing assets and data inconsistencies before deployment, preventing broken images and invalid links.

### 4. Client-Side JavaScript (`src/tests/client-scripts.test.ts`)

**Purpose**: Tests the minimal client-side JavaScript functionality (terminal sound, language switching, animations).

**Tests**:
- ✅ Terminal sound function creation
- ✅ Terminal sound execution without errors
- ✅ Language switching to Spanish
- ✅ Language switching to English
- ✅ Language toggle functionality
- ✅ Language preference persistence in localStorage
- ✅ Default language fallback
- ✅ Terminal element initialization
- ✅ Terminal state reset
- ✅ Terminal command generation
- ✅ Mobile terminal command generation
- ✅ Modal checkbox toggle
- ✅ Modal close functionality

**Why it matters**: Ensures the interactive features work correctly without requiring manual testing in a browser.

## Configuration

### Vitest Config (`vitest.config.ts`)

```typescript
{
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,ts}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
}
```

### Setup File (`src/tests/setup.ts`)

- Resets DOM after each test
- Mocks `AudioContext` for terminal sound tests
- Provides consistent test environment

## Adding New Tests

### 1. Create a new test file

```bash
touch src/tests/my-feature.test.ts
```

### 2. Write your tests

```typescript
import { describe, it, expect } from 'vitest';

describe('My Feature', () => {
  it('should do something', () => {
    expect(true).toBe(true);
  });
});
```

### 3. Run tests

```bash
npm test
```

## Best Practices

1. **Write tests for new features**: Before adding new content or features, write tests to validate them.

2. **Run tests before committing**: Ensure all tests pass before pushing changes.

3. **Use descriptive test names**: Test names should clearly describe what is being tested.

4. **Test both success and failure cases**: Don't just test the happy path.

5. **Keep tests isolated**: Each test should be independent and not rely on other tests.

6. **Use test coverage**: Run `npm run test:coverage` to identify untested code.

## Coverage Goals

Current coverage areas:
- ✅ Content schema validation
- ✅ Static path generation
- ✅ Data integrity and asset existence
- ✅ Client-side JavaScript functionality

Future coverage areas to consider:
- 🔲 Component rendering tests (using `@astrojs/test`)
- 🔲 Build process validation
- 🔲 E2E tests with Playwright
- 🔲 Accessibility tests with axe-core

## Continuous Integration

Consider adding tests to your CI/CD pipeline:

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install
      - run: npm test
```

## Troubleshooting

### Tests fail to import Astro modules

**Solution**: Use standard libraries instead. For example, import `z` from `'zod'` instead of `'astro:content'`.

### AudioContext errors

**Solution**: The setup file mocks `AudioContext`. If you see errors, ensure `src/tests/setup.ts` is properly configured.

### File path issues

**Solution**: Use `resolve(__dirname, '../..')` for proper path resolution in tests.

### DOM not available

**Solution**: Ensure `environment: 'jsdom'` is set in `vitest.config.ts`.

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Zod Validation](https://zod.dev/)
- [Astro Testing](https://docs.astro.build/en/guides/testing/)
