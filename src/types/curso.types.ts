// =====================
// INTERFACES PRINCIPALES
// =====================

export interface Clase {
  id_clases?: number;
  titulo: string;
  descripcion?: string;
  duracion: number;
  curso_id: number;
}

export interface Curso {
  id?: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  creditos: number;
  horas_semanales: number;
  nivel?: string;
  area?: string;
  estado?: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';
  prerequisitos?: string[];
  capacidad_maxima?: number;
  created_at?: Date;
  updated_at?: Date;
  clases?: Clase[]; // Aquí vinculamos las clases al curso
}

// =====================
// DTO PARA CREAR Y ACTUALIZAR CURSOS
// =====================

export interface CreateCursoDTO {
  codigo: string;
  nombre: string;
  descripcion?: string;
  creditos: number;
  horas_semanales: number;
  nivel?: string;
  area?: string;
  prerequisitos?: string[];
  capacidad_maxima?: number;
}

export interface UpdateCursoDTO {
  nombre?: string;
  descripcion?: string;
  creditos?: number;
  horas_semanales?: number;
  nivel?: string;
  area?: string;
  estado?: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';
  prerequisitos?: string[];
  capacidad_maxima?: number;
}

// =====================
// DTO PARA CREAR Y ACTUALIZAR CLASES
// =====================

export interface CreateClaseDTO {
  titulo: string;
  descripcion?: string;
  duracion: number;
  curso_id: number;
}

export interface UpdateClaseDTO {
  titulo?: string;
  descripcion?: string;
  duracion?: number;
  curso_id?: number;
}
