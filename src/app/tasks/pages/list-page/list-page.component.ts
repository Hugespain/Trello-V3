// import { Component, OnInit } from '@angular/core';
// import { Task } from '../../interfaces/task.interface';
// import { TasksService } from '../../services/task.service';

// @Component({
//   selector: 'app-list-page',
//   templateUrl: './list-page.component.html',
//   styleUrls: ['./list-page.component.css']
// })
// export class ListPageComponent implements OnInit {

//   public tasksPendientes: Task[] = [];
//   public tasksEnProgreso: Task[] = [];
//   public tasksTerminadas: Task[] = [];

//   constructor(private taskService: TasksService) {}

//   ngOnInit(): void {
//     this.taskService.getTasks().subscribe(tasks => {
//       this.tasksPendientes = tasks.filter(task => task.estado === Estado.Pendiente);
//       this.tasksEnProgreso = tasks.filter(task => task.estado === Estado.Enprogreso);
//       this.tasksTerminadas = tasks.filter(task => task.estado === stado.Terminada);
//     });
//   }
// }




// import { Component, OnInit } from '@angular/core';
// import { Estado, Task } from '../../interfaces/task.interface';
// import { TasksService } from '../../services/task.service';
// import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

// @Component({
//   selector: 'app-list-page',
//   templateUrl: './list-page.component.html',
//   styleUrls: ['./list-page.component.css']
// })
// export class ListPageComponent implements OnInit {

//   public tasksPendientes: Task[] = [];
//   public tasksEnProgreso: Task[] = [];
//   public tasksTerminadas: Task[] = [];

//   public Estado = Estado;

//   constructor(private taskService: TasksService) {}

//   ngOnInit(): void {
//     this.taskService.getTasks().subscribe(tasks => {
//       this.tasksPendientes = tasks.filter(task => task.estado === Estado.Pendiente);
//       this.tasksEnProgreso = tasks.filter(task => task.estado === Estado.Enprogreso);
//       this.tasksTerminadas = tasks.filter(task => task.estado === Estado.Terminada);
//     });
//   }

//   drop(event: CdkDragDrop<Task[]>, newEstado: Estado): void {
//     if (event.previousContainer === event.container) {
//       moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
//     } else {
//       const task = event.previousContainer.data[event.previousIndex];
//       task.estado = newEstado;
//       transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
//       this.taskService.updateTask(task).subscribe();
//     }
//   }
// }


import { Component, OnInit } from '@angular/core';
import { Estado, Task } from '../../interfaces/task.interface';
import { TasksService } from '../../services/task.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.css']
})
export class ListPageComponent implements OnInit {

  public tasksPendientes: Task[] = [];
  public tasksEnProgreso: Task[] = [];
  public tasksTerminadas: Task[] = [];

  public Estado = Estado;

  constructor(private taskService: TasksService) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasksPendientes = tasks.filter(task => task.estado === Estado.Pendiente);
      this.tasksEnProgreso = tasks.filter(task => task.estado === Estado.Enprogreso);
      this.tasksTerminadas = tasks.filter(task => task.estado === Estado.Terminada);
    });
  }

  drop(event: CdkDragDrop<Task[]>, newEstado: Estado): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      task.estado = newEstado;
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      this.taskService.updateTask(task).subscribe(); // Actualiza el backend
    }
  }
}
