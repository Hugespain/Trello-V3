import { Component, OnInit } from '@angular/core';
import { TasksService } from '../../services/task.service';
import { Task } from '../../interfaces/task.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from '../../components/dialogs/success-dialog/success-dialog.component';
import { ConfirmDialogComponent } from '../../components/dialogs/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.css']
})
export class EditPageComponent implements OnInit {

  availableIds: number[] = [];

  constructor(private fb: FormBuilder, private taskService: TasksService, public dialog: MatDialog) {}

  public taskForm: FormGroup = this.fb.group({
    id: ['', Validators.required],
    estado: ['', Validators.required],
    personaAsignada: ['', [Validators.required, Validators.maxLength(20)]],
    description: ['', [Validators.required, Validators.maxLength(100)]],
    dificultad: ['', Validators.required],
    categoria: ['', Validators.required]
  });

  ngOnInit(): void {
    this.taskService.getAvailableIds().subscribe(ids => {
      this.availableIds = ids;
    });
  }

  // Método para manejar la selección del ID
  onIdSelection(id: number): void {
    if (id) {
      this.taskService.getTaskById(id).subscribe(task => {
        if (task) {
          this.taskForm.patchValue(task);
        }
      });
    }
  }

  onUpdate(): void {
    if (this.taskForm.invalid) {
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
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
            // Aquí puedes manejar el error, como mostrar un mensaje de error al usuario
          },
          complete: () => {
            console.log('Operación completada');
            // Aquí puedes agregar lógica adicional que se ejecutará cuando la operación se complete
          }
        });

        this.resetForm();
      }
    });
  }

  onDelete(): void {
    if (this.taskForm.invalid) {
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
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
            // Aquí puedes manejar el error, como mostrar un mensaje de error al usuario
          },
          complete: () => {
            console.log('Operación completada');
            // Aquí puedes agregar lógica adicional que se ejecutará cuando la operación se complete
          }
        });

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
