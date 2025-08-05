import { test, expect } from '@playwright/test'

test.describe('Admin Panel', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin first
    await page.goto('/admin/login')
    await page.getByLabel(/email/i).fill('admin@example.com')
    await page.getByLabel(/password/i).fill('adminpassword')
    await page.getByRole('button', { name: /login/i }).click()
    
    // Wait for redirect to admin dashboard
    await expect(page).toHaveURL('/admin')
  })

  test('should access admin dashboard after login', async ({ page }) => {
    await expect(page.getByText(/admin dashboard/i)).toBeVisible()
    await expect(page.getByText(/products/i)).toBeVisible()
    await expect(page.getByText(/categories/i)).toBeVisible()
  })

  test('should create a new product', async ({ page }) => {
    // Navigate to products page
    await page.getByRole('link', { name: /products/i }).click()
    await expect(page).toHaveURL('/admin/products')
    
    // Click add new product
    await page.getByRole('link', { name: /add new product/i }).click()
    await expect(page).toHaveURL('/admin/products/new')
    
    // Fill product form
    await page.getByLabel(/product name/i).fill('Test Product')
    await page.getByLabel(/description/i).fill('Test product description')
    await page.getByLabel(/price/i).fill('99.99')
    await page.getByLabel(/category/i).selectOption('test-category')
    
    // Upload image
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles('tests/fixtures/test-image.jpg')
    
    // Save product
    await page.getByRole('button', { name: /save product/i }).click()
    
    // Should redirect to products list
    await expect(page).toHaveURL('/admin/products')
    await expect(page.getByText(/product created successfully/i)).toBeVisible()
  })

  test('should edit an existing product', async ({ page }) => {
    await page.goto('/admin/products')
    
    // Click edit on first product
    await page.locator('[data-testid="edit-product"]').first().click()
    
    // Update product name
    await page.getByLabel(/product name/i).clear()
    await page.getByLabel(/product name/i).fill('Updated Product Name')
    
    // Save changes
    await page.getByRole('button', { name: /update product/i }).click()
    
    // Should show success message
    await expect(page.getByText(/product updated successfully/i)).toBeVisible()
  })

  test('should delete a product', async ({ page }) => {
    await page.goto('/admin/products')
    
    // Click delete on first product
    await page.locator('[data-testid="delete-product"]').first().click()
    
    // Confirm deletion
    await page.getByRole('button', { name: /confirm/i }).click()
    
    // Should show success message
    await expect(page.getByText(/product deleted successfully/i)).toBeVisible()
  })

  test('should create a new category', async ({ page }) => {
    // Navigate to categories page
    await page.getByRole('link', { name: /categories/i }).click()
    await expect(page).toHaveURL('/admin/categories')
    
    // Click add new category
    await page.getByRole('link', { name: /add new category/i }).click()
    await expect(page).toHaveURL('/admin/categories/new')
    
    // Fill category form
    await page.getByLabel(/category name/i).fill('Test Category')
    await page.getByLabel(/description/i).fill('Test category description')
    await page.getByLabel(/slug/i).fill('test-category')
    
    // Upload image
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles('tests/fixtures/test-image.jpg')
    
    // Save category
    await page.getByRole('button', { name: /save category/i }).click()
    
    // Should redirect to categories list
    await expect(page).toHaveURL('/admin/categories')
    await expect(page.getByText(/category created successfully/i)).toBeVisible()
  })

  test('should manage product inventory', async ({ page }) => {
    await page.goto('/admin/products')
    
    // Click on a product to edit
    await page.locator('[data-testid="edit-product"]').first().click()
    
    // Update inventory
    await page.getByLabel(/stock quantity/i).clear()
    await page.getByLabel(/stock quantity/i).fill('50')
    
    // Toggle in stock status
    await page.getByLabel(/in stock/i).check()
    
    // Save changes
    await page.getByRole('button', { name: /update product/i }).click()
    
    await expect(page.getByText(/product updated successfully/i)).toBeVisible()
  })

  test('should view order management', async ({ page }) => {
    // Navigate to orders page
    await page.getByRole('link', { name: /orders/i }).click()
    await expect(page).toHaveURL('/admin/orders')
    
    // Should show orders list
    await expect(page.getByText(/order management/i)).toBeVisible()
  })

  test('should access admin profile', async ({ page }) => {
    // Click on admin profile
    await page.locator('[data-testid="admin-profile"]').click()
    await expect(page).toHaveURL('/admin/profile')
    
    // Should show profile information
    await expect(page.getByText(/admin profile/i)).toBeVisible()
  })

  test('should logout from admin panel', async ({ page }) => {
    // Click logout
    await page.getByRole('button', { name: /logout/i }).click()
    
    // Should redirect to login page
    await expect(page).toHaveURL('/admin/login')
    await expect(page.getByText(/admin login/i)).toBeVisible()
  })
}) 