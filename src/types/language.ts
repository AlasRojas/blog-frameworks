// Tipos TypeScript para el sistema de idiomas mejorado

import { SupportedLanguage } from './topics';

/**
 * Estructura de datos de idioma existente (UI)
 */
export interface LanguageData {
  header: {
    title: string;
    subtitle: string;
    nav: {
      home: string;
      topics: string;
      about: string;
    };
    language: {
      label: string;
      spanish: string;
      english: string;
      french: string;
    };
  };
  home: {
    carousel: {
      title: string;
      subtitle: string;
      description: string;
    };
    explanation: {
      title: string;
      subtitle: string;
      description: string;
    };
    example: {
      title: string;
      subtitle: string;
      description: string;
    };
    topics: {
      title: string;
      subtitle: string;
      description: string;
      button: string;
    };
  };
  topic: {
    navigation: {
      back: string;
      home: string;
    };
    error: {
      title: string;
      description: string;
      button: string;
    };
    sections: {
      technical: string;
      example: string;
      analogy: string;
      comparison: string;
      code: string;
    };
  };
  modal: {
    close: string;
    title: string;
  };
  metadata: {
    title: string;
    description: string;
  };
}

/**
 * Contexto de idioma mejorado que incluye topics
 */
export interface EnhancedLanguageContextType {
  // Estado actual
  currentLanguage: SupportedLanguage;
  languageData: LanguageData | null;
  isLoading: boolean;
  error: string | null;
  
  // Acciones
  changeLanguage: (language: SupportedLanguage) => Promise<void>;
  reloadLanguageData: () => Promise<void>;
  
  // Utilidades
  t: (key: string) => string; // Función de traducción
  formatDate: (date: Date) => string;
  formatNumber: (number: number) => string;
}

/**
 * Configuración del sistema de idiomas
 */
export interface LanguageConfig {
  defaultLanguage: SupportedLanguage;
  fallbackLanguage: SupportedLanguage;
  supportedLanguages: SupportedLanguage[];
  persistLanguage: boolean; // Guardar en localStorage
  autoDetect: boolean; // Detectar idioma del navegador
}

/**
 * Proveedor de datos de idioma
 */
export interface LanguageDataProvider {
  loadLanguageData: (language: SupportedLanguage) => Promise<LanguageData>;
  preloadLanguages: (languages: SupportedLanguage[]) => Promise<void>;
  clearCache: () => void;
}

/**
 * Cache de datos de idioma
 */
export interface LanguageCache {
  data: Record<SupportedLanguage, LanguageData>;
  timestamps: Record<SupportedLanguage, Date>;
  ttl: number; // Time to live en milisegundos
}

/**
 * Hook para usar el sistema de idiomas
 */
export interface UseLanguageHook {
  currentLanguage: SupportedLanguage;
  languageData: LanguageData | null;
  isLoading: boolean;
  error: string | null;
  changeLanguage: (language: SupportedLanguage) => Promise<void>;
  t: (key: string) => string;
}

/**
 * Utilidades para trabajar con rutas de traducción
 */
export type TranslationKey = 
  | `header.${keyof LanguageData['header']}`
  | `header.nav.${keyof LanguageData['header']['nav']}`
  | `header.language.${keyof LanguageData['header']['language']}`
  | `home.${keyof LanguageData['home']}`
  | `home.carousel.${keyof LanguageData['home']['carousel']}`
  | `home.explanation.${keyof LanguageData['home']['explanation']}`
  | `home.example.${keyof LanguageData['home']['example']}`
  | `home.topics.${keyof LanguageData['home']['topics']}`
  | `topic.${keyof LanguageData['topic']}`
  | `topic.navigation.${keyof LanguageData['topic']['navigation']}`
  | `topic.error.${keyof LanguageData['topic']['error']}`
  | `topic.sections.${keyof LanguageData['topic']['sections']}`
  | `modal.${keyof LanguageData['modal']}`
  | `metadata.${keyof LanguageData['metadata']}`;

/**
 * Función helper para obtener valor anidado de un objeto
 */
export const getNestedValue = (obj: any, path: string): string => {
  return path.split('.').reduce((current, key) => current?.[key], obj) || path;
};

/**
 * Función helper para validar estructura de datos de idioma
 */
export const validateLanguageData = (data: any): data is LanguageData => {
  const requiredKeys = ['header', 'home', 'topic', 'modal', 'metadata'];
  return requiredKeys.every(key => key in data);
};

/**
 * Configuración por defecto del sistema de idiomas
 */
export const defaultLanguageConfig: LanguageConfig = {
  defaultLanguage: 'es',
  fallbackLanguage: 'en',
  supportedLanguages: ['es', 'en', 'fr'],
  persistLanguage: true,
  autoDetect: true
};

/**
 * Mapeo de códigos de idioma del navegador a idiomas soportados
 */
export const browserLanguageMap: Record<string, SupportedLanguage> = {
  'es': 'es',
  'es-ES': 'es',
  'es-MX': 'es',
  'es-AR': 'es',
  'en': 'en',
  'en-US': 'en',
  'en-GB': 'en',
  'fr': 'fr',
  'fr-FR': 'fr',
  'fr-CA': 'fr'
};

/**
 * Función para detectar idioma del navegador
 */
export const detectBrowserLanguage = (): SupportedLanguage => {
  if (typeof window === 'undefined') {
    return defaultLanguageConfig.defaultLanguage;
  }
  
  const browserLang = navigator.language || navigator.languages?.[0];
  return browserLanguageMap[browserLang] || defaultLanguageConfig.fallbackLanguage;
};

/**
 * Función para obtener idioma guardado en localStorage
 */
export const getStoredLanguage = (): SupportedLanguage | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  const stored = localStorage.getItem('preferred-language');
  if (stored && defaultLanguageConfig.supportedLanguages.includes(stored as SupportedLanguage)) {
    return stored as SupportedLanguage;
  }
  
  return null;
};

/**
 * Función para guardar idioma en localStorage
 */
export const storeLanguage = (language: SupportedLanguage): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('preferred-language', language);
  }
};

/**
 * Función para limpiar idioma guardado
 */
export const clearStoredLanguage = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('preferred-language');
  }
};