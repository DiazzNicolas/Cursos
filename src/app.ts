import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Rutas
import cursoRoutes from './routes/curso.routes';
import claseRoutes from './routes/clase.routes'; // ✅ nuevo import

// Middlewares
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';

dotenv.config();

const app: Application = express();

// Middlewares de seguridad y parseo
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger simple
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Microservicio de Gestión de Cursos funcionando correctamente',
    timestamp: new Date().toISOString(),
    service: 'ms-gestion-cursos',
    version: '1.0.0'
  });
});

// ✅ Rutas principales
app.use('/api/cursos', cursoRoutes);
app.use('/api/clases', claseRoutes); // ✅ reemplaza a seccionRoutes

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API de Gestión de Cursos',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      cursos: '/api/cursos',
      clases: '/api/clases' // ✅ actualizado
    }
  });
});

// Manejo de errores
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
