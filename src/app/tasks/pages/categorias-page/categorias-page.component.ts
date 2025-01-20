import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TasksService } from '../../services/task.service';
import { MatDialog } from '@angular/material/dialog';
import { Task } from '../../interfaces/task.interface';
import { SuccessDialogComponent } from '../../components/dialogs/success-dialog/success-dialog.component';

@Component({
  selector: 'app-categorias-page',
  templateUrl: './categorias-page.component.html',
  styleUrls: ['./categorias-page.component.css']
})
export class CategoriasPageComponent implements OnInit {
  public taskForm: FormGroup;
  public categorias: string[] = [];

  constructor(private fb: FormBuilder, private taskService: TasksService, public dialog: MatDialog) {
    this.taskForm = this.fb.group({
      categoria: [''],
      crearCategoria: ['', [Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {
    this.loadCategorias();
  }

  private loadCategorias(): void {
    this.taskService.getTasks().subscribe((tasks: Task[]) => {
      const categoriasSet = new Set<string>();
      tasks.forEach(task => {
        if (task.categoria) {
          if (Array.isArray(task.categoria)) {
            task.categoria.forEach(categoria => categoriasSet.add(categoria));
          } else {
            categoriasSet.add(task.categoria);
          }
        }
      });
      this.categorias = Array.from(categoriasSet);
    });
  }

  private resetForm(): void {
    this.taskForm.reset({
      categoria: '',
      crearCategoria: ''
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

  public onSubmit(): void {
    if (this.taskForm.valid) {
      const nuevaCategoria = this.taskForm.value.crearCategoria;
      if (nuevaCategoria && !this.categorias.includes(nuevaCategoria)) {
        this.taskService.getTasks().subscribe((tasks: Task[]) => {
          tasks.forEach(task => {
            if (Array.isArray(task.categoria)) {
              task.categoria.push(nuevaCategoria);
            } else if (task.categoria) {
              task.categoria = [task.categoria, nuevaCategoria];
            } else {
              task.categoria = [nuevaCategoria];
            }

            // Actualizar la tarea en el servidor
            this.taskService.updateTask(task).subscribe();
          });

          // Actualizar la lista de categorías en el formulario
          this.categorias.push(nuevaCategoria);

          // Mostrar el diálogo de éxito
          this.openSuccessDialog('Categoría guardada con éxito');
          this.resetForm();
        });
      } else {
        this.openSuccessDialog('La categoría ya existe o no es válida');
      }
    }
  }

  public removeCategoria(categoria: string): void {
    if (categoria) {
      this.taskService.getTasks().subscribe((tasks: Task[]) => {
        const tasksToUpdate = tasks.filter(task => {
          if (task.categoria) {
            if (Array.isArray(task.categoria)) {
              return task.categoria.includes(categoria);
            } else {
              return task.categoria === categoria;
            }
          }
          return false;
        });

        tasksToUpdate.forEach(task => {
          if (Array.isArray(task.categoria)) {
            task.categoria = task.categoria.filter(cat => cat !== categoria);
          } else if (task.categoria === categoria) {
            task.categoria = [];
          }

          // Actualizar la tarea en el servidor
          this.taskService.updateTask(task).subscribe();
        });

        // Actualizar la lista de categorías en el formulario
        this.categorias = this.categorias.filter(cat => cat !== categoria);

        // Mostrar el diálogo de éxito
        this.openSuccessDialog('Categoría eliminada con éxito');
      });
    } else {
      this.openSuccessDialog('No se seleccionó ninguna categoría para eliminar');
    }
  }}
