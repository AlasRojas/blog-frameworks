import { sql } from '@vercel/postgres';

export { sql };

// Función para crear la tabla topics si no existe
export async function createTopicsTable() {
  try {
    const result = await sql`
      CREATE TABLE IF NOT EXISTS topics (
        id SERIAL PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
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
    return result;
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

// Función para crear un nuevo topic
export async function createTopic(topicData: {
  titulo: string;
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
    const {
      titulo,
      explicacion_tecnica = '',
      explicacion_ejemplo = '',
      image_explicacion = null,
      librerias = [],
      table_elements = {},
      code_exemple = {},
      parent = null,
      childs = []
    } = topicData;

    const { rows } = await sql`
      INSERT INTO topics (
        titulo, explicacion_tecnica, explicacion_ejemplo, image_explicacion,
        librerias, table_elements, code_exemple, parent, childs
      )
      VALUES (
        ${titulo}, ${explicacion_tecnica}, ${explicacion_ejemplo}, ${image_explicacion},
        ${JSON.stringify(librerias)}, ${JSON.stringify(table_elements)}, 
        ${JSON.stringify(code_exemple)}, ${parent}, ${JSON.stringify(childs)}
      )
      RETURNING *
    `;
    return rows[0];
  } catch (error) {
    console.error('Error creating topic:', error);
    throw error;
  }
}

// Función para actualizar un topic
export async function updateTopic(id: number, topicData: Partial<{
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
        if (['librerias', 'table_elements', 'code_exemple', 'childs'].includes(key)) {
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

// Función para obtener topics por framework
export async function getTopicsByFramework(framework: string) {
  try {
    const { rows } = await sql`
      SELECT * FROM topics 
      WHERE librerias @> ${JSON.stringify([framework])}
      ORDER BY created_at DESC
    `;
    return rows;
  } catch (error) {
    console.error('Error fetching topics by framework:', error);
    throw error;
  }
}