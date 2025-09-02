import { sql } from '@vercel/postgres';
import type { TopicTranslation } from '@/types/topics';

export { sql };

// Función para limpiar completamente la base de datos
export async function clearDatabase() {
  try {
    console.log('🗑️ Limpiando base de datos...');
    await sql`DROP TABLE IF EXISTS topics CASCADE`;
    console.log('✅ Base de datos limpiada exitosamente');
    return { success: true };
  } catch (error) {
    console.error('Error limpiando base de datos:', error);
    throw error;
  }
}

// Función para crear la tabla topics si no existe
export async function createTopicsTable() {
  try {
    // Crear la tabla con todas las columnas necesarias
    await sql`
      CREATE TABLE IF NOT EXISTS topics (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(255) UNIQUE,
        frameworks JSONB DEFAULT '[]'::jsonb,
        difficulty_level VARCHAR(50) DEFAULT 'intermediate',
        estimated_time VARCHAR(50) DEFAULT '20 min',
        parent_id INTEGER,
        child_topics JSONB DEFAULT '[]'::jsonb,
        translations JSONB DEFAULT '{}'::jsonb,
        framework_details JSONB DEFAULT '{}'::jsonb,
        titulo VARCHAR(255),
        explicacion_tecnica TEXT,
        explicacion_ejemplo TEXT,
        image_explicacion VARCHAR(255),
        librerias JSONB DEFAULT '[]'::jsonb,
        table_elements JSONB DEFAULT '{}'::jsonb,
        code_exemple JSONB DEFAULT '{}'::jsonb,
        parent VARCHAR(255),
        childs JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
    
    return { success: true };
  } catch (error) {
    console.error('Error creating topics table:', error);
    throw error;
  }
}

// Función para obtener todos los topics
export async function getAllTopics() {
  try {
    const { rows } = await sql`SELECT * FROM topics ORDER BY created_at DESC`;
    return rows;
  } catch (error) {
    console.error('Error fetching topics:', error);
    throw error;
  }
}

// Función para obtener un topic por ID
export async function getTopicById(id: number) {
  try {
    const { rows } = await sql`SELECT * FROM topics WHERE id = ${id}`;
    return rows[0] || null;
  } catch (error) {
    console.error('Error fetching topic by ID:', error);
    throw error;
  }
}

// Función para crear un nuevo topic con nueva estructura
export async function createTopic(topicData: {
  slug: string;
  frameworks?: string[];
  difficulty_level?: string;
  estimated_time?: string;
  parent_id?: number | null;
  child_topics?: string[];
  translations?: object;
  framework_details?: object;
  // Campos legacy opcionales
  titulo?: string;
  explicacion_tecnica?: string;
  explicacion_ejemplo?: string;
  image_explicacion?: string;
  librerias?: string[];
  table_elements?: object;
  code_exemple?: object;
  parent?: string;
  childs?: string[];
}) {
  try {
    // Extraer título del objeto translations si existe
    const translations = topicData.translations as Record<string, TopicTranslation> | undefined;
    const titulo = topicData.titulo || 
      translations?.es?.title || 
      translations?.en?.title || 
      '';
    
    // Extraer descripción del objeto translations si existe
    const explicacion_tecnica = topicData.explicacion_tecnica || 
      translations?.es?.description || 
      translations?.en?.description || 
      '';
    
    // Extraer analogía del objeto translations si existe
    const explicacion_ejemplo = topicData.explicacion_ejemplo || 
      translations?.es?.analogy || 
      translations?.en?.analogy || 
      '';
    
    const { rows } = await sql`
      INSERT INTO topics (
        slug,
        frameworks,
        difficulty_level,
        estimated_time,
        parent_id,
        child_topics,
        translations,
        framework_details,
        titulo,
        explicacion_tecnica,
        explicacion_ejemplo,
        image_explicacion,
        librerias,
        table_elements,
        code_exemple,
        parent,
        childs
      ) VALUES (
        ${topicData.slug},
        ${JSON.stringify(topicData.frameworks || [])},
        ${topicData.difficulty_level || 'intermediate'},
        ${topicData.estimated_time || '20 min'},
        ${topicData.parent_id || null},
        ${JSON.stringify(topicData.child_topics || [])},
        ${JSON.stringify(topicData.translations || {})},
        ${JSON.stringify(topicData.framework_details || {})},
        ${titulo},
        ${explicacion_tecnica},
        ${explicacion_ejemplo},
        ${topicData.image_explicacion || ''},
        ${JSON.stringify(topicData.frameworks || topicData.librerias || [])},
        ${JSON.stringify(topicData.framework_details || topicData.table_elements || {})},
        ${JSON.stringify(topicData.framework_details || topicData.code_exemple || {})},
        ${topicData.parent || ''},
        ${JSON.stringify(topicData.child_topics || topicData.childs || [])}
      ) RETURNING *
    `;
    return rows[0];
  } catch (error) {
    console.error('Error creating topic:', error);
    throw error;
  }
}

// Función para actualizar un topic con nueva estructura
export async function updateTopic(id: number, topicData: Partial<{
  slug: string;
  frameworks: string[];
  difficulty_level: string;
  estimated_time: string;
  parent_id: number | null;
  child_topics: string[];
  translations: object;
  framework_details: object;
  // Campos legacy opcionales
  titulo: string;
  explicacion_tecnica: string;
  explicacion_ejemplo: string;
  image_explicacion: string;
  librerias: string[];
  table_elements: object;
  code_exemple: object;
  parent: string;
  childs: string[];
}>) {
  try {
    const updates = [];
    const values = [];
    let paramIndex = 1;

    Object.entries(topicData).forEach(([key, value]) => {
      if (value !== undefined) {
        if (['frameworks', 'child_topics', 'translations', 'framework_details', 'librerias', 'table_elements', 'code_exemple', 'childs'].includes(key)) {
          updates.push(`${key} = $${paramIndex}`);
          values.push(JSON.stringify(value));
        } else {
          updates.push(`${key} = $${paramIndex}`);
          values.push(value);
        }
        paramIndex++;
      }
    });

    if (updates.length === 0) {
      throw new Error('No fields to update');
    }

    updates.push(`updated_at = NOW()`);
    
    const query = `
      UPDATE topics 
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    
    values.push(id);
    
    const { rows } = await sql.query(query, values);
    return rows[0];
  } catch (error) {
    console.error('Error updating topic:', error);
    throw error;
  }
}

// Función para eliminar un topic
export async function deleteTopic(id: number) {
  try {
    const { rows } = await sql`
      DELETE FROM topics 
      WHERE id = ${id}
      RETURNING *
    `;
    return rows[0] || null;
  } catch (error) {
    console.error('Error deleting topic:', error);
    throw error;
  }
}

// Función para obtener topics por framework (nueva estructura)
export async function getTopicsByFramework(framework: string) {
  try {
    const { rows } = await sql`
      SELECT * FROM topics 
      WHERE frameworks::jsonb ? ${framework} OR librerias::jsonb ? ${framework}
      ORDER BY created_at DESC
    `;
    return rows;
  } catch (error) {
    console.error('Error getting topics by framework:', error);
    throw error;
  }
}

// Función para obtener topic por slug (nueva estructura)
export async function getTopicBySlug(slug: string) {
  try {
    const { rows } = await sql`
      SELECT * FROM topics 
      WHERE slug = ${slug}
      LIMIT 1
    `;
    return rows[0] || null;
  } catch (error) {
    console.error('Error getting topic by slug:', error);
    throw error;
  }
}

// Función para obtener topics hijos por parent_id
export async function getChildTopics(parentId: number) {
  try {
    const { rows } = await sql`
      SELECT * FROM topics 
      WHERE parent_id = ${parentId}
      ORDER BY created_at ASC
    `;
    return rows;
  } catch (error) {
    console.error('Error getting child topics:', error);
    throw error;
  }
}

// Función para obtener topics por nivel de dificultad
export async function getTopicsByDifficulty(difficulty: string) {
  try {
    const { rows } = await sql`
      SELECT * FROM topics 
      WHERE difficulty_level = ${difficulty}
      ORDER BY created_at DESC
    `;
    return rows;
  } catch (error) {
    console.error('Error getting topics by difficulty:', error);
    throw error;
  }
}