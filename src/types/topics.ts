// Tipos para la nueva estructura de topics optimizada

// Interfaz para traducciones básicas de un topic
export interface TopicTranslation {
  title: string;
  description: string;
  analogy: string;
}

// Interfaz para traducciones específicas de framework
export interface FrameworkTranslation {
  similarities: string;
  differences: string;
}

// Interfaz para detalles específicos de cada framework
export interface FrameworkDetail {
  code_example: string;
  translations: {
    [languageCode: string]: FrameworkTranslation;
  };
}

// Interfaz principal para un topic
export interface Topic {
  id: number;
  slug: string;
  frameworks: string[];
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  estimated_time: string;
  parent_id: number | null;
  child_topics: string[];
  created_at: string;
  updated_at: string;
  translations: {
    [languageCode: string]: TopicTranslation;
  };
  framework_details: {
    [framework: string]: FrameworkDetail;
  };
}

// Interfaz para respuesta de API
export interface TopicsResponse {
  success: boolean;
  data: Topic[];
  count: number;
}

// Interfaz para respuesta de API de un solo topic
export interface TopicResponse {
  success: boolean;
  data: Topic;
}

// Tipos para crear/actualizar topics
export interface CreateTopicData {
  slug: string;
  frameworks: string[];
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  estimated_time: string;
  parent_id?: number | null;
  child_topics?: string[];
  translations: {
    [languageCode: string]: TopicTranslation;
  };
  framework_details: {
    [framework: string]: FrameworkDetail;
  };
}

export interface UpdateTopicData extends Partial<CreateTopicData> {
  id: number;
}

// Tipos legacy para compatibilidad temporal
export interface LegacyTopic {
  id: number;
  titulo: string;
  explicacion_tecnica: string;
  explicacion_ejemplo: string;
  librerias: string[];
  table_elements: {
    react?: {
      similitudes: string;
      diferencias: string;
    };
    vue?: {
      similitudes: string;
      diferencias: string;
    };
    angular?: {
      similitudes: string;
      diferencias: string;
    };
  };
  code_exemple: {
    react?: string;
    vue?: string;
    angular?: string;
  };
  created_at: string;
}

// Función helper para convertir de legacy a nueva estructura
export function convertLegacyToNewTopic(legacy: LegacyTopic): Topic {
  return {
    id: legacy.id,
    slug: legacy.titulo.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    frameworks: legacy.librerias,
    difficulty_level: 'intermediate', // valor por defecto
    estimated_time: '20 min', // valor por defecto
    parent_id: null,
    child_topics: [],
    created_at: legacy.created_at,
    updated_at: legacy.created_at,
    translations: {
      es: {
        title: legacy.titulo,
        description: legacy.explicacion_tecnica,
        analogy: legacy.explicacion_ejemplo
      }
    },
    framework_details: {
      ...(legacy.code_exemple.react && {
        react: {
          code_example: legacy.code_exemple.react,
          translations: {
            es: {
              similarities: legacy.table_elements.react?.similitudes || '',
              differences: legacy.table_elements.react?.diferencias || ''
            }
          }
        }
      }),
      ...(legacy.code_exemple.vue && {
        vue: {
          code_example: legacy.code_exemple.vue,
          translations: {
            es: {
              similarities: legacy.table_elements.vue?.similitudes || '',
              differences: legacy.table_elements.vue?.diferencias || ''
            }
          }
        }
      }),
      ...(legacy.code_exemple.angular && {
        angular: {
          code_example: legacy.code_exemple.angular,
          translations: {
            es: {
              similarities: legacy.table_elements.angular?.similitudes || '',
              differences: legacy.table_elements.angular?.diferencias || ''
            }
          }
        }
      })
    }
  };
}