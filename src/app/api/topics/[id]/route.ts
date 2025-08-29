import { NextRequest, NextResponse } from 'next/server';
import { 
  getTopicById, 
  updateTopic, 
  deleteTopic 
} from '@/lib/db';

// GET - Obtener topic por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID inválido' 
        },
        { status: 400 }
      );
    }

    const topic = await getTopicById(id);
    
    if (!topic) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Topic no encontrado' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: topic
    });
  } catch (error) {
    console.error('Error in GET /api/topics/[id]:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al obtener el topic',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PUT - Actualizar topic por ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID inválido' 
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Verificar que el topic existe
    const existingTopic = await getTopicById(id);
    if (!existingTopic) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Topic no encontrado' 
        },
        { status: 404 }
      );
    }

    const updatedTopic = await updateTopic(id, body);
    
    return NextResponse.json({
      success: true,
      data: updatedTopic,
      message: 'Topic actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error in PUT /api/topics/[id]:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al actualizar el topic',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar topic por ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID inválido' 
        },
        { status: 400 }
      );
    }

    // Verificar que el topic existe
    const existingTopic = await getTopicById(id);
    if (!existingTopic) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Topic no encontrado' 
        },
        { status: 404 }
      );
    }

    const deletedTopic = await deleteTopic(id);
    
    return NextResponse.json({
      success: true,
      data: deletedTopic,
      message: 'Topic eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error in DELETE /api/topics/[id]:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al eliminar el topic',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}