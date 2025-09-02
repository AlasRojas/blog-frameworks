import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock @vercel/postgres

vi.mock('@vercel/postgres', () => ({
  sql: Object.assign(vi.fn(), {
    query: vi.fn()
  })
}));

import {
  clearDatabase,
  createTopicsTable,
  getAllTopics,
  getTopicById,
  createTopic,
  updateTopic,
  deleteTopic,
  getTopicsByFramework,
  getTopicBySlug,
  getChildTopics,
  getTopicsByDifficulty
} from '../db';
import { sql } from '@vercel/postgres';

// Get references to the mocked functions
const mockSql = sql as vi.MockedFunction<typeof sql> & { query: vi.MockedFunction<(...args: unknown[]) => Promise<unknown>> };
const mockSqlQueryRef = mockSql.query;

// Mock console methods
const consoleSpy = {
  log: vi.spyOn(console, 'log').mockImplementation(() => {}),
  error: vi.spyOn(console, 'error').mockImplementation(() => {})
};

// Sample data for testing
const mockTopic = {
  id: 1,
  slug: 'test-topic',
  frameworks: ['react', 'vue'],
  difficulty_level: 'intermediate',
  estimated_time: '20 min',
  parent_id: null,
  child_topics: ['subtopic1', 'subtopic2'],
  translations: {
    es: {
      title: 'Tema de Prueba',
      description: 'Descripción de prueba',
      analogy: 'Analogía de prueba'
    },
    en: {
      title: 'Test Topic',
      description: 'Test description',
      analogy: 'Test analogy'
    }
  },
  framework_details: {
    react: {
      similarities: 'React similarities',
      differences: 'React differences',
      code_example: 'const example = "react";'
    }
  },
  titulo: 'Tema de Prueba',
  explicacion_tecnica: 'Explicación técnica',
  explicacion_ejemplo: 'Ejemplo práctico',
  image_explicacion: 'image.jpg',
  librerias: ['react', 'vue'],
  table_elements: {},
  code_exemple: {},
  parent: '',
  childs: ['subtopic1', 'subtopic2'],
  created_at: new Date(),
  updated_at: new Date()
};

const mockTopics = [mockTopic, { ...mockTopic, id: 2, slug: 'test-topic-2' }];

describe('Database Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    consoleSpy.log.mockClear();
    consoleSpy.error.mockClear();
  });

  describe('clearDatabase', () => {
    it('should clear database successfully', async () => {
      mockSql.mockResolvedValue({ rows: [] });

      const result = await clearDatabase();

      expect(result).toEqual({ success: true });
      expect(mockSql).toHaveBeenCalled();
      expect(consoleSpy.log).toHaveBeenCalledWith('🗑️ Limpiando base de datos...');
      expect(consoleSpy.log).toHaveBeenCalledWith('✅ Base de datos limpiada exitosamente');
    });

    it('should handle errors when clearing database', async () => {
      const error = new Error('Database error');
      mockSql.mockRejectedValue(error);

      await expect(clearDatabase()).rejects.toThrow('Database error');
      expect(consoleSpy.error).toHaveBeenCalledWith('Error limpiando base de datos:', error);
    });
  });

  describe('createTopicsTable', () => {
    it('should create topics table successfully', async () => {
      mockSql.mockResolvedValue({ rows: [] });

      const result = await createTopicsTable();

      expect(result).toEqual({ success: true });
      expect(mockSql).toHaveBeenCalled();
    });

    it('should handle errors when creating table', async () => {
      const error = new Error('Table creation error');
      mockSql.mockRejectedValue(error);

      await expect(createTopicsTable()).rejects.toThrow('Table creation error');
      expect(consoleSpy.error).toHaveBeenCalledWith('Error creating topics table:', error);
    });
  });

  describe('getAllTopics', () => {
    it('should return all topics successfully', async () => {
      mockSql.mockResolvedValue({ rows: mockTopics });

      const result = await getAllTopics();

      expect(result).toEqual(mockTopics);
      expect(mockSql).toHaveBeenCalled();
    });

    it('should return empty array when no topics exist', async () => {
      mockSql.mockResolvedValue({ rows: [] });

      const result = await getAllTopics();

      expect(result).toEqual([]);
    });

    it('should handle errors when fetching topics', async () => {
      const error = new Error('Fetch error');
      mockSql.mockRejectedValue(error);

      await expect(getAllTopics()).rejects.toThrow('Fetch error');
      expect(consoleSpy.error).toHaveBeenCalledWith('Error fetching topics:', error);
    });
  });

  describe('getTopicById', () => {
    it('should return topic by ID successfully', async () => {
      mockSql.mockResolvedValue({ rows: [mockTopic] });

      const result = await getTopicById(1);

      expect(result).toEqual(mockTopic);
      expect(mockSql).toHaveBeenCalled();
    });

    it('should return null when topic not found', async () => {
      mockSql.mockResolvedValue({ rows: [] });

      const result = await getTopicById(999);

      expect(result).toBeNull();
    });

    it('should handle errors when fetching topic by ID', async () => {
      const error = new Error('Fetch by ID error');
      mockSql.mockRejectedValue(error);

      await expect(getTopicById(1)).rejects.toThrow('Fetch by ID error');
      expect(consoleSpy.error).toHaveBeenCalledWith('Error fetching topic by ID:', error);
    });
  });

  describe('createTopic', () => {
    const newTopicData = {
      slug: 'new-topic',
      frameworks: ['react'],
      difficulty_level: 'beginner',
      estimated_time: '15 min',
      translations: {
        es: {
          title: 'Nuevo Tema',
          description: 'Nueva descripción',
          analogy: 'Nueva analogía'
        }
      }
    };

    it('should create topic successfully', async () => {
      const createdTopic = { ...mockTopic, ...newTopicData };
      mockSql.mockResolvedValue({ rows: [createdTopic] });

      const result = await createTopic(newTopicData);

      expect(result).toEqual(createdTopic);
      expect(mockSql).toHaveBeenCalled();
    });

    it('should create topic with default values', async () => {
      const minimalData = { slug: 'minimal-topic' };
      const createdTopic = { ...mockTopic, ...minimalData };
      mockSql.mockResolvedValue({ rows: [createdTopic] });

      const result = await createTopic(minimalData);

      expect(result).toEqual(createdTopic);
    });

    it('should extract title from translations', async () => {
      const dataWithTranslations = {
        slug: 'translated-topic',
        translations: {
          es: { title: 'Título Español', description: 'Desc', analogy: 'Analogía' },
          en: { title: 'English Title', description: 'Desc', analogy: 'Analogy' }
        }
      };
      const createdTopic = { ...mockTopic, ...dataWithTranslations };
      mockSql.mockResolvedValue({ rows: [createdTopic] });

      const result = await createTopic(dataWithTranslations);

      expect(result).toEqual(createdTopic);
    });

    it('should handle errors when creating topic', async () => {
      const error = new Error('Create error');
      mockSql.mockRejectedValue(error);

      await expect(createTopic(newTopicData)).rejects.toThrow('Create error');
      expect(consoleSpy.error).toHaveBeenCalledWith('Error creating topic:', error);
    });
  });

  describe('updateTopic', () => {
    const updateData = {
      slug: 'updated-topic',
      difficulty_level: 'advanced',
      frameworks: ['angular']
    };

    it('should update topic successfully', async () => {
      const updatedTopic = { ...mockTopic, ...updateData };
      mockSqlQueryRef.mockResolvedValue({ rows: [updatedTopic] });

      const result = await updateTopic(1, updateData);

      expect(result).toEqual(updatedTopic);
      expect(mockSqlQueryRef).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE topics'),
        ['updated-topic', 'advanced', '["angular"]', 1]
      );
    });

    it('should handle JSONB fields correctly', async () => {
      const jsonbData = {
        frameworks: ['react', 'vue'],
        translations: { es: { title: 'Test' } }
      };
      const updatedTopic = { ...mockTopic, ...jsonbData };
      mockSqlQueryRef.mockResolvedValue({ rows: [updatedTopic] });

      const result = await updateTopic(1, jsonbData);

      expect(result).toEqual(updatedTopic);
      expect(mockSqlQueryRef).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE topics'),
        expect.arrayContaining([JSON.stringify(jsonbData.frameworks), JSON.stringify(jsonbData.translations), 1])
      );
    });

    it('should throw error when no fields to update', async () => {
      await expect(updateTopic(1, {})).rejects.toThrow('No fields to update');
    });

    it('should handle errors when updating topic', async () => {
      const error = new Error('Update error');
      mockSqlQueryRef.mockRejectedValue(error);

      await expect(updateTopic(1, updateData)).rejects.toThrow('Update error');
      expect(consoleSpy.error).toHaveBeenCalledWith('Error updating topic:', error);
    });
  });

  describe('deleteTopic', () => {
    it('should delete topic successfully', async () => {
      mockSql.mockResolvedValue({ rows: [mockTopic] });

      const result = await deleteTopic(1);

      expect(result).toEqual(mockTopic);
      expect(mockSql).toHaveBeenCalled();
    });

    it('should return null when topic not found for deletion', async () => {
      mockSql.mockResolvedValue({ rows: [] });

      const result = await deleteTopic(999);

      expect(result).toBeNull();
    });

    it('should handle errors when deleting topic', async () => {
      const error = new Error('Delete error');
      mockSql.mockRejectedValue(error);

      await expect(deleteTopic(1)).rejects.toThrow('Delete error');
      expect(consoleSpy.error).toHaveBeenCalledWith('Error deleting topic:', error);
    });
  });

  describe('getTopicsByFramework', () => {
    it('should return topics by framework successfully', async () => {
      mockSql.mockResolvedValue({ rows: [mockTopic] });

      const result = await getTopicsByFramework('react');

      expect(result).toEqual([mockTopic]);
      expect(mockSql).toHaveBeenCalled();
    });

    it('should handle errors when getting topics by framework', async () => {
      const error = new Error('Framework fetch error');
      mockSql.mockRejectedValue(error);

      await expect(getTopicsByFramework('react')).rejects.toThrow('Framework fetch error');
      expect(consoleSpy.error).toHaveBeenCalledWith('Error getting topics by framework:', error);
    });
  });

  describe('getTopicBySlug', () => {
    it('should return topic by slug successfully', async () => {
      mockSql.mockResolvedValue({ rows: [mockTopic] });

      const result = await getTopicBySlug('test-topic');

      expect(result).toEqual(mockTopic);
      expect(mockSql).toHaveBeenCalled();
    });

    it('should return null when topic not found by slug', async () => {
      mockSql.mockResolvedValue({ rows: [] });

      const result = await getTopicBySlug('non-existent');

      expect(result).toBeNull();
    });

    it('should handle errors when getting topic by slug', async () => {
      const error = new Error('Slug fetch error');
      mockSql.mockRejectedValue(error);

      await expect(getTopicBySlug('test-topic')).rejects.toThrow('Slug fetch error');
      expect(consoleSpy.error).toHaveBeenCalledWith('Error getting topic by slug:', error);
    });
  });

  describe('getChildTopics', () => {
    it('should return child topics successfully', async () => {
      const childTopics = [{ ...mockTopic, parent_id: 1 }];
      mockSql.mockResolvedValue({ rows: childTopics });

      const result = await getChildTopics(1);

      expect(result).toEqual(childTopics);
      expect(mockSql).toHaveBeenCalled();
    });

    it('should handle errors when getting child topics', async () => {
      const error = new Error('Child topics fetch error');
      mockSql.mockRejectedValue(error);

      await expect(getChildTopics(1)).rejects.toThrow('Child topics fetch error');
      expect(consoleSpy.error).toHaveBeenCalledWith('Error getting child topics:', error);
    });
  });

  describe('getTopicsByDifficulty', () => {
    it('should return topics by difficulty successfully', async () => {
      const beginnerTopics = [{ ...mockTopic, difficulty_level: 'beginner' }];
      mockSql.mockResolvedValue({ rows: beginnerTopics });

      const result = await getTopicsByDifficulty('beginner');

      expect(result).toEqual(beginnerTopics);
      expect(mockSql).toHaveBeenCalled();
    });

    it('should handle errors when getting topics by difficulty', async () => {
      const error = new Error('Difficulty fetch error');
      mockSql.mockRejectedValue(error);

      await expect(getTopicsByDifficulty('beginner')).rejects.toThrow('Difficulty fetch error');
      expect(consoleSpy.error).toHaveBeenCalledWith('Error getting topics by difficulty:', error);
    });
  });
});