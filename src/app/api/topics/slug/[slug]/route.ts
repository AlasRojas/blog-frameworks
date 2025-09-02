import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

// GET - Obtener topic por slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    if (!slug) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Slug es requerido' 
        },
        { status: 400 }
      );
    }

    // Buscar topic por slug
    const { rows } = await sql`
      SELECT * FROM topics 
      WHERE slug = ${slug}
      LIMIT 1
    `;
    
    if (rows.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Topic no encontrado' 
        },
        { status: 404 }
      );
    }

    const topic = rows[0];
    
    // Parsear campos JSON
    if (topic.frameworks && typeof topic.frameworks === 'string') {
      topic.frameworks = JSON.parse(topic.frameworks);
    }
    if (topic.child_topics && typeof topic.child_topics === 'string') {
      topic.child_topics = JSON.parse(topic.child_topics);
    }
    if (topic.translations && typeof topic.translations === 'string') {
      topic.translations = JSON.parse(topic.translations);
    }
    if (topic.framework_details && typeof topic.framework_details === 'string') {
      topic.framework_details = JSON.parse(topic.framework_details);
    }

    return NextResponse.json({
      success: true,
      data: topic
    });
  } catch (error) {
    console.error('Error in GET /api/topics/slug/[slug]:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al obtener el topic por slug',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}