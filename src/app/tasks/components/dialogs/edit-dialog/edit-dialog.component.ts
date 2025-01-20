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
      categoria: ['', Validators.required],
      subtasks: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.taskForm.patchValue(this.data);
    this.setSubtasks(this.data.subtasks || []);
  }

  // Método para inicializar las subtareas en el formulario
  setSubtasks(subtasks: Subtask[]): void {
    const subtaskFGs = subtasks.map(subtask => this.fb.group(subtask));
    const subtaskFormArray = this.fb.array(subtaskFGs);
    this.taskForm.setControl('subtasks', subtaskFormArray);
  }

  // Método para obtener el FormArray de subtareas
  get subtasks(): FormArray {
    return this.taskForm.get('subtasks') as FormArray;
  }

  // Método para añadir una nueva subtarea
  addSubtask(): void {
    this.subtasks.push(this.fb.group({
      description: ['', Validators.required],
      completed: [false]
    }));
  }

  // Método para eliminar una subtarea
  removeSubtask(index: number): void {
    this.subtasks.removeAt(index);
    this.taskForm.updateValueAndValidity(); // Actualizar el estado del formulario
  }

  // Método para verificar si se puede habilitar el botón de borrar
  canDeleteTask(): boolean {
    const subtasks = this.subtasks.value;
    return subtasks.length === 0 || subtasks.every((subtask: Subtask) => subtask.completed);
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
        this.taskService.updateTask(task).subscribe({
          next: response => {
            console.log('Tarea actualizada:', response);
            this.openSuccessDialog('Tarea editada correctamente con el ID: ' + response.id);
            this.dialogRef.close(); // Cerrar el diálogo después de actualizar
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
            this.dialogRef.close(); // Cerrar el diálogo después de eliminar
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
      categoria: ''
    });

    // Marcar todos los controles como intocados y prístinos
    Object.keys(this.taskForm.controls).forEach(key => {
      const control = this.taskForm.get(key);
      control?.setErrors(null); // Eliminar errores de validación
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
