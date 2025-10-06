import { pool } from '../config/database';
import { Clase, CreateClaseDTO, UpdateClaseDTO } from '../types/clase.types';

export class ClaseModel {

  async findAll(): Promise<Clase[]> {
    const query = 'SELECT * FROM clases ORDER BY id_clases';
    const result = await pool.query(query);
    return result.rows;
  }

  async findById(id: number): Promise<Clase | null> {
    const query = 'SELECT * FROM clases WHERE id_clases = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  async findByCurso(cursoId: number): Promise<Clase[]> {
    const query = 'SELECT * FROM clases WHERE curso_id = $1 ORDER BY id_clases';
    const result = await pool.query(query, [cursoId]);
    return result.rows;
  }

  async create(claseData: CreateClaseDTO): Promise<Clase> {
    const query = `
      INSERT INTO clases (titulo, descripcion, duracion, curso_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [
      claseData.titulo,
      claseData.descripcion || null,
      claseData.duracion || null,
      claseData.curso_id
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async update(id: number, claseData: UpdateClaseDTO): Promise<Clase | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.entries(claseData).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const query = `
      UPDATE clases 
      SET ${fields.join(', ')}
      WHERE id_clases = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM clases WHERE id_clases = $1';
    const result = await pool.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }

  async findWithCurso(id: number): Promise<any> {
    const query = `
      SELECT c.*, cu.nombre as curso_nombre, cu.creditos
      FROM clases c
      JOIN cursos cu ON c.curso_id = cu.id_curso
      WHERE c.id_clases = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }
}

export default new ClaseModel();
