"use client";

import Link from "next/link";
import { CarouselHome } from "@/app/ui/CarrouselHome";
import { TopicsLinks } from "@/app/ui/TopicsLinks";
import { Card } from "flowbite-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useLanguage } from "./hooks/useLanguage";

// Interfaz para el tipo de datos de los topics
interface Topic {
  id: number;
  titulo: string;
  explicacion_tecnica: string;
  explicacion_ejemplo: string;
  librerias: string[];
  created_at: string;
}

interface TopicsResponse {
  success: boolean;
  data: Topic[];
  count: number;
}

export default function Home() {
  const { texts, loading: langLoading, error: langError } = useLanguage();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true);
        const response = await axios.get<TopicsResponse>('/api/topics');
        
        if (response.data.success) {
          // Limitamos a 4 topics para mantener el diseño 2x2
          setTopics(response.data.data.slice(0, 4));
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
  const [reactCode] = useState(`import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}`);

  const [vueCode] = useState(`<template>
  <div>
    <p>You clicked {{ count }} times</p>
    <button @click="count++">
      Click me
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0
    }
  }
}
</script>`);

  const [angularCode] = useState(`import { Component } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: \`
    <div>
      <p>You clicked {{ count }} times</p>
      <button (click)="count++">
        Click me
      </button>
    </div>
  \`,
})
export class CounterComponent {
  count = 0;
}`);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Carousel section - fuera del grid */}
      <div className="w-full">
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            {texts?.home.carousel.title || "Cargando..."}
          </h1>
        </div>
        <CarouselHome />
      </div>

      {/* Grid container para el resto del contenido */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sección de texto explicativo */}
          <div className="lg:col-span-12">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
              {texts?.home.explanation.subtitle || "Cargando..."}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-justify leading-relaxed mb-6">
              {texts?.home.explanation.description || "Cargando..."}
            </p>
          </div>

          {/* Título de ejemplo */}
          <div className="lg:col-span-12">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 text-center">
              {texts?.home.example.title || "Cargando..."}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center mb-8">
              {texts?.home.example.description || "Cargando..."}
            </p>
          </div>

          {/* Cards de código - 3 columnas en desktop */}
          <div className="lg:col-span-4">
            <Card className="h-full">
              <h4 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-4 text-center">
                {texts?.home.carousel.frameworks.react || "React"}
              </h4>
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
                <code className="text-gray-800 dark:text-gray-200">
                  {reactCode}
                </code>
              </pre>
            </Card>
          </div>

          <div className="lg:col-span-4">
            <Card className="h-full">
              <h4 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-4 text-center">
                {texts?.home.carousel.frameworks.vue || "Vue"}
              </h4>
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
                <code className="text-gray-800 dark:text-gray-200">
                  {vueCode}
                </code>
              </pre>
            </Card>
          </div>

          <div className="lg:col-span-4">
            <Card className="h-full">
              <h4 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4 text-center">
                {texts?.home.carousel.frameworks.angular || "Angular"}
              </h4>
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
                <code className="text-gray-800 dark:text-gray-200">
                  {angularCode}
                </code>
              </pre>
            </Card>
          </div>

          {/* Sección de temas importantes */}
          <div className="lg:col-span-12 mt-16">
            <TopicsLinks />
          </div>
        </div>
      </div>
    </div>
  );
}