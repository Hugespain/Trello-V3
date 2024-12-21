import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewPageComponent } from './pages/new-page/new-page.component';
import { EditPageComponent } from './pages/edit-page/edit-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page/layout-page.component';

const routes: Routes = [
  {
    path: '', component: LayoutPageComponent,
    children: [
      {path:'', component: ListPageComponent},
      {path:'new', component: NewPageComponent},
      {path:'edit/:id', component: EditPageComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasksRoutingModule { }
