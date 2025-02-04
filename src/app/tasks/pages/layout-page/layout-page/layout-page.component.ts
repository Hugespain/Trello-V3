import { Component} from '@angular/core';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styleUrl: './layout-page.component.css'
})
export class LayoutPageComponent {


  public sidebarItems = [
    { label: 'SIDEBAR.LISTADO', icon: 'label', url: '' },
    // { label: 'SIDEBAR.ADD_TASK', icon: 'add', url: 'new' },
    // { label: 'SIDEBAR.EDIT_DELETE_TASK', icon: 'edit', url: 'edit' },
    { label: 'SIDEBAR.CATEGORIES', icon: 'category', url: 'categorias' },
    { label: 'SIDEBAR.PEOPLE', icon: 'group_add', url: 'personas' }
  ];
}
