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
import { MatDialog } from '@angular/material/dialog';
import { EditDialogComponent } from '../../components/dialogs/edit-dialog/edit-dialog.component';

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

  constructor(private taskService: TasksService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadTasks();

    this.taskService.taskUpdated$.subscribe(updatedTask => {
      if (updatedTask) {
        this.updateTaskInList(updatedTask);
      }
    });

    this.taskService.taskDeleted$.subscribe(deletedTaskId => {
      if (deletedTaskId) {
        this.removeTaskFromList(deletedTaskId);
      }
    });
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasksPendientes = tasks.filter(task => task.estado === Estado.Pendiente);
      this.tasksEnProgreso = tasks.filter(task => task.estado === Estado.Enprogreso);
      this.tasksTerminadas = tasks.filter(task => task.estado === Estado.Terminada);
    });
  }

  updateTaskInList(updatedTask: Task): void {
    this.removeTaskFromList(updatedTask.id); // Elimina la tarea de su columna actual

    // Añade la tarea a la columna correspondiente basada en su nuevo estado
    if (updatedTask.estado === Estado.Pendiente) {
      this.tasksPendientes.push(updatedTask);
    } else if (updatedTask.estado === Estado.Enprogreso) {
      this.tasksEnProgreso.push(updatedTask);
    } else if (updatedTask.estado === Estado.Terminada) {
      this.tasksTerminadas.push(updatedTask);
    }
  }

  removeTaskFromList(deletedTaskId: number): void {
    const removeTaskFromArray = (tasks: Task[]) => {
      const index = tasks.findIndex(task => task.id === deletedTaskId);
      if (index !== -1) {
        tasks.splice(index, 1);
      }
    };

    removeTaskFromArray(this.tasksPendientes);
    removeTaskFromArray(this.tasksEnProgreso);
    removeTaskFromArray(this.tasksTerminadas);
  }

  drop(event: CdkDragDrop<Task[]>, newEstado: Estado): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      task.estado = newEstado;
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      this.taskService.updateTask(task).subscribe();
    }
  }

  Openpopup(task: Task): void {
    this.dialog.open(EditDialogComponent, {
      width: '60%',
      height: '700px',
      enterAnimationDuration: '500ms',
      data: task
    });
  }
}
