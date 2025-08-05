import { test, expect } from '@playwright/test'

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should add product to cart and proceed to checkout', async ({ page }) => {
    // Navigate to a product page
    await page.goto('/product/test-product')
    
    // Add product to cart
    await page.getByRole('button', { name: /add to cart/i }).click()
    
    // Check if cart notification appears
    await expect(page.locator('[data-testid="cart-notification"]')).toBeVisible()
    
    // Navigate to cart
    await page.getByRole('link', { name: /cart/i }).click()
    await expect(page).toHaveURL(/\/cart/)
    
    // Verify product is in cart
    await expect(page.locator('[data-testid="cart-item"]')).toBeVisible()
    await expect(page.getByText(/test product/i)).toBeVisible()
    
    // Proceed to checkout
    await page.getByRole('button', { name: /proceed to checkout/i }).click()
    await expect(page).toHaveURL(/\/checkout/)
  })

  test('should handle cart quantity updates', async ({ page }) => {
    await page.goto('/cart')
    
    // Increase quantity
    await page.locator('[data-testid="quantity-increase"]').click()
    
    // Verify quantity updated
    await expect(page.locator('[data-testid="quantity-display"]')).toContainText('2')
    
    // Decrease quantity
    await page.locator('[data-testid="quantity-decrease"]').click()
    
    // Verify quantity back to 1
    await expect(page.locator('[data-testid="quantity-display"]')).toContainText('1')
  })

  test('should remove item from cart', async ({ page }) => {
    await page.goto('/cart')
    
    // Remove item
    await page.locator('[data-testid="remove-item"]').click()
    
    // Verify cart is empty
    await expect(page.getByText(/your cart is empty/i)).toBeVisible()
  })

  test('should complete checkout process', async ({ page }) => {
    // Add product to cart first
    await page.goto('/product/test-product')
    await page.getByRole('button', { name: /add to cart/i }).click()
    
    // Go to checkout
    await page.goto('/checkout')
    
    // Fill shipping information
    await page.getByLabel(/first name/i).fill('John')
    await page.getByLabel(/last name/i).fill('Doe')
    await page.getByLabel(/email/i).fill('john@example.com')
    await page.getByLabel(/phone/i).fill('1234567890')
    await page.getByLabel(/address/i).fill('123 Main St')
    await page.getByLabel(/city/i).fill('New York')
    await page.getByLabel(/state/i).fill('NY')
    await page.getByLabel(/zip code/i).fill('10001')
    
    // Fill payment information (using test card)
    await page.getByLabel(/card number/i).fill('4242424242424242')
    await page.getByLabel(/expiry date/i).fill('12/25')
    await page.getByLabel(/cvc/i).fill('123')
    
    // Submit order
    await page.getByRole('button', { name: /place order/i }).click()
    
    // Should redirect to confirmation page
    await expect(page).toHaveURL(/\/confirmation/)
    await expect(page.getByText(/order confirmed/i)).toBeVisible()
  })

  test('should validate checkout form fields', async ({ page }) => {
    await page.goto('/checkout')
    
    // Try to submit without filling required fields
    await page.getByRole('button', { name: /place order/i }).click()
    
    // Should show validation errors
    await expect(page.getByText(/first name is required/i)).toBeVisible()
    await expect(page.getByText(/email is required/i)).toBeVisible()
    await expect(page.getByText(/address is required/i)).toBeVisible()
  })

  test('should handle payment errors gracefully', async ({ page }) => {
    await page.goto('/checkout')
    
    // Fill form with invalid payment details
    await page.getByLabel(/first name/i).fill('John')
    await page.getByLabel(/email/i).fill('john@example.com')
    await page.getByLabel(/address/i).fill('123 Main St')
    await page.getByLabel(/card number/i).fill('4000000000000002') // Declined card
    await page.getByLabel(/expiry date/i).fill('12/25')
    await page.getByLabel(/cvc/i).fill('123')
    
    await page.getByRole('button', { name: /place order/i }).click()
    
    // Should show payment error
    await expect(page.getByText(/payment failed/i)).toBeVisible()
  })

  test('should calculate totals correctly', async ({ page }) => {
    await page.goto('/cart')
    
    // Verify subtotal
    await expect(page.locator('[data-testid="subtotal"]')).toBeVisible()
    
    // Verify tax calculation
    await expect(page.locator('[data-testid="tax"]')).toBeVisible()
    
    // Verify total
    await expect(page.locator('[data-testid="total"]')).toBeVisible()
  })

  test('should apply discount codes', async ({ page }) => {
    await page.goto('/cart')
    
    // Enter discount code
    await page.getByLabel(/discount code/i).fill('SAVE10')
    await page.getByRole('button', { name: /apply/i }).click()
    
    // Verify discount applied
    await expect(page.getByText(/discount applied/i)).toBeVisible()
    await expect(page.locator('[data-testid="discount"]')).toBeVisible()
  })

  test('should handle guest checkout', async ({ page }) => {
    await page.goto('/checkout')
    
    // Should allow guest checkout without login
    await expect(page.getByText(/guest checkout/i)).toBeVisible()
    
    // Fill guest information
    await page.getByLabel(/first name/i).fill('Guest')
    await page.getByLabel(/last name/i).fill('User')
    await page.getByLabel(/email/i).fill('guest@example.com')
    
    // Should be able to proceed
    await expect(page.getByRole('button', { name: /place order/i })).toBeEnabled()
  })

  test('should save shipping address for logged in users', async ({ page }) => {
    // Login first
    await page.getByRole('link', { name: /login/i }).click()
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/password/i).fill('password123')
    await page.getByRole('button', { name: /login/i }).click()
    
    // Go to checkout
    await page.goto('/checkout')
    
    // Should show saved addresses option
    await expect(page.getByText(/saved addresses/i)).toBeVisible()
  })
}) 