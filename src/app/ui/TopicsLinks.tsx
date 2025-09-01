"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Card } from 'flowbite-react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Topic,
  TopicSummary,
  TopicsApiResponse,
  ApiResponse,
  SupportedLanguage,
  Framework,
  getLocalizedContent,
  createTopicSummary
} from '../../types';

// Interfaz legacy para compatibilidad
interface LegacyTopic {
  id: number;
  titulo: string;
  explicacion_tecnica: string;
  explicacion_ejemplo: string;
  librerias: string[];
  created_at: string;
}

interface LegacyTopicsResponse {
  success: boolean;
  data: LegacyTopic[];
  count: number;
}

// Props del componente
interface TopicsLinksProps {
  framework?: Framework;
  limit?: number;
  showFrameworkFilter?: boolean;
}

export function TopicsLinks({ 
  framework, 
  limit = 10, 
  showFrameworkFilter = false 
}: TopicsLinksProps = {}) {
  const { texts, currentLanguage, t, formatDate } = useLanguage();
  const [topics, setTopics] = useState<TopicSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFramework, setSelectedFramework] = useState<Framework | undefined>(framework);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  // Función para obtener topics con manejo de errores mejorado
  const fetchTopics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Construir URL con parámetros
      const params = new URLSearchParams();
      if (selectedFramework) {
        params.append('framework', selectedFramework);
      }
      if (limit) {
        params.append('limit', limit.toString());
      }
      params.append('language', currentLanguage);
      
      const url = `/api/topics${params.toString() ? '?' + params.toString() : ''}`;
      
      // Intentar nueva API primero
      try {
        const response = await axios.get<ApiResponse<TopicsApiResponse>>(url);
        
        if (response.data.success && response.data.data) {
          const topicsData = response.data.data.topics.map(topic => 
            createTopicSummary(topic, currentLanguage)
          );
          setTopics(topicsData);
          setRetryCount(0);
          return;
        }
      } catch (newApiError) {
        console.warn('Nueva API no disponible, intentando API legacy:', newApiError);
      }
      
      // Fallback a API legacy
      const legacyUrl = selectedFramework 
        ? `/api/topics/framework/${selectedFramework}`
        : '/api/topics';
      
      const legacyResponse = await axios.get<LegacyTopicsResponse>(legacyUrl);
      
      if (legacyResponse.data.success) {
        // Convertir datos legacy al nuevo formato
        const legacyTopics: TopicSummary[] = legacyResponse.data.data.map(legacyTopic => ({
          id: legacyTopic.id,
          title: legacyTopic.titulo,
          frameworks_list: legacyTopic.librerias as Framework[],
          created_at: legacyTopic.created_at
        }));
        setTopics(legacyTopics);
        setRetryCount(0);
      } else {
        throw new Error(t('topics.errors.load_failed') || 'Error al cargar los topics');
      }
    } catch (err) {
      console.error('Error fetching topics:', err);
      
      if (retryCount < maxRetries) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => fetchTopics(), 1000 * (retryCount + 1)); // Backoff exponencial
      } else {
        setError(
          axios.isAxiosError(err) 
            ? t('topics.errors.connection') || 'Error de conexión al cargar los topics'
            : err instanceof Error 
              ? err.message 
              : t('topics.errors.unknown') || 'Error desconocido'
        );
      }
    } finally {
      setLoading(false);
    }
  }, [selectedFramework, limit, currentLanguage, t, retryCount, maxRetries]);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  // Función para cambiar framework
  const handleFrameworkChange = useCallback((newFramework: Framework | undefined) => {
    setSelectedFramework(newFramework);
    setRetryCount(0);
  }, []);

  // Función para reintentar carga
  const handleRetry = useCallback(() => {
    setRetryCount(0);
    fetchTopics();
  }, [fetchTopics]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">
          {t('topics.loading') || texts?.home?.topics?.loading || "Cargando topics..."}
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <p className="font-medium">
          {t('topics.error') || texts?.home?.topics?.error || "Error:"}:
        </p>
        <p>{error}</p>
        {retryCount < maxRetries && (
          <button
            onClick={handleRetry}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            {t('topics.retry') || "Reintentar"}
          </button>
        )}
      </div>
    );
  }

  if (topics.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>{t('topics.empty') || texts?.home?.topics?.empty || "No hay topics disponibles en este momento."}</p>
        {showFrameworkFilter && selectedFramework && (
          <button
            onClick={() => handleFrameworkChange(undefined)}
            className="mt-2 text-blue-600 hover:text-blue-800 underline"
          >
            {t('topics.show_all') || "Mostrar todos los topics"}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
          {t('topics.title') || "Temas Fundamentales"}
        </h2>
        
        {showFrameworkFilter && (
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => handleFrameworkChange(undefined)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                !selectedFramework
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {t('topics.all') || "Todos"}
            </button>
            {(['react', 'vue', 'angular'] as Framework[]).map((fw) => (
              <button
                key={fw}
                onClick={() => handleFrameworkChange(fw)}
                className={`px-3 py-1 rounded-full text-sm transition-colors capitalize ${
                  selectedFramework === fw
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {fw}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => (
          <Card key={topic.id} className="h-full hover:shadow-lg transition-shadow">
            <div className="flex flex-col h-full">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {topic.title}
              </h3>
              
              <div className="flex-grow mb-4">
                {topic.frameworks_list && topic.frameworks_list.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {t('topics.frameworks') || "Frameworks:"}:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {topic.frameworks_list.map((framework, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full capitalize"
                        >
                          {framework}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('topics.created')} {formatDate(new Date(topic.created_at))}
                </p>
              </div>
              
              <Link 
                href={`/page/${topic.id}`}
                className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-center transition-colors duration-200 mt-auto"
              >
                {t('topics.view_details') || "Ver detalles"}
              </Link>
            </div>
          </Card>
        ))}
      </div>
      
      {topics.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-500">
          {t('topics.showing')} {topics.length} {t('topics.of_total') || "topics"}
        </div>
      )}
    </div>
  );
}