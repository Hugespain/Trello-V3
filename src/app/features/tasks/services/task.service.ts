import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../interfaces/task.interface';
import { environments } from '../../../../environments/environments';

@Injectable({providedIn: 'root'})
export class TasksService {

  private baseUrl: string = environments.baseUrl;


  constructor(private http: HttpClient) { }

  getHeroes(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/tasks`);
  }
}
