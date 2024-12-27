import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';


import { TasksRoutingModule } from './tasks-routing.module';
import { LayoutPageComponent } from './pages/layout-page/layout-page/layout-page.component';
import { MaterialModule } from '../material/material.module';
import { NewPageComponent } from './pages/new-page/new-page.component';
import { EditPageComponent } from './pages/edit-page/edit-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';


@NgModule({
  declarations: [
    LayoutPageComponent,
    NewPageComponent,
    EditPageComponent,
    ListPageComponent
  ],
  imports: [
    CommonModule,
    TasksRoutingModule,
    MaterialModule,
    DragDropModule


  ]
})
export class TasksModule { }
