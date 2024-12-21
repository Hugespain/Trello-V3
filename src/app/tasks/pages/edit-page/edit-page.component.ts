import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrl: './edit-page.component.css'
})
export class EditPageComponent implements OnInit {
  taskId: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Obtener el ID de la ruta
    this.route.paramMap.subscribe(params => {
      this.taskId = params.get('id');  // Accede al parámetro 'id'
      console.log('ID de la tarea:', this.taskId); // Asegúrate de que el ID se obtiene correctamente

      // Aquí puedes cargar los datos de la tarea a editar utilizando 'taskId'
    });
  }
}
