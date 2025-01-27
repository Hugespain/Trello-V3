import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TasksService } from '../../services/task.service';
import { SuccessDialogComponent } from '../../components/dialogs/success-dialog/success-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-people-page',
  templateUrl: './people-page.component.html',
  styleUrls: ['./people-page.component.css']
})
export class PeoplePageComponent implements OnInit {
  public personForm: FormGroup;
  public displayedColumns: string[] = ['id', 'nombre', 'acciones'];
  public dataSource = new MatTableDataSource<{ id: string, nombre: string }>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private fb: FormBuilder, private taskService: TasksService, public dialog: MatDialog) {
    this.personForm = this.fb.group({
      crearPersona: ['', [Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {
    this.loadPeople();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  private loadPeople(): void {
    this.taskService.getPersonas().subscribe(people => {
      this.dataSource.data = people;
    });
  }

  private resetForm(): void {
    this.personForm.reset({
      crearPersona: ''
    });
    Object.keys(this.personForm.controls).forEach(key => {
      const control = this.personForm.get(key);
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

  public normalizeString(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  public crearPersona(): void {
    const nombre = this.personForm.get('crearPersona')?.value;
    if (nombre) {
      const nombreYaExiste = this.dataSource.data.find(persona => this.normalizeString(persona.nombre) === this.normalizeString(nombre));
      if (nombreYaExiste) {
        this.openSuccessDialog('El nombre ya existe');
        return;
      } else {
        this.taskService.addPersona(nombre).subscribe(() => {
          this.openSuccessDialog('Persona creada con éxito');
          this.loadPeople();
          this.resetForm();
        });
      }
    } else {
      this.openSuccessDialog('El campo no puede estar vacío');
      this.loadPeople();
      this.resetForm();
    }
  }

  public removePerson(personId: string): void {
    if (personId) {
      this.taskService.deletePersonaById(personId).subscribe(() => {
        this.dataSource.data = this.dataSource.data.filter(person => person.id.toString() !== personId);
        this.openSuccessDialog('Persona eliminada con éxito');
      });
    } else {
      this.openSuccessDialog('No se seleccionó ninguna persona para eliminar');
    }
  }
}
