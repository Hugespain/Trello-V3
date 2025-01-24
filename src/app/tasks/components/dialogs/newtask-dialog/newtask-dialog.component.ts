import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TasksService } from '../../../services/task.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from '../../../interfaces/task.interface';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';

@Component({
  selector: 'app-newtask-dialog',
  templateUrl: './newtask-dialog.component.html',
  styleUrls: ['./newtask-dialog.component.css']
})
export class NewtaskDialogComponent {

  constructor(
    private fb: FormBuilder,
    private taskService: TasksService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<NewtaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { listId: string }
  ) {}

  public taskForm: FormGroup = this.fb.group({
    estado: ['', Validators.required],
    description: ['', [Validators.maxLength(100)]],
    dificultad: ['', Validators.required],
  });

  onSave(): void {
    if (this.taskForm.invalid) {
      return;
    }

    const task: Task = { ...this.taskForm.value, listId: this.data.listId };
    this.taskService.createTask(task).subscribe({
      next: response => {
        console.log('Tarea creada:', response);
        this.openSuccessDialog(`Tarea creada correctamente con ID ${response.id}.`);
        this.dialogRef.close(response); // Cerrar el diálogo después de crear la tarea y pasar la tarea creada
      },
      error: error => {
        console.error('Error al crear la tarea:', error);
      },
      complete: () => {
        console.log('Operación completada');
      }
    });

    this.resetForm();
  }

  private resetForm(): void {
    this.taskForm.reset({
      estado: '',
      personaAsignada: '',
      description: '',
      dificultad: '',
      categoria: ''
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
      width: '400px',
      data: { message }
    });
  }
}
