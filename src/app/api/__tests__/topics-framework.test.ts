import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { GET } from '../topics/framework/[framework]/route'
import * as db from '@/lib/db'

// Mock the database functions
vi.mock('@/lib/db', () => ({
  getTopicsByFramework: vi.fn()
}))

const mockDb = vi.mocked(db)

// Mock topics data
const mockReactTopics = [
  {
    id: 1,
    slug: 'react-hooks',
    frameworks: ['react'],
    difficulty_level: 'intermediate',
    estimated_time: '30 min',
    translations: {
      es: {
        title: 'React Hooks',
        description: 'Aprende sobre hooks en React'
      }
    }
  },
  {
    id: 2,
    slug: 'react-state',
    frameworks: ['react', 'vue'],
    difficulty_level: 'beginner',
    estimated_time: '20 min',
    translations: {
      es: {
        title: 'Estado en React',
        description: 'Manejo de estado en React'
      }
    }
  }
]

describe('/api/topics/framework/[framework]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET', () => {
    it('should return topics for valid framework (react)', async () => {
      mockDb.getTopicsByFramework.mockResolvedValue(mockReactTopics)

      const response = await GET(
        new NextRequest('http://localhost:3000/api/topics/framework/react'),
        { params: Promise.resolve({ framework: 'react' }) }
      )
      
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockReactTopics)
      expect(data.framework).toBe('react')
      expect(data.count).toBe(2)
      expect(mockDb.getTopicsByFramework).toHaveBeenCalledWith('react')
    })

    it('should return topics for valid framework (vue)', async () => {
      const mockVueTopics = [
        {
          id: 3,
          slug: 'vue-composition',
          frameworks: ['vue'],
          difficulty_level: 'advanced',
          estimated_time: '45 min'
        }
      ]

      mockDb.getTopicsByFramework.mockResolvedValue(mockVueTopics)

      const response = await GET(
        new NextRequest('http://localhost:3000/api/topics/framework/vue'),
        { params: Promise.resolve({ framework: 'vue' }) }
      )
      
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockVueTopics)
      expect(data.framework).toBe('vue')
      expect(data.count).toBe(1)
      expect(mockDb.getTopicsByFramework).toHaveBeenCalledWith('vue')
    })

    it('should return topics for valid framework (angular)', async () => {
      mockDb.getTopicsByFramework.mockResolvedValue([])

      const response = await GET(
        new NextRequest('http://localhost:3000/api/topics/framework/angular'),
        { params: Promise.resolve({ framework: 'angular' }) }
      )
      
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual([])
      expect(data.framework).toBe('angular')
      expect(data.count).toBe(0)
      expect(mockDb.getTopicsByFramework).toHaveBeenCalledWith('angular')
    })

    it('should return topics for valid framework (svelte)', async () => {
      mockDb.getTopicsByFramework.mockResolvedValue([])

      const response = await GET(
        new NextRequest('http://localhost:3000/api/topics/framework/svelte'),
        { params: Promise.resolve({ framework: 'svelte' }) }
      )
      
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.framework).toBe('svelte')
      expect(mockDb.getTopicsByFramework).toHaveBeenCalledWith('svelte')
    })

    it('should handle case insensitive framework names', async () => {
      mockDb.getTopicsByFramework.mockResolvedValue(mockReactTopics)

      const response = await GET(
        new NextRequest('http://localhost:3000/api/topics/framework/REACT'),
        { params: Promise.resolve({ framework: 'REACT' }) }
      )
      
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.framework).toBe('react')
      expect(mockDb.getTopicsByFramework).toHaveBeenCalledWith('react')
    })

    it('should return 400 for invalid framework', async () => {
      const response = await GET(
        new NextRequest('http://localhost:3000/api/topics/framework/invalid'),
        { params: Promise.resolve({ framework: 'invalid' }) }
      )
      
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Framework inválido. Debe ser uno de: react, vue, angular, svelte')
      expect(mockDb.getTopicsByFramework).not.toHaveBeenCalled()
    })

    it('should return 400 for empty framework', async () => {
      const response = await GET(
        new NextRequest('http://localhost:3000/api/topics/framework/'),
        { params: Promise.resolve({ framework: '' }) }
      )
      
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Framework inválido. Debe ser uno de: react, vue, angular, svelte')
      expect(mockDb.getTopicsByFramework).not.toHaveBeenCalled()
    })

    it('should handle database errors', async () => {
      mockDb.getTopicsByFramework.mockRejectedValue(new Error('Database connection failed'))

      const response = await GET(
        new NextRequest('http://localhost:3000/api/topics/framework/react'),
        { params: Promise.resolve({ framework: 'react' }) }
      )
      
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Error al obtener topics por framework')
      expect(data.details).toBe('Database connection failed')
    })

    it('should handle special characters in framework parameter', async () => {
      const response = await GET(
        new NextRequest('http://localhost:3000/api/topics/framework/react%20js'),
        { params: Promise.resolve({ framework: 'react js' }) }
      )
      
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Framework inválido. Debe ser uno de: react, vue, angular, svelte')
    })

    it('should handle numeric framework parameter', async () => {
      const response = await GET(
        new NextRequest('http://localhost:3000/api/topics/framework/123'),
        { params: Promise.resolve({ framework: '123' }) }
      )
      
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Framework inválido. Debe ser uno de: react, vue, angular, svelte')
    })
  })
})