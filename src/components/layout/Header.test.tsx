import { render, screen } from '@testing-library/react'
import { useRouter } from 'next/router'
import Header from './Header'

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>

describe('Header', () => {
  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    })
  })

  it('renders the header with logo', () => {
    render(<Header />)
    
    // Check if logo is present
    const logo = screen.getByAltText(/logo/i)
    expect(logo).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(<Header />)
    
    // Check if navigation links are present
    expect(screen.getByText(/home/i)).toBeInTheDocument()
    expect(screen.getByText(/products/i)).toBeInTheDocument()
    expect(screen.getByText(/about/i)).toBeInTheDocument()
    expect(screen.getByText(/contact/i)).toBeInTheDocument()
  })

  it('renders cart icon', () => {
    render(<Header />)
    
    // Check if cart icon is present
    const cartIcon = screen.getByLabelText(/cart/i)
    expect(cartIcon).toBeInTheDocument()
  })

  it('renders user menu when authenticated', () => {
    // Mock authentication state
    const mockUser = {
      uid: '123',
      email: 'test@example.com',
      displayName: 'Test User',
    }

    render(<Header user={mockUser} />)
    
    // Check if user menu is present
    expect(screen.getByText(/test user/i)).toBeInTheDocument()
  })

  it('renders login button when not authenticated', () => {
    render(<Header user={null} />)
    
    // Check if login button is present
    expect(screen.getByText(/login/i)).toBeInTheDocument()
  })
}) 