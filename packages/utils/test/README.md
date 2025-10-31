# Test Setup

This directory contains the test setup and configuration for the utils package.

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## Test Structure

- `setup.ts` - Global test setup, mocks, and extensions
- `__tests__/` directories contain test files colocated with source files

## Writing Tests

Tests use Vitest with React Testing Library. Key imports:

```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
```

## Mocks

The setup file provides:
- `window.matchMedia` mock for responsive hooks
- `@testing-library/jest-dom` matchers
- Automatic cleanup after each test