"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  SupportedLanguage,
  LanguageData,
  EnhancedLanguageContextType,
  getNestedValue,
  validateLanguageData,
  detectBrowserLanguage,
  getStoredLanguage,
  storeLanguage,
  defaultLanguageConfig
} from '../../types';

// Mantener compatibilidad con la interfaz existente
interface LegacyLanguageContextType {
  currentLanguage: SupportedLanguage;
  texts: LanguageData | null;
  loading: boolean;
  error: string | null;
  changeLanguage: (language: SupportedLanguage) => void;
}

// Contexto mejorado que extiende la funcionalidad
interface ExtendedLanguageContextType extends LegacyLanguageContextType {
  // Nuevas funcionalidades
  t: (key: string) => string;
  formatDate: (date: Date) => string;
  formatNumber: (number: number) => string;
  reloadLanguageData: () => Promise<void>;
  preloadLanguages: (languages: SupportedLanguage[]) => Promise<void>;
  clearCache: () => void;
  
  // Información adicional
  supportedLanguages: SupportedLanguage[];
  isLanguageSupported: (lang: string) => boolean;
  lastUpdated: Date | null;
}

const LanguageContext = createContext<ExtendedLanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

// Cache para almacenar datos de idiomas
const languageCache = new Map<SupportedLanguage, LanguageData>();
const cacheTimestamps = new Map<SupportedLanguage, Date>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Inicializar idioma desde localStorage o detectar automáticamente
  const getInitialLanguage = (): SupportedLanguage => {
    const stored = getStoredLanguage();
    if (stored) return stored;
    
    const detected = detectBrowserLanguage();
    return detected;
  };

  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(getInitialLanguage);
  const [texts, setTexts] = useState<LanguageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Función para verificar si el cache es válido
  const isCacheValid = (language: SupportedLanguage): boolean => {
    const timestamp = cacheTimestamps.get(language);
    if (!timestamp) return false;
    return Date.now() - timestamp.getTime() < CACHE_TTL;
  };

  // Función mejorada para cargar idiomas con cache
  const loadLanguage = useCallback(async (language: SupportedLanguage) => {
    try {
      setLoading(true);
      setError(null);

      // Verificar cache primero
      if (isCacheValid(language) && languageCache.has(language)) {
        const cachedData = languageCache.get(language)!;
        setTexts(cachedData);
        setLastUpdated(cacheTimestamps.get(language)!);
        setLoading(false);
        return;
      }

      const response = await fetch(`/json/language/${language}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load ${language} language file`);
      }
      
      const data = await response.json();
      
      // Validar estructura de datos
      if (!validateLanguageData(data)) {
        throw new Error(`Invalid language data structure for ${language}`);
      }
      
      // Actualizar cache
      const now = new Date();
      languageCache.set(language, data);
      cacheTimestamps.set(language, now);
      
      setTexts(data);
      setLastUpdated(now);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      
      // Fallback al idioma por defecto si falla
      if (language !== defaultLanguageConfig.fallbackLanguage) {
        try {
          const fallbackResponse = await fetch(`/json/language/${defaultLanguageConfig.fallbackLanguage}.json`);
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            if (validateLanguageData(fallbackData)) {
              const now = new Date();
              languageCache.set(defaultLanguageConfig.fallbackLanguage, fallbackData);
              cacheTimestamps.set(defaultLanguageConfig.fallbackLanguage, now);
              setTexts(fallbackData);
              setCurrentLanguage(defaultLanguageConfig.fallbackLanguage);
              setLastUpdated(now);
            }
          }
        } catch {
          setTexts(null);
        }
      } else {
        setTexts(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para cambiar idioma con persistencia
  const changeLanguage = useCallback(async (language: SupportedLanguage) => {
    if (language === currentLanguage) return;
    
    setCurrentLanguage(language);
    storeLanguage(language); // Guardar en localStorage
    await loadLanguage(language);
  }, [currentLanguage, loadLanguage]);

  // Función para recargar datos de idioma
  const reloadLanguageData = useCallback(async () => {
    // Limpiar cache para el idioma actual
    languageCache.delete(currentLanguage);
    cacheTimestamps.delete(currentLanguage);
    await loadLanguage(currentLanguage);
  }, [currentLanguage, loadLanguage]);

  // Función para precargar idiomas
  const preloadLanguages = useCallback(async (languages: SupportedLanguage[]) => {
    const promises = languages
      .filter(lang => !isCacheValid(lang))
      .map(async (lang) => {
        try {
          const response = await fetch(`/json/language/${lang}.json`);
          if (response.ok) {
            const data = await response.json();
            if (validateLanguageData(data)) {
              languageCache.set(lang, data);
              cacheTimestamps.set(lang, new Date());
            }
          }
        } catch {
          // Ignorar errores en precarga
        }
      });
    
    await Promise.allSettled(promises);
  }, []);

  // Función para limpiar cache
  const clearCache = useCallback(() => {
    languageCache.clear();
    cacheTimestamps.clear();
  }, []);

  // Función de traducción
  const t = useCallback((key: string): string => {
    if (!texts) return key;
    return getNestedValue(texts, key);
  }, [texts]);

  // Función para formatear fechas según el idioma
  const formatDate = useCallback((date: Date): string => {
    const locale = currentLanguage === 'es' ? 'es-ES' : 
                   currentLanguage === 'en' ? 'en-US' : 'fr-FR';
    return date.toLocaleDateString(locale);
  }, [currentLanguage]);

  // Función para formatear números según el idioma
  const formatNumber = useCallback((number: number): string => {
    const locale = currentLanguage === 'es' ? 'es-ES' : 
                   currentLanguage === 'en' ? 'en-US' : 'fr-FR';
    return number.toLocaleString(locale);
  }, [currentLanguage]);

  // Función para verificar si un idioma es soportado
  const isLanguageSupported = useCallback((lang: string): boolean => {
    return defaultLanguageConfig.supportedLanguages.includes(lang as SupportedLanguage);
  }, []);

  useEffect(() => {
    loadLanguage(currentLanguage);
  }, [currentLanguage, loadLanguage]);

  // Precargar otros idiomas después de cargar el actual
  useEffect(() => {
    if (!loading && !error && texts) {
      const otherLanguages = defaultLanguageConfig.supportedLanguages
        .filter(lang => lang !== currentLanguage);
      preloadLanguages(otherLanguages);
    }
  }, [loading, error, texts, currentLanguage, preloadLanguages]);

  const value: ExtendedLanguageContextType = {
    // Propiedades existentes (compatibilidad)
    currentLanguage,
    texts,
    loading,
    error,
    changeLanguage,
    
    // Nuevas funcionalidades
    t,
    formatDate,
    formatNumber,
    reloadLanguageData,
    preloadLanguages,
    clearCache,
    
    // Información adicional
    supportedLanguages: defaultLanguageConfig.supportedLanguages,
    isLanguageSupported,
    lastUpdated,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook para usar el contexto de idioma
export const useLanguage = (): ExtendedLanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Hook legacy para compatibilidad hacia atrás
export const useLegacyLanguage = (): LegacyLanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLegacyLanguage must be used within a LanguageProvider');
  }
  
  return {
    currentLanguage: context.currentLanguage,
    texts: context.texts,
    loading: context.loading,
    error: context.error,
    changeLanguage: context.changeLanguage,
  };
};

// Exportar tipos para uso externo
export type { ExtendedLanguageContextType, LegacyLanguageContextType };