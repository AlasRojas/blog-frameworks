"use client";

import { Carousel } from "flowbite-react";

export default function DebugCarousel() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Carousel</h1>
      
      {/* Carousel básico sin estilos adicionales */}
      <div className="mb-8">
        <h2 className="text-xl mb-2">Carousel Básico:</h2>
        <div className="h-64 bg-gray-100">
          <Carousel>
            <div className="flex h-full items-center justify-center bg-red-400 text-white text-2xl">
              Slide 1 - Rojo
            </div>
            <div className="flex h-full items-center justify-center bg-green-400 text-white text-2xl">
              Slide 2 - Verde
            </div>
            <div className="flex h-full items-center justify-center bg-blue-400 text-white text-2xl">
              Slide 3 - Azul
            </div>
          </Carousel>
        </div>
      </div>

      {/* Carousel con configuración completa */}
      <div className="mb-8">
        <h2 className="text-xl mb-2">Carousel Configurado:</h2>
        <div className="h-64 bg-gray-100">
          <Carousel 
            slideInterval={5000}
            slide={true}
            indicators={true}
            leftControl="<"
            rightControl=">"
          >
            <div className="flex h-full items-center justify-center bg-purple-400 text-white text-2xl">
              Slide A - Púrpura
            </div>
            <div className="flex h-full items-center justify-center bg-yellow-400 text-black text-2xl">
              Slide B - Amarillo
            </div>
            <div className="flex h-full items-center justify-center bg-pink-400 text-white text-2xl">
              Slide C - Rosa
            </div>
          </Carousel>
        </div>
      </div>

      {/* Información de debug */}
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="text-lg font-semibold mb-2">Debug Info:</h3>
        <p>Si solo ves el último slide en cada carousel, el problema está en los estilos CSS.</p>
        <p>Si los carousels funcionan correctamente aquí, el problema está en el componente CarouselHome.</p>
      </div>
    </div>
  );
}