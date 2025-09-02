import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import axios from 'axios'
import { TopicsLinks } from '../TopicsLinks'
import { LanguageProvider } from '../../contexts/LanguageContext'
import { Topic } from '../../../types/topics'

// Mock axios
vi.mock('axios')
const mockedAxios = vi.mocked(axios)

// Mock flowbite-react Card component
vi.mock('flowbite-react', () => ({
  Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="card-mock" className={className}>{children}</div>
  ),
}))

// Mock data
const mockTopics: Topic[] = [
  {
    id: 1,
    slug: 'react-basics',
    difficulty_level: 'beginner',
    estimated_time: '2 hours',
    frameworks: ['React'],
    translations: {
      es: {
        title: 'Fundamentos de React',
        description: 'Aprende los conceptos básicos de React'
      },
      en: {
        title: 'React Basics',
        description: 'Learn the basic concepts of React'
      }
    }
  },
  {
    id: 2,
    slug: 'vue-advanced',
    difficulty_level: 'advanced',
    estimated_time: '4 hours',
    frameworks: ['Vue'],
    translations: {
      es: {
        title: 'Vue Avanzado',
        description: 'Conceptos avanzados de Vue.js'
      }
    }
  }
]



// Wrapper component with LanguageProvider
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <LanguageProvider>
    {children}
  </LanguageProvider>
)

describe('TopicsLinks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state initially', () => {
    // Mock pending axios request
    mockedAxios.get.mockImplementation(() => new Promise(() => {}))
    
    render(
      <TestWrapper>
        <TopicsLinks />
      </TestWrapper>
    )
    
    expect(screen.getByText(/cargando topics/i)).toBeInTheDocument()
    expect(screen.getByText(/cargando topics/i).previousElementSibling).toHaveClass('animate-spin') // spinner
  })

  it('displays topics when loaded successfully', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        success: true,
        data: mockTopics
      }
    })
    
    render(
      <TestWrapper>
        <TopicsLinks />
      </TestWrapper>
    )
    
    await waitFor(() => {
      expect(screen.getByText('Fundamentos de React')).toBeInTheDocument()
      expect(screen.getByText('Vue Avanzado')).toBeInTheDocument()
    })
    
    expect(screen.getByText('Aprende los conceptos básicos de React')).toBeInTheDocument()
    expect(screen.getByText('Conceptos avanzados de Vue.js')).toBeInTheDocument()
  })

  it('displays error message when API fails', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network error'))
    
    render(
      <TestWrapper>
        <TopicsLinks />
      </TestWrapper>
    )
    
    await waitFor(() => {
      expect(screen.getByText(/error de conexión/i)).toBeInTheDocument()
    })
  })

  it('displays empty state when no topics available', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        success: true,
        data: []
      }
    })
    
    render(
      <TestWrapper>
        <TopicsLinks />
      </TestWrapper>
    )
    
    await waitFor(() => {
      expect(screen.getByText(/no hay topics disponibles/i)).toBeInTheDocument()
    })
  })

  it('displays difficulty levels with correct styling', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        success: true,
        data: mockTopics
      }
    })
    
    render(
      <TestWrapper>
        <TopicsLinks />
      </TestWrapper>
    )
    
    await waitFor(() => {
      const beginnerBadge = screen.getByText('beginner')
      const advancedBadge = screen.getByText('advanced')
      
      expect(beginnerBadge).toHaveClass('bg-green-100', 'text-green-800')
      expect(advancedBadge).toHaveClass('bg-red-100', 'text-red-800')
    })
  })

  it('displays frameworks correctly', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        success: true,
        data: mockTopics
      }
    })
    
    render(
      <TestWrapper>
        <TopicsLinks />
      </TestWrapper>
    )
    
    await waitFor(() => {
      expect(screen.getByText('React')).toBeInTheDocument()
      expect(screen.getByText('Vue')).toBeInTheDocument()
      expect(screen.getAllByText('Frameworks:')).toHaveLength(2)
    })
  })

  it('displays estimated time', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        success: true,
        data: mockTopics
      }
    })
    
    render(
      <TestWrapper>
        <TopicsLinks />
      </TestWrapper>
    )
    
    await waitFor(() => {
      expect(screen.getByText('2 hours')).toBeInTheDocument()
      expect(screen.getByText('4 hours')).toBeInTheDocument()
    })
  })

  it('renders correct links to topic pages', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        success: true,
        data: mockTopics
      }
    })
    
    render(
      <TestWrapper>
        <TopicsLinks />
      </TestWrapper>
    )
    
    await waitFor(() => {
      const reactLink = screen.getByRole('link', { name: /fundamentos de react/i })
      const vueLink = screen.getByRole('link', { name: /vue avanzado/i })
      
      expect(reactLink).toHaveAttribute('href', '/page/react-basics')
      expect(vueLink).toHaveAttribute('href', '/page/vue-advanced')
    })
  })

  it('renders action buttons with correct links', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        success: true,
        data: mockTopics
      }
    })
    
    render(
      <TestWrapper>
        <TopicsLinks />
      </TestWrapper>
    )
    
    await waitFor(() => {
      const actionButtons = screen.getAllByText('Ver detalles')
      expect(actionButtons).toHaveLength(2)
      
      expect(actionButtons[0]).toHaveAttribute('href', '/page/react-basics')
      expect(actionButtons[1]).toHaveAttribute('href', '/page/vue-advanced')
    })
  })
})