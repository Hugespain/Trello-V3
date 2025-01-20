import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



import { TasksRoutingModule } from './tasks-routing.module';
import { LayoutPageComponent } from './pages/layout-page/layout-page/layout-page.component';
import { MaterialModule } from '../material/material.module';
import { NewPageComponent } from './pages/new-page/new-page.component';
import { EditPageComponent } from './pages/edit-page/edit-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { ConfirmDialogComponent } from './components/dialogs/confirm-dialog/confirm-dialog.component';
import { SuccessDialogComponent } from './components/dialogs/success-dialog/success-dialog.component';
import { EditDialogComponent } from './components/dialogs/edit-dialog/edit-dialog.component';
import { NewtaskDialogComponent } from './components/dialogs/newtask-dialog/newtask-dialog.component';
import { CategoriasPageComponent } from './pages/categorias-page/categorias-page.component';


@NgModule({
  declarations: [
    LayoutPageComponent,
    NewPageComponent,
    EditPageComponent,
    ListPageComponent,
    ConfirmDialogComponent,
    SuccessDialogComponent,
    EditDialogComponent,
    NewtaskDialogComponent,
    CategoriasPageComponent,
  ],
  imports: [
    CommonModule,
    TasksRoutingModule,
    MaterialModule,
    DragDropModule,
    ReactiveFormsModule,
    FormsModule


  ]
})
export class TasksModule { }
