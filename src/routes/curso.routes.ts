import { Router } from 'express';
import CursoController from '../controllers/curso.controller';
import { validateCurso, validateUpdateCurso } from '../middlewares/validators';

const router = Router();

/**
 * ============================
 * RUTAS DE CURSOS
 * ============================
 */

/**
 * @route   GET /api/cursos
 * @desc    Obtener todos los cursos
 * @access  Public
 */
router.get('/', CursoController.getAllCursos);

/**
 * @route   GET /api/cursos/search
 * @desc    Buscar cursos por término
 * @access  Public
 */
router.get('/search', CursoController.searchCursos);

/**
 * @route   GET /api/cursos/estadisticas/por-area
 * @desc    Obtener estadísticas de cursos por área
 * @access  Public
 */
router.get('/estadisticas/por-area', CursoController.getEstadisticasPorArea);

/**
 * @route   GET /api/cursos/area/:area
 * @desc    Obtener cursos por área
 * @access  Public
 */
router.get('/area/:area', CursoController.getCursosByArea);

/**
 * @route   GET /api/cursos/codigo/:codigo
 * @desc    Obtener curso por código
 * @access  Public
 */
router.get('/codigo/:codigo', CursoController.getCursoByCodigo);

/**
 * @route   GET /api/cursos/:id
 * @desc    Obtener curso por ID
 * @access  Public
 */
router.get('/:id', CursoController.getCursoById);

/**
 * @route   GET /api/cursos/:id/clases
 * @desc    Obtener curso con sus clases
 * @access  Public
 */
router.get('/:id/clases', CursoController.getCursoWithClases);

/**
 * @route   POST /api/cursos
 * @desc    Crear nuevo curso
 * @access  Private
 */
router.post('/', validateCurso, CursoController.createCurso);

/**
 * @route   PUT /api/cursos/:id
 * @desc    Actualizar curso
 * @access  Private
 */
router.put('/:id', validateUpdateCurso, CursoController.updateCurso);

/**
 * @route   DELETE /api/cursos/:id
 * @desc    Eliminar curso
 * @access  Private
 */
router.delete('/:id', CursoController.deleteCurso);

/**
 * @route   POST /api/cursos/:id/clases
 * @desc    Crear nueva clase en un curso
 * @access  Private
 */
router.post('/:id/clases', CursoController.createClase);

/**
 * @route   PUT /api/clases/:id
 * @desc    Actualizar clase por ID
 * @access  Private
 */
router.put('/clases/:id', CursoController.updateClase);

/**
 * @route   DELETE /api/clases/:id
 * @desc    Eliminar clase por ID
 * @access  Private
 */
router.delete('/clases/:id', CursoController.deleteClase);

export default router;
