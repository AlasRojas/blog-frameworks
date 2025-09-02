import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { GET, POST } from '../topics/route'
import * as db from '@/lib/db'

// Mock the database functions
vi.mock('@/lib/db', () => ({
  getAllTopics: vi.fn(),
  createTopic: vi.fn(),
  createTopicsTable: vi.fn()
}))

const mockDb = vi.mocked(db)

// Mock topics data
const mockTopics = [
  {
    id: 1,
    slug: 'test-topic',
    frameworks: ['react', 'vue'],
    difficulty_level: 'beginner',
    estimated_time: '15 min',
    translations: {
      es: {
        title: 'Topic de Prueba',
        description: 'Descripción de prueba'
      }
    }
  },
  {
    id: 2,
    slug: 'advanced-topic',
    frameworks: ['angular'],
    difficulty_level: 'advanced',
    estimated_time: '45 min',
    translations: {
      es: {
        title: 'Topic Avanzado',
        description: 'Descripción avanzada'
      }
    }
  }
]

describe('/api/topics', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET', () => {
    it('should return all topics successfully', async () => {
      mockDb.createTopicsTable.mockResolvedValue(undefined)
      mockDb.getAllTopics.mockResolvedValue(mockTopics)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockTopics)
      expect(data.count).toBe(2)
      expect(mockDb.createTopicsTable).toHaveBeenCalledOnce()
      expect(mockDb.getAllTopics).toHaveBeenCalledOnce()
    })

    it('should handle database errors', async () => {
      mockDb.createTopicsTable.mockResolvedValue(undefined)
      mockDb.getAllTopics.mockRejectedValue(new Error('Database connection failed'))

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Error al obtener los topics')
      expect(data.details).toBe('Database connection failed')
    })

    it('should return empty array when no topics exist', async () => {
      mockDb.createTopicsTable.mockResolvedValue(undefined)
      mockDb.getAllTopics.mockResolvedValue([])

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual([])
      expect(data.count).toBe(0)
    })
  })

  describe('POST', () => {
    it('should create a new topic successfully', async () => {
      const newTopicData = {
        titulo: 'Nuevo Topic',
        slug: 'nuevo-topic',
        frameworks: ['react'],
        difficulty_level: 'beginner'
      }

      const createdTopic = {
        id: 3,
        ...newTopicData
      }

      mockDb.createTopicsTable.mockResolvedValue(undefined)
      mockDb.createTopic.mockResolvedValue(createdTopic)

      const request = new NextRequest('http://localhost:3000/api/topics', {
        method: 'POST',
        body: JSON.stringify(newTopicData)
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(createdTopic)
      expect(data.message).toBe('Topic creado exitosamente')
      expect(mockDb.createTopic).toHaveBeenCalledWith(newTopicData)
    })

    it('should return error when titulo is missing', async () => {
      const invalidData = {
        slug: 'invalid-topic',
        frameworks: ['vue']
      }

      const request = new NextRequest('http://localhost:3000/api/topics', {
        method: 'POST',
        body: JSON.stringify(invalidData)
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('El campo titulo es requerido')
      expect(mockDb.createTopic).not.toHaveBeenCalled()
    })

    it('should handle database errors during creation', async () => {
      const newTopicData = {
        titulo: 'Topic con Error',
        slug: 'topic-error'
      }

      mockDb.createTopicsTable.mockResolvedValue(undefined)
      mockDb.createTopic.mockRejectedValue(new Error('Database insert failed'))

      const request = new NextRequest('http://localhost:3000/api/topics', {
        method: 'POST',
        body: JSON.stringify(newTopicData)
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Error al crear el topic')
      expect(data.details).toBe('Database insert failed')
    })

    it('should handle invalid JSON in request body', async () => {
      const request = new NextRequest('http://localhost:3000/api/topics', {
        method: 'POST',
        body: 'invalid json'
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Error al crear el topic')
    })
  })
})