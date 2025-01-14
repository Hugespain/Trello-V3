
import { Component, OnInit } from '@angular/core';
import { Task } from '../../interfaces/task.interface';
import { TasksService } from '../../services/task.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { EditDialogComponent } from '../../components/dialogs/edit-dialog/edit-dialog.component';
import { TaskList } from '../../interfaces/TaskList.interface';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.css']
})
export class ListPageComponent implements OnInit {

  public taskLists: TaskList[] = [
    { listId: '1', name: 'Pendientes', tasks: [] },
    { listId: '2', name: 'En Progreso', tasks: [] },
    { listId: '3', name: 'Terminadas', tasks: [] }
  ];

  public connectedTo: string[] = [];

  constructor(private taskService: TasksService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadTasks();
    this.loadTaskLists();
    this.updateConnectedTo();

    this.taskService.taskUpdated$.subscribe((updatedTask: Task | null) => {
      if (updatedTask) {
        this.updateTaskInList(updatedTask);
      }
    });

    this.taskService.taskDeleted$.subscribe((deletedTaskId: number | null) => {
      if (deletedTaskId) {
        this.removeTaskFromList(deletedTaskId);
      }
    });
  }

  loadTaskLists(): void {
    this.taskService.getTaskLists().subscribe((taskLists: TaskList[]) => {
      this.taskLists = taskLists;
      this.loadTasks();
    });
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe((tasks: Task[]) => {
      this.taskLists.forEach(list => {
        list.tasks = tasks.filter(task => task.listId === list.listId);
      });
    });
  }

  updateTaskInList(updatedTask: Task): void {
    this.removeTaskFromList(updatedTask.id); // Elimina la tarea de su columna actual

    // Añade la tarea a la columna correspondiente basada en su nuevo listId
    const list = this.taskLists.find(list => list.listId === updatedTask.listId);
    if (list) {
      list.tasks.push(updatedTask);
    }
  }

  removeTaskFromList(deletedTaskId: number): void {
    this.taskLists.forEach(list => {
      const index = list.tasks.findIndex((task: Task) => task.id === deletedTaskId);
      if (index !== -1) {
        list.tasks.splice(index, 1);
      }
    });
  }

  drop(event: CdkDragDrop<Task[]>, newListId: string): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      task.listId = newListId;
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      this.taskService.updateTask(task).subscribe();
    }
  }

  addTaskList(): void {
    const name = prompt('Introduce el nombre de la nueva lista:');
    if (name) {
      const newList: TaskList = { listId: this.generateId(), name, tasks: [] };
      this.taskService.createTaskList(newList).subscribe({
        next: () => {
          this.taskLists.push(newList);
          this.updateConnectedTo();
        },
        error: err => {
          console.error('Error al crear la nueva lista:', err);
        }
      });
    }
  }

  removeTaskList(listId: string): void {
    const index = this.taskLists.findIndex(list => list.listId === listId);
    if (index !== -1) {
      this.taskLists.splice(index, 1);
      this.updateConnectedTo();
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private updateConnectedTo(): void {
    this.connectedTo = this.taskLists.map(list => list.listId);
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
