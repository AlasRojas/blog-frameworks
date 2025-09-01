// Tipos TypeScript para la nueva estructura de API de topics con internacionalización

/**
 * Idiomas soportados por la aplicación
 */
export type SupportedLanguage = 'es' | 'en' | 'fr';

/**
 * Contenido localizado para un topic
 */
export interface LocalizedTopicContent {
  title: string;
  technical_explanation: string;
  example_explanation: string;
  analogy_example?: string;
}

/**
 * Contenido internacionalizado para un topic
 */
export interface InternationalizedContent {
  es: LocalizedTopicContent;
  en: LocalizedTopicContent;
  fr: LocalizedTopicContent;
}

/**
 * Elementos de tabla comparativa entre frameworks
 */
export interface TableElements {
  similitudes: {
    react: string[];
    vue: string[];
    angular: string[];
  };
  diferencias: {
    react: string[];
    vue: string[];
    angular: string[];
  };
}

/**
 * Ejemplos de código para cada framework
 */
export interface CodeExamples {
  react: string;
  vue: string;
  angular: string;
}

/**
 * Lista de frameworks soportados
 */
export type Framework = 'react' | 'vue' | 'angular';

/**
 * Estructura completa de un topic con internacionalización
 */
export interface Topic {
  id: number;
  content: InternationalizedContent;
  image_explanation?: string;
  image_analogy?: string;
  frameworks_list: Framework[];
  table_elements: TableElements;
  code_examples: CodeExamples;
  parent?: string;
  children?: string[];
  created_at: string;
  updated_at?: string;
}

/**
 * Estructura simplificada para listas de topics
 */
export interface TopicSummary {
  id: number;
  title: string; // Título en el idioma actual
  frameworks_list: Framework[];
  created_at: string;
}

/**
 * Parámetros para crear un nuevo topic
 */
export interface CreateTopicRequest {
  content: InternationalizedContent;
  image_explanation?: string;
  image_analogy?: string;
  frameworks_list: Framework[];
  table_elements: TableElements;
  code_examples: CodeExamples;
  parent?: string;
  children?: string[];
}

/**
 * Parámetros para actualizar un topic existente
 */
export interface UpdateTopicRequest extends Partial<CreateTopicRequest> {
  id: number;
}

/**
 * Respuesta de la API para obtener topics
 */
export interface TopicsApiResponse {
  topics: Topic[];
  total: number;
  page?: number;
  limit?: number;
}

/**
 * Respuesta de la API para un topic individual
 */
export interface TopicApiResponse {
  topic: Topic;
}

/**
 * Parámetros de consulta para filtrar topics
 */
export interface TopicsQueryParams {
  framework?: Framework;
  language?: SupportedLanguage;
  page?: number;
  limit?: number;
  search?: string;
}

/**
 * Error de la API
 */
export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

/**
 * Respuesta estándar de la API
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

/**
 * Utilidad para obtener contenido localizado
 */
export type GetLocalizedContent<T extends { content: InternationalizedContent }> = 
  (item: T, language: SupportedLanguage) => LocalizedTopicContent;

/**
 * Función helper para extraer contenido localizado
 */
export const getLocalizedContent: GetLocalizedContent<Topic> = (topic, language) => {
  return topic.content[language];
};

/**
 * Función helper para crear un topic summary localizado
 */
export const createTopicSummary = (topic: Topic, language: SupportedLanguage): TopicSummary => {
  const localizedContent = getLocalizedContent(topic, language);
  return {
    id: topic.id,
    title: localizedContent.title,
    frameworks_list: topic.frameworks_list,
    created_at: topic.created_at
  };
};

/**
 * Validador de idioma soportado
 */
export const isSupportedLanguage = (lang: string): lang is SupportedLanguage => {
  return ['es', 'en', 'fr'].includes(lang);
};

/**
 * Validador de framework soportado
 */
export const isSupportedFramework = (framework: string): framework is Framework => {
  return ['react', 'vue', 'angular'].includes(framework);
};