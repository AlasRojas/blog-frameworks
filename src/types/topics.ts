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