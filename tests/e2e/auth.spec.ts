import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should allow user registration', async ({ page }) => {
    // Navigate to register page
    await page.getByRole('link', { name: /register/i }).click()
    await expect(page).toHaveURL(/\/register/)

    // Fill registration form
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/password/i).fill('password123')
    await page.getByLabel(/confirm password/i).fill('password123')
    await page.getByLabel(/name/i).fill('Test User')

    // Submit form
    await page.getByRole('button', { name: /register/i }).click()

    // Should redirect to home page or show success message
    await expect(page).toHaveURL('/')
  })

  test('should allow user login', async ({ page }) => {
    // Navigate to login page
    await page.getByRole('link', { name: /login/i }).click()
    await expect(page).toHaveURL(/\/login/)

    // Fill login form
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/password/i).fill('password123')

    // Submit form
    await page.getByRole('button', { name: /login/i }).click()

    // Should redirect to home page or dashboard
    await expect(page).toHaveURL('/')
  })

  test('should show error for invalid login credentials', async ({ page }) => {
    await page.getByRole('link', { name: /login/i }).click()

    // Fill invalid credentials
    await page.getByLabel(/email/i).fill('invalid@example.com')
    await page.getByLabel(/password/i).fill('wrongpassword')

    // Submit form
    await page.getByRole('button', { name: /login/i }).click()

    // Should show error message
    await expect(page.locator('.error-message')).toBeVisible()
  })

  test('should allow user logout', async ({ page }) => {
    // First login
    await page.getByRole('link', { name: /login/i }).click()
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/password/i).fill('password123')
    await page.getByRole('button', { name: /login/i }).click()

    // Check if user menu is visible
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible()

    // Click logout
    await page.getByRole('button', { name: /logout/i }).click()

    // Should redirect to home page and show login button
    await expect(page).toHaveURL('/')
    await expect(page.getByRole('link', { name: /login/i })).toBeVisible()
  })

  test('should protect admin routes', async ({ page }) => {
    // Try to access admin page without authentication
    await page.goto('/admin')
    
    // Should redirect to login page
    await expect(page).toHaveURL(/\/login/)
  })

  test('should allow admin access after login', async ({ page }) => {
    // Login as admin
    await page.getByRole('link', { name: /login/i }).click()
    await page.getByLabel(/email/i).fill('admin@example.com')
    await page.getByLabel(/password/i).fill('adminpassword')
    await page.getByRole('button', { name: /login/i }).click()

    // Navigate to admin page
    await page.goto('/admin')
    
    // Should access admin dashboard
    await expect(page).toHaveURL('/admin')
    await expect(page.locator('h1')).toContainText(/admin/i)
  })

  test('should handle password reset', async ({ page }) => {
    await page.getByRole('link', { name: /login/i }).click()
    
    // Click forgot password link
    await page.getByRole('link', { name: /forgot password/i }).click()
    
    // Fill email for password reset
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByRole('button', { name: /send reset email/i }).click()
    
    // Should show success message
    await expect(page.locator('.success-message')).toBeVisible()
  })

  test('should validate form inputs', async ({ page }) => {
    await page.getByRole('link', { name: /register/i }).click()
    
    // Try to submit empty form
    await page.getByRole('button', { name: /register/i }).click()
    
    // Should show validation errors
    await expect(page.locator('.error-message')).toBeVisible()
    
    // Fill invalid email
    await page.getByLabel(/email/i).fill('invalid-email')
    await page.getByRole('button', { name: /register/i }).click()
    
    // Should show email validation error
    await expect(page.locator('.error-message')).toContainText(/email/i)
    
    // Fill weak password
    await page.getByLabel(/password/i).fill('123')
    await page.getByRole('button', { name: /register/i }).click()
    
    // Should show password strength error
    await expect(page.locator('.error-message')).toContainText(/password/i)
  })
}) 