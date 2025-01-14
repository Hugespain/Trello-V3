export interface Task {
  id: number;
  listId: string;
  estado: Estado;
  personaAsignada: string;
  description: string;
  dificultad: Dificultad;
  categoria: Categoria;
}

export enum Estado {
  Pendiente = "Pendiente",
  Enprogreso = "En Progreso",
  Terminada = "Terminada",
}

export enum Dificultad {
  Facil = "Fácil",
  Media = "Media",
  Dificil = "Difícil",
}

export enum Categoria {
  Analizar = "Analizar",
  Codear = "Codear",
  Formacion = "Formación",
}
