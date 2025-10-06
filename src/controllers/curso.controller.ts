import { Request, Response } from 'express';
import { query } from '../config/database';

class CursoController {
  /**
   * Obtener todos los cursos
   */
  static async getAllCursos(req: Request, res: Response) {
    try {
      const result = await query('SELECT * FROM cursos ORDER BY id ASC');
      res.json({ success: true, data: result.rows });
    } catch (error) {
      console.error('Error al obtener los cursos:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }

  /**
   * Buscar cursos por término (nombre, descripción, área)
   */
  static async searchCursos(req: Request, res: Response) {
    const { term } = req.query;
    try {
      const result = await query(
        `SELECT * FROM cursos 
         WHERE LOWER(nombre) LIKE LOWER($1) 
         OR LOWER(descripcion) LIKE LOWER($1) 
         OR LOWER(area) LIKE LOWER($1)`,
        [`%${term}%`]
      );
      res.json({ success: true, data: result.rows });
    } catch (error) {
      console.error('Error al buscar cursos:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }

  /**
   * Obtener estadísticas de cursos agrupadas por área
   */
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

  /**
   * Obtener cursos por área específica
   */
  static async getCursosByArea(req: Request, res: Response) {
    const { area } = req.params;
    try {
      const result = await query('SELECT * FROM cursos WHERE LOWER(area) = LOWER($1)', [area]);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      console.error('Error al obtener cursos por área:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }

  /**
   * Obtener curso por ID
   */
  static async getCursoById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const result = await query('SELECT * FROM cursos WHERE id = $1', [id]);
      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, message: 'Curso no encontrado' });
      }
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      console.error('Error al obtener curso por ID:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }

  /**
   * Obtener curso con sus clases asociadas
   */
  static async getCursoWithClases(req: Request, res: Response) {
    const { id } = req.params;
    try {
      // Obtener curso principal
      const cursoResult = await query('SELECT * FROM cursos WHERE id = $1', [id]);
      if (cursoResult.rowCount === 0) {
        return res.status(404).json({ success: false, message: 'Curso no encontrado' });
      }

      const curso = cursoResult.rows[0];

      // Obtener clases asociadas a ese curso
      const clasesResult = await query(
        'SELECT * FROM clases WHERE curso_id = $1 ORDER BY fecha_creacion ASC',
        [id]
      );

      res.json({
        success: true,
        data: {
          ...curso,
          clases: clasesResult.rows,
        },
      });
    } catch (error) {
      console.error('Error al obtener curso con clases:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }

  /**
   * Obtener curso por código único
   */
  static async getCursoByCodigo(req: Request, res: Response) {
    const { codigo } = req.params;
    try {
      const result = await query('SELECT * FROM cursos WHERE codigo = $1', [codigo]);
      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, message: 'Curso no encontrado' });
      }
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      console.error('Error al obtener curso por código:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }

  /**
   * Crear nuevo curso
   */
  static async createCurso(req: Request, res: Response) {
    const { nombre, descripcion, area, codigo } = req.body;
    try {
      const result = await query(
        `INSERT INTO cursos (nombre, descripcion, area, codigo)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [nombre, descripcion, area, codigo]
      );
      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
      console.error('Error al crear curso:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }

  /**
   * Actualizar curso existente
   */
  static async updateCurso(req: Request, res: Response) {
    const { id } = req.params;
    const { nombre, descripcion, area, codigo } = req.body;

    try {
      const result = await query(
        `UPDATE cursos 
         SET nombre = $1, descripcion = $2, area = $3, codigo = $4 
         WHERE id = $5 RETURNING *`,
        [nombre, descripcion, area, codigo, id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, message: 'Curso no encontrado' });
      }

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      console.error('Error al actualizar curso:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }

  /**
   * Eliminar curso
   */
  static async deleteCurso(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const result = await query('DELETE FROM cursos WHERE id = $1 RETURNING *', [id]);
      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, message: 'Curso no encontrado' });
      }
      res.json({ success: true, message: 'Curso eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar curso:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  }
}

export default CursoController;
