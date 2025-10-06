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
}

export interface Seccion {
  id?: number;
  curso_id: number;
  codigo_seccion: string;
  periodo: string;
  profesor_id?: number;
  horario?: Record<string, string>;
  aula?: string;
  cupos_disponibles?: number;
  estado?: 'ABIERTA' | 'CERRADA' | 'CANCELADA';
  created_at?: Date;
  updated_at?: Date;
}

export interface CursoConSecciones extends Curso {
  secciones?: Seccion[];
}

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

export interface CreateSeccionDTO {
  curso_id: number;
  codigo_seccion: string;
  periodo: string;
  profesor_id?: number;
  horario?: Record<string, string>;
  aula?: string;
  cupos_disponibles?: number;
}

export interface UpdateSeccionDTO {
  profesor_id?: number;
  horario?: Record<string, string>;
  aula?: string;
  cupos_disponibles?: number;
  estado?: 'ABIERTA' | 'CERRADA' | 'CANCELADA';
}