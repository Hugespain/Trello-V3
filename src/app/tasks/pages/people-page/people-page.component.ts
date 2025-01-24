import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TasksService } from '../../services/task.service';
import { SuccessDialogComponent } from '../../components/dialogs/success-dialog/success-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-people-page',
  templateUrl: './people-page.component.html',
  styleUrl: './people-page.component.css'
})
export class PeoplePageComponent implements OnInit {
  public personForm: FormGroup;
  public people: { id: string, nombre: string }[] = [];


  constructor(private fb: FormBuilder, private taskService: TasksService, public dialog: MatDialog) {
    this.personForm = this.fb.group({
      persona: [''],
      crearPersona: ['', [Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {
    this.loadPeople();
  }

  private loadPeople(): void {
    this.taskService.getPersonas().subscribe(people => {
      this.people = people;
    });
  }

  //Método para resetear el formulario
  private resetForm(): void {
    this.personForm.reset({
      persona: '',
      crearPersona: ''
    });
    //Marcar todos los controles como intocados y prístinos
    Object.keys(this.personForm.controls).forEach(key => {
      const control = this.personForm.get(key);
      control?.setErrors(null); // Eliminar errores de validación
      control?.markAsPristine();
      control?.markAsUntouched();
    });
  }

  //Dialogo para mostrar mensaje
  private openSucessDialog(message: string): void {
    this.dialog.open(SuccessDialogComponent, {
      width: '400px',
      data: { message }
    });
  }

  //Método de normalizacion de texto
  public normalizeString(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }


  //Método para crear una persona
  public crearPersona(): void {
    //Obtenemos el nombre de la persona del formulario
    const nombre = this.personForm.get('crearPersona')?.value;
    //El campo no está vacio
    if (nombre) {
      //PERO el nombre puede estar duplicado
      const nombreYaExiste = this.people.find(persona => this.normalizeString(persona.nombre) === this.normalizeString(nombre));
      if (nombreYaExiste) {
        this.openSucessDialog('El nombre ya existe');
        return;
        //El nombre no está duplicado y el campo no está vacío
        //Creamos la nueva persona
      } else {
        this.taskService.addPersona(nombre).subscribe(() => {
          this.openSucessDialog('Persona creada con éxito');
          this.loadPeople();
          this.resetForm();
        });
      }
      //Suponiendo que el campo está vacío
    } else {
      this.openSucessDialog('El campo no puede estar vacío');
      this.loadPeople();
      this.resetForm();
    }
  }

  //Método para eliminar una persona
  public removePerson(personId: string): void {
    if (personId) {
      this.taskService.deletePersonaById(personId).subscribe(() => {
        this.people = this.people.filter(person => person.id.toString() !== personId);
        this.openSucessDialog('Persona eliminada con éxito');
      });
    } else {
      this.openSucessDialog('No se seleccionó ninguna persona para eliminar');
    }
  }



}
