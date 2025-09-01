// Archivo de índice para todos los tipos TypeScript

// Tipos de topics
export type {
  SupportedLanguage,
  LocalizedTopicContent,
  InternationalizedContent,
  TableElements,
  CodeExamples,
  Framework,
  Topic,
  TopicSummary,
  CreateTopicRequest,
  UpdateTopicRequest,
  TopicsApiResponse,
  TopicApiResponse,
  TopicsQueryParams,
  ApiError,
  ApiResponse,
  GetLocalizedContent
} from './topics';

// Funciones helper de topics
export {
  getLocalizedContent,
  createTopicSummary,
  isSupportedLanguage,
  isSupportedFramework
} from './topics';

// Tipos de API
export type {
  ApiConfig,
  ApiRequestOptions,
  TopicsApiService,
  LoadingState,
  TopicsCacheState,
  AppContextType,
  UseTopicsHook,
  UseTopicHook,
  ApiErrorDetails,
  LegacyTopic,
  DataMigrationService,
  CacheConfig,
  ApiMetrics
} from './api';

// Clase de error de API
export { ApiError as ApiErrorClass } from './api';

// Tipos de idiomas
export type {
  LanguageData,
  EnhancedLanguageContextType,
  LanguageConfig,
  LanguageDataProvider,
  LanguageCache,
  UseLanguageHook,
  TranslationKey
} from './language';

// Funciones helper de idiomas
export {
  getNestedValue,
  validateLanguageData,
  defaultLanguageConfig,
  browserLanguageMap,
  detectBrowserLanguage,
  getStoredLanguage,
  storeLanguage,
  clearStoredLanguage
} from './language';

// Tipos combinados para facilitar el uso
export interface AppState {
  language: {
    current: SupportedLanguage;
    data: LanguageData | null;
    loading: boolean;
    error: string | null;
  };
  topics: {
    list: TopicSummary[];
    current: Topic | null;
    loading: boolean;
    error: string | null;
    cache: TopicsCacheState;
  };
}

// Constantes útiles
export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['es', 'en', 'fr'];
export const SUPPORTED_FRAMEWORKS: Framework[] = ['react', 'vue', 'angular'];

// Tipos de utilidad
export type Nullable<T> = T | null;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Tipos para eventos del sistema
export interface LanguageChangeEvent {
  previousLanguage: SupportedLanguage;
  newLanguage: SupportedLanguage;
  timestamp: Date;
}

export interface TopicLoadEvent {
  topicId: number;
  language: SupportedLanguage;
  timestamp: Date;
  loadTime: number;
}

export interface ErrorEvent {
  type: 'language' | 'topic' | 'api';
  message: string;
  details?: any;
  timestamp: Date;
}

// Tipos para configuración global
export interface GlobalConfig {
  api: ApiConfig;
  language: LanguageConfig;
  cache: CacheConfig;
  features: {
    enableAnalytics: boolean;
    enableOfflineMode: boolean;
    enablePreloading: boolean;
  };
}

// Tipos para el contexto global de la aplicación
export interface GlobalContextType {
  config: GlobalConfig;
  state: AppState;
  actions: {
    language: {
      change: (language: SupportedLanguage) => Promise<void>;
      reload: () => Promise<void>;
    };
    topics: {
      load: (framework?: Framework) => Promise<void>;
      loadById: (id: number) => Promise<void>;
      search: (query: string) => Promise<void>;
      clear: () => void;
    };
    cache: {
      clear: () => void;
      preload: () => Promise<void>;
    };
  };
  utils: {
    t: (key: string) => string;
    formatDate: (date: Date) => string;
    formatNumber: (number: number) => string;
  };
}