import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { GET } from '../topics/slug/[slug]/route'
import { sql } from '@vercel/postgres'

// Mock @vercel/postgres
vi.mock('@vercel/postgres', () => ({
  sql: vi.fn()
}))

const mockSql = vi.mocked(sql)

// Mock topic data
const mockTopic = {
  id: 1,
  slug: 'test-topic',
  frameworks: '["react", "vue"]',
  difficulty_level: 'beginner',
  estimated_time: '15 min',
  child_topics: '["useState", "useEffect"]',
  translations: '{"es": {"title": "Topic de Prueba", "description": "Descripción de prueba"}}',
  framework_details: '{"react": {"similarities": "Hooks", "differences": "JSX", "code_example": "const [state, setState] = useState()"}}',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
}

const expectedParsedTopic = {
  ...mockTopic,
  frameworks: ['react', 'vue'],
  child_topics: ['useState', 'useEffect'],
  translations: {
    es: {
      title: 'Topic de Prueba',
      description: 'Descripción de prueba'
    }
  },
  framework_details: {
    react: {
      similarities: 'Hooks',
      differences: 'JSX',
      code_example: 'const [state, setState] = useState()'
    }
  }
}

describe('/api/topics/slug/[slug]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET', () => {
    it('should return topic by slug successfully', async () => {
      mockSql.mockResolvedValue({
        rows: [mockTopic]
      } as { rows: typeof mockTopic[] })

      const response = await GET(
        new NextRequest('http://localhost:3000/api/topics/slug/test-topic'),
        { params: Promise.resolve({ slug: 'test-topic' }) }
      )
      
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(expectedParsedTopic)
      expect(mockSql).toHaveBeenCalledWith(
        [
          '\n      SELECT * FROM topics \n      WHERE slug = ',
          '\n      LIMIT 1\n    '
        ],
        'test-topic'
      )
    })

    it('should return 404 when topic not found', async () => {
      mockSql.mockResolvedValue({
        rows: []
      } as { rows: never[] })

      const response = await GET(
        new NextRequest('http://localhost:3000/api/topics/slug/nonexistent'),
        { params: Promise.resolve({ slug: 'nonexistent' }) }
      )
      
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Topic no encontrado')
    })

    it('should return 400 when slug is empty', async () => {
      const response = await GET(
        new NextRequest('http://localhost:3000/api/topics/slug/'),
        { params: Promise.resolve({ slug: '' }) }
      )
      
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Slug es requerido')
      expect(mockSql).not.toHaveBeenCalled()
    })

    it('should handle database errors', async () => {
      mockSql.mockRejectedValue(new Error('Database connection failed'))

      const response = await GET(
        new NextRequest('http://localhost:3000/api/topics/slug/test-topic'),
        { params: Promise.resolve({ slug: 'test-topic' }) }
      )
      
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Error al obtener el topic por slug')
      expect(data.details).toBe('Database connection failed')
    })

    it('should handle topics with null JSON fields', async () => {
      const topicWithNulls = {
        ...mockTopic,
        frameworks: null,
        child_topics: null,
        translations: null,
        framework_details: null
      }

      mockSql.mockResolvedValue({
        rows: [topicWithNulls]
      } as { rows: Array<typeof topicWithNulls> })

      const response = await GET(
        new NextRequest('http://localhost:3000/api/topics/slug/test-topic'),
        { params: Promise.resolve({ slug: 'test-topic' }) }
      )
      
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(topicWithNulls)
    })

    it('should parse JSON fields correctly when they are already objects', async () => {
      const topicWithObjects = {
        ...mockTopic,
        frameworks: ['react', 'vue'], // Already parsed
        translations: { es: { title: 'Test' } } // Already parsed
      }

      mockSql.mockResolvedValue({
        rows: [topicWithObjects]
      } as { rows: Array<typeof topicWithObjects> })

      const response = await GET(
        new NextRequest('http://localhost:3000/api/topics/slug/test-topic'),
        { params: Promise.resolve({ slug: 'test-topic' }) }
      )
      
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.frameworks).toEqual(['react', 'vue'])
      expect(data.data.translations).toEqual({ es: { title: 'Test' } })
    })

    it('should handle malformed JSON in database fields', async () => {
      const topicWithBadJson = {
        ...mockTopic,
        frameworks: 'invalid json{',
        translations: 'also invalid}'
      }

      mockSql.mockResolvedValue({
        rows: [topicWithBadJson]
      } as { rows: Array<typeof topicWithBadJson> })

      const response = await GET(
        new NextRequest('http://localhost:3000/api/topics/slug/test-topic'),
        { params: Promise.resolve({ slug: 'test-topic' }) }
      )
      
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Error al obtener el topic por slug')
    })
  })
})