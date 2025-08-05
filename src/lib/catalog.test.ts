import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
} from './catalog'

// Mock Firebase modules
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
}))

jest.mock('firebase/storage', () => ({
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
}))

jest.mock('./firebase', () => ({
  db: {},
  storage: {},
}))

describe('Catalog Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Category Management', () => {
    const mockCategory = {
      name: 'Test Category',
      description: 'Test Description',
      imageUrl: 'https://example.com/image.jpg',
      slug: 'test-category',
    }

    it('should create a category successfully', async () => {
      const { addDoc } = require('firebase/firestore')
      addDoc.mockResolvedValue({ id: 'test-id' })

      const result = await createCategory(mockCategory)

      expect(addDoc).toHaveBeenCalled()
      expect(result).toBe('test-id')
    })

    it('should throw error when Firebase is not initialized', async () => {
      // Mock db as null to simulate uninitialized Firebase
      jest.doMock('./firebase', () => ({
        db: null,
        storage: null,
      }))

      await expect(createCategory(mockCategory)).rejects.toThrow(
        'Firebase database is not initialized'
      )
    })

    it('should get all categories successfully', async () => {
      const { getDocs, collection } = require('firebase/firestore')
      const mockDocs = [
        { id: '1', data: () => ({ ...mockCategory, id: '1' }) },
        { id: '2', data: () => ({ ...mockCategory, id: '2' }) },
      ]
      getDocs.mockResolvedValue({ docs: mockDocs })

      const result = await getAllCategories()

      expect(collection).toHaveBeenCalledWith({}, 'categories')
      expect(getDocs).toHaveBeenCalled()
      expect(result).toHaveLength(2)
    })

    it('should get category by ID successfully', async () => {
      const { getDoc, doc } = require('firebase/firestore')
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ ...mockCategory, id: 'test-id' }),
      })

      const result = await getCategoryById('test-id')

      expect(doc).toHaveBeenCalledWith({}, 'categories', 'test-id')
      expect(result).toEqual({ ...mockCategory, id: 'test-id' })
    })

    it('should return null for non-existent category', async () => {
      const { getDoc, doc } = require('firebase/firestore')
      getDoc.mockResolvedValue({
        exists: () => false,
      })

      const result = await getCategoryById('non-existent')

      expect(result).toBeNull()
    })
  })

  describe('Product Management', () => {
    const mockProduct = {
      name: 'Test Product',
      description: 'Test Description',
      price: 99.99,
      categoryId: 'test-category',
      images: ['https://example.com/image1.jpg'],
      inStock: true,
      slug: 'test-product',
    }

    it('should create a product successfully', async () => {
      const { addDoc } = require('firebase/firestore')
      addDoc.mockResolvedValue({ id: 'test-product-id' })

      const result = await createProduct(mockProduct)

      expect(addDoc).toHaveBeenCalled()
      expect(result).toBe('test-product-id')
    })

    it('should get all products successfully', async () => {
      const { getDocs, collection } = require('firebase/firestore')
      const mockDocs = [
        { id: '1', data: () => ({ ...mockProduct, id: '1' }) },
        { id: '2', data: () => ({ ...mockProduct, id: '2' }) },
      ]
      getDocs.mockResolvedValue({ docs: mockDocs })

      const result = await getAllProducts()

      expect(collection).toHaveBeenCalledWith({}, 'products')
      expect(getDocs).toHaveBeenCalled()
      expect(result).toHaveLength(2)
    })

    it('should get product by ID successfully', async () => {
      const { getDoc, doc } = require('firebase/firestore')
      getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ ...mockProduct, id: 'test-product-id' }),
      })

      const result = await getProductById('test-product-id')

      expect(doc).toHaveBeenCalledWith({}, 'products', 'test-product-id')
      expect(result).toEqual({ ...mockProduct, id: 'test-product-id' })
    })

    it('should get products by category successfully', async () => {
      const { getDocs, collection, query, where } = require('firebase/firestore')
      const mockDocs = [
        { id: '1', data: () => ({ ...mockProduct, id: '1' }) },
      ]
      getDocs.mockResolvedValue({ docs: mockDocs })

      const result = await getProductsByCategory('test-category')

      expect(collection).toHaveBeenCalledWith({}, 'products')
      expect(query).toHaveBeenCalled()
      expect(where).toHaveBeenCalledWith('categoryId', '==', 'test-category')
      expect(result).toHaveLength(1)
    })

    it('should update product successfully', async () => {
      const { updateDoc, doc } = require('firebase/firestore')
      updateDoc.mockResolvedValue(undefined)

      await updateProduct('test-id', { name: 'Updated Product' })

      expect(doc).toHaveBeenCalledWith({}, 'products', 'test-id')
      expect(updateDoc).toHaveBeenCalled()
    })

    it('should delete product successfully', async () => {
      const { deleteDoc, doc } = require('firebase/firestore')
      deleteDoc.mockResolvedValue(undefined)

      await deleteProduct('test-id')

      expect(doc).toHaveBeenCalledWith({}, 'products', 'test-id')
      expect(deleteDoc).toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    it('should handle Firebase errors gracefully', async () => {
      const { addDoc } = require('firebase/firestore')
      addDoc.mockRejectedValue(new Error('Firebase error'))

      await expect(createCategory({ name: 'Test' })).rejects.toThrow('Firebase error')
    })

    it('should validate required fields', async () => {
      await expect(createCategory({} as any)).rejects.toThrow()
    })
  })
}) 