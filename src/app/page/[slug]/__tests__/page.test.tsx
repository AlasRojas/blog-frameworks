import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import TopicPage from '../page';
import { useLanguage } from '../../../contexts/LanguageContext';

// Mock dependencies
vi.mock('next/navigation', () => ({
  useParams: vi.fn()
}));

vi.mock('next/link', () => ({
  default: ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  )
}));

vi.mock('axios');

vi.mock('flowbite-react', () => ({
  Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="card" className={className}>{children}</div>
  )
}));

vi.mock('../../../contexts/LanguageContext', () => ({
  useLanguage: vi.fn()
}));

const mockUseParams = vi.mocked(useParams);
const mockAxios = vi.mocked(axios);
const mockUseLanguage = vi.mocked(useLanguage);

const mockTexts = {
  home: {
    topics: {
      loading: "Loading topic..."
    }
  },
  topic: {
    error: {
      title: "Error",
      notFound: "Topic not found",
      backButton: "Back to Home"
    },
    navigation: {
      back: "Back to Home"
    },
    sections: {
      technicalExplanation: "Technical Explanation",
      practicalExample: "Practical Example",
      codeComparison: "Code Comparison",
      similarities: "Similarities",
      differences: "Differences"
    }
  }
};

const mockTopic = {
  id: 1,
  slug: "test-topic",
  frameworks: ["react", "vue", "angular"],
  difficulty_level: "beginner",
  estimated_time: "15 min",
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-02T00:00:00Z",
  translations: {
    es: {
      title: "Test Topic",
      description: "Test description",
      analogy: "Test analogy"
    },
    en: {
      title: "Test Topic EN",
      description: "Test description EN",
      analogy: "Test analogy EN"
    }
  },
  framework_details: {
    react: {
      code_example: "const Component = () => <div>React</div>;",
      translations: {
        es: {
          similarities: "React similarities",
          differences: "React differences"
        }
      }
    },
    vue: {
      code_example: "<template><div>Vue</div></template>",
      translations: {
        es: {
          similarities: "Vue similarities",
          differences: "Vue differences"
        }
      }
    },
    angular: {
      code_example: "@Component({template: '<div>Angular</div>'})",
      translations: {
        es: {
          similarities: "Angular similarities",
          differences: "Angular differences"
        }
      }
    }
  }
};

describe('TopicPage', () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({ slug: 'test-topic' });
    mockUseLanguage.mockReturnValue({
      texts: mockTexts,
      currentLanguage: 'es',
      changeLanguage: vi.fn(),
      availableLanguages: ['es', 'en']
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should show loading state initially', () => {
    mockAxios.get.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(<TopicPage />);
    
    expect(screen.getByText('Loading topic...')).toBeInTheDocument();
    expect(document.querySelector('.animate-spin')).toBeInTheDocument(); // Loading spinner
  });

  it('should render topic successfully', async () => {
    mockAxios.get.mockResolvedValue({
      data: {
        success: true,
        data: mockTopic
      }
    });

    render(<TopicPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Topic')).toBeInTheDocument();
    });

    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('Test analogy')).toBeInTheDocument();
    expect(screen.getByText('beginner')).toBeInTheDocument();
    expect(screen.getByText('15 min')).toBeInTheDocument();
  });

  it('should handle API error', async () => {
    mockAxios.get.mockRejectedValue(new Error('Network error'));

    render(<TopicPage />);

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Back to Home')).toBeInTheDocument();
  });

  it('should handle unsuccessful API response', async () => {
    mockAxios.get.mockResolvedValue({
      data: {
        success: false,
        data: null
      }
    });

    render(<TopicPage />);

    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('should render framework badges', async () => {
    mockAxios.get.mockResolvedValue({
      data: {
        success: true,
        data: mockTopic
      }
    });

    render(<TopicPage />);

    await waitFor(() => {
      expect(screen.getByText('React')).toBeInTheDocument();
    });

    expect(screen.getByText('Vue')).toBeInTheDocument();
    expect(screen.getByText('Angular')).toBeInTheDocument();
  });

  it('should render difficulty level with correct styling', async () => {
    mockAxios.get.mockResolvedValue({
      data: {
        success: true,
        data: mockTopic
      }
    });

    render(<TopicPage />);

    await waitFor(() => {
      const difficultyBadge = screen.getByText('beginner');
      expect(difficultyBadge).toHaveClass('bg-green-100', 'text-green-800');
    });
  });

  it('should render framework comparison section', async () => {
    mockAxios.get.mockResolvedValue({
      data: {
        success: true,
        data: mockTopic
      }
    });

    render(<TopicPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Topic')).toBeInTheDocument();
    });

    expect(screen.getAllByText('Code Comparison')[0]).toBeInTheDocument();

    expect(screen.getByText('React similarities')).toBeInTheDocument();
    expect(screen.getByText('React differences')).toBeInTheDocument();
    expect(screen.getByText('Vue similarities')).toBeInTheDocument();
    expect(screen.getByText('Vue differences')).toBeInTheDocument();
  });

  it('should handle framework selection', async () => {
    mockAxios.get.mockResolvedValue({
      data: {
        success: true,
        data: mockTopic
      }
    });

    render(<TopicPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Topic')).toBeInTheDocument();
    });

    // Wait for framework buttons to be rendered
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'React' })).toBeInTheDocument();
    });

    // Initially shows React code (first framework)
    expect(screen.getByText('const Component = () => <div>React</div>;')).toBeInTheDocument();

    // Click Vue button
    const vueButton = screen.getByRole('button', { name: 'Vue' });
    fireEvent.click(vueButton);

    // Should show Vue code
    await waitFor(() => {
      expect(screen.getByText('<template><div>Vue</div></template>')).toBeInTheDocument();
    });
  });

  it('should handle different language translations', async () => {
    mockUseLanguage.mockReturnValue({
      texts: mockTexts,
      currentLanguage: 'en',
      changeLanguage: vi.fn(),
      availableLanguages: ['es', 'en']
    });

    mockAxios.get.mockResolvedValue({
      data: {
        success: true,
        data: mockTopic
      }
    });

    render(<TopicPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Topic EN')).toBeInTheDocument();
    });

    expect(screen.getByText('Test description EN')).toBeInTheDocument();
    expect(screen.getByText('Test analogy EN')).toBeInTheDocument();
  });

  it('should fallback to Spanish when translation not available', async () => {
    mockUseLanguage.mockReturnValue({
      texts: mockTexts,
      currentLanguage: 'fr', // French not available
      changeLanguage: vi.fn(),
      availableLanguages: ['es', 'en', 'fr']
    });

    mockAxios.get.mockResolvedValue({
      data: {
        success: true,
        data: mockTopic
      }
    });

    render(<TopicPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Topic')).toBeInTheDocument(); // Falls back to Spanish
    });
  });

  it('should render creation and update dates', async () => {
    mockAxios.get.mockResolvedValue({
      data: {
        success: true,
        data: mockTopic
      }
    });

    render(<TopicPage />);

    await waitFor(() => {
      expect(screen.getByText(/Creado el:/)).toBeInTheDocument();
    });

    expect(screen.getByText(/Actualizado el:/)).toBeInTheDocument();
  });

  it('should handle topic without framework details', async () => {
    const topicWithoutFrameworkDetails = {
      ...mockTopic,
      framework_details: {}
    };

    mockAxios.get.mockResolvedValue({
      data: {
        success: true,
        data: topicWithoutFrameworkDetails
      }
    });

    render(<TopicPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Topic')).toBeInTheDocument();
    });

    // Should not render framework comparison sections
    expect(screen.queryByText('Code Comparison')).not.toBeInTheDocument();
  });

  it('should handle missing translations gracefully', async () => {
    const topicWithoutTranslations = {
      ...mockTopic,
      translations: {}
    };

    mockAxios.get.mockResolvedValue({
      data: {
        success: true,
        data: topicWithoutTranslations
      }
    });

    render(<TopicPage />);

    await waitFor(() => {
      expect(screen.getByText('Topic 1')).toBeInTheDocument(); // Fallback to ID
    });

    expect(screen.getByText('No description available')).toBeInTheDocument();
    expect(screen.getByText('No analogy available')).toBeInTheDocument();
  });

  it('should render back navigation link', async () => {
    mockAxios.get.mockResolvedValue({
      data: {
        success: true,
        data: mockTopic
      }
    });

    render(<TopicPage />);

    await waitFor(() => {
      const backLink = screen.getByText('← Back to Home');
      expect(backLink).toBeInTheDocument();
      expect(backLink.closest('a')).toHaveAttribute('href', '/');
    });
  });

  it('should handle intermediate difficulty styling', async () => {
    const intermediateTopic = {
      ...mockTopic,
      difficulty_level: 'intermediate'
    };

    mockAxios.get.mockResolvedValue({
      data: {
        success: true,
        data: intermediateTopic
      }
    });

    render(<TopicPage />);

    await waitFor(() => {
      const difficultyBadge = screen.getByText('intermediate');
      expect(difficultyBadge).toHaveClass('bg-yellow-100', 'text-yellow-800');
    });
  });

  it('should handle advanced difficulty styling', async () => {
    const advancedTopic = {
      ...mockTopic,
      difficulty_level: 'advanced'
    };

    mockAxios.get.mockResolvedValue({
      data: {
        success: true,
        data: advancedTopic
      }
    });

    render(<TopicPage />);

    await waitFor(() => {
      const difficultyBadge = screen.getByText('advanced');
      expect(difficultyBadge).toHaveClass('bg-red-100', 'text-red-800');
    });
  });
});