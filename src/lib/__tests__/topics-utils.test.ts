import { describe, it, expect } from 'vitest';
import type { Topic, TopicTranslation, FrameworkDetail } from '@/types/topics';

// Utility functions for topics data transformation
// These functions simulate the logic found in TopicsLinks.tsx and other components

/**
 * Extract current translation from topic based on language preference
 * @param topic - The topic object
 * @param currentLanguage - The preferred language
 * @returns The translation object or empty object
 */
export function getCurrentTranslation(
  topic: Topic, 
  currentLanguage: string
): TopicTranslation | Record<string, never> {
  if (!topic.translations) {
    return {};
  }
  
  // Try current language first
  if (topic.translations[currentLanguage]) {
    return topic.translations[currentLanguage];
  }
  
  // Fallback to Spanish
  if (topic.translations['es']) {
    return topic.translations['es'];
  }
  
  // Fallback to first available language
  const availableLanguages = Object.keys(topic.translations);
  if (availableLanguages.length > 0) {
    return topic.translations[availableLanguages[0]];
  }
  
  return {};
}

/**
 * Get display title for a topic
 * @param topic - The topic object
 * @param currentLanguage - The preferred language
 * @returns The title string
 */
export function getTopicTitle(
  topic: Topic, 
  currentLanguage: string
): string {
  const translation = getCurrentTranslation(topic, currentLanguage);
  return translation?.title || `Topic ${topic.id}`;
}

/**
 * Get display description for a topic
 * @param topic - The topic object
 * @param currentLanguage - The preferred language
 * @returns The description string
 */
export function getTopicDescription(
  topic: Topic, 
  currentLanguage: string
): string {
  const translation = getCurrentTranslation(topic, currentLanguage);
  return translation?.description || 'No description available';
}

/**
 * Get CSS classes for difficulty level badge
 * @param difficultyLevel - The difficulty level
 * @returns CSS classes string
 */
export function getDifficultyClasses(difficultyLevel: string): string {
  switch (difficultyLevel) {
    case 'beginner':
      return 'bg-green-100 text-green-800';
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-800';
    case 'advanced':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Filter topics by framework
 * @param topics - Array of topics
 * @param framework - Framework to filter by
 * @returns Filtered topics array
 */
export function filterTopicsByFramework(
  topics: Topic[], 
  framework: string
): Topic[] {
  return topics.filter(topic => 
    topic.frameworks && topic.frameworks.includes(framework)
  );
}

/**
 * Filter topics by difficulty level
 * @param topics - Array of topics
 * @param difficulty - Difficulty level to filter by
 * @returns Filtered topics array
 */
export function filterTopicsByDifficulty(
  topics: Topic[], 
  difficulty: string
): Topic[] {
  return topics.filter(topic => topic.difficulty_level === difficulty);
}

/**
 * Sort topics by creation date
 * @param topics - Array of topics
 * @param order - Sort order ('asc' or 'desc')
 * @returns Sorted topics array
 */
export function sortTopicsByDate(
  topics: Topic[], 
  order: 'asc' | 'desc' = 'desc'
): Topic[] {
  return [...topics].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
}

/**
 * Validate topic data structure
 * @param topic - Topic object to validate
 * @returns Validation result
 */
export function validateTopicData(topic: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!topic) {
    errors.push('Topic object is required');
    return { isValid: false, errors };
  }
  
  if (!topic.slug || typeof topic.slug !== 'string') {
    errors.push('Slug is required and must be a string');
  }
  
  if (!topic.frameworks || !Array.isArray(topic.frameworks)) {
    errors.push('Frameworks must be an array');
  }
  
  if (!['beginner', 'intermediate', 'advanced'].includes(topic.difficulty_level)) {
    errors.push('Difficulty level must be beginner, intermediate, or advanced');
  }
  
  if (!topic.translations || typeof topic.translations !== 'object') {
    errors.push('Translations object is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Tests
describe('Topics Utils', () => {
  const mockTopic: Topic = {
    id: 1,
    slug: 'test-topic',
    frameworks: ['react', 'vue'],
    difficulty_level: 'intermediate',
    estimated_time: '20 min',
    parent_id: null,
    child_topics: ['subtopic1'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    translations: {
      es: {
        title: 'Tema de Prueba',
        description: 'Descripción en español',
        analogy: 'Analogía en español'
      },
      en: {
        title: 'Test Topic',
        description: 'Description in English',
        analogy: 'Analogy in English'
      }
    },
    framework_details: {
      react: {
        code_example: 'const example = "react";',
        translations: {
          es: {
            similarities: 'Similitudes React',
            differences: 'Diferencias React'
          }
        }
      }
    }
  };

  describe('getCurrentTranslation', () => {
    it('should return translation for current language', () => {
      const result = getCurrentTranslation(mockTopic, 'en');
      expect(result).toEqual(mockTopic.translations.en);
    });

    it('should fallback to Spanish when current language not available', () => {
      const result = getCurrentTranslation(mockTopic, 'fr');
      expect(result).toEqual(mockTopic.translations.es);
    });

    it('should return first available language when Spanish not available', () => {
      const topicWithoutSpanish = {
        ...mockTopic,
        translations: {
          en: mockTopic.translations.en
        }
      };
      const result = getCurrentTranslation(topicWithoutSpanish, 'fr');
      expect(result).toEqual(mockTopic.translations.en);
    });

    it('should return empty object when no translations available', () => {
      const topicWithoutTranslations = {
        ...mockTopic,
        translations: {}
      };
      const result = getCurrentTranslation(topicWithoutTranslations, 'en');
      expect(result).toEqual({});
    });

    it('should handle missing translations property', () => {
      const topicWithoutTranslations = {
        ...mockTopic,
        translations: undefined as any
      };
      const result = getCurrentTranslation(topicWithoutTranslations, 'en');
      expect(result).toEqual({});
    });
  });

  describe('getTopicTitle', () => {
    it('should return title from translation', () => {
      const result = getTopicTitle(mockTopic, 'en');
      expect(result).toBe('Test Topic');
    });

    it('should return fallback title when translation not available', () => {
      const topicWithoutTranslations = {
        ...mockTopic,
        translations: {}
      };
      const result = getTopicTitle(topicWithoutTranslations, 'en');
      expect(result).toBe('Topic 1');
    });
  });

  describe('getTopicDescription', () => {
    it('should return description from translation', () => {
      const result = getTopicDescription(mockTopic, 'en');
      expect(result).toBe('Description in English');
    });

    it('should return fallback description when translation not available', () => {
      const topicWithoutTranslations = {
        ...mockTopic,
        translations: {}
      };
      const result = getTopicDescription(topicWithoutTranslations, 'en');
      expect(result).toBe('No description available');
    });
  });

  describe('getDifficultyClasses', () => {
    it('should return correct classes for beginner', () => {
      const result = getDifficultyClasses('beginner');
      expect(result).toBe('bg-green-100 text-green-800');
    });

    it('should return correct classes for intermediate', () => {
      const result = getDifficultyClasses('intermediate');
      expect(result).toBe('bg-yellow-100 text-yellow-800');
    });

    it('should return correct classes for advanced', () => {
      const result = getDifficultyClasses('advanced');
      expect(result).toBe('bg-red-100 text-red-800');
    });

    it('should return default classes for unknown difficulty', () => {
      const result = getDifficultyClasses('unknown');
      expect(result).toBe('bg-gray-100 text-gray-800');
    });
  });

  describe('filterTopicsByFramework', () => {
    const topics = [
      mockTopic,
      {
        ...mockTopic,
        id: 2,
        frameworks: ['angular']
      }
    ];

    it('should filter topics by framework', () => {
      const result = filterTopicsByFramework(topics, 'react');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it('should return empty array when no topics match framework', () => {
      const result = filterTopicsByFramework(topics, 'svelte');
      expect(result).toHaveLength(0);
    });

    it('should handle topics without frameworks', () => {
      const topicsWithoutFrameworks = [
        {
          ...mockTopic,
          frameworks: undefined as any
        }
      ];
      const result = filterTopicsByFramework(topicsWithoutFrameworks, 'react');
      expect(result).toHaveLength(0);
    });
  });

  describe('filterTopicsByDifficulty', () => {
    const topics = [
      mockTopic,
      {
        ...mockTopic,
        id: 2,
        difficulty_level: 'beginner' as const
      }
    ];

    it('should filter topics by difficulty', () => {
      const result = filterTopicsByDifficulty(topics, 'intermediate');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it('should return empty array when no topics match difficulty', () => {
      const result = filterTopicsByDifficulty(topics, 'advanced');
      expect(result).toHaveLength(0);
    });
  });

  describe('sortTopicsByDate', () => {
    const topics = [
      {
        ...mockTopic,
        id: 1,
        created_at: '2024-01-01T00:00:00Z'
      },
      {
        ...mockTopic,
        id: 2,
        created_at: '2024-01-02T00:00:00Z'
      }
    ];

    it('should sort topics by date descending by default', () => {
      const result = sortTopicsByDate(topics);
      expect(result[0].id).toBe(2);
      expect(result[1].id).toBe(1);
    });

    it('should sort topics by date ascending when specified', () => {
      const result = sortTopicsByDate(topics, 'asc');
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
    });

    it('should not mutate original array', () => {
      const originalOrder = topics.map(t => t.id);
      sortTopicsByDate(topics);
      expect(topics.map(t => t.id)).toEqual(originalOrder);
    });
  });

  describe('validateTopicData', () => {
    it('should validate correct topic data', () => {
      const result = validateTopicData(mockTopic);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return error for null topic', () => {
      const result = validateTopicData(null);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Topic object is required');
    });

    it('should return error for missing slug', () => {
      const invalidTopic = { ...mockTopic, slug: undefined };
      const result = validateTopicData(invalidTopic);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Slug is required and must be a string');
    });

    it('should return error for invalid frameworks', () => {
      const invalidTopic = { ...mockTopic, frameworks: 'not-an-array' };
      const result = validateTopicData(invalidTopic);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Frameworks must be an array');
    });

    it('should return error for invalid difficulty level', () => {
      const invalidTopic = { ...mockTopic, difficulty_level: 'invalid' };
      const result = validateTopicData(invalidTopic);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Difficulty level must be beginner, intermediate, or advanced');
    });

    it('should return error for missing translations', () => {
      const invalidTopic = { ...mockTopic, translations: undefined };
      const result = validateTopicData(invalidTopic);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Translations object is required');
    });

    it('should return multiple errors for multiple issues', () => {
      const invalidTopic = {
        ...mockTopic,
        slug: undefined,
        frameworks: 'invalid',
        difficulty_level: 'invalid'
      };
      const result = validateTopicData(invalidTopic);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(3);
    });
  });
});