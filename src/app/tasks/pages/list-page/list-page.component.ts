import { Component, OnInit } from '@angular/core';
import { Estado, Task } from '../../interfaces/task.interface';
import { TasksService } from '../../services/task.service';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.css']
})
export class ListPageComponent implements OnInit {

  public tasksPendientes: Task[] = [];
  public tasksEnProgreso: Task[] = [];
  public tasksTerminadas: Task[] = [];

  constructor(private taskService: TasksService) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasksPendientes = tasks.filter(task => task.estado === Estado.Pendiente);
      this.tasksEnProgreso = tasks.filter(task => task.estado === Estado.Enprogreso);
      this.tasksTerminadas = tasks.filter(task => task.estado === Estado.Terminada);
    });
  }
}
