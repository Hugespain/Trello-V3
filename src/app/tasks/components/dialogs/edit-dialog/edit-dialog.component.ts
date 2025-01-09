import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TasksService } from '../../../services/task.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from '../../../interfaces/task.interface';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.css']
})
export class EditDialogComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private taskService: TasksService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: Task
  ) {}

  public taskForm: FormGroup = this.fb.group({
    id: ['', Validators.required],
    estado: ['', Validators.required],
    personaAsignada: ['', [Validators.required, Validators.maxLength(20)]],
    description: ['', [Validators.maxLength(100)]],
    dificultad: ['', Validators.required],
    categoria: ['', Validators.required]
  });

  ngOnInit(): void {
    this.taskForm.patchValue(this.data);
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
        const task: Task = this.taskForm.value;
        this.taskService.updateTask(task).subscribe({
          next: response => {
            console.log('Tarea actualizada:', response);
            this.openSuccessDialog('Tarea editada correctamente con el ID: ' + response.id);
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
