"use client";

import Link from "next/link";
import { CarouselHome } from "@/app/ui/CarrouselHome";
import { Card } from "flowbite-react";
import { useState } from "react";

export default function Home() {
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
            ¿Sabes usar alguno de estos frameworks de Javascript?
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
              Si tienes claridad en sus conceptos principales, prácticamente puedes usar los 3 frameworks
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-justify leading-relaxed mb-6">
              Al tener una base de Javascript, es más sencillo aprender los conceptos básicos de cada framework.
              Cada framework tiene sus propias sintaxis y estructuras, pero basado en estas similitudes se pueden hacer <i>traducciones</i> entre ellos sin perder su lógica interna.
              Por ejemplo, si tienes una función en React, puedes traducirla a Vue o Angular sin perder su funcionalidad.
              Esto te permite aprovechar las ventajas de cada framework y usar el que mejor se adapte a tu proyecto.
            </p>
          </div>

          {/* Título de ejemplo */}
          <div className="lg:col-span-12">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 text-center">
              Por ejemplo
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center mb-8">
              La estructura básica de un componente simple se ve así en cada uno de los frameworks:
            </p>
          </div>

          {/* Cards de código - 3 columnas en desktop */}
          <div className="lg:col-span-4">
            <Card className="h-full">
              <h4 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-4 text-center">
                React
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
                Vue
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
                Angular
              </h4>
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
                <code className="text-gray-800 dark:text-gray-200">
                  {angularCode}
                </code>
              </pre>
            </Card>
          </div>

          {/* Link de navegación */}
          <div className="lg:col-span-12 text-center mt-8">
            <Link 
              href="/page?id=1"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Explorar comparaciones detalladas
            </Link>
          </div>

          {/* Sección de temas importantes */}
          <div className="lg:col-span-12 mt-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
              Temas Fundamentales
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="h-full hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Manejo de Estados
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Aprende sobre useState y useEffect en React, reactive data en Vue, y servicios en Angular para gestionar el estado de tu aplicación.
                </p>
              </Card>

              <Card className="h-full hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Componentes Reutilizables
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Descubre cómo crear componentes modulares y reutilizables en cada framework, desde props hasta composición avanzada.
                </p>
              </Card>

              <Card className="h-full hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Routing y Navegación
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Explora las soluciones de routing: Next.js App Router, Vue Router, y Angular Router para crear aplicaciones de múltiples páginas.
                </p>
              </Card>

              <Card className="h-full hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Testing y Calidad
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Implementa testing efectivo con Jest, Testing Library, Vitest y Jasmine para asegurar la calidad de tu código.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
