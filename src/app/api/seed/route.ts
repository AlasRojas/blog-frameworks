import { NextResponse } from 'next/server';
import { createTopicsTable, createTopic, getAllTopics } from '@/lib/db';

// Datos de ejemplo para poblar la base de datos
const sampleTopics = [
  {
    slug: "manejo-de-estados",
    titulo: "Manejo de Estados",
    explicacion_tecnica: "El manejo de estados se refiere a cómo una aplicación gestiona y actualiza los datos que cambian a lo largo del tiempo. Cada framework tiene su propio enfoque para manejar el estado local y global.",
    explicacion_ejemplo: "Imagina el estado como el 'humor' de una persona. Así como el humor puede cambiar según los eventos del día (café por la mañana = feliz, tráfico = molesto), el estado de una aplicación cambia según las acciones del usuario (click en botón, escribir en formulario, etc.).",
    image_explicacion: undefined,
    librerias: ["react", "vue", "angular"],
    table_elements: {
      react: {
        similitudes: "Usa hooks como useState y useReducer para estado local",
        diferencias: "Inmutabilidad requerida, re-renders automáticos en cambios de estado"
      },
      vue: {
        similitudes: "Sistema reactivo con ref() y reactive() para estado local",
        diferencias: "Mutabilidad permitida, reactividad basada en proxies"
      },
      angular: {
        similitudes: "Servicios y RxJS para manejo de estado complejo",
        diferencias: "Basado en observables, inyección de dependencias"
      }
    },
    code_exemple: {
      react: "const [count, setCount] = useState(0);\nconst increment = () => setCount(count + 1);",
      vue: "const count = ref(0);\nconst increment = () => count.value++;",
      angular: "count = signal(0);\nincrement() { this.count.update(val => val + 1); }"
    },
    parent: undefined,
    childs: ["useState", "useReducer", "Context API"]
  },
  {
    slug: "componentes-reutilizables",
    titulo: "Componentes Reutilizables",
    explicacion_tecnica: "Los componentes son bloques de construcción reutilizables que encapsulan lógica, estado y presentación. Permiten crear interfaces modulares y mantenibles.",
    explicacion_ejemplo: "Los componentes son como piezas de LEGO. Cada pieza tiene una forma y función específica, pero puedes combinarlas de diferentes maneras para crear estructuras más complejas. Un botón es una pieza, un formulario es otra, y juntos forman una página completa.",
    image_explicacion: undefined,
    librerias: ["react", "vue", "angular"],
    table_elements: {
      react: {
        similitudes: "Componentes funcionales con props y children",
        diferencias: "JSX como sintaxis, composición sobre herencia"
      },
      vue: {
        similitudes: "Single File Components con template, script y style",
        diferencias: "Template syntax declarativa, slots para contenido"
      },
      angular: {
        similitudes: "Componentes basados en clases con decoradores",
        diferencias: "TypeScript nativo, inyección de dependencias"
      }
    },
    code_exemple: {
      react: "function Button({ children, onClick }) {\n  return <button onClick={onClick}>{children}</button>;\n}",
      vue: "<template>\n  <button @click=\"onClick\">\n    <slot></slot>\n  </button>\n</template>",
      angular: "@Component({\n  selector: 'app-button',\n  template: '<button (click)=\"onClick()\"><ng-content></ng-content></button>'\n})"
    },
    parent: undefined,
    childs: ["Props", "Events", "Slots/Children"]
  },
  {
    slug: "routing-y-navegacion",
    titulo: "Routing y Navegación",
    explicacion_tecnica: "El routing permite crear aplicaciones de múltiples páginas (SPA) manejando la navegación entre diferentes vistas sin recargar la página completa.",
    explicacion_ejemplo: "El routing es como el sistema de navegación de un centro comercial. Tienes un mapa (rutas) que te dice cómo llegar a diferentes tiendas (páginas) sin salir del edificio (aplicación). Puedes ir de la tienda de ropa a la de comida siguiendo las señales, pero sigues dentro del mismo lugar.",
    image_explicacion: undefined,
    librerias: ["react", "vue", "angular"],
    table_elements: {
      react: {
        similitudes: "React Router o Next.js App Router para navegación",
        diferencias: "Configuración programática, componentes de ruta"
      },
      vue: {
        similitudes: "Vue Router integrado con el ecosistema Vue",
        diferencias: "Configuración declarativa, guards de navegación"
      },
      angular: {
        similitudes: "Angular Router con lazy loading nativo",
        diferencias: "Configuración basada en módulos, guards tipados"
      }
    },
    code_exemple: {
      react: "import { BrowserRouter, Route, Routes } from 'react-router-dom';\n<Routes>\n  <Route path=\"/\" element={<Home />} />\n</Routes>",
      vue: "const routes = [\n  { path: '/', component: Home },\n  { path: '/about', component: About }\n];",
      angular: "const routes: Routes = [\n  { path: '', component: HomeComponent },\n  { path: 'about', component: AboutComponent }\n];"
    },
    parent: undefined,
    childs: ["Route Guards", "Lazy Loading", "Navigation"]
  }
];

// POST - Inicializar base de datos con datos de ejemplo
export async function POST() {
  try {
    // Crear tabla si no existe
    await createTopicsTable();
    
    // Verificar si ya hay datos
    const existingTopics = await getAllTopics();
    if (existingTopics.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'La base de datos ya contiene datos',
        count: existingTopics.length
      }, { status: 400 });
    }
    
    // Crear topics de ejemplo
    const createdTopics = [];
    for (const topicData of sampleTopics) {
      const topic = await createTopic(topicData);
      createdTopics.push(topic);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Base de datos inicializada exitosamente',
      data: createdTopics,
      count: createdTopics.length
    }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/seed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al inicializar la base de datos',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET - Verificar estado de la base de datos
export async function GET() {
  try {
    const topics = await getAllTopics();
    
    return NextResponse.json({
      success: true,
      message: 'Estado de la base de datos',
      isEmpty: topics.length === 0,
      count: topics.length,
      sampleDataAvailable: sampleTopics.length
    });
  } catch (error) {
    console.error('Error in GET /api/seed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al verificar el estado de la base de datos',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}