"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { Card } from 'flowbite-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Topic, TopicResponse } from '../../../types/topics';

export default function TopicPage() {
  const { texts, currentLanguage } = useLanguage();
  const params = useParams();
  const topicSlug = params.slug as string;
  
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFramework, setSelectedFramework] = useState<string>('react');

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        setLoading(true);
        const response = await axios.get<TopicResponse>(`/api/topics/slug/${topicSlug}`);
        
        if (response.data.success) {
          setTopic(response.data.data);
          // Set the first available framework as default
          if (response.data.data.frameworks && response.data.data.frameworks.length > 0) {
            setSelectedFramework(response.data.data.frameworks[0]);
          }
        } else {
          setError(texts?.topic.error.title || 'Error al cargar el topic');
        }
      } catch {
        setError(texts?.topic.error.title || 'Error de conexión al cargar el topic');
      } finally {
        setLoading(false);
      }
    };

    if (topicSlug) {
      fetchTopic();
    }
  }, [topicSlug, texts?.topic.error.notFound, texts?.topic.error.title]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600 text-lg">{texts?.home.topics.loading || "Cargando topic..."}</span>
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700 max-w-md">
            <p className="font-medium text-lg mb-2">{texts?.topic.error.title || "Error:"}:</p>
            <p>{error || texts?.topic.error.notFound || 'Topic no encontrado'}</p>
          </div>
          <Link 
            href="/"
            className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            {texts?.topic.error.backButton || "Volver al Inicio"}
          </Link>
        </div>
      </div>
    );
  }

  const currentTranslation = topic.translations?.[currentLanguage] || topic.translations?.['es'] || (topic.translations && topic.translations[Object.keys(topic.translations)[0]]) || {};

  console.log("currentTranslation", currentTranslation, currentTranslation?.title)

  return (
    <div className="container mx-auto px-4 py-8 max-w-screen-xl">
      {/* Header */}
      <div className="shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link 
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-4"
          >
            ← {texts?.topic.navigation.back || "Volver al Inicio"}
          </Link>
          <h1 className="text-4xl font-bold mb-6 text-center text-gray-900 dark:text-white">
            {currentTranslation?.title || `Topic ${topic.id}`}
          </h1>
          
          {/* Topic metadata */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              topic.difficulty_level === 'beginner' ? 'bg-green-100 text-green-800' :
              topic.difficulty_level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {topic.difficulty_level}
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {topic.estimated_time}
            </span>
            {topic.frameworks.map((framework, index) => (
              <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                {framework}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* Explicación Técnica */}
          <Card className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="p-6">
              <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white border-l-4 border-blue-500 pl-3">{texts?.topic.sections.technicalExplanation || "Explicación Técnica"}</h2>
              <p className="text-justify text-gray-700 dark:text-gray-300 leading-relaxed">{currentTranslation?.description || 'No description available'}</p>
            </div>
          </Card>

          {/* Explicación con Ejemplo */}
          <Card className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="p-6">
              <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white border-l-4 border-blue-500 pl-3">{texts?.topic.sections.practicalExample || "Ejemplo Práctico"}</h2>
              <p className="text-justify text-gray-700 dark:text-gray-300 leading-relaxed">{currentTranslation?.analogy || 'No analogy available'}</p>
            </div>
          </Card>
        </div>

        {/* Tabla Comparativa */}
        {topic.framework_details && Object.keys(topic.framework_details).length > 0 && (
          <Card className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="p-6">
              <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white border-l-4 border-blue-500 pl-3">{texts?.topic.sections.codeComparison || "Comparación entre Frameworks"}</h2>
              <div className="overflow-x-auto">
                <div className="min-w-full bg-white dark:bg-gray-800 rounded-lg">
                  <div className="grid grid-cols-1 gap-4">
                    {Object.entries(topic.framework_details).map(([framework, details]) => {
                      const frameworkTranslation = details.translations?.[currentLanguage] || details.translations?.['es'] || (details.translations && details.translations[Object.keys(details.translations)[0]]) || {};
                      return (
                        <div key={framework} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="mb-3">
                            <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-semibold rounded-full capitalize">
                              {framework}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">✓ {texts?.topic.sections.similarities || "Similitudes"}</h4>
                              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                                {frameworkTranslation?.similarities || 'No similarities available'}
                              </p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-orange-700 dark:text-orange-400 mb-2">⚡ {texts?.topic.sections.differences || "Diferencias"}</h4>
                              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                                {frameworkTranslation?.differences || 'No differences available'}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Ejemplos de Código */}
        {topic.framework_details && Object.keys(topic.framework_details).length > 0 && (
          <Card>
            <div className="p-6">
              <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white border-l-4 border-blue-500 pl-3">{texts?.topic.sections.codeComparison || "Ejemplos de Código por Framework"}</h2>
              
              {/* Framework Selector */}
              <div className="flex space-x-2 mb-4">
                {Object.keys(topic.framework_details).map((framework) => {
                  const getFrameworkClasses = (fw: string, isSelected: boolean) => {
                    const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-all duration-200';
                    
                    if (isSelected) {
                      switch (fw) {
                        case 'angular':
                          return `${baseClasses} bg-gradient-to-r from-red-600 to-red-400 text-white shadow-lg`;
                        case 'react':
                          return `${baseClasses} bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg`;
                        case 'vue':
                          return `${baseClasses} bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg`;
                        case 'svelte':
                          return `${baseClasses} bg-gradient-to-r from-orange-400 to-orange-600 text-white shadow-lg`;
                        default:
                          return `${baseClasses} bg-blue-600 text-white shadow-lg`;
                      }
                    }
                    
                    return `${baseClasses} bg-gray-200 text-gray-700 hover:bg-gray-300`;
                  };
                  
                  return (
                    <button
                      key={framework}
                      onClick={() => setSelectedFramework(framework)}
                      className={getFrameworkClasses(framework, selectedFramework === framework)}
                    >
                      {framework.charAt(0).toUpperCase() + framework.slice(1)}
                    </button>
                  );
                })}
              </div>

              {/* Code Display */}
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-green-400 text-sm">
                  <code>{topic.framework_details[selectedFramework]?.code_example || 'Código no disponible para este framework'}</code>
                </pre>
              </div>
            </div>
          </Card>
        )}

        {/* Información adicional */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Creado el: {new Date(topic.created_at).toLocaleDateString('es-ES')}</p>
          {topic.updated_at && topic.updated_at !== topic.created_at && (
            <p>Actualizado el: {new Date(topic.updated_at).toLocaleDateString('es-ES')}</p>
          )}
        </div>
      </div>
    </div>
  );
}