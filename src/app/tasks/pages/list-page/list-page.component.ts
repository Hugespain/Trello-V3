import { Component, OnInit } from '@angular/core';
import { Task } from '../../interfaces/task.interface';
import { TasksService } from '../../services/task.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { EditDialogComponent } from '../../components/dialogs/edit-dialog/edit-dialog.component';
import { TaskList } from '../../interfaces/TaskList.interface';
import { NewtaskDialogComponent } from '../../components/dialogs/newtask-dialog/newtask-dialog.component';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.css']
})
export class ListPageComponent implements OnInit {

  public taskLists: TaskList[] = [];

  public connectedTo: string[] = [];

  public searchText: string = '';

  constructor(private taskService: TasksService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadTaskLists();
    this.updateConnectedTo();


    // Suscripción a los cambios en las tareas
    this.taskService.taskUpdated$.subscribe((updatedTask: Task | null) => {
      if (updatedTask) {
        this.updateTaskInList(updatedTask);
      }
    });

    // Suscripción a la eliminación de tareas
    this.taskService.taskDeleted$.subscribe((deletedTaskId: number | null) => {
      if (deletedTaskId) {
        this.removeTaskFromList(deletedTaskId);
      }
    });

    // Suscripción a la creación de nuevas tareas
    this.taskService.taskCreated$.subscribe((newTask: Task) => {
      const list = this.taskLists.find(list => list.listId === newTask.listId);
      if (list) {
        list.tasks.push(newTask);
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
    this.removeTaskFromList(updatedTask.id);

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

  removeTaskList(taskList: TaskList): void {
    // Verificar si la lista de tareas está vacía
    if (taskList.tasks && taskList.tasks.length > 0) {
      console.warn('No se puede eliminar una lista que contiene tareas.');
      return;
    }

    // Verificar si el ID de la lista de tareas está definido
    if (!taskList.id) {
      console.error('El ID de la lista de tareas no está definido.');
      return;
    }

    // Eliminar la lista de tareas
    this.taskService.deleteTaskList(taskList.id).subscribe({
      next: () => {
        const index = this.taskLists.findIndex(list => list.id === taskList.id);
        if (index !== -1) {
          this.taskLists.splice(index, 1);
          this.updateConnectedTo();
        }
      },
      error: (err) => {
        console.error('Error al eliminar la lista de tareas:', err);
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

  addTask(listId: string): void {
    this.dialog.open(NewtaskDialogComponent, {
      width: '600px',
      maxHeight: '90vh',
      enterAnimationDuration: '500ms',
      data: { listId },
      panelClass: 'custom-dialog-container'
    });
  }

  addTaskList(): void {
    const name = prompt('Introduce el nombre de la nueva lista:');
    if (name) {
      const newList: TaskList = { listId: this.generateId(), name, tasks: [] };
      this.taskService.createTaskList(newList).subscribe({
        next: () => {
          this.taskLists.push(newList); // Mantener el push
          this.loadTaskLists(); // Llamar a loadTaskLists después de crear la nueva lista
          this.updateConnectedTo();
        },
        error: err => {
          console.error('Error al crear la nueva lista:', err);
        }
      });
    }
  }

  //FILTRO DE TAREAS
  filterTasks(searchText: string): void {
    this.searchText = searchText;
    console.log(this.searchText);
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
