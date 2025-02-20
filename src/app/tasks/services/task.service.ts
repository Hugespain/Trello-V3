import { Injectable } from '@angular/core';
import { environments } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { map, Observable, BehaviorSubject, Subject } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { Task } from '../interfaces/task.interface';
import { TaskList } from '../interfaces/TaskList.interface';

@Injectable({ providedIn: 'root' })
export class TasksService {
  private baseUrl: string = environments.baseUrl;
  private taskUpdatedSubject = new BehaviorSubject<Task | null>(null);
  private taskDeletedSubject = new BehaviorSubject<number | null>(null);
  private taskCreatedSubject = new Subject<Task>();

  taskUpdated$ = this.taskUpdatedSubject.asObservable();
  taskDeleted$ = this.taskDeletedSubject.asObservable();
  taskCreated$ = this.taskCreatedSubject.asObservable();

  private categoriasSubject = new BehaviorSubject<{ id: number, nombre: string }[]>([]);
  public categorias$ = this.categoriasSubject.asObservable();

  constructor(private http: HttpClient) {
  }

  // Obtener todas las tareas
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/tasks`);
  }

  // Obtener una tarea por su ID
  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.baseUrl}/tasks/${id}`);
  }

  // Crear una nueva tarea
  createTask(task: Task): Observable<Task> {
    // Asigna 1 como listId por defecto si no se proporciona uno
    if (!task.listId) {
      task.listId = '1';
    }
    return this.http.post<Task>(`${this.baseUrl}/tasks`, task).pipe(
      tap(newTask => this.taskCreatedSubject.next(newTask)) // Emitir evento cuando se crea una nueva tarea
    );
  }

  // Actualizar una tarea existente
  updateTask(task: Task): Observable<Task> {
    return this.http.patch<Task>(`${this.baseUrl}/tasks/${task.id}`, task).pipe(
      tap(updatedTask => this.taskUpdatedSubject.next(updatedTask))
    );
  }

  // Eliminar una tarea
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/tasks/${id}`).pipe(
      tap(() => this.taskDeletedSubject.next(id))
    );
  }

  // Obtener todos los IDs disponibles
  getAvailableIds(): Observable<number[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/tasks`).pipe(
      map(tasks => tasks.map(task => task.id))
    );
  }

  //LISTA DE TAREAS
  //Servicio para crear Listas de tareas
  getTaskLists(): Observable<TaskList[]> {
    return this.http.get<TaskList[]>(`${this.baseUrl}/taskLists`);
  }

  getAvailableListIds(): Observable<string[]> {
    return this.http.get<TaskList[]>(`${this.baseUrl}/taskLists`).pipe(
      map(taskLists => taskLists.map(taskList => taskList.listId))
    );
  }

  createTaskList(taskList: TaskList): Observable<TaskList> {
    return this.http.post<TaskList>(`${this.baseUrl}/taskLists`, taskList);
  }

  updateTaskList(taskList: TaskList): Observable<TaskList> {
    return this.http.put<TaskList>(`${this.baseUrl}/taskLists/${taskList.listId}`, taskList);
  }

  deleteTaskList(listId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/taskLists/${listId}`);
  }

  // Servicio para encontrar una lista de tareas por su id
  getTaskListById(id: string): Observable<TaskList> {
    return this.http.get<TaskList>(`${this.baseUrl}/taskLists/${id}`);
  }

  // CATEGORÍAS
  // private loadCategorias(): void {
  //   this.http.get<{ id: number, nombre: string }[]>(`${this.baseUrl}/categorias`).subscribe(categorias => {
  //     this.categoriasSubject.next(categorias);
  //   });
  // }

  setCategorias(categorias: { id: string, nombre: string }[]): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/categorias`, categorias);
  }

  getCategorias(): Observable<{ id: string, nombre: string }[]> {
    return this.http.get<{ id: string, nombre: string }[]>(`${this.baseUrl}/categorias`);
  }

  addCategoria(nombre: string): Observable<void> {
    const newCategoria = { nombre };
    return this.http.post<void>(`${this.baseUrl}/categorias`, newCategoria);
  }

  deleteCategoriaById(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/categorias/${id}`);
  }

  updateCategoria(id: string, nombre: string): Observable<void> {
    const updatedCategoria = { nombre };
    return this.http.put<void>(`${this.baseUrl}/categorias/${id}`, updatedCategoria);
  }

  // Método para eliminar una categoría de una tarea específica
  removeCategoriaFromTask(taskId: string, categoria: string): Observable<Task> {
    return this.http.get<Task>(`${this.baseUrl}/tasks/${taskId}`).pipe(
      switchMap(task => {
        if (task.categoria) {
          task.categoria = task.categoria.filter(cat => cat !== categoria);
        }
        return this.updateTask(task);
      })
    );
  }


  //PERSONAS


// private loadPersonasAsignadas(): void {
//   this.http.get<{ id: number, nombre: string }[]>(`${this.baseUrl}/personasAsignadas`).subscribe(personasAsignadas => {
//     this.personasAsignadasSubject.next(personasAsignadas);
//   });
// }

setPersonas(personas: { id: string, nombre: string }[]): Observable<void> {
  return this.http.put<void>(`${this.baseUrl}/personas`, personas);
}

getPersonas(): Observable<{ id: string, nombre: string }[]> {
  return this.http.get<{ id: string, nombre: string }[]>(`${this.baseUrl}/personas`);
}

addPersona(nombre: string): Observable<void> {
  const newPersona = { nombre };
  return this.http.post<void>(`${this.baseUrl}/personas`, newPersona);
}

deletePersonaById(id: string): Observable<void> {
  return this.http.delete<void>(`${this.baseUrl}/personas/${id}`);
}

updatePersona(id: string, nombre: string): Observable<void> {
  const updatedPersona = { nombre };
  return this.http.put<void>(`${this.baseUrl}/personas/${id}`, updatedPersona);
}

// Método para eliminar una persona asignada de una tarea específica
removePersonaFromTask(taskId: string, persona: string): Observable<Task> {
  return this.http.get<Task>(`${this.baseUrl}/tasks/${taskId}`).pipe(
    switchMap(task => {
      if (task.personaAsignada) {
        task.personaAsignada = task.personaAsignada.filter(p => p !== persona);
      }
      return this.updateTask(task);
    })
  );
}

}
