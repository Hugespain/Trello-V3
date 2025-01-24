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
  public availableIds: number[] = [];
  public availablePersonas: {id: string, nombre: string}[] = [];

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
      personaAsignada: this.fb.array([]),
      description: ['', [Validators.maxLength(100)]],
      dificultad: ['', Validators.required],
      categoria: this.fb.array([]), // Campo para la categoría específica de la tarea
      subtasks: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.taskForm.patchValue(this.data);
    this.setSubtasks(this.data.subtasks || []);
    this.setCategorias(this.data.categoria || []);
    this.loadAvailableCategorias();
    this.loadAvailableIds();
    this.setPersonas(this.data.personaAsignada|| []);
    this.loadAvailablePersonas();
  }

  //TASKS
  onIdSelection(id: number): void {
    if (id) {
      this.taskService.getTaskById(id).subscribe(task => {
        if (task) {
          this.taskForm.patchValue(task);
          this.setCategorias(task.categoria || []); // Usar 'categoria' en lugar de 'categorias'
        }
      });
    }
  }

  loadAvailableIds(): void {
    this.taskService.getAvailableIds().subscribe(ids => {
      this.availableIds = ids;
    });
  }

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
        task.categoria = this.categoria.value; // Usar 'categoria' en lugar de 'categorias'
        task.personaAsignada = this.personaAsignada.value; //Ahora también debe actualizar la persona asignada


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

  //SUBTASKS
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

  //CATEGORIAS
  loadAvailableCategorias(): void {
    this.taskService.getCategorias().subscribe(categorias => {
      this.availableCategorias = categorias;
    });
  }

  //Convierte las categorias disponibles en un FormArray de FormControl
  //para que puedan ser gestionadas dentro del formulario reactivo.
  setCategorias(categorias: string[]): void {
    const categoriaFGs = categorias.map(categoria => this.fb.control(categoria));
    const categoriaFormArray = this.fb.array(categoriaFGs);
    this.taskForm.setControl('categoria', categoriaFormArray);
  }

  get categoria(): FormArray {
    return this.taskForm.get('categoria') as FormArray;
  }


  removeCategoria(categoria: string): void {
    const categorias = this.categoria.value as string[];
    const updatedCategorias = categorias.filter(cat => cat !== categoria);
    this.setCategorias(updatedCategorias);
  }

  //Añadir categoria al controlador, luego se guardará con el método onupdate que actualiza toda la tarea
  addCategoria(categoria: string): void {
    if (categoria && !this.categoria.value.includes(categoria)) {
      this.categoria.push(this.fb.control(categoria));
    }
  }

  //PERSONAS
  loadAvailablePersonas():void{
    this.taskService.getPersonas().subscribe(personas => {
      this.availablePersonas = personas;
    });
  }

  get personaAsignada(): FormArray {
  return this.taskForm.get('personaAsignada') as FormArray;
}

  //Convierte las personas disponibles en un FormArray
  // de FormControl para que puedan ser gestionadas dentro del formulario reactivo
  //Primero se crea un nuevo FormControl para cada persona y luego se crea un FormArray con esos controles
  //Finalmente, el FormArray creado se asigna al control categoria del formulario usando this.taskForm.setControl.
  setPersonas(personas: string []):void{
    const personaFGs = personas.map(persona => this.fb.control(persona));
    const personaFormArray = this.fb.array(personaFGs);
    this.taskForm.setControl('personaAsignada', personaFormArray);
  }


  addPersona(personaAsignada: string):void{
    if(personaAsignada && !this.personaAsignada.value.includes(personaAsignada)){
      this.personaAsignada.push(this.fb.control(personaAsignada));
    }
  }

  removePersona(personaAsignada: string):void{
    const personas = this.personaAsignada.value as string[];
    const updatedPersonas = personas.filter(persona => persona !== personaAsignada);
    this.setPersonas(updatedPersonas);
  }


  //Método para reiniciar el formulario
  private resetForm(): void {
    this.taskForm.reset({
      id: '',
      estado: '',
      personaAsignada: [],
      description: '',
      dificultad: '',
      categoria: [] // Usar 'categoria' en lugar de 'categorias'
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
