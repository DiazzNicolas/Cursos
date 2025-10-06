import { Request, Response } from 'express';
import ClaseModel from '../models/clase.model';
import CursoModel from '../models/curso.model';
import { CreateClaseDTO, UpdateClaseDTO } from '../types/clase.types';

export class ClaseController {

  async getAllClases(req: Request, res: Response): Promise<void> {
    try {
      const clases = await ClaseModel.findAll();
      res.status(200).json({
        success: true,
        data: clases,
        count: clases.length
      });
    } catch (error) {
      console.error('Error en getAllClases:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener las clases',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async getClaseById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const clase = await ClaseModel.findById(parseInt(id));

      if (!clase) {
        res.status(404).json({
          success: false,
          message: 'Clase no encontrada'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: clase
      });
    } catch (error) {
      console.error('Error en getClaseById:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener la clase',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async getClasesByCurso(req: Request, res: Response): Promise<void> {
    try {
      const { cursoId } = req.params;
      const clases = await ClaseModel.findByCurso(parseInt(cursoId));

      res.status(200).json({
        success: true,
        data: clases,
        count: clases.length
      });
    } catch (error) {
      console.error('Error en getClasesByCurso:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener clases del curso',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async createClase(req: Request, res: Response): Promise<void> {
    try {
      const claseData: CreateClaseDTO = req.body;

      // Verificar que el curso existe
      const curso = await CursoModel.findById(claseData.curso_id);
      if (!curso) {
        res.status(404).json({
          success: false,
          message: 'Curso no encontrado'
        });
        return;
      }

      const nuevaClase = await ClaseModel.create(claseData);

      res.status(201).json({
        success: true,
        message: 'Clase creada exitosamente',
        data: nuevaClase
      });
    } catch (error) {
      console.error('Error en createClase:', error);
      res.status(500).json({
        success: false,
        message: 'Error al crear la clase',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async updateClase(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const claseData: UpdateClaseDTO = req.body;

      const claseActualizada = await ClaseModel.update(parseInt(id), claseData);

      if (!claseActualizada) {
        res.status(404).json({
          success: false,
          message: 'Clase no encontrada'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Clase actualizada exitosamente',
        data: claseActualizada
      });
    } catch (error) {
      console.error('Error en updateClase:', error);
      res.status(500).json({
        success: false,
        message: 'Error al actualizar la clase',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async deleteClase(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const eliminado = await ClaseModel.delete(parseInt(id));

      if (!eliminado) {
        res.status(404).json({
          success: false,
          message: 'Clase no encontrada'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Clase eliminada exitosamente'
      });
    } catch (error) {
      console.error('Error en deleteClase:', error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar la clase',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async getClaseWithCurso(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const clase = await ClaseModel.findWithCurso(parseInt(id));

      if (!clase) {
        res.status(404).json({
          success: false,
          message: 'Clase no encontrada'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: clase
      });
    } catch (error) {
      console.error('Error en getClaseWithCurso:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener la clase con información del curso',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
}

export default new ClaseController();
