import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  getAuth,
} from 'firebase/auth'
import { protectAdminRoute } from './auth.server'

// Mock Firebase Auth
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
  getAuth: jest.fn(),
}))

// Mock Next.js
jest.mock('next/server', () => ({
  NextResponse: {
    redirect: jest.fn((url) => ({ url })),
  },
}))

describe('Authentication Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Client-side Authentication', () => {
    it('should sign in user with email and password', async () => {
      const mockUser = {
        uid: 'test-uid',
        email: 'test@example.com',
        displayName: 'Test User',
      }
      ;(signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
        user: mockUser,
      })

      const result = await signInWithEmailAndPassword(
        {} as any,
        'test@example.com',
        'password123'
      )

      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        {},
        'test@example.com',
        'password123'
      )
      expect(result.user).toEqual(mockUser)
    })

    it('should create new user with email and password', async () => {
      const mockUser = {
        uid: 'new-uid',
        email: 'new@example.com',
        displayName: 'New User',
      }
      ;(createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({
        user: mockUser,
      })

      const result = await createUserWithEmailAndPassword(
        {} as any,
        'new@example.com',
        'password123'
      )

      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        {},
        'new@example.com',
        'password123'
      )
      expect(result.user).toEqual(mockUser)
    })

    it('should sign out user', async () => {
      ;(signOut as jest.Mock).mockResolvedValue(undefined)

      await signOut({} as any)

      expect(signOut).toHaveBeenCalledWith({})
    })

    it('should handle authentication state changes', () => {
      const mockCallback = jest.fn()
      ;(onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
        callback({ uid: 'test-uid' })
        return () => {}
      })

      const unsubscribe = onAuthStateChanged({} as any, mockCallback)

      expect(onAuthStateChanged).toHaveBeenCalledWith({}, mockCallback)
      expect(mockCallback).toHaveBeenCalledWith({ uid: 'test-uid' })
      expect(typeof unsubscribe).toBe('function')
    })

    it('should get auth instance', () => {
      const mockAuth = { uid: 'test-uid' }
      ;(getAuth as jest.Mock).mockReturnValue(mockAuth)

      const auth = getAuth()

      expect(getAuth).toHaveBeenCalled()
      expect(auth).toEqual(mockAuth)
    })
  })

  describe('Server-side Authentication', () => {
    it('should protect admin routes and redirect to login', async () => {
      const mockRequest = {
        url: 'http://localhost:3000/admin',
        cookies: {
          get: jest.fn().mockReturnValue(null), // No auth token
        },
      } as any

      const result = await protectAdminRoute(mockRequest)

      expect(result).toEqual({ url: '/admin/login' })
    })

    it('should allow access to admin routes with valid token', async () => {
      const mockRequest = {
        url: 'http://localhost:3000/admin',
        cookies: {
          get: jest.fn().mockReturnValue({
            value: 'valid-token',
          }),
        },
      } as any

      // Mock successful token verification
      jest.doMock('./firebaseAdmin', () => ({
        verifyIdToken: jest.fn().mockResolvedValue({
          uid: 'admin-uid',
          email: 'admin@example.com',
        }),
      }))

      const result = await protectAdminRoute(mockRequest)

      expect(result).toBeNull() // No redirect, access allowed
    })

    it('should handle invalid tokens', async () => {
      const mockRequest = {
        url: 'http://localhost:3000/admin',
        cookies: {
          get: jest.fn().mockReturnValue({
            value: 'invalid-token',
          }),
        },
      } as any

      // Mock failed token verification
      jest.doMock('./firebaseAdmin', () => ({
        verifyIdToken: jest.fn().mockRejectedValue(new Error('Invalid token')),
      }))

      const result = await protectAdminRoute(mockRequest)

      expect(result).toEqual({ url: '/admin/login' })
    })
  })

  describe('Error Handling', () => {
    it('should handle authentication errors', async () => {
      const authError = new Error('Invalid email or password')
      ;(signInWithEmailAndPassword as jest.Mock).mockRejectedValue(authError)

      await expect(
        signInWithEmailAndPassword({} as any, 'invalid@example.com', 'wrongpass')
      ).rejects.toThrow('Invalid email or password')
    })

    it('should handle user creation errors', async () => {
      const creationError = new Error('Email already in use')
      ;(createUserWithEmailAndPassword as jest.Mock).mockRejectedValue(creationError)

      await expect(
        createUserWithEmailAndPassword({} as any, 'existing@example.com', 'password123')
      ).rejects.toThrow('Email already in use')
    })
  })
}) 