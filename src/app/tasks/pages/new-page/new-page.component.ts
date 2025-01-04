import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { TasksService } from '../../services/task.service';
import { Task } from '../../interfaces/task.interface';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styleUrl: './new-page.component.css'
})
export class NewPageComponent  {

  constructor(private fb: FormBuilder,  private taskService: TasksService) {}

  public taskForm: FormGroup = this.fb.group({
      estado: ['', Validators.required],
      personaAsignada: ['', Validators.required, Validators.maxLength(20)],
      description: ['', Validators.required, Validators.maxLength(50)],
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
        // Aquí puedes agregar lógica adicional, como redirigir al usuario o mostrar un mensaje de éxito
      },
      error: error => {
        console.error('Error al crear la tarea:', error);
        // Aquí puedes manejar el error, como mostrar un mensaje de error al usuario
      },
      complete: () => {
        console.log('Operación completada');
        // Aquí puedes agregar lógica adicional que se ejecutará cuando la operación se complete
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
}
