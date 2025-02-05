import { Component} from '@angular/core';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styleUrl: './layout-page.component.css'
})
export class LayoutPageComponent {


  public sidebarItems = [
    { label: 'SIDEBAR.LISTADO', icon: 'label', url: 'list' },
    { label: 'SIDEBAR.CATEGORIES', icon: 'category', url: 'categorias' },
    { label: 'SIDEBAR.PEOPLE', icon: 'group_add', url: 'personas' }
  ];
}
