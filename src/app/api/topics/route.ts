import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllTopics, 
  createTopic, 
  createTopicsTable 
} from '@/lib/db';

// GET - Obtener todos los topics
export async function GET() {
  try {
    // Asegurar que la tabla existe
    await createTopicsTable();
    
    const topics = await getAllTopics();
    return NextResponse.json({
      success: true,
      data: topics,
      count: topics.length
    });
  } catch (error) {
    console.error('Error in GET /api/topics:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al obtener los topics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST - Crear un nuevo topic
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar campos requeridos
    if (!body.titulo) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'El campo titulo es requerido' 
        },
        { status: 400 }
      );
    }

    // Asegurar que la tabla existe
    await createTopicsTable();
    
    const newTopic = await createTopic(body);
    
    return NextResponse.json({
      success: true,
      data: newTopic,
      message: 'Topic creado exitosamente'
    }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/topics:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al crear el topic',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}