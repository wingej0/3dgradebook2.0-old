import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentsComponent } from './students/students.component';
import { PageLayoutModule } from '../page-layout/page-layout.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [StudentsComponent],
  imports: [
    CommonModule,
    PageLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class StudentsModule { }
