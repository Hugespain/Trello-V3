import { Component, OnInit } from '@angular/core';
import { TasksService } from '../../services/task.service';
import { Task } from '../../interfaces/task.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.css']
})
export class EditPageComponent implements OnInit {

  availableIds: number[] = [];

  constructor(private fb: FormBuilder, private taskService: TasksService) {}

  public taskForm: FormGroup = this.fb.group({
    id: ['', Validators.required],
    estado: ['', Validators.required],
    personaAsignada: ['', [Validators.required, Validators.maxLength(20)]],
    description: ['', [Validators.required, Validators.maxLength(50)]],
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

    const task: Task = this.taskForm.value;
    this.taskService.updateTask(task).subscribe({
      next: response => {
        console.log('Tarea actualizada:', response);
        // Aquí puedes agregar lógica adicional, como redirigir al usuario o mostrar un mensaje de éxito
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

  onDelete(): void {
    if (this.taskForm.invalid) {
      return;
    }

    const id = this.taskForm.get('id')!.value;
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        console.log('Tarea eliminada');
        // Aquí puedes agregar lógica adicional, como redirigir al usuario o mostrar un mensaje de éxito
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
}
