import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewPageComponent } from './pages/new-page/new-page.component';
import { EditPageComponent } from './pages/edit-page/edit-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page/layout-page.component';
import { CategoriasPageComponent } from './pages/categorias-page/categorias-page.component';

const routes: Routes = [
  {
    path: '', component: LayoutPageComponent,
    children: [
      {path:'', component: ListPageComponent},
      {path:'new', component: NewPageComponent},
      {path: 'edit', component: EditPageComponent},
      {path: 'categorias', component: CategoriasPageComponent}


    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasksRoutingModule { }
