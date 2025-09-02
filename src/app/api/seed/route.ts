import { NextResponse } from 'next/server';
import { createTopicsTable, createTopic, getAllTopics, sql } from '@/lib/db';

// Datos de ejemplo para poblar la base de datos con nueva estructura
const sampleTopics = [
  {
    slug: "manejo-de-estados",
    frameworks: ["react", "vue", "angular", "svelte"],
    difficulty_level: "intermediate",
    estimated_time: "25 min",
    parent_id: null,
    child_topics: ["useState", "useReducer", "Context API"],
    translations: {
      es: {
        title: "Manejo de Estados",
        description: "El manejo de estados se refiere a cómo una aplicación gestiona y actualiza los datos que cambian a lo largo del tiempo. Cada framework tiene su propio enfoque para manejar el estado local y global.",
        analogy: "Imagina el estado como el 'humor' de una persona. Así como el humor puede cambiar según los eventos del día (café por la mañana = feliz, tráfico = molesto), el estado de una aplicación cambia según las acciones del usuario (click en botón, escribir en formulario, etc.)."
      },
      en: {
        title: "State Management",
        description: "State management refers to how an application manages and updates data that changes over time. Each framework has its own approach to handling local and global state.",
        analogy: "Think of state as a person's 'mood'. Just as mood can change based on daily events (morning coffee = happy, traffic = annoyed), an application's state changes based on user actions (button clicks, form inputs, etc.)."
      },
      fr: {
        title: "Gestion d'État",
        description: "La gestion d'état fait référence à la façon dont une application gère et met à jour les données qui changent au fil du temps. Chaque framework a sa propre approche pour gérer l'état local et global.",
        analogy: "Pensez à l'état comme à l'humeur d'une personne. Tout comme l'humeur peut changer selon les événements quotidiens (café du matin = heureux, embouteillages = agacé), l'état d'une application change selon les actions de l'utilisateur."
      }
    },
    framework_details: {
      react: {
        similarities: "Usa hooks como useState y useReducer para estado local",
        differences: "Inmutabilidad requerida, re-renders automáticos en cambios de estado",
        code_example: "const [count, setCount] = useState(0);\nconst increment = () => setCount(count + 1);"
      },
      vue: {
        similarities: "Sistema reactivo con ref() y reactive() para estado local",
        differences: "Mutabilidad permitida, reactividad basada en proxies",
        code_example: "const count = ref(0);\nconst increment = () => count.value++;"
      },
      angular: {
        similarities: "Servicios y RxJS para manejo de estado complejo",
        differences: "Basado en observables, inyección de dependencias",
        code_example: "count = signal(0);\nincrement() { this.count.update(val => val + 1); }"
      },
      svelte: {
        similarities: "Variables reactivas y stores para estado global",
        differences: "Reactividad automática sin hooks, compilación optimizada",
        code_example: "let count = 0;\nconst increment = () => count++;"
      }
    }
  },
  {
    slug: "componentes-reutilizables",
    frameworks: ["react", "vue", "angular", "svelte"],
    difficulty_level: "beginner",
    estimated_time: "20 min",
    parent_id: null,
    child_topics: ["Props", "Events", "Slots/Children"],
    translations: {
      es: {
        title: "Componentes Reutilizables",
        description: "Los componentes son bloques de construcción reutilizables que encapsulan lógica, estado y presentación. Permiten crear interfaces modulares y mantenibles.",
        analogy: "Los componentes son como piezas de LEGO. Cada pieza tiene una forma y función específica, pero puedes combinarlas de diferentes maneras para crear estructuras más complejas. Un botón es una pieza, un formulario es otra, y juntos forman una página completa."
      },
      en: {
        title: "Reusable Components",
        description: "Components are reusable building blocks that encapsulate logic, state, and presentation. They allow creating modular and maintainable interfaces.",
        analogy: "Components are like LEGO pieces. Each piece has a specific shape and function, but you can combine them in different ways to create more complex structures. A button is one piece, a form is another, and together they form a complete page."
      },
      fr: {
        title: "Composants Réutilisables",
        description: "Les composants sont des blocs de construction réutilisables qui encapsulent la logique, l'état et la présentation. Ils permettent de créer des interfaces modulaires et maintenables.",
        analogy: "Les composants sont comme des pièces de LEGO. Chaque pièce a une forme et une fonction spécifiques, mais vous pouvez les combiner de différentes manières pour créer des structures plus complexes."
      }
    },
    framework_details: {
      react: {
        similarities: "Componentes funcionales con props y children",
        differences: "JSX como sintaxis, composición sobre herencia",
        code_example: "function Button({ children, onClick }) {\n  return <button onClick={onClick}>{children}</button>;\n}"
      },
      vue: {
        similarities: "Single File Components con template, script y style",
        differences: "Template syntax declarativa, slots para contenido",
        code_example: "<template>\n  <button @click=\"onClick\">\n    <slot></slot>\n  </button>\n</template>"
      },
      angular: {
        similarities: "Componentes basados en clases con decoradores",
        differences: "TypeScript nativo, inyección de dependencias",
        code_example: "@Component({\n  selector: 'app-button',\n  template: '<button (click)=\"onClick()\"><ng-content></ng-content></button>'\n})"
      },
      svelte: {
        similarities: "Componentes como archivos .svelte con lógica integrada",
        differences: "Compilación optimizada, sintaxis más simple",
        code_example: "<script>\n  export let onClick;\n</script>\n<button on:click={onClick}>\n  <slot></slot>\n</button>"
      }
    }
  },
  {
    slug: "routing-y-navegacion",
    frameworks: ["react", "vue", "angular", "svelte"],
    difficulty_level: "intermediate",
    estimated_time: "30 min",
    parent_id: null,
    child_topics: ["Route Guards", "Lazy Loading", "Navigation"],
    translations: {
      es: {
        title: "Routing y Navegación",
        description: "El routing permite crear aplicaciones de múltiples páginas (SPA) manejando la navegación entre diferentes vistas sin recargar la página completa.",
        analogy: "El routing es como el sistema de navegación de un centro comercial. Tienes un mapa (rutas) que te dice cómo llegar a diferentes tiendas (páginas) sin salir del edificio (aplicación). Puedes ir de la tienda de ropa a la de comida siguiendo las señales, pero sigues dentro del mismo lugar."
      },
      en: {
        title: "Routing and Navigation",
        description: "Routing allows creating multi-page applications (SPA) by handling navigation between different views without reloading the complete page.",
        analogy: "Routing is like a shopping mall's navigation system. You have a map (routes) that tells you how to get to different stores (pages) without leaving the building (application). You can go from the clothing store to the food court following the signs, but you're still inside the same place."
      },
      fr: {
        title: "Routage et Navigation",
        description: "Le routage permet de créer des applications multi-pages (SPA) en gérant la navigation entre différentes vues sans recharger la page complète.",
        analogy: "Le routage est comme le système de navigation d'un centre commercial. Vous avez une carte (routes) qui vous dit comment vous rendre dans différents magasins (pages) sans quitter le bâtiment (application)."
      }
    },
    framework_details: {
      react: {
        similarities: "React Router o Next.js App Router para navegación",
        differences: "Configuración programática, componentes de ruta",
        code_example: "import { BrowserRouter, Route, Routes } from 'react-router-dom';\n<Routes>\n  <Route path=\"/\" element={<Home />} />\n</Routes>"
      },
      vue: {
        similarities: "Vue Router integrado con el ecosistema Vue",
        differences: "Configuración declarativa, guards de navegación",
        code_example: "const routes = [\n  { path: '/', component: Home },\n  { path: '/about', component: About }\n];"
      },
      angular: {
        similarities: "Angular Router con lazy loading nativo",
        differences: "Configuración basada en módulos, guards tipados",
        code_example: "const routes: Routes = [\n  { path: '', component: HomeComponent },\n  { path: 'about', component: AboutComponent }\n];"
      },
      svelte: {
        similarities: "SvelteKit con file-based routing automático",
        differences: "Routing basado en sistema de archivos, SSR integrado",
        code_example: "// src/routes/+page.svelte\n<script>\n  import { goto } from '$app/navigation';\n</script>\n<button on:click={() => goto('/about')}>Go to About</button>"
      }
    }
  }
];

// POST - Inicializar base de datos con datos de ejemplo
export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const force = url.searchParams.get('force') === 'true';
    
    // Crear tabla si no existe
    await createTopicsTable();
    
    // Verificar si ya hay datos
    const existingTopics = await getAllTopics();
    if (existingTopics.length > 0 && !force) {
      return NextResponse.json({
        success: false,
        message: 'La base de datos ya contiene datos. Usa ?force=true para sobrescribir.',
        count: existingTopics.length
      }, { status: 400 });
    }
    
    // Si force=true, limpiar la base de datos primero
    if (force && existingTopics.length > 0) {
      await clearDatabase();
      await createTopicsTable();
    }
    
    // Crear topics de ejemplo
    const createdTopics = [];
    for (const topicData of sampleTopics) {
      const topic = await createTopic(topicData);
      createdTopics.push(topic);
    }
    
    return NextResponse.json({
      success: true,
      message: force ? 'Base de datos limpiada y reinicializada exitosamente' : 'Base de datos inicializada exitosamente',
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

// DELETE - Limpiar base de datos
export async function DELETE() {
  try {
    console.log('🗑️ Limpiando base de datos...');
    await sql`DROP TABLE IF EXISTS topics CASCADE`;
    console.log('✅ Base de datos limpiada exitosamente');
    
    return NextResponse.json({
      success: true,
      message: 'Base de datos limpiada exitosamente'
    });
  } catch (error) {
    console.error('Error in DELETE /api/seed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al limpiar la base de datos',
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