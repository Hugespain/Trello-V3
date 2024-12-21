import { Component } from '@angular/core';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styleUrl: './layout-page.component.css'
})
export class LayoutPageComponent {

  public sidebarItems = [
    { label: 'Listado', icon: 'label', url: '' },
    { label: 'Añadir', icon: 'add', url: './new' },
    { label: 'Edit', icon: 'edit', link: './edit/:id' },
  ]
}
