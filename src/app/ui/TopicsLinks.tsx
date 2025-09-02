"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Card } from 'flowbite-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Topic, TopicsResponse } from '../../types/topics';

export function TopicsLinks() {
  const { texts, currentLanguage } = useLanguage();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true);
        const response = await axios.get<TopicsResponse>('/api/topics');
        
        if (response.data.success) {
          setTopics(response.data.data);
        } else {
          setError('Error al cargar los topics');
        }
      } catch (err) {
        console.error('Error fetching topics:', err);
        setError('Error de conexión al cargar los topics');
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">{texts?.home.topics.loading || "Cargando topics..."}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <p className="font-medium">{texts?.home.topics.error || "Error:"}:</p>
        <p>{error}</p>
      </div>
    );
  }

  if (topics.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>{texts?.home.topics.empty || "No hay topics disponibles en este momento."}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Temas Fundamentales
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {topics.map((topic) => {
          const currentTranslation = topic.translations[currentLanguage] || topic.translations['es'] || topic.translations[Object.keys(topic.translations)[0]];
          
          return (
            <Card key={topic.id} className="h-full hover:shadow-lg transition-shadow">
              <div className="flex flex-col h-full">
                <Link 
                  href={`/page/${topic.slug}`}
                  className="block mb-4"
                >
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 hover:text-blue-600 transition-colors">
                    {currentTranslation?.title || `Topic ${topic.id}`}
                  </h3>
                </Link>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                  {currentTranslation?.description || 'No description available'}
                </p>
                
                <div className="mt-auto space-y-3">
                  {/* Difficulty and Time */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      topic.difficulty_level === 'beginner' ? 'bg-green-100 text-green-800' :
                      topic.difficulty_level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {topic.difficulty_level}
                    </span>
                    <span className="text-gray-400">{topic.estimated_time}</span>
                  </div>
                  
                  {/* Frameworks */}
                  {topic.frameworks && topic.frameworks.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Frameworks:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {topic.frameworks.map((framework, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                          >
                            {framework}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Action Button */}
                  <Link 
                    href={`/page/${topic.slug}`}
                    className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-center transition-colors duration-200"
                  >
                    Ver detalles
                  </Link>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}