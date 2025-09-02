import { NextRequest, NextResponse } from 'next/server';
import { getTopicsByFramework } from '@/lib/db';

// GET - Obtener topics por framework
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ framework: string }> }
) {
  try {
    const { framework: frameworkParam } = await params;
    const framework = frameworkParam.toLowerCase();
    
    // Validar que el framework sea válido
    const validFrameworks = ['react', 'vue', 'angular', 'svelte'];
    if (!validFrameworks.includes(framework)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Framework inválido. Debe ser uno de: ${validFrameworks.join(', ')}` 
        },
        { status: 400 }
      );
    }

    const topics = await getTopicsByFramework(framework);
    
    return NextResponse.json({
      success: true,
      data: topics,
      framework: framework,
      count: topics.length
    });
  } catch (error) {
    console.error('Error in GET /api/topics/framework/[framework]:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al obtener topics por framework',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}