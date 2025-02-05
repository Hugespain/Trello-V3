import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListPageComponent } from '../tasks/pages/list-page/list-page.component';
import { LayoutPageComponent } from '../tasks/pages/layout-page/layout-page/layout-page.component';
import { CategoriasPageComponent } from '../tasks/pages/categorias-page/categorias-page.component';
import { PeoplePageComponent } from '../tasks/pages/people-page/people-page.component';
import { RoleGuard } from '../auth/guards/role-guard';

const routes: Routes = [
  {
    path: '', component: LayoutPageComponent, canActivate: [RoleGuard], data: { allowedRoles: ['Developer', 'Admin', 'Project Manager'] },
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: ListPageComponent, canActivate: [RoleGuard], data: { allowedRoles: ['Developer', 'Admin', 'Project Manager'] } },
      { path: 'categorias', component: CategoriasPageComponent, canActivate: [RoleGuard], data: { allowedRoles: ['Admin', 'Project Manager'] } },
      { path: 'personas', component: PeoplePageComponent, canActivate: [RoleGuard], data: { allowedRoles: ['Admin', 'Project Manager'] } }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasksRoutingModule { }
