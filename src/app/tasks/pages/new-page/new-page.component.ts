import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TasksService } from '../../services/task.service';
import { Task } from '../../interfaces/task.interface';
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from '../../components/dialogs/success-dialog/success-dialog.component';


@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styleUrls: ['./new-page.component.css']
})
export class NewPageComponent {

  constructor(private fb: FormBuilder, private taskService: TasksService, public dialog: MatDialog) {}

  public taskForm: FormGroup = this.fb.group({
    estado: ['', Validators.required],
    personaAsignada: ['', [Validators.required, Validators.maxLength(20)]],
    description: ['', [Validators.required, Validators.maxLength(100)]],
    dificultad: ['', Validators.required],
    categoria: ['', Validators.required]
  });

  onSave(): void {
    if (this.taskForm.invalid) {
      return;
    }

    const task: Task = this.taskForm.value;
    this.taskService.createTask(task).subscribe({
      next: response => {
        console.log('Tarea creada:', response);
        this.openSuccessDialog(`Tarea creada correctamente con ID ${response.id}.`);
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
      width: '400px',
      data: { message }
    });
  }
}
