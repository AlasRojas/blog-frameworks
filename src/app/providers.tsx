"use client";

import { useEffect } from 'react';

export function FlowbiteInit({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Importar y inicializar Flowbite dinámicamente en el cliente
    import('flowbite').then((flowbite) => {
      flowbite.initFlowbite();
    }).catch((error) => {
      console.error('Error al inicializar Flowbite:', error);
    });
  }, []);

  return <>{children}</>;
}