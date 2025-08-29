
"use client";

import { Carousel } from "flowbite-react";

export function CarouselHome() {
  return (
    <div className="relative h-56 sm:h-64 xl:h-80 2xl:h-96 rounded-lg">
      <Carousel
        theme={{
          scrollContainer: {
            base: "overflow-hidden"
          }
        }}
      >
        <div className="flex h-full items-center justify-center bg-gradient-to-r from-red-600 to-red-400 text-white text-2xl font-bold relative">
          <div className="flex flex-col items-center space-y-4">
            <i className="fab fa-angular text-6xl text-white"></i>
            <span>Angular</span>
          </div>
        </div>
        <div className="flex h-full items-center justify-center bg-gradient-to-r from-cyan-400 to-blue-500 text-white text-2xl font-bold relative">
          <div className="flex flex-col items-center space-y-4">
            <i className="fab fa-react text-6xl text-white"></i>
            <span>React</span>
          </div>
        </div>
        <div className="flex h-full items-center justify-center bg-gradient-to-r from-green-400 to-green-600 text-white text-2xl font-bold relative">
          <div className="flex flex-col items-center space-y-4">
            <i className="fab fa-vuejs text-6xl text-white"></i>
            <span>Vue</span>
          </div>
        </div>
      </Carousel>
    </div>
  );
}
