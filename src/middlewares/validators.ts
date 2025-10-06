import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: errors.array()
    });
    return;
  }
  next();
};

export const validateCurso = [
  body('codigo')
    .trim()
    .notEmpty().withMessage('El código del curso es requerido')
    .isLength({ max: 20 }).withMessage('El código no puede exceder 20 caracteres'),
  
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre del curso es requerido')
    .isLength({ max: 200 }).withMessage('El nombre no puede exceder 200 caracteres'),
  
  body('descripcion')
    .optional()
    .trim(),
  
  body('creditos')
    .notEmpty().withMessage('Los créditos son requeridos')
    .isInt({ min: 1, max: 10 }).withMessage('Los créditos deben estar entre 1 y 10'),
  
  body('horas_semanales')
    .notEmpty().withMessage('Las horas semanales son requeridas')
    .isInt({ min: 1, max: 20 }).withMessage('Las horas semanales deben estar entre 1 y 20'),
  
  body('nivel')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('El nivel no puede exceder 50 caracteres'),
  
  body('area')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('El área no puede exceder 100 caracteres'),
  
  body('prerequisitos')
    .optional()
    .isArray().withMessage('Los prerequisitos deben ser un array'),
  
  body('capacidad_maxima')
    .optional()
    .isInt({ min: 1, max: 200 }).withMessage('La capacidad máxima debe estar entre 1 y 200'),
  
  handleValidationErrors
];

export const validateUpdateCurso = [
  body('codigo')
    .optional()
    .trim()
    .isLength({ max: 20 }).withMessage('El código no puede exceder 20 caracteres'),
  
  body('nombre')
    .optional()
    .trim()
    .notEmpty().withMessage('El nombre no puede estar vacío')
    .isLength({ max: 200 }).withMessage('El nombre no puede exceder 200 caracteres'),
  
  body('descripcion')
    .optional()
    .trim(),
  
  body('creditos')
    .optional()
    .isInt({ min: 1, max: 10 }).withMessage('Los créditos deben estar entre 1 y 10'),
  
  body('horas_semanales')
    .optional()
    .isInt({ min: 1, max: 20 }).withMessage('Las horas semanales deben estar entre 1 y 20'),
  
  body('nivel')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('El nivel no puede exceder 50 caracteres'),
  
  body('area')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('El área no puede exceder 100 caracteres'),
  
  body('estado')
    .optional()
    .isIn(['ACTIVO', 'INACTIVO', 'SUSPENDIDO']).withMessage('Estado inválido'),
  
  body('prerequisitos')
    .optional()
    .isArray().withMessage('Los prerequisitos deben ser un array'),
  
  body('capacidad_maxima')
    .optional()
    .isInt({ min: 1, max: 200 }).withMessage('La capacidad máxima debe estar entre 1 y 200'),
  
  handleValidationErrors
];

export const validateSeccion = [
  body('curso_id')
    .notEmpty().withMessage('El ID del curso es requerido')
    .isInt({ min: 1 }).withMessage('El ID del curso debe ser un número válido'),
  
  body('codigo_seccion')
    .trim()
    .notEmpty().withMessage('El código de sección es requerido')
    .isLength({ max: 10 }).withMessage('El código de sección no puede exceder 10 caracteres'),
  
  body('periodo')
    .trim()
    .notEmpty().withMessage('El periodo es requerido')
    .matches(/^\d{4}-[12]$/).withMessage('El periodo debe tener formato YYYY-1 o YYYY-2'),
  
  body('profesor_id')
    .optional()
    .isInt({ min: 1 }).withMessage('El ID del profesor debe ser un número válido'),
  
  body('horario')
    .optional()
    .isObject().withMessage('El horario debe ser un objeto'),
  
  body('aula')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('El aula no puede exceder 50 caracteres'),
  
  body('cupos_disponibles')
    .optional()
    .isInt({ min: 0, max: 200 }).withMessage('Los cupos disponibles deben estar entre 0 y 200'),
  
  handleValidationErrors
];

export const validateUpdateSeccion = [
  body('profesor_id')
    .optional()
    .isInt({ min: 1 }).withMessage('El ID del profesor debe ser un número válido'),
  
  body('horario')
    .optional()
    .isObject().withMessage('El horario debe ser un objeto'),
  
  body('aula')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('El aula no puede exceder 50 caracteres'),
  
  body('cupos_disponibles')
    .optional()
    .isInt({ min: 0, max: 200 }).withMessage('Los cupos disponibles deben estar entre 0 y 200'),
  
  body('estado')
    .optional()
    .isIn(['ABIERTA', 'CERRADA', 'CANCELADA']).withMessage('Estado inválido'),
  
  handleValidationErrors
];