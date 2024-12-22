import { Injectable } from '@angular/core';
import { environments } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../interfaces/task.interface';

@Injectable({providedIn: 'root'})
export class TasksService {
  private baseUrl: string = environments.baseUrl;

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
  return this.http.get<Task[]>(`${this.baseUrl}/tasks`);
  }
}
