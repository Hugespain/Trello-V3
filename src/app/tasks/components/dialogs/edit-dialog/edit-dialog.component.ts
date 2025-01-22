import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { TasksService } from '../../../services/task.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Task, Subtask } from '../../../interfaces/task.interface';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.css']
})
export class EditDialogComponent implements OnInit {

  public taskForm: FormGroup;
  public availableCategorias: { id: string, nombre: string }[] = [];
  public availableIds: number[] = []; // Añadir esta línea

  constructor(
    private fb: FormBuilder,
    private taskService: TasksService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Task
  ) {
    this.taskForm = this.fb.group({
      id: [{ value: '', disabled: true }, Validators.required],
      estado: ['', Validators.required],
      personaAsignada: ['', [Validators.required, Validators.maxLength(20)]],
      description: ['', [Validators.maxLength(100)]],
      dificultad: ['', Validators.required],
      categorias: this.fb.array([]),
      subtasks: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.taskForm.patchValue(this.data);
    this.setSubtasks(this.data.subtasks || []);
    this.setCategorias(this.data.categoria || []);
    this.loadAvailableCategorias();
    this.loadAvailableIds(); // Añadir esta línea
  }

  loadAvailableCategorias(): void {
    this.taskService.getCategorias().subscribe(categorias => {
      this.availableCategorias = categorias;
    });
  }

  loadAvailableIds(): void { // Añadir este método
    this.taskService.getAvailableIds().subscribe(ids => {
      this.availableIds = ids;
    });
  }

  setCategorias(categorias: string[]): void {
    const categoriaFGs = categorias.map(categoria => this.fb.control(categoria));
    const categoriaFormArray = this.fb.array(categoriaFGs);
    this.taskForm.setControl('categorias', categoriaFormArray);
  }

  get categorias(): FormArray {
    return this.taskForm.get('categorias') as FormArray;
  }

  setSubtasks(subtasks: Subtask[]): void {
    const subtaskFGs = subtasks.map(subtask => this.fb.group(subtask));
    const subtaskFormArray = this.fb.array(subtaskFGs);
    this.taskForm.setControl('subtasks', subtaskFormArray);
  }

  get subtasks(): FormArray {
    return this.taskForm.get('subtasks') as FormArray;
  }

  addSubtask(): void {
    this.subtasks.push(this.fb.group({
      description: ['', Validators.required],
      completed: [false]
    }));
  }

  removeSubtask(index: number): void {
    this.subtasks.removeAt(index);
    this.taskForm.updateValueAndValidity();
  }

  canDeleteTask(): boolean {
    const subtasks = this.subtasks.value;
    return subtasks.length === 0 || subtasks.every((subtask: Subtask) => subtask.completed);
  }

  removeCategoria(categoria: string): void {
    const categorias = this.categorias.value as string[];
    const updatedCategorias = categorias.filter(cat => cat !== categoria);
    this.setCategorias(updatedCategorias);
  }

  addCategoria(categoria: string): void {
    if (categoria && !this.categorias.value.includes(categoria)) {
      this.categorias.push(this.fb.control(categoria));
    }
  }

  onIdSelection(id: number): void { // Añadir este método
    if (id) {
      this.taskService.getTaskById(id).subscribe(task => {
        if (task) {
          this.taskForm.patchValue(task);
          this.setCategorias(task.categoria || []);
        }
      });
    }
  }

  onUpdate(): void {
    if (this.taskForm.invalid) {
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { message: '¿Estás seguro de que deseas editar esta tarea?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const task: Task = this.taskForm.getRawValue();
        task.categoria = this.categorias.value; // Asegúrate de que las categorías se incluyen en el objeto task

        this.taskService.updateTask(task).subscribe({
          next: response => {
            console.log('Tarea actualizada:', response);
            this.openSuccessDialog('Tarea editada correctamente con el ID: ' + response.id);
            this.dialogRef.close();
          },
          error: error => {
            console.error('Error al actualizar la tarea:', error);
          },
          complete: () => {
            console.log('Operación completada');
          }
        });

        this.resetForm();
      } else {
        this.resetForm();
      }
    });
  }

  onDelete(): void {
    if (this.taskForm.invalid) {
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { message: '¿Estás seguro de que deseas eliminar esta tarea?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const id = this.taskForm.get('id')!.value;
        this.taskService.deleteTask(id).subscribe({
          next: () => {
            console.log('Tarea eliminada');
            this.openSuccessDialog('Tarea eliminada correctamente.');
            this.dialogRef.close();
          },
          error: error => {
            console.error('Error al eliminar la tarea:', error);
          },
          complete: () => {
            console.log('Operación completada');
          }
        });

        this.resetForm();
      } else {
        this.resetForm();
      }
    });
  }

  private resetForm(): void {
    this.taskForm.reset({
      id: '',
      estado: '',
      personaAsignada: '',
      description: '',
      dificultad: '',
      categorias: []
    });

    Object.keys(this.taskForm.controls).forEach(key => {
      const control = this.taskForm.get(key);
      control?.setErrors(null);
      control?.markAsPristine();
      control?.markAsUntouched();
    });
  }

  private openSuccessDialog(message: string): void {
    this.dialog.open(SuccessDialogComponent, {
      width: '250px',
      data: { message }
    });
  }
}
