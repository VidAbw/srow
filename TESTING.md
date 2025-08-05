# Testing Guide for Srow E-commerce

This guide explains how to run and maintain tests for the Srow e-commerce application.

## Test Structure

```
tests/
├── e2e/                    # End-to-end tests (Playwright)
│   ├── auth.spec.ts       # Authentication tests
│   ├── home.spec.ts       # Home page tests
│   ├── checkout.spec.ts   # Checkout flow tests
│   └── admin.spec.ts      # Admin panel tests
├── api/                   # API integration tests
│   └── create-payment-intent.test.ts
└── fixtures/              # Test data and files
    └── test-data.json

src/
├── components/
│   ├── layout/
│   │   └── Header.test.tsx
│   └── auth/
│       └── LoginForm.test.tsx
└── lib/
    ├── auth.test.ts
    └── catalog.test.ts
```

## Types of Tests

### 1. Unit Tests (Jest + React Testing Library)
- **Purpose**: Test individual components and functions in isolation
- **Location**: `src/**/*.test.tsx` and `src/**/*.test.ts`
- **Framework**: Jest + React Testing Library

### 2. Integration Tests (Jest)
- **Purpose**: Test API endpoints and utility functions
- **Location**: `tests/api/*.test.ts`
- **Framework**: Jest + node-mocks-http

### 3. End-to-End Tests (Playwright)
- **Purpose**: Test complete user workflows
- **Location**: `tests/e2e/*.spec.ts`
- **Framework**: Playwright

## Running Tests

### Prerequisites
Make sure you have all dependencies installed:
```bash
npm install
```

### 1. Run All Tests
```bash
npm run test:all
```
This runs linting, type checking, unit tests, and E2E tests in sequence.

### 2. Run Unit Tests Only
```bash
# Run all unit tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### 3. Run E2E Tests Only
```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests with UI (interactive)
npm run test:e2e:ui

# Run E2E tests in headed mode (see browser)
npm run test:e2e:headed
```

### 4. Run Specific Test Files
```bash
# Run specific unit test file
npm test -- src/components/auth/LoginForm.test.tsx

# Run specific E2E test file
npm run test:e2e -- tests/e2e/auth.spec.ts
```

### 5. Run Tests with Different Browsers
```bash
# Run E2E tests on specific browser
npm run test:e2e -- --project=chromium
npm run test:e2e -- --project=firefox
npm run test:e2e -- --project=webkit
```

## Test Coverage

The project is configured with 70% coverage thresholds:
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

To view coverage report:
```bash
npm run test:coverage
```
This will generate a coverage report in the `coverage/` directory.

## Writing Tests

### Unit Test Example
```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import LoginForm from './LoginForm'

describe('LoginForm', () => {
  it('should render login form', () => {
    render(<LoginForm />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('should handle form submission', async () => {
    const mockOnSubmit = jest.fn()
    render(<LoginForm onSubmit={mockOnSubmit} />)
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    })
    fireEvent.click(screen.getByRole('button', { name: /login/i }))
    
    expect(mockOnSubmit).toHaveBeenCalled()
  })
})
```

### E2E Test Example
```typescript
import { test, expect } from '@playwright/test'

test('should login successfully', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel(/email/i).fill('test@example.com')
  await page.getByLabel(/password/i).fill('password123')
  await page.getByRole('button', { name: /login/i }).click()
  
  await expect(page).toHaveURL('/')
  await expect(page.getByText(/welcome/i)).toBeVisible()
})
```

## Test Data Management

### Using Test Fixtures
```typescript
import testData from '../fixtures/test-data.json'

test('should create product with test data', async ({ page }) => {
  const product = testData.products.testProduct
  // Use product data in test...
})
```

### Environment Variables for Testing
Create a `.env.test` file for test-specific environment variables:
```env
NODE_ENV=test
FIREBASE_PROJECT_ID=test-project
STRIPE_SECRET_KEY=sk_test_...
```

## Continuous Integration

The project includes GitHub Actions workflows that run tests automatically:

1. **Lint and Type Check**: ESLint, Prettier, TypeScript
2. **Unit Tests**: Jest with coverage reporting
3. **E2E Tests**: Playwright on multiple browsers
4. **Build Test**: Ensures the app builds successfully
5. **Security Audit**: npm audit for vulnerabilities

## Debugging Tests

### Debug Unit Tests
```bash
# Run tests with debugging
npm test -- --verbose --detectOpenHandles

# Debug specific test
npm test -- --testNamePattern="should login successfully"
```

### Debug E2E Tests
```bash
# Run with headed mode to see browser
npm run test:e2e:headed

# Run with UI for interactive debugging
npm run test:e2e:ui

# Run with trace
npm run test:e2e -- --trace on
```

### View Test Reports
- **Unit Tests**: Coverage report in `coverage/` directory
- **E2E Tests**: HTML report in `playwright-report/` directory
- **CI Reports**: Available in GitHub Actions

## Best Practices

1. **Test Naming**: Use descriptive test names that explain the expected behavior
2. **Test Isolation**: Each test should be independent and not rely on other tests
3. **Mock External Dependencies**: Mock Firebase, Stripe, and other external services
4. **Use Test IDs**: Add `data-testid` attributes to elements for reliable selection
5. **Test User Flows**: Focus on testing complete user journeys rather than isolated features
6. **Maintain Test Data**: Keep test data consistent and up-to-date

## Common Issues and Solutions

### Tests Failing Due to Environment
- Ensure all environment variables are set in `.env.test`
- Check that Firebase emulators are running for integration tests

### E2E Tests Timing Out
- Increase timeout in `playwright.config.ts`
- Add explicit waits for dynamic content
- Use `page.waitForSelector()` for elements that load asynchronously

### Mock Issues
- Clear mocks between tests using `jest.clearAllMocks()`
- Ensure mocks are properly configured for the specific test scenario

## Performance Testing

For performance testing, consider adding:
- Lighthouse CI for performance metrics
- Load testing with tools like Artillery or k6
- Bundle size analysis with `npm run analyze`

## Security Testing

The project includes:
- npm audit for dependency vulnerabilities
- Security headers testing in E2E tests
- Input validation testing in unit tests

## Maintenance

- Update test dependencies regularly
- Review and update test data as the application evolves
- Monitor test coverage and add tests for new features
- Keep E2E tests aligned with UI changes 