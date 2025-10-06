import { Request, Response } from 'express';
import { query } from '../config/database';
import { Curso, CreateCursoDTO, UpdateCursoDTO, Clase, CreateClaseDTO, UpdateClaseDTO } from '../types/curso.types';

class CursoController {

  // =====================
  // CURSOS
  // =====================

  static async getAllCursos(req: Request, res: Response) {
    try {
      const result = await query('SELECT * FROM cursos ORDER BY codigo ASC');
      res.json({ success: true, data: result.rows });
    } catch (error) {
      console.error('Error al obtener los cursos:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }

  static async getCursoById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const result = await query('SELECT * FROM cursos WHERE id = $1', [id]);
      if (result.rowCount === 0)
        return res.status(404).json({ success: false, message: 'Curso no encontrado' });
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      console.error('Error al obtener curso por ID:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }

  static async getCursoByCodigo(req: Request, res: Response) {
    const { codigo } = req.params;
    try {
      const result = await query('SELECT * FROM cursos WHERE codigo = $1', [codigo]);
      if (result.rowCount === 0)
        return res.status(404).json({ success: false, message: 'Curso no encontrado' });
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      console.error('Error al obtener curso por código:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }

  static async getCursosByArea(req: Request, res: Response) {
    const { area } = req.params;
    try {
      const result = await query('SELECT * FROM cursos WHERE LOWER(area) = LOWER($1) ORDER BY codigo', [area]);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      console.error('Error al obtener cursos por área:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }

  static async searchCursos(req: Request, res: Response) {
    const { term } = req.query;
    try {
      const result = await query(
        `SELECT * FROM cursos 
         WHERE LOWER(nombre) LIKE LOWER($1) 
         OR LOWER(descripcion) LIKE LOWER($1) 
         OR LOWER(area) LIKE LOWER($1)
         OR LOWER(codigo) LIKE LOWER($1)
         ORDER BY codigo`,
        [`%${term}%`]
      );
      res.json({ success: true, data: result.rows });
    } catch (error) {
      console.error('Error al buscar cursos:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }

  static async getEstadisticasPorArea(req: Request, res: Response) {
    try {
      const result = await query(`
        SELECT area, COUNT(*) AS cantidad 
        FROM cursos 
        GROUP BY area 
        ORDER BY cantidad DESC
      `);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }

  static async createCurso(req: Request, res: Response) {
    const cursoData: CreateCursoDTO = req.body;
    try {
      const result = await query(
        `INSERT INTO cursos 
         (codigo, nombre, descripcion, creditos, horas_semanales, nivel, area, estado, prerequisitos, capacidad_maxima)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
        [
          cursoData.codigo,
          cursoData.nombre,
          cursoData.descripcion || null,
          cursoData.creditos,
          cursoData.horas_semanales,
          cursoData.nivel || null,
          cursoData.area || null,
          'ACTIVO',
          cursoData.prerequisitos || [],
          cursoData.capacidad_maxima || 30
        ]
      );
      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
      console.error('Error al crear curso:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }

  static async updateCurso(req: Request, res: Response) {
    const { id } = req.params;
    const cursoData: UpdateCursoDTO = req.body;

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

    if (fields.length === 0)
      return res.status(400).json({ success: false, message: 'No se proporcionaron campos para actualizar' });

    values.push(id);
    try {
      const result = await query(
        `UPDATE cursos SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
        values
      );
      if (result.rowCount === 0)
        return res.status(404).json({ success: false, message: 'Curso no encontrado' });
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      console.error('Error al actualizar curso:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }

  static async deleteCurso(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const result = await query('DELETE FROM cursos WHERE id = $1 RETURNING *', [id]);
      if (result.rowCount === 0)
        return res.status(404).json({ success: false, message: 'Curso no encontrado' });
      res.json({ success: true, message: 'Curso eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar curso:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }

  // =====================
  // CLASES
  // =====================

  static async getCursoWithClases(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const cursoResult = await query('SELECT * FROM cursos WHERE id = $1', [id]);
      if (cursoResult.rowCount === 0)
        return res.status(404).json({ success: false, message: 'Curso no encontrado' });

      const curso = cursoResult.rows[0];
      const clasesResult = await query('SELECT * FROM clases WHERE curso_id = $1 ORDER BY id_clases ASC', [id]);

      res.json({ success: true, data: { ...curso, clases: clasesResult.rows } });
    } catch (error) {
      console.error('Error al obtener curso con clases:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }

  static async createClase(req: Request, res: Response) {
    const claseData: CreateClaseDTO = req.body;
    try {
      const result = await query(
        `INSERT INTO clases (titulo, descripcion, duracion, curso_id)
         VALUES ($1,$2,$3,$4) RETURNING *`,
        [claseData.titulo, claseData.descripcion || null, claseData.duracion, claseData.curso_id]
      );
      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
      console.error('Error al crear clase:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }

  static async updateClase(req: Request, res: Response) {
    const { id } = req.params;
    const claseData: UpdateClaseDTO = req.body;

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

    if (fields.length === 0)
      return res.status(400).json({ success: false, message: 'No se proporcionaron campos para actualizar' });

    values.push(id);

    try {
      const result = await query(
        `UPDATE clases SET ${fields.join(', ')} WHERE id_clases = $${paramCount} RETURNING *`,
        values
      );
      if (result.rowCount === 0)
        return res.status(404).json({ success: false, message: 'Clase no encontrada' });
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      console.error('Error al actualizar clase:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }

    static async deleteClase(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const result = await query('DELETE FROM clases WHERE id_clases = $1 RETURNING *', [id]);
      if (result.rowCount === 0)
        return res.status(404).json({ success: false, message: 'Clase no encontrada' });
      res.json({ success: true, message: 'Clase eliminada correctamente' });
    } catch (error) {
      console.error('Error al eliminar clase:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }
}

export default CursoController;

