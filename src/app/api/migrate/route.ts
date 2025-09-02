import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

/**
 * Genera un slug basado en el título
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
    .trim()
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .replace(/-+/g, '-'); // Remover guiones duplicados
}

/**
 * Determina los frameworks relevantes basado en el contenido
 */
function determineFrameworks(topic: any): string[] {
  const content = `${topic.titulo} ${topic.explicacion_tecnica} ${topic.explicacion_ejemplo}`.toLowerCase();
  const frameworks: string[] = [];
  
  if (content.includes('react') || content.includes('jsx') || content.includes('hook')) {
    frameworks.push('react');
  }
  if (content.includes('vue') || content.includes('composition api') || content.includes('vuex')) {
    frameworks.push('vue');
  }
  if (content.includes('angular') || content.includes('typescript') || content.includes('rxjs')) {
    frameworks.push('angular');
  }
  if (content.includes('svelte') || content.includes('sveltekit')) {
    frameworks.push('svelte');
  }
  
  // Si no se detecta ningún framework específico, asignar a todos
  if (frameworks.length === 0) {
    frameworks.push('react', 'vue', 'angular', 'svelte');
  }
  
  return frameworks;
}

/**
 * Determina el nivel de dificultad basado en el contenido
 */
function determineDifficultyLevel(topic: any): 'beginner' | 'intermediate' | 'advanced' {
  const content = `${topic.titulo} ${topic.explicacion_tecnica}`.toLowerCase();
  
  // Palabras clave para nivel avanzado
  const advancedKeywords = ['optimización', 'performance', 'ssr', 'lazy loading', 'memoization', 'virtualization'];
  // Palabras clave para nivel intermedio
  const intermediateKeywords = ['routing', 'estado', 'state', 'api', 'hooks', 'lifecycle'];
  
  if (advancedKeywords.some(keyword => content.includes(keyword))) {
    return 'advanced';
  }
  if (intermediateKeywords.some(keyword => content.includes(keyword))) {
    return 'intermediate';
  }
  return 'beginner';
}

/**
 * Estima el tiempo de lectura basado en la longitud del contenido
 */
function estimateReadingTime(topic: any): string {
  const totalWords = `${topic.titulo} ${topic.explicacion_tecnica} ${topic.explicacion_ejemplo}`.split(' ').length;
  const wordsPerMinute = 200; // Velocidad promedio de lectura
  const minutes = Math.ceil(totalWords / wordsPerMinute);
  
  if (minutes <= 5) return '5 min';
  if (minutes <= 10) return '10 min';
  if (minutes <= 15) return '15 min';
  if (minutes <= 20) return '20 min';
  return '25 min';
}

/**
 * Crea el objeto de traducciones
 */
function createTranslations(topic: any) {
  const translations: any = {
    es: {
      titulo: topic.titulo,
      explicacion_tecnica: topic.explicacion_tecnica,
      explicacion_ejemplo: topic.explicacion_ejemplo
    }
  };
  
  if (topic.titulo_en) {
    translations.en = {
      titulo: topic.titulo_en,
      explicacion_tecnica: topic.explicacion_tecnica_en || '',
      explicacion_ejemplo: topic.explicacion_ejemplo_en || ''
    };
  }
  
  if (topic.titulo_fr) {
    translations.fr = {
      titulo: topic.titulo_fr,
      explicacion_tecnica: topic.explicacion_tecnica_fr || '',
      explicacion_ejemplo: topic.explicacion_ejemplo_fr || ''
    };
  }
  
  return translations;
}

/**
 * API endpoint para ejecutar la migración de datos
 * POST /api/migrate
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Iniciando migración de datos via API...');
    
    // Obtener todos los topics existentes
    const { rows: topics } = await sql`
      SELECT id, titulo, explicacion_tecnica, explicacion_ejemplo,
             titulo_en, explicacion_tecnica_en, explicacion_ejemplo_en,
             titulo_fr, explicacion_tecnica_fr, explicacion_ejemplo_fr
      FROM topics
      WHERE slug IS NULL OR frameworks = '[]'
    `;
    
    console.log(`📊 Encontrados ${topics.length} topics para migrar`);
    
    for (const topic of topics) {
      console.log(`🔄 Migrando topic: ${topic.titulo}`);
      
      const slug = generateSlug(topic.titulo);
      const frameworks = determineFrameworks(topic);
      const difficultyLevel = determineDifficultyLevel(topic);
      const estimatedTime = estimateReadingTime(topic);
      const translations = createTranslations(topic);
      
      // Actualizar el topic con los nuevos datos
      await sql`
        UPDATE topics 
        SET 
          slug = ${slug},
          frameworks = ${JSON.stringify(frameworks)},
          difficulty_level = ${difficultyLevel},
          estimated_time = ${estimatedTime},
          translations = ${JSON.stringify(translations)},
          framework_details = '{}'
        WHERE id = ${topic.id}
      `;
      
      console.log(`✅ Topic migrado: ${topic.titulo} -> ${slug}`);
    }
    
    console.log('🎉 Migración completada exitosamente!');
    
    return NextResponse.json({
      success: true,
      message: 'Migración completada exitosamente',
      data: { migratedCount: topics.length }
    });
    
  } catch (error) {
    console.error('❌ Error en migración:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Error durante la migración',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint para verificar el estado de la migración
 */
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      message: 'Endpoint de migración disponible',
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Error al verificar estado de migración'
      },
      { status: 500 }
    );
  }
}