// Tipos TypeScript para la API y servicios

import { SupportedLanguage, Framework, Topic, TopicSummary } from './topics';

/**
 * Configuración del cliente API
 */
export interface ApiConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
}

/**
 * Opciones para las peticiones de la API
 */
export interface ApiRequestOptions {
  language?: SupportedLanguage;
  framework?: Framework;
  cache?: boolean;
  timeout?: number;
}

/**
 * Servicio de topics con soporte para internacionalización
 */
export interface TopicsApiService {
  /**
   * Obtener todos los topics
   */
  getAllTopics(options?: ApiRequestOptions): Promise<TopicSummary[]>;
  
  /**
   * Obtener topic por ID
   */
  getTopicById(id: number, options?: ApiRequestOptions): Promise<Topic>;
  
  /**
   * Obtener topics por framework
   */
  getTopicsByFramework(framework: Framework, options?: ApiRequestOptions): Promise<TopicSummary[]>;
  
  /**
   * Buscar topics
   */
  searchTopics(query: string, options?: ApiRequestOptions): Promise<TopicSummary[]>;
  
  /**
   * Crear nuevo topic
   */
  createTopic(topic: Omit<Topic, 'id' | 'created_at' | 'updated_at'>): Promise<Topic>;
  
  /**
   * Actualizar topic existente
   */
  updateTopic(id: number, updates: Partial<Topic>): Promise<Topic>;
  
  /**
   * Eliminar topic
   */
  deleteTopic(id: number): Promise<void>;
}

/**
 * Estados de carga para la UI
 */
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  lastUpdated?: Date;
}

/**
 * Estado del cache de topics
 */
export interface TopicsCacheState {
  topics: Record<string, TopicSummary[]>; // key: framework o 'all'
  topicDetails: Record<number, Topic>;
  loadingStates: Record<string, LoadingState>;
  lastFetch: Record<string, Date>;
}

/**
 * Contexto de la aplicación que incluye idioma y topics
 */
export interface AppContextType {
  // Idioma
  currentLanguage: SupportedLanguage;
  changeLanguage: (language: SupportedLanguage) => void;
  
  // Topics
  topics: TopicSummary[];
  currentTopic: Topic | null;
  loadingState: LoadingState;
  
  // Acciones
  loadTopics: (framework?: Framework) => Promise<void>;
  loadTopicById: (id: number) => Promise<void>;
  searchTopics: (query: string) => Promise<void>;
  clearCurrentTopic: () => void;
}

/**
 * Hooks personalizados
 */
export interface UseTopicsHook {
  topics: TopicSummary[];
  loading: boolean;
  error: string | null;
  loadTopics: (framework?: Framework) => Promise<void>;
  searchTopics: (query: string) => Promise<void>;
}

export interface UseTopicHook {
  topic: Topic | null;
  loading: boolean;
  error: string | null;
  loadTopic: (id: number) => Promise<void>;
  clearTopic: () => void;
}

/**
 * Tipos para el manejo de errores
 */
export interface ApiErrorDetails {
  status: number;
  statusText: string;
  url: string;
  timestamp: Date;
}

export class ApiError extends Error {
  public details: ApiErrorDetails;
  
  constructor(message: string, details: ApiErrorDetails) {
    super(message);
    this.name = 'ApiError';
    this.details = details;
  }
}

/**
 * Tipos para la migración de datos
 */
export interface LegacyTopic {
  id: number;
  titulo: string;
  explicacion_tecnica: string;
  explicacion_ejemplo: string;
  image_explicacion?: string;
  librerias: string[];
  table_elements: any;
  code_exemple: any; // Typo en el nombre original
  parent?: string;
  childs?: string[]; // Typo en el nombre original
  created_at: string;
}

/**
 * Función para migrar datos legacy a la nueva estructura
 */
export interface DataMigrationService {
  migrateLegacyTopic: (legacyTopic: LegacyTopic) => Topic;
  migrateLegacyTopics: (legacyTopics: LegacyTopic[]) => Topic[];
  validateMigratedTopic: (topic: Topic) => boolean;
}

/**
 * Configuración para el sistema de cache
 */
export interface CacheConfig {
  ttl: number; // Time to live en milisegundos
  maxSize: number; // Máximo número de elementos en cache
  enablePersistence: boolean; // Guardar en localStorage
}

/**
 * Métricas de rendimiento de la API
 */
export interface ApiMetrics {
  requestCount: number;
  averageResponseTime: number;
  errorRate: number;
  cacheHitRate: number;
  lastReset: Date;
}