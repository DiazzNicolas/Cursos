export interface Clase {
  id_clases: number;
  titulo: string;
  descripcion: string;
  duracion: number;
  curso_id: number;
}

export interface CreateClaseDTO {
  titulo: string;
  descripcion?: string;
  duracion?: number;
  curso_id: number;
}

export interface UpdateClaseDTO {
  titulo?: string;
  descripcion?: string;
  duracion?: number;
  curso_id?: number;
}
