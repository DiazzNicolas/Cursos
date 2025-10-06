import { Router } from 'express';
import ClaseController from '../controllers/clase.controller';

const router = Router();

/**
 * @route   GET /api/clases
 * @desc    Obtener todas las clases
 * @access  Public
 */
router.get('/', ClaseController.getAllClases);

/**
 * @route   GET /api/clases/curso/:cursoId
 * @desc    Obtener clases por curso
 * @access  Public
 */
router.get('/curso/:cursoId', ClaseController.getClasesByCurso);

/**
 * @route   GET /api/clases/:id
 * @desc    Obtener una clase por ID
 * @access  Public
 */
router.get('/:id', ClaseController.getClaseById);

/**
 * @route   POST /api/clases
 * @desc    Crear nueva clase
 * @access  Private
 */
router.post('/', ClaseController.createClase);

/**
 * @route   PUT /api/clases/:id
 * @desc    Actualizar clase existente
 * @access  Private
 */
router.put('/:id', ClaseController.updateClase);

/**
 * @route   DELETE /api/clases/:id
 * @desc    Eliminar clase
 * @access  Private
 */
router.delete('/:id', ClaseController.deleteClase);

export default router;
