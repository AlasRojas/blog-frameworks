
"use client";

import { Carousel } from "flowbite-react";

export function CarouselHome() {
  return (
    <div className="relative h-56 sm:h-64 xl:h-80 2xl:h-96 rounded-lg">
      <Carousel>
      
        <div className="flex h-full items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white text-2xl font-bold relative">
          Slide 1
        </div>
        <div className="flex h-full items-center justify-center bg-gradient-to-r from-green-500 to-blue-500 text-white text-2xl font-bold relative">
          Slide 2
        </div>
        <div className="flex h-full items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl font-bold relative ">
          Slide 3
        </div>
      </Carousel>
    </div>
  );
}
