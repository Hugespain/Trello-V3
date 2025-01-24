import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TasksService } from '../../services/task.service';
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from '../../components/dialogs/success-dialog/success-dialog.component';

@Component({
  selector: 'app-categorias-page',
  templateUrl: './categorias-page.component.html',
  styleUrls: ['./categorias-page.component.css']
})
export class CategoriasPageComponent implements OnInit, AfterViewInit {
  public taskForm: FormGroup;
  public categorias: { id: string, nombre: string }[] = [];

  constructor(private fb: FormBuilder, private taskService: TasksService, public dialog: MatDialog) {
    this.taskForm = this.fb.group({
      categoria: [''],
      crearCategoria: ['', [Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {
    this.loadCategorias();
  }

  ngAfterViewInit(): void {
    this.addAnimation();
  }

  private loadCategorias(): void {
    this.taskService.getCategorias().subscribe(categorias => {
      this.categorias = categorias;
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



  public removeCategoria(categoriaId: string): void {
    if (categoriaId) {
      this.taskService.deleteCategoriaById(categoriaId).subscribe(() => {
        this.categorias = this.categorias.filter(cat => cat.id.toString() !== categoriaId);

        // Mostrar el diálogo de éxito
        this.openSuccessDialog('Categoría eliminada con éxito');
      });
    } else {
      this.openSuccessDialog('No se seleccionó ninguna categoría para eliminar');
    }
  }

  public crearCategoria(): void {
    const nombre = this.taskForm.get('crearCategoria')?.value;
    if (nombre) {
      // Verificar si la categoría ya existe
      const categoriaExistente = this.categorias.find(cat => cat.nombre.toLowerCase() === nombre.toLowerCase());
      if (categoriaExistente) {
        this.openSuccessDialog('La categoría ya existe');
        return;
      } else {
        this.taskService.addCategoria(nombre).subscribe(() => {
          this.loadCategorias(); // Recargar las categorías después de añadir una nueva
          this.resetForm(); // Resetear el formulario
          this.openSuccessDialog('Categoría creada con éxito');
        });
      }
    } else {
      this.openSuccessDialog('El campo de crear categoría está vacío');
    }
  }
  private addAnimation(): void {
    const scrollers = document.querySelectorAll(".scroller");

    // If a user hasn't opted in for reduced motion, then we add the animation
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      scrollers.forEach((scroller) => {
        // add data-animated="true" to every `.scroller` on the page
        scroller.setAttribute("data-animated", "true");

        // Make an array from the elements within `.scroller-inner`
        const scrollerInner = scroller.querySelector(".scroller__inner");
        if (scrollerInner) {
          const scrollerContent = Array.from(scrollerInner.children);

          // For each item in the array, clone it
          // add aria-hidden to it
          // add it into the `.scroller-inner`
          scrollerContent.forEach((item) => {
            const duplicatedItem = item.cloneNode(true) as HTMLElement;
            duplicatedItem.setAttribute("aria-hidden", "true");
            scrollerInner.appendChild(duplicatedItem);
          });
        }
      });
    }
  }
}
