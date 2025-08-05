import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test('should load the home page successfully', async ({ page }) => {
    await page.goto('/')
    
    // Check if the page loads without errors
    await expect(page).toHaveTitle(/Srow/i)
    
    // Check if main content is visible
    await expect(page.locator('main')).toBeVisible()
  })

  test('should display navigation header', async ({ page }) => {
    await page.goto('/')
    
    // Check if header is present
    await expect(page.locator('header')).toBeVisible()
    
    // Check if logo is present
    await expect(page.locator('img[alt*="logo" i]')).toBeVisible()
    
    // Check if navigation links are present
    await expect(page.getByRole('link', { name: /home/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /products/i })).toBeVisible()
  })

  test('should display featured products section', async ({ page }) => {
    await page.goto('/')
    
    // Check if featured products section exists
    await expect(page.locator('section').filter({ hasText: /featured/i })).toBeVisible()
    
    // Check if product cards are displayed
    const productCards = page.locator('[data-testid="product-card"]')
    await expect(productCards.first()).toBeVisible()
  })

  test('should navigate to product details when clicking on product', async ({ page }) => {
    await page.goto('/')
    
    // Click on the first product card
    const firstProduct = page.locator('[data-testid="product-card"]').first()
    await firstProduct.click()
    
    // Should navigate to product detail page
    await expect(page).toHaveURL(/\/product\//)
  })

  test('should display cart icon and allow cart access', async ({ page }) => {
    await page.goto('/')
    
    // Check if cart icon is present
    const cartIcon = page.locator('[aria-label*="cart" i]')
    await expect(cartIcon).toBeVisible()
    
    // Click on cart icon
    await cartIcon.click()
    
    // Should show cart or navigate to cart page
    await expect(page).toHaveURL(/\/cart/)
  })

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Check if mobile menu button is visible
    const mobileMenuButton = page.locator('[aria-label*="menu" i]')
    await expect(mobileMenuButton).toBeVisible()
    
    // Click mobile menu button
    await mobileMenuButton.click()
    
    // Check if mobile menu opens
    await expect(page.locator('nav')).toBeVisible()
  })

  test('should handle search functionality', async ({ page }) => {
    await page.goto('/')
    
    // Find search input
    const searchInput = page.locator('input[placeholder*="search" i]')
    await expect(searchInput).toBeVisible()
    
    // Type in search query
    await searchInput.fill('test product')
    await searchInput.press('Enter')
    
    // Should navigate to search results or show results
    await expect(page).toHaveURL(/search/)
  })

  test('should display footer with links', async ({ page }) => {
    await page.goto('/')
    
    // Check if footer is present
    await expect(page.locator('footer')).toBeVisible()
    
    // Check if footer links are present
    await expect(page.getByRole('link', { name: /about/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /contact/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /privacy/i })).toBeVisible()
  })
}) 