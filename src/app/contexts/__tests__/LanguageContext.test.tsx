import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { LanguageProvider, useLanguage } from '../LanguageContext'

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

// Simple test component
const TestComponent = () => {
  const { currentLanguage, loading } = useLanguage()
  
  return (
    <div>
      <div data-testid="current-language">{currentLanguage}</div>
      <div data-testid="loading">{loading ? 'loading' : 'loaded'}</div>
    </div>
  )
}

// Mock language data
const mockData = {
  header: {
    title: 'Test Title',
    flags: {
      england: 'England',
      france: 'France',
      spain: 'Spain'
    }
  },
  home: {
    carousel: {
      title: 'Test',
      frameworks: {
        angular: 'Angular',
        react: 'React',
        vue: 'Vue'
      }
    },
    explanation: {
      subtitle: 'Test',
      description: 'Test'
    },
    example: {
      title: 'Test',
      description: 'Test'
    },
    topics: {
      loading: 'Loading...',
      error: 'Error',
      empty: 'Empty'
    }
  },
  topic: {
    navigation: {
      back: 'Back'
    },
    error: {
      title: 'Error',
      notFound: 'Not found',
      backButton: 'Back'
    },
    sections: {
      technicalExplanation: 'Technical',
      practicalExample: 'Example',
      codeComparison: 'Comparison',
      similarities: 'Similarities',
      differences: 'Differences'
    }
  },
  modal: {
    title: 'Modal'
  },
  metadata: {
    title: 'Title',
    description: 'Description'
  }
}

describe('LanguageContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with default Spanish language', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData)
    })

    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    )

    expect(screen.getByTestId('current-language')).toHaveTextContent('es')
    expect(screen.getByTestId('loading')).toHaveTextContent('loading')

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('loaded')
    })
  })

  it('throws error when used outside provider', () => {
    const TestWithoutProvider = () => {
      try {
        useLanguage()
        return <div>Should not render</div>
      } catch (error) {
        return <div data-testid="error">{(error as Error).message}</div>
      }
    }

    render(<TestWithoutProvider />)
    
    expect(screen.getByTestId('error')).toHaveTextContent(
      'useLanguage must be used within a LanguageProvider'
    )
  })
})