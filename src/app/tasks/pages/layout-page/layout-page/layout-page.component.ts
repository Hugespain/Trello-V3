import { Component} from '@angular/core';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styleUrl: './layout-page.component.css'
})
export class LayoutPageComponent {


  public sidebarItems = [
    { label: 'Listado', icon: 'label', url: '' },
    { label: 'Añadir tarea', icon: 'add', url: 'new' },
    { label: 'Editar/Eliminar tarea', icon: 'edit', url: 'edit'  },
    { label: 'Categorias', icon: 'category', url: 'categorias'  },
    { label: 'Personas', icon: 'group_add', url: 'personas'  }


  ]
}
