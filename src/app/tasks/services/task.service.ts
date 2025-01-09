// import { Injectable } from '@angular/core';
// import { environments } from '../../../environments/environments';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { Task } from '../interfaces/task.interface';

// @Injectable({providedIn: 'root'})
// export class TasksService {
//   private baseUrl: string = environments.baseUrl;

//   constructor(private http: HttpClient) {}

//   getTasks(): Observable<Task[]> {
//   return this.http.get<Task[]>(`${this.baseUrl}/tasks`);
//   }
// }


// import { Injectable } from '@angular/core';
// import { environments } from '../../../environments/environments';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { Task } from '../interfaces/task.interface';

// @Injectable({providedIn: 'root'})
// export class TasksService {
//   private baseUrl: string = environments.baseUrl;

//   constructor(private http: HttpClient) {}

//   getTasks(): Observable<Task[]> {
//   return this.http.get<Task[]>(`${this.baseUrl}/tasks`);
//   }
// }

import { Injectable } from '@angular/core';
import { environments } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { map, Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Task } from '../interfaces/task.interface';

@Injectable({ providedIn: 'root' })
export class TasksService {
  private baseUrl: string = environments.baseUrl;
  private taskUpdatedSubject = new BehaviorSubject<Task | null>(null);
  private taskDeletedSubject = new BehaviorSubject<number | null>(null);

  taskUpdated$ = this.taskUpdatedSubject.asObservable();
  taskDeleted$ = this.taskDeletedSubject.asObservable();

  constructor(private http: HttpClient) {}

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
    return this.http.post<Task>(`${this.baseUrl}/tasks`, task);
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
}
