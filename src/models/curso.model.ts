import { pool } from "../config/database";
import { Curso, CreateCursoDTO, UpdateCursoDTO, CursoConSecciones } from '../types/curso.types';

export class CursoModel {
  
  async findAll(): Promise<Curso[]> {
    const query = 'SELECT * FROM cursos ORDER BY codigo';
    const result = await pool.query(query);
    return result.rows;
  }

  async findById(id: number): Promise<Curso | null> {
    const query = 'SELECT * FROM cursos WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  async findByCodigo(codigo: string): Promise<Curso | null> {
    const query = 'SELECT * FROM cursos WHERE codigo = $1';
    const result = await pool.query(query, [codigo]);
    return result.rows[0] || null;
  }

  async findByArea(area: string): Promise<Curso[]> {
    const query = 'SELECT * FROM cursos WHERE area = $1 ORDER BY codigo';
    const result = await pool.query(query, [area]);
    return result.rows;
  }

  async findByEstado(estado: string): Promise<Curso[]> {
    const query = 'SELECT * FROM cursos WHERE estado = $1 ORDER BY codigo';
    const result = await pool.query(query, [estado]);
    return result.rows;
  }

  async findWithSecciones(cursoId: number, periodo?: string): Promise<CursoConSecciones | null> {
    const cursoQuery = 'SELECT * FROM cursos WHERE id = $1';
    const cursoResult = await pool.query(cursoQuery, [cursoId]);
    
    if (cursoResult.rows.length === 0) {
      return null;
    }

    const curso = cursoResult.rows[0];
    
    let seccionesQuery = 'SELECT * FROM secciones WHERE curso_id = $1';
    const params: any[] = [cursoId];
    
    if (periodo) {
      seccionesQuery += ' AND periodo = $2';
      params.push(periodo);
    }
    
    seccionesQuery += ' ORDER BY codigo_seccion';
    
    const seccionesResult = await pool.query(seccionesQuery, params);
    
    return {
      ...curso,
      secciones: seccionesResult.rows
    };
  }

  async create(cursoData: CreateCursoDTO): Promise<Curso> {
    const query = `
      INSERT INTO cursos (codigo, nombre, descripcion, creditos, horas_semanales, nivel, area, prerequisitos, capacidad_maxima)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    
    const values = [
      cursoData.codigo,
      cursoData.nombre,
      cursoData.descripcion || null,
      cursoData.creditos,
      cursoData.horas_semanales,
      cursoData.nivel || null,
      cursoData.area || null,
      cursoData.prerequisitos || [],
      cursoData.capacidad_maxima || 30
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async update(id: number, cursoData: UpdateCursoDTO): Promise<Curso | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.entries(cursoData).forEach(([key, value]) => {
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
      UPDATE cursos 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM cursos WHERE id = $1';
    const result = await pool.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }

  async search(searchTerm: string): Promise<Curso[]> {
    const query = `
      SELECT * FROM cursos 
      WHERE 
        codigo ILIKE $1 OR 
        nombre ILIKE $1 OR 
        descripcion ILIKE $1 OR
        area ILIKE $1
      ORDER BY codigo
    `;
    const result = await pool.query(query, [`%${searchTerm}%`]);
    return result.rows;
  }

  async countByArea(): Promise<Array<{area: string, count: number}>> {
    const query = `
      SELECT area, COUNT(*) as count 
      FROM cursos 
      WHERE area IS NOT NULL
      GROUP BY area 
      ORDER BY count DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }
}

export default new CursoModel();