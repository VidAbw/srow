import { createMocks } from 'node-mocks-http'
import createPaymentIntent from '@/pages/api/create-payment-intent'

// Mock Stripe
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    paymentIntents: {
      create: jest.fn(),
    },
  }))
})

describe('/api/create-payment-intent', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should create payment intent successfully', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        amount: 1000,
        currency: 'usd',
      },
    })

    const mockPaymentIntent = {
      id: 'pi_test_123',
      client_secret: 'pi_test_secret_123',
      amount: 1000,
      currency: 'usd',
      status: 'requires_payment_method',
    }

    const Stripe = require('stripe')
    const mockStripe = new Stripe()
    mockStripe.paymentIntents.create.mockResolvedValue(mockPaymentIntent)

    await createPaymentIntent(req, res)

    expect(res._getStatusCode()).toBe(200)
    expect(JSON.parse(res._getData())).toEqual({
      clientSecret: 'pi_test_secret_123',
    })
    expect(mockStripe.paymentIntents.create).toHaveBeenCalledWith({
      amount: 1000,
      currency: 'usd',
    })
  })

  it('should return 400 for invalid request method', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    })

    await createPaymentIntent(req, res)

    expect(res._getStatusCode()).toBe(400)
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Method not allowed',
    })
  })

  it('should return 400 for missing amount', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        currency: 'usd',
      },
    })

    await createPaymentIntent(req, res)

    expect(res._getStatusCode()).toBe(400)
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Amount is required',
    })
  })

  it('should return 400 for invalid amount', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        amount: -100,
        currency: 'usd',
      },
    })

    await createPaymentIntent(req, res)

    expect(res._getStatusCode()).toBe(400)
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Amount must be greater than 0',
    })
  })

  it('should handle Stripe errors', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        amount: 1000,
        currency: 'usd',
      },
    })

    const Stripe = require('stripe')
    const mockStripe = new Stripe()
    mockStripe.paymentIntents.create.mockRejectedValue(
      new Error('Stripe error')
    )

    await createPaymentIntent(req, res)

    expect(res._getStatusCode()).toBe(500)
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Failed to create payment intent',
    })
  })

  it('should use default currency when not provided', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        amount: 1000,
      },
    })

    const mockPaymentIntent = {
      id: 'pi_test_123',
      client_secret: 'pi_test_secret_123',
      amount: 1000,
      currency: 'usd',
      status: 'requires_payment_method',
    }

    const Stripe = require('stripe')
    const mockStripe = new Stripe()
    mockStripe.paymentIntents.create.mockResolvedValue(mockPaymentIntent)

    await createPaymentIntent(req, res)

    expect(res._getStatusCode()).toBe(200)
    expect(mockStripe.paymentIntents.create).toHaveBeenCalledWith({
      amount: 1000,
      currency: 'usd',
    })
  })

  it('should validate currency format', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        amount: 1000,
        currency: 'invalid',
      },
    })

    await createPaymentIntent(req, res)

    expect(res._getStatusCode()).toBe(400)
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Invalid currency format',
    })
  })
}) 